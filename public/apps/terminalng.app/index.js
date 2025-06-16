const tb = window.tb || window.parent.tb || {};

import yargsParser from "yargs-parser";

/**
 * @typedef {} parsedCmdArgs
 */
/**
 * @typedef {function(string, )}
 */

const term = new Terminal();
term.open(document.getElementById("term"));
term.write("Terbium NG terminal");

/**
 * Whether a new command is currently being capturec by accCmd
 */
let cmdBeingProcessed = false;
/**
 * The command that has been captured from the start of the other command prompt ending and after the newline carriage
 */
let accCmd = "";

/**
 * @type {}
 */
let currentCmdHandler;
term.onData(async (char) => {
	if (!cmdBeingProcessed && char === "\r") {
		cmdBeingProcessed = true;
		const [cmd, ...rawArgs] = accCmd.split(" ");
		const parsedArgs = yargsParser(rawArgs);
	} else accCmd += char;
});
term.onLineFeed(() => {
	// Reset because are on a newline carriage
	accCmd = "";
});

/**
 * The URLs to try to fetch the scripts from
 * @type {string[]}
 */
const scriptPaths = [
	`/apps/terminalng.tapp/scripts/${commandName.toLowerCase()}.js`,
	// Bypass the local FS for debugging
	//`/fs/scripts/${commandName.toLowerCase()}.js`
];
/**
 *
 * @param {string} cmd The command to start processing
 */
async function handleCommand(name, args) {
	for (const scriptPath of scriptPaths) {
		try {
		} catch {
			// Continue on to the next script path to try
		}
	}
}

function displayOutput(message, ...styles) {
	term.writeln(`\x1b[${styles.join(";")}m${message}\x1b[0m`);
}

function displayError(message) {
	term.writeln(`\x1b[31mERR: ${message}\x1b[0m`);
}
