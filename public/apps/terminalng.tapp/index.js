import { FitAddon } from "xterm-addon-fit";
import parser from "yargs-parser";

/**
 * @typedef {import("yargs-parser").Arguments} argv
 */
/**
 * @typedef {function(string, argv)} commandHandler
 */
/**
 * @typedef {Object} appInfo
 * @property {string} name The name of the app
 * @property {string} description The description of the app
 * @property {string} usage How to use the app from the CLI
 */

// This is just to resove the terbium system api's
const tb = window.tb || window.parent.tb || {};

/**
 * Converts a hex color to an RGB string
 * @param {*} hex The hex color to convert
 * @returns The r;g;b string for use in accent
 */
function htorgb(hex) {
	hex = hex.replace(/^#/, '');
	if (hex.length === 3) {
		hex = hex.split('').map(x => x + x).join('');
	}
	if (hex.length !== 6) return null;
	const num = parseInt(hex, 16);
	const red = (num >> 16) & 255;
	const green = (num >> 8) & 255;
	const blue = num & 255;
	return `${red};${green};${blue};`;
}

/**
 * The command that has been captured from the start of the other command prompt ending and after the newline carriage
 */
let accCommand = "";
/**
 * Whether a new command is currently being captured by `accCommand`
 */
let currentlyAccCommand = false;

const term = new Terminal();
const fitAddon = new FitAddon();
document.addEventListener("DOMContentLoaded", async () => {
	term.loadAddon(fitAddon);
	term.open(document.getElementById("term"));
	term.writeln(`TerbiumOS [Version: ${tb.system.version()}]`);
	term.writeln(`Type 'help' for a list of commands.`);
	term.setOption("theme", {
		background: "#000000",
		foreground: "#ffffff",
		cursor: "#ffffff",
		selection: "#444444",
		cursorBlink: true,
		fontFamily: "Inter",
	});
	const username = await tb.user.username();
	const usersettings = JSON.parse(await Filer.fs.promises.readFile(`/home/${username}/settings.json`, "utf8"));
	term.write(`\r\n\x1b[38;2;${htorgb(usersettings.accent)}m${username}@${JSON.parse(await Filer.fs.promises.readFile("//system/etc/terbium/settings.json"))["host-name"]}\x1b[39m `);
	term.onData(async (char) => {
		accCommand += char;

		console.log(char)
		if (char === "\r") {
			term.writeln("")
			term.write(`\r\n\x1b[38;2;${htorgb(usersettings.accent)}m${username}@${JSON.parse(await Filer.fs.promises.readFile("//system/etc/terbium/settings.json"))["host-name"]}\x1b[39m `);
			
			const currentAcc = accCommand.split(" ");
			const [cmd, ...rawArgs] = currentAcc;
			const argv = parser(rawArgs);
			handleCommand(cmd, argv);
			accCommand = "";
		}
		term.write(char);
	});
	term.onLineFeed(() => {
		// Reset because are on a newline carriage
		accCommand = "";
	});
	term.focus();
})

window.addEventListener('resize', () => {
    fitAddon.fit();
});

/**
 *
 * @param {string} name The command name
 * @param {argv} args The command's respective args (from yargs-parser)
 */
async function handleCommand(name, args) {
	/**
	 * The URLs to try to fetch the scripts from
	 * @type {string[]}
	 */
	const scriptPaths = [
		`/apps/terminal.tapp/scripts/${name.toLowerCase()}.js`,
		// Bypass the local FS for debugging
		//  `/fs/scripts/${commandName.toLowerCase()}.js`
	];
	for (const scriptPath of scriptPaths) {
		const appInfo = await getAppInfo();
		if (appInfo === null) {
			displayError("Failed to fetch app info, cannot execute command");
			return;
		}
		// A sanity check to ensure the command exists and is defined properly
		if (!appInfo.some(app => app.name.toLowerCase() === name.toLowerCase())) {
			displayError(`Command '${name}' not found! Type 'help' for a list of commands.`);
			return;
		}
		/**
		 * @type {Response}
		 */
		let scriptRes;
		try {
			scriptRes = await fetch(scriptPath);
		} catch (error) {
			displayError(`Failed to fetch script: ${error.message}`);
			// Try the next script path
			continue;
		}
		new Function("args", await scriptRes.body())(args);
	}
}

/**
 * Fetches the app info from the `info.json` file
 * @param {boolean} justNames Whether to return just the app names or the full app info
 * @returns {Promise<string[]|appInfo>} The app names or the full app info
 */
async function getAppInfo(justNames = true) {
	/**
	 * @type {Response}
	 */
	let appInfoRes;
	try {
		appInfoRes = await fetch(`/fs/apps/user/${await tb.user.username()}/terminalng/scripts/info.json`);
	} catch (error) {
		displayError(`Failed to fetch info.json, required for getting app info: ${error.message}`);
		return null;
	}

	/**
	 * @type {Response}
	 */
	let appInfo;
	try {
		appInfoRes = await appInfoRes.json();
	} catch (error) {
		displayError(`Failed to parse info.json: ${error.message}`);
		return null;
	}

	if (justNames)
		return appInfo.map(app => app.name);
	return appInfo;
}

/**
 * Displays a styled message to the terminal
 * @param {string} message
 */
function displayOutput(message, ...styles) {
	term.writeln(`\x1b[${styles.join(";")}m${message}\x1b[0m`);
}

/**
 * Logs an error message to terminal
 * @param {string} message The error message that will be displayed on the output
 */
function displayError(message) {
	term.writeln(`\x1b[31mERR: ${message}\x1b[0m`);
}

/**
 * Creates new command line
 */
async function createNewCommandInput() {
	term.write(`\r\n\x1b[38;2;${htorgb(usersettings.accent)}m${username}@${JSON.parse(await Filer.fs.promises.readFile("//system/etc/terbium/settings.json"))["host-name"]}\x1b[39m `);
}
