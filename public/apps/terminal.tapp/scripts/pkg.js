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
			if (args._[1]) {
				const response = await tb.libcurl.fetch(localStorage.getItem("appRepo"));
				const repoData = await response.json();
				const packageName = args._[1].toLowerCase();
				const exactMatch = repoData.find(pkg => pkg.name.toLowerCase() === packageName);
				if (exactMatch) {
					displayOutput(`Installing ${exactMatch.name}...`);
					const installed = JSON.parse(await Filer.fs.promises.readFile("/apps/installed.json", "utf8"));
					if (installed.some(app => app.name.toLowerCase() === exactMatch.name.toLowerCase())) {
						displayOutput(`The app "${exactMatch.name}" is already installed.`);
						displayOutput("Do you want to reinstall it? (y/n)");
						term.write("\r\n> ");
						const onData = function (input) {
							const userInput = input.trim().toLowerCase();
							if (userInput === "y") {
								displayOutput("");
								displayOutput(`Reinstalling ${exactMatch.name}...`);
								installApp(app.name, "", installed);
							} else {
								createNewCommandInput();
							}
							disposable.dispose();
						};
						const disposable = term.onData(onData);
						return;
					} else {
						displayOutput(`${exactMatch.name} installed successfully!`);
						createNewCommandInput();
						return;
					}
				} else {
					displayOutput(`No package found with the name "${packageName}".`);
					createNewCommandInput();
					return;
				}
			} else {
				displayOutput("Usage: pkg install <package-name>");
				createNewCommandInput();
				return;
			}
		case "remove":
			if (args._[1]) {
				const packageName = args._.slice(1).join(" ").toLowerCase();
				let installed = JSON.parse(await Filer.fs.promises.readFile("/apps/installed.json", "utf8"));
				const appIndex = installed.findIndex(app => app.name.toLowerCase() === packageName);
				if (appIndex !== -1) {
					const app = installed[appIndex];
					installed.splice(appIndex, 1);
					await Filer.fs.promises.writeFile("/apps/installed.json", JSON.stringify(installed, null, 2), "utf8");
					displayOutput(`Uninstalling ${app.name}...`);
					const configPath = app.config;
					console.log(configPath);
					if (configPath.endsWith("index.json")) {
						let webApps = JSON.parse(await Filer.fs.promises.readFile("/apps/web_apps.json", "utf8"));
						const waIndex = webApps.findIndex(webApp => webApp.name.toLowerCase() === app.name.toLowerCase());
						if (waIndex !== -1) {
							webApps.splice(waIndex, 1);
							await Filer.fs.promises.writeFile("/apps/web_apps.json", JSON.stringify(webApps, null, 2), "utf8");
							await tb.launcher.removeApp(app.name);
							displayOutput(`${app.name} has been uninstalled.`);
						}
					} else if (configPath.endsWith("manifest.json")) {
						await Filer.fs.promises.unlink(`/system/etc/anura/configs/${app.name}.json`);
						await tb.sh.rm(configPath.replace("/manifest.json", "/"));
						await tb.launcher.removeApp(app.name);
						displayOutput(`${app.name} has been uninstalled.`);
					} else if (configPath.endsWith(".tbconfig")) {
						await tb.sh.rm(configPath.replace("/.tbconfig", "/"));
						await tb.launcher.removeApp(app.name);
						displayOutput(`${app.name} has been uninstalled.`);
					}
				} else {
					displayOutput(`No installed app found with the name "${packageName}".`);
				}
				createNewCommandInput();
			} else {
				displayOutput("Usage: pkg remove <package-name>");
				createNewCommandInput();
			}
			break;
		case "list":
			displayOutput("Installed Packages for this system:");
			const installed = JSON.parse(await Filer.fs.promises.readFile("/apps/installed.json", "utf8"));
			for (const app of installed) {
				displayOutput(`${app.name} - ${app.user}`);
			}
			displayOutput("");
			displayOutput(`${installed.length} are installed.`);
			createNewCommandInput();
			break;
		case "search":
			if (args._[1]) {
				const response = await tb.libcurl.fetch(localStorage.getItem("appRepo"));
				const repoData = await response.json();
				const searchTerm = args._[1].toLowerCase();
				const exactMatch = repoData.find(pkg => pkg.name.toLowerCase() === searchTerm);
				if (exactMatch) {
					displayOutput(`Found package: ${exactMatch.name}`);
				} else {
					const potentialMatches = repoData.filter(pkg => pkg.name.toLowerCase().includes(searchTerm));
					if (potentialMatches.length > 0) {
						displayOutput(`No exact match found for "${searchTerm}".`);
						displayOutput("Did you mean? Potential match(es):");
						for (const match of potentialMatches) {
							displayOutput(`  - ${match.name}`);
						}
					} else {
						displayOutput("No matching packages found.");
					}
				}
				createNewCommandInput();
			} else {
				displayOutput("Usage: pkg search <package-name>");
				createNewCommandInput();
				return;
			}
			break;
		case "repo":
			switch (args._[1]) {
				case "r":
				case "remove":
					displayOutput("Changed Repository URL to the default repo");
					localStorage.removeItem("appRepo");
					createNewCommandInput();
					break;
				case "a":
				case "add":
					displayOutput("Changed Repository URL to: " + args._[2]);
					localStorage.setItem("appRepo", args._[2]);
					createNewCommandInput();
					break;
				default:
					displayOutput("Usage: pkg repo <a/r> [repo-url]");
					createNewCommandInput();
					break;
			}
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

function installApp(name, type) {
	switch (type) {
		case "web":
			break;
		case "TAPP":
			break;
		case "anura":
			break;
	}
}

pkg(args);
