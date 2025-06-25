function rm(args) {
	let availableOptions = [
		"-f: ignore nonexistent files and arguments, never prompt.",
		"-r: remove directories and their contents recursively.; optionally you can also use -rf to remove directories and their contents recursively without prompt.",
		"-v: explain what is being done (not default).",
		"-d: remove empty directories.; you should use rmdir instead.",
	];

	if (!args || args.length === 0 || args.includes("-h")) {
		displayOutput("Usage: rm [OPTION] [FILE]");
		displayOutput("Remove (unlink) the FILE(s).");
		displayOutput(" ");
		displayOutput("Options:");
		for (let option of availableOptions) {
			let nspace = " ";
			let [opt, desc] = option.split(": ");
			let optionally = desc.split(";")[1];
			desc = desc.replace(";", "").replace(optionally, "");
			displayOutput(`  ${opt.padEnd(10)} ${desc}`);
			if (optionally) {
				displayOutput(`  ${nspace.padEnd(10)}${optionally}`);
			}
		}
		createNewCommandInput();
		return;
	}
	let path = terminal.getAttribute("path");
	const user = sessionStorage.getItem("currAcc");
	const systemDirs = ["/home", `/home/${user}/documents`, `/home/${user}/videos`, `/home/${user}/pictures`, `/home/${user}/music`];

	for (let arg of args) {
		if (!arg.startsWith("-")) {
			if (arg.startsWith("/")) {
				path = arg.split("/").join("/");
			} else {
				path = terminal.getAttribute("path") + "/" + arg;
			}
			break;
		}
	}
	if (path.includes("~")) {
		path = path.replace("~", `/home/${window.parent.sessionStorage.getItem("currAcc")}`);
	}

	for (let sdir of systemDirs) {
		if (path === sdir) {
			displayOutput(`rm: cannot remove "${path}": Is a system directory`);
			createNewCommandInput();
			return;
		}
	}

	let options = {
		force: false,
		recursive: false,
		verbose: false,
		directory: false,
	};

	if (args.includes("-rf")) {
		options.force = true;
		options.recursive = true;
	}
	if (args.includes("-r")) {
		options.recursive = true;
	}
	if (args.includes("-f")) {
		options.force = true;
	}
	if (args.includes("-v")) {
		options.verbose = true;
	}
	if (args.includes("-d")) {
		options.directory = true;
	}
	Filer.fs.stat(path, (err, stats) => {
		if (err) return console.log(err);
		if (stats.isDirectory()) {
			if (options.force || options.recursive) {
				sh.rm(path, { recursive: options.recursive, force: options.force }, err => {
					if (err) {
						displayError(`rm: cannot remove "${path}": ${err.message}`);
						createNewCommandInput();
					} else {
						if (options.verbose) {
							displayOutput(`removed directory "${path}"`);
						}
						createNewCommandInput();
					}
				});
			} else if (options.directory) {
				Filer.fs.rmdir(path, err => {
					if (err) {
						if (err.code === "ENOTEMPTY") {
							displayError(`rm: cannot remove "${path}": Directory not empty`);
							displayOutput("Use -r to remove non-empty directories. or -rf to remove non-empty directories without prompt.");
						} else {
							displayError(`rm: cannot remove "${path}": ${err.message}`);
						}
						createNewCommandInput();
					} else {
						if (options.verbose) {
							displayOutput(`removed directory "${path}"`);
						}
						createNewCommandInput();
					}
				});
			} else {
				displayError(`rm: cannot remove "${path}": Is a directory`);
				createNewCommandInput();
			}
		} else {
			tb.sh.rm(path, { recursive: options.recursive, force: options.force }, err => {
				if (err) {
					displayError(`rm: cannot remove "${path}": ${err.message}`);
					createNewCommandInput();
				} else {
					if (options.verbose) {
						displayOutput(`removed "${path}"`);
					}
					createNewCommandInput();
				}
			});
		}
	});
}
rm(args);
