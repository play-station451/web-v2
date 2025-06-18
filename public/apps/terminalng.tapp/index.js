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
	hex = hex.replace("#", "");
	if (hex.length === 3) {
		hex = hex
			.split("")
			.map(h => h + h)
			.join("");
	}
	if (hex.length !== 6) return null;
	const bigint = parseInt(hex, 16);
	return {
		r: (bigint >> 16) & 255,
		g: (bigint >> 8) & 255,
		b: bigint & 255,
	};
}

/**
 * The command that has been captured from the start of the other command prompt ending and after the newline carriage
 */
let accCommand = "";

const term = new Terminal();
document.addEventListener("DOMContentLoaded", async () => {
	term.open(document.getElementById("term"));
	term.writeln(`TerbiumOS [Version: ${tb.system.version()}]`);
	term.writeln(`Type 'help' for a list of commands.`);
	term.setOption("theme", {
		background: "#000000",
		cursor: "#ffffff",
		selection: "#444444",
	});
	term.setOption("cursorBlink", true);
	window.term = term; // Expose the terminal to the global scope for debugging
	const username = await tb.user.username();
	const usersettings = JSON.parse(await Filer.fs.promises.readFile(`/home/${username}/settings.json`, "utf8"));
	const accent = await htorgb(usersettings.accent);
	term.write(`\r\n\x1b[38;2;${accent.r};${accent.g};${accent.b}m${username}@${JSON.parse(await Filer.fs.promises.readFile("//system/etc/terbium/settings.json"))["host-name"]}\x1b[39m `);
	term.onData(async char => {
		if (char === "\x7f") {
			if (accCommand.length > 0) {
				accCommand = accCommand.slice(0, -1);
				term.write("\b \b");
			}
			return;
		}
		if (char === "\r") {
			term.writeln("");
			const input = accCommand.trim();
			if (input.length > 0) {
				const [cmd, ...rawArgs] = input.split(" ");
				const argv = parser(rawArgs);
				await handleCommand(cmd, argv);
			}
			accCommand = "";
			return;
		}
		if (char >= " " && char <= "~") {
			accCommand += char;
			term.write(char);
		}
	});
	term.onLineFeed(() => {
		// Reset because are on a newline carriage
		accCommand = "";
	});
	term.focus();
});

function resizeTerm() {
	const cols = Math.floor(window.innerWidth / term._core._renderService.dimensions.actualCellWidth);
	const rows = Math.floor(window.innerHeight / term._core._renderService.dimensions.actualCellHeight);
	term.resize(cols, rows);
}

setTimeout(resizeTerm, 50);
window.addEventListener("resize", resizeTerm);

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
	const scriptPath = `/fs/apps/system/terminalng.tapp/scripts/${name.toLowerCase()}.js`;
	const appInfo = await getAppInfo();
	if (appInfo === null) {
		displayError("Failed to fetch app info, cannot execute command");
		createNewCommandInput();
		return;
	}
	// A sanity check to ensure the command exists and is defined properly
	if (!appInfo.some(app => app.name.toLowerCase() === name.toLowerCase())) {
		displayError(`Command '${name}' not found! Type 'help' for a list of commands.`);
		createNewCommandInput();
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
	}
	try {
		const script = await scriptRes.text();
		const fn = new Function("args", "displayOutput", "createNewCommandInput", "displayError", script);
		fn(args, displayOutput, createNewCommandInput, displayError);
	} catch (e) {
		displayError(`Failed to execute command '${name}': ${e.message}`);
		createNewCommandInput();
		return;
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
		// Temp for testing
		appInfoRes = await fetch(`/fs/apps/user/${await tb.user.username()}/terminal/info.json`);
	} catch (error) {
		displayError(`Failed to fetch info.json, required for getting app info: ${error.message}`);
		createNewCommandInput();
		return null;
	}

	/**
	 * @type {Response}
	 */
	let appInfo;
	try {
		appInfo = await appInfoRes.json();
	} catch (error) {
		displayError(`Failed to parse info.json: ${error.message}`);
		createNewCommandInput();
		return null;
	}

	//if (justNames) return appInfo.map(app => app.name);
	return appInfo;
}

/**
 * Displays a styled message to the terminal
 * @param {string} message
 */
async function displayOutput(message, ...styles) {
	if (message.includes("%c")) {
		let parts = message.split(/(%c)/);
		let styled = "";
		let styleIndex = 0;
		for (let i = 0; i < parts.length; i++) {
			if (parts[i] === "%c") {
				let text = parts[++i] || "";
				let style = styles[styleIndex++] || "";
				let colorMatch = style.match(/color:\s*(#[0-9a-fA-F]{3,6})/);
				if (colorMatch) {
					let rgb = await htorgb(colorMatch[1]);
					if (rgb) {
						styled += `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m${text}\x1b[0m`;
					} else {
						styled += text;
					}
				} else {
					styled += text;
				}
			} else {
				styled += parts[i];
			}
		}
		term.writeln(styled);
	} else {
		term.writeln(message);
	}
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
	const usersettings = JSON.parse(await Filer.fs.promises.readFile(`/home/${await tb.user.username()}/settings.json`, "utf8"));
	const accent = await htorgb(usersettings.accent);
	term.write(`\r\n\x1b[38;2;${accent.r};${accent.g};${accent.b}m${await tb.user.username()}@${JSON.parse(await Filer.fs.promises.readFile("//system/etc/terbium/settings.json"))["host-name"]}\x1b[39m `);
}
