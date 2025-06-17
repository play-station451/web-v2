async function git(args) {
	let user = await window.parent.tb.user.username();
	let http = window.http;
	let currentPath = terminal.getAttribute("path");
	if (currentPath.startsWith("~")) currentPath = currentPath.replace("~", `/home/${window.parent.sessionStorage.getItem("currAcc")}`);
	try {
		if (args.length === 0 || args[0] === "git") {
			displayOutput(`
Usage: git [--version] [--help] <command> [<args>]

These are common Git commands used in various situations:

start a working area
   clone     Clone a repository into a new directory
   init      Create an empty Git repository or reinitialize an existing one

work on the current change
   add       Add file contents to the index
   rm        Remove files from the working tree and from the index

examine the history and state
   status    Show the working tree status

grow, mark and tweak your common history
   commit    Record changes to the repository (Make sure to run git add <filename> <directory> before commiting)

collaborate (Login requires your GitHub Token)
   fetch     Download objects and refs from another repository
   pull      Fetch from and integrate with another repository or a local branch
   push      Update remote refs along with associated objects
`);
			createNewCommandInput();
		} else if (args[0] === "clone") {
			let path;
			if (!args[2]) {
				path = "/home";
			}

			if (path !== "/" && args[2] === "/") {
				path = args[2];
			} else if (path !== "/") {
				path = `${currentPath}/${args[2]}`;
			}

			displayOutput(`Cloning into '${args[1].split(/(\\|\/)/g).pop()}'...`);
			const targetDir = args[2] ?? `${currentPath}/${args[1].split(/(\\|\/)/g).pop()}`;
			await Filer.fs.promises.mkdir(targetDir, { recursive: true });
			await gitfetch.clone({
				fs: window.parent.Filer.fs,
				http: http,
				dir: targetDir,
				corsProxy: "https://cors.isomorphic-git.org",
				url: args[1],
				noCheckout: false,
				singleBranch: true,
				depth: 1,
				onAuth: async () => {
					return new Promise(async resolve => {
						await window.parent.tb.dialog.WebAuth({
							title: "GitHub Authentication",
							onOk: async (username, password) => {
								resolve({ username, password });
							},
							onCancel: () => {
								displayError("Authentication was canceled");
								createNewCommandInput();
							},
						});
					});
				},
				onMessage: e => {
					displayOutput(e);
				},
			});
			await gitfetch.setConfig({
				fs: window.parent.Filer.fs,
				dir: targetDir,
				path: "user.name",
				value: await window.parent.tb.user.username(),
			});
			createNewCommandInput();
		} else if (args[0] === "init") {
			let path = currentPath + args[1];
			if (!args[1]) {
				displayError("Error: Target directory must be specified for 'git init'.");
				createNewCommandInput();
				return;
			}

			displayOutput(`Initializing empty Git repository in ${path}/.git/...`);
			await Filer.fs.promises.mkdir(`${path}/.git`, { recursive: true });
			await gitfetch.init({
				fs: window.parent.Filer.fs,
				http: http,
				dir: path,
				bare: false,
				defaultBranch: "master",
				gitdir: `${path}/.git`,
			});
			displayOutput("Initialized empty Git repository.");
			createNewCommandInput();
		} else if (args[0] === "checkout") {
			if (!args[1] || !args[2]) {
				displayOutput("Usage: git checkout <branch> <directory>");
				createNewCommandInput();
				return;
			}
			const branchName = args[1];
			const targetDir = currentPath + args[2];
			try {
				await gitfetch.checkout({
					fs: window.parent.Filer.fs,
					dir: targetDir,
					ref: branchName,
					onMessage: e => {
						displayOutput(e);
					},
				});

				displayOutput(`Switched branch '${branchName}' in '${targetDir}'`);
			} catch (error) {
				displayError(`Error: ${error.message}`);
			}
			createNewCommandInput();
		} else if (args[0] === "add") {
			if (!args[1] || !args[2]) {
				displayOutput("Usage: git add <file> <directory>");
				createNewCommandInput();
				return;
			}
			const filePath = args[1];
			const targetDir = currentPath + args[2];
			try {
				await gitfetch.add({
					fs: window.parent.Filer.fs,
					dir: targetDir,
					filepath: filePath,
				});

				displayOutput(`Added '${filePath}' to staging area`);
			} catch (error) {
				displayError(`Error: ${error.message}`);
			}

			createNewCommandInput();
		} else if (args[0] === "rm") {
			if (!args[1] || !args[2]) {
				displayOutput("Usage: git rm <file> <directory>");
				createNewCommandInput();
				return;
			}
			const filePath = args[1];
			const targetDir = currentPath + args[2];
			try {
				await gitfetch.remove({
					fs: window.parent.Filer.fs,
					dir: targetDir,
					filepath: filePath,
				});

				displayOutput(`Removed '${filePath}' from the working tree and the index`);
			} catch (error) {
				displayError(`Error: ${error.message}`);
			}

			createNewCommandInput();
		} else if (args[0] === "status") {
			//if (!args[1]) {
			//    displayOutput("Usage: git status <directory>");
			//    createNewCommandInput();
			//    return;
			//}
			//const targetDir = await Filer.fs.promises.readdir(args[1]);
			//try {
			//    const status = await gitfetch.status({
			//        fs: window.parent.Filer.fs,
			//        dir: targetDir,
			//        filepath: '',
			//    });
			//    displayOutput(JSON.stringify(status, null, 2));
			//} catch (error) {
			//    displayError(`Error: ${error.message}`);
			//}
			displayOutput("Command is currently not implemented");
			createNewCommandInput();
		} else if (args[0] === "pull") {
			if (!args[1]) {
				displayOutput("Usage: git pull <directory>");
				createNewCommandInput();
				return;
			}
			const dirName = args[1];
			const targetDir = `${currentPath}/${dirName}`;
			try {
				const result = await gitfetch.pull({
					fs: window.parent.Filer.fs,
					http: http,
					dir: targetDir,
					corsProxy: "https://cors.isomorphic-git.org",
					author: {
						name: user,
						email: `${user}@terbiumux.net`,
					},
					onMessage: e => {
						displayOutput(e);
					},
				});
				displayOutput(JSON.stringify(result, null, 2));
			} catch (error) {
				displayError(`Error: ${error.message}`);
			}
			createNewCommandInput();
		} else if (args[0] === "push") {
			if (!args[1]) {
				displayOutput("Usage: git push <directory>");
				createNewCommandInput();
				return;
			}
			const dirName = args[1];
			const targetDir = `${currentPath}/${dirName}`;
			try {
				const result = await window.parent.tb.dialog.WebAuth({
					title: "GitHub Authentication",
					onOk: async ({ username, password }) => {
						try {
							const gitResult = await gitfetch.push({
								fs: window.parent.Filer.fs,
								http: http,
								dir: targetDir,
								corsProxy: "https://cors.isomorphic-git.org",
								remote: "origin",
								force: false,
								onMessage: e => {
									displayOutput(e);
								},
								author: {
									name: user,
									email: `${user}@terbiumux.net`,
								},
								onAuth: () => {
									return { username, password };
								},
							});
							displayOutput(JSON.stringify(gitResult, null, 2));
						} catch (error) {
							displayError(`Error: ${error.message}`);
						} finally {
							createNewCommandInput();
						}
					},
					onCancel: () => {
						displayError("GitHub authentication canceled");
						createNewCommandInput();
					},
				});
			} catch (error) {
				displayError(`Error: ${error.message}`);
				createNewCommandInput();
			}
		} else if (args[0] === "fetch") {
			if (!args[1]) {
				displayOutput("Usage: git fetch <directory> <remote-url>");
				createNewCommandInput();
				return;
			}
			const dirName = args[1];
			const targetDir = `${currentPath}/${dirName}/.git`;
			if (!args[2]) {
				displayError("Error: Remote URL must be provided.");
				createNewCommandInput();
				return;
			}
			const remoteUrl = args[2];
			try {
				await gitfetch.fetch({
					fs: window.parent.Filer.fs,
					http: http,
					dir: targetDir,
					url: remoteUrl,
				});

				displayOutput("Fetch successful.");
			} catch (error) {
				displayError(`Error: ${error.message}`);
			}
			createNewCommandInput();
		} else if (args[0] === "commit") {
			if (!args[1]) {
				displayOutput("Usage: git commit <directory> <message>");
				createNewCommandInput();
				return;
			}
			const dirName = args[1];
			const targetDir = `${currentPath}/${dirName}`;
			if (!args[2]) {
				displayError("Error: Commit message must be provided.");
				createNewCommandInput();
				return;
			}
			const commitMessage = args.slice(2).join(" ");
			try {
				await gitfetch.commit({
					fs: window.parent.Filer.fs,
					http: http,
					dir: targetDir,
					corsProxy: "https://cors.isomorphic-git.org",
					author: {
						name: user,
						email: `${user}@terbiumux.net`,
					},
					message: commitMessage,
				});
				displayOutput("Commit successful.");
			} catch (error) {
				displayError(`Error: ${error.message}`);
			}
			createNewCommandInput();
		} else {
			displayOutput(`
Usage: git [--version] [--help] <command> [<args>]

These are common Git commands used in various situations:

start a working area
   clone     Clone a repository into a new directory
   init      Create an empty Git repository or reinitialize an existing one

work on the current change
   add       Add file contents to the index
   rm        Remove files from the working tree and from the index

examine the history and state
   status    Show the working tree status

grow, mark and tweak your common history
   commit    Record changes to the repository (Make sure to run git add <filename> <directory> before commiting)

collaborate (Login requires your GitHub Token)
   fetch     Download objects and refs from another repository
   pull      Fetch from and integrate with another repository or a local branch
   push      Update remote refs along with associated objects
`);
			createNewCommandInput();
		}
	} catch (e) {
		displayError(e);
		createNewCommandInput();
	}
}

git(args);
