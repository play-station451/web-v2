async function pkg(args) {
	let availableCommands = [
		"pkg <command> -h: Display help for <command>.",
		"pkg install <package-name>: Install an app matching <package-name> from the repo.",
		"pkg remove <package-name>: Uninstall an app matching <package-name> from the repo.",
		"pkg list: Shows a list of installed apps.",
		"pkg search <package-name>: Search for an app matching <package-name> in the repo.",
		"pkg repo: Changes the Package Managers Fetch repo (Use -r to remove the repo you added)",
	];
	switch (args._[0]) {
		case "install":
			break;
		case "remove":
			break;
		case "list":
			displayOutput("Installed Packages for this system:");
			const installed = JSON.parse(await Filer.fs.promises.readFile("/apps/installed.json", "utf8"));
			for (const app of installed) {
				displayOutput(`${app.name} - ${app.user}`);
			}
			displayOutput(`${installed.length} are installed.`);
			createNewCommandInput();
			break;
		case "search":
			break;
		case "repo":
			break;
		case "help":
		default:
			displayOutput(`TPKG v1.4.0 - June 2025`);
			displayOutput(`Usage: pkg <command>`);
			displayOutput(" ");
			displayOutput("All commands:");
			for (let command in availableCommands) {
				command = availableCommands[command];
				let [cmd, description] = command.split(": ");
				displayOutput(`   ${cmd.padEnd(40)} ${description}`);
			}
			createNewCommandInput();
			break;
	}
}

pkg(args);
