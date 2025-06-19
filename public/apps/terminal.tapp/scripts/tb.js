const ver = "1.0.0";

const cmdData = {
	help: {
		desc: "Shows information about a given subcommand",
		usage: "tb help <subcommand> ...",
		args: {
			"subcommand": "The subcommand to look up. I.e. tb help system version"
		}
	},
	restart: {
		desc: "Restarts TerbiumOS",
		usage: "tb restart <args>",
		alias: "reboot",
		args: {
			"-f/--force": "Clears the session cache upon reboot",
		},
	},
	process: {
		desc: "Parent command for listing terbium processes.",
		usage: "tb process [subcmd] <args>",
		alias: "proc",
		subcmds: {
			kill: {
				desc: "Kill/delete a given process",
				usage: "tb process kill [pid]",
				alias: "delete",
				args: {
					pid: "The ID of the process to kill/delete",
				},
			},
			list: {
				desc: "Lists all active processes",
				usage: "tb process list",
			},
		},
	},
	system: {
		desc: "Parent command for details about the terbium system.",
		usage: "tb system [subcmd] <args>",
		alias: "sys",
		subcmds: {
			version: {
				desc: "Display the currently installed Terbium version.",
				usage: "tb system version",
				alias: "ver",
			},
		},
	},
};

async function tb(args) {
	function error(err) {
		displayError(`${err}\n`);
		createNewCommandInput();
	}
	function help(args) {
		function resolveCommand(args) {
			var resObj = cmdData;
			if (args.length !== 1) {
				if (args.length === 2) {
					resObj = resObj[args[1]];
				} else {
					resObj = resObj[args[1]];
					for (let i = 2; i < args.length; i++) {
						resObj = resObj.subcmds[args[i]];
					}
				}
			} else resObj.v = true;
			return resObj;
		}
		function formatData(info) {
			if (typeof info.v === "undefined") {
				displayOutput(`Description: ${info.desc}\n`);
				displayOutput(`USAGE: ${info.usage}`);
				if (info.alias) displayOutput(`ALIAS(ES): ${info.alias}\n`);
				if (info.subcmds) {
					displayOutput("SUBCOMMANDS:");
					const subkeys = Object.keys(info.subcmds);
					for (let i = 0; i < subkeys.length; i++) {
						displayOutput(`${`\t${subkeys[i]}`.padEnd(30)}${info.subcmds[subkeys[i]].desc}\n`);
					}
				} else if (info.args) {
					displayOutput("ARGUMENTS:");
					const subkeys = Object.keys(info.args);
					for (let i = 0; i < subkeys.length; i++) {
						displayOutput(`${`\t${subkeys[i]}`.padEnd(30)}${info.args[subkeys[i]]}\n`);
					}
				}
			} else {
				delete info.v;
				displayOutput("Any commands listed as \"parent\" commands have subcommands. Use `tb help <cmd>` to view it's commands.");
				displayOutput("List of available commands:\n");
				const cmdKeys = Object.keys(cmdData);
				for (let i = 0; i < cmdKeys.length; i++) {
					displayOutput(`${`\t${cmdKeys[i]}`.padEnd(30)}${cmdData[cmdKeys[i]].desc}\n`);
				}
			}
		}
		const data = resolveCommand(args);
		formatData(data);
		displayOutput(`Terbium System CLI v${ver}`);
		createNewCommandInput();
	}
	switch (args._[0]) {
		case undefined:
		case null:
			help(["help"]);
			break;
		case "help":
			help(args._);
			break;
		case "restart":
		case "reboot":
			switch (args._[1]) {
				case "-f":
				case "--force":
					window.parent.sessionStorage.clear();
					window.parent.location.reload();
					break;
				default:
					window.parent.sessionStorage.setItem("logged-in", "false");
					window.parent.location.reload();
					break;
			}
			break;
		case "lock":
			window.parent.sessionStorage.setItem("logged-in", false);
			window.parent.location.reload();
			break;
		case "process":
		case "proc":
			switch (args._[1]) {
				case "kill":
				case "delete":
					if (args._[2] === undefined) {
						error("tb: proc: expected an argument at pos 2, got nothing");
					} else {
						tb.process.kill(args._[2]);
					}
					createNewCommandInput();
					break;
				case "list": {
					const proclist = window.parent.tb.process.list();
					const proclistIDs = Object.keys(proclist);
					for (let i = 0; i < proclist.length; i++) {
						displayOutput(`"${proclist[i].name}" [PID: ${proclistIDs[i]}]`);
					}
					createNewCommandInput();
					break;
				}
				default:
					error("tb: proc: expected an argument at pos 2, got nothing");
			}
			break;
		case "sys":
		case "system":
			switch (args._[1]) {
				case undefined:
				case null:
					error("tb: system: expected an argument at pos 1, got nothing");
					break;
				case "ver":
				case "version":
					displayOutput(`TerbiumOS version ${window.parent.tb.system.version()}`);
					createNewCommandInput();
					break;
				default:
					error(`tb: system: unknown subcommand: ${args._[1]}`);
			}
			break;
		default:
			error(`tb: unknown subcommand: ${args._[0]}`);
			break;
	}
}
tb(args, term);
