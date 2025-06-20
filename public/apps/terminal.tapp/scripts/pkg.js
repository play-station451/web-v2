let repo = localStorage.getItem("appRepo") || "https://raw.githubusercontent.com/TerbiumOS/app-repo/main/apps.json";
console.log("Using: ", repo);

async function installApp(appName, param) {
	const response = await window.parent.tb.libcurl.fetch(repo);
	const apps = await response.json();
	const appToInstall = apps.find(app => app["pkg-name"].toLowerCase() === appName.toLowerCase());
	async function install(appName) {
		if ("pkg-download" in appName) {
			let app = appName;
			const appPath = `/apps/system/${app.name.toLowerCase()}.tapp`;
			const appExists = await new Promise(resolve => Filer.fs.exists(appPath, resolve));
			if (!appExists) {
				await installTAPP(app);
				createNewCommandInput();
			} else {
				displayOutput(`${app.name} is already installed. Do you want to reinstall? [y/N]`);
				term.focus();
				// TODO
				window.addEventListener("keydown", async function keydownListener(e) {
					if (e.key === "y") {
						await installTAPP(app);
						displayOutput(`Reinstalled ${app.name}`);
						window.removeEventListener("keydown", keydownListener);
						createNewCommandInput();
					} else if (e.key === "n") {
						displayOutput(`${app.name} was not reinstalled.`);
						window.removeEventListener("keydown", keydownListener);
						createNewCommandInput();
					}
				});
			}
		} else if ("anura-pkg" in appName) {
			let app = appName;
			const appPath = `/apps/anura/${app.name.toLowerCase()}`;
			const appExists = await new Promise(resolve => Filer.fs.exists(appPath, resolve));
			if (!appExists) {
				await installAnura(app);
				createNewCommandInput();
			} else {
				displayOutput(`${app.name} is already installed. Do you want to reinstall? [y/N]`);
				inputElement.blur();
				inputElement.disabled = true;
				window.addEventListener("keydown", async function keydownListener(e) {
					if (e.key === "y") {
						await installAnura(app);
						displayOutput(`Reinstalled ${app.name}`);
						window.removeEventListener("keydown", keydownListener);
						createNewCommandInput();
					} else if (e.key === "n") {
						displayOutput(`${app.name} was not reinstalled.`);
						window.removeEventListener("keydown", keydownListener);
						createNewCommandInput();
					}
				});
			}
		} else {
			let app = appName;
			let appPath = `/apps/user/${await window.parent.tb.user.username()}/${app.name}`;
			let appIndex = {
				name: app.name,
				icon: app.icon,
				description: app.description,
				authors: app.authors,
				"pkg-name": app["pkg-name"],
				version: app.version,
				images: app.images,
				wmArgs: app.wmArgs,
			};
			let installed = await Filer.fs.promises.readdir("/apps");
			if (installed.includes(app["pkg-name"])) {
				displayOutput(`${app.name} is already installed. Do you want to reinstall? [y/N]`);
				inputElement.blur();
				inputElement.disabled = true;
				window.addEventListener("keydown", async function keydownListener(e) {
					if (e.key === "y") {
						await Filer.fs.promises.writeFile(`${appPath}/index.json`, JSON.stringify(appIndex));
						displayOutput(`Reinstalled ${app.name}`);
						window.removeEventListener("keydown", keydownListener);
						createNewCommandInput();
					} else if (e.key === "n") {
						displayOutput(`${app.name} was not reinstalled.`);
						window.removeEventListener("keydown", keydownListener);
						createNewCommandInput();
					}
				});
			} else {
				await Filer.fs.promises.mkdir(appPath);
				await Filer.fs.promises.writeFile(`${appPath}/index.json`, JSON.stringify(appIndex));
				let apps = JSON.parse(await Filer.fs.promises.readFile("/apps/web_apps.json", "utf8"));
				apps["apps"].push(app["pkg-name"]);
				await Filer.fs.promises.writeFile("/apps/web_apps.json", JSON.stringify(apps));
				await window.parent.tb.launcher.addApp({
					title: app["wmArgs"]["title"],
					name: app.name,
					icon: app.icon,
					src: `${(await window.tb.proxy.get()) === "Ultraviolet" ? "/uv/service/" + (await tb.proxy.encode(app["wmArgs"]["src"], "xor")) : "/service/" + (await tb.proxy.encode(app["wmArgs"]["src"], "xor"))}`,
					size: {
						width: app["wmArgs"]["size"]["width"],
						height: app["wmArgs"]["size"]["height"],
					},
					single: app["wmArgs"]["single"],
					resizable: app["wmArgs"]["resizable"],
					controls: app["wmArgs"]["controls"],
					message: app["wmArgs"]["message"],
					snapable: app["wmArgs"]["snapable"],
				});
				try {
					let apps = JSON.parse(await Filer.fs.promises.readFile(`/apps/installed.json`, "utf8"));
					apps.push({
						name: app.name,
						user: await window.parent.tb.user.username(),
						config: `/apps/user/${await window.parent.tb.user.username()}/${app.name}/index.json`,
					});
					await Filer.fs.promises.writeFile(`/apps/installed.json`, JSON.stringify(apps));
				} catch {
					await Filer.fs.promises.writeFile(
						`/apps/installed.json`,
						JSON.stringify([
							{
								name: app.name,
								user: await window.parent.tb.user.username(),
								config: `/apps/user/${await window.parent.tb.user.username()}/${app.name}/index.json`,
							},
						]),
					);
				}
				displayOutput(`Installed ${app.name}`);
				createNewCommandInput();
			}
		}
	}
	async function installTAPP(app) {
		const appName = app.name.toLowerCase();
		const appPath = `/apps/${appName}`;
		const downloadUrl = app["pkg-download"];
		console.log(downloadUrl);
		window.parent.tb.notification.Installing({
			message: `Installing ${app.name}...`,
			application: "Files",
			iconSrc: "/apps/files.tapp/icon.svg",
			time: 500,
		});
		displayOutput(`Installing ${app.name}...`);
		try {
			await tb.system.download(downloadUrl, `${appPath}.zip`);
			const targetDirectory = `/apps/system/${appName}.tapp/`;
			await unzip(`/apps/${appName}.zip`, targetDirectory);
			console.log("Done!");
			displayOutput("Done!");
			const appConf = await Filer.fs.promises.readFile(`/apps/system/${appName}.tapp/.tbconfig`, "utf8");
			const appData = JSON.parse(appConf);
			console.log(appData);
			await window.parent.tb.launcher.addApp({
				title:
					typeof appData.wmArgs.title === "object"
						? {
								text: appData.wmArgs.title.text,
								weight: appData.wmArgs.title.weight,
								html: appData.wmArgs.title.html,
							}
						: appData.wmArgs.title,
				name: appData.title,
				icon: `/fs/apps/system/${appName}.tapp/${appData.icon}`,
				src: `/fs/apps/system/${appName}.tapp/${appData.wmArgs.src}`,
				size: {
					width: appData.wmArgs.size.width,
					height: appData.wmArgs.size.height,
				},
				single: appData.wmArgs.single,
				resizable: appData.wmArgs.resizable,
				controls: appData.wmArgs.controls,
				message: appData.wmArgs.message,
				snapable: appData.wmArgs.snapable,
			});
			try {
				let apps = JSON.parse(await Filer.fs.promises.readFile(`/apps/installed.json`, "utf8"));
				apps.push({
					name: appName,
					user: await window.parent.tb.user.username(),
					config: `/apps/system/${appName}.tapp/.tbconfig`,
				});
				await Filer.fs.promises.writeFile(`/apps/installed.json`, JSON.stringify(apps));
			} catch {
				await Filer.fs.promises.writeFile(
					`/apps/installed.json`,
					JSON.stringify({
						name: appName,
						user: await window.parent.tb.user.username(),
						config: `/apps/system/${appName}.tapp/.tbconfig`,
					}),
				);
			}
			window.parent.tb.notification.Toast({
				message: `${appName} has been installed!`,
				application: "App Store",
				iconSrc: "/apps/app store.tapp/icon.svg",
				time: 5000,
			});
			displayOutput(`${app.name} has been installed sucessfully`);
			await Filer.fs.promises.unlink(`/apps/${appName}.zip`);
		} catch (e) {
			console.error("Error installing the app:", e);
			await new Filer.fs.Shell().promises.rm(`/apps/${appName}`, { recursive: true });
			window.parent.tb.notification.Toast({
				message: `Failed to install ${appName}. Check the console for details.`,
				application: "App Store",
				iconSrc: "/apps/app store.tapp/icon.svg",
				time: 5000,
			});
			displayError(`${app.name} wasn't installed sucessfully.`);
		}
	}
	async function installAnura(app) {
		const appName = app.name.toLowerCase();
		const appPath = `/apps/anura/${appName}`;
		const downloadUrl = app["anura-pkg"];
		console.log(downloadUrl);
		window.parent.tb.notification.Installing({
			message: `Installing ${appName}...`,
			application: "Files",
			iconSrc: "/apps/files.tapp/icon.svg",
			time: 500,
		});
		displayOutput(`Installing ${appName}...`);
		try {
			await tb.system.download(downloadUrl, `${appPath}.zip`);
			const targetDirectory = `/apps/anura/${appName}/`;
			await unzip(`/apps/${appName}.zip`, targetDirectory);
			console.log("Done!");
			displayOutput("Done!");
			const appConf = await Filer.fs.promises.readFile(`/apps/anura/${appName}/manifest.json`, "utf8");
			const appData = JSON.parse(appConf);
			console.log(appData);
			await window.parent.tb.launcher.addApp({
				name: appData.wininfo.title,
				title: appData.wininfo.title,
				icon: `/fs/apps/anura/${appName}/${appData.icon}`,
				src: `/fs/apps/anura/${appName}/${appData.index}`,
				size: {
					width: appData.wininfo.width,
					height: appData.wininfo.height,
				},
				single: appData.wininfo.allowMultipleInstance,
			});
			window.parent.anura.apps[appData.package] = {
				title: appData.name,
				icon: appData.icon,
				id: appData.package,
			};
			try {
				let apps = JSON.parse(await Filer.fs.promises.readFile(`/apps/installed.json`, "utf8"));
				apps.push({
					name: appData.name,
					user: await window.parent.tb.user.username(),
					config: `/apps/anura/${appName}/manifest.json`,
				});
				await Filer.fs.promises.writeFile(`/apps/installed.json`, JSON.stringify(apps));
			} catch {
				await Filer.fs.promises.writeFile(
					`/apps/installed.json`,
					JSON.stringify([
						{
							name: appData.name,
							user: await window.parent.tb.user.username(),
							config: `/apps/anura/${appName}/manifest.json`,
						},
					]),
				);
			}
			window.parent.tb.notification.Toast({
				message: `${appName} has been installed!`,
				application: "App Store",
				iconSrc: "/apps/app store.tapp/icon.svg",
				time: 5000,
			});
			displayOutput(`${appName} has been installed sucessfully`);
			await Filer.fs.promises.unlink(`/apps/anura/${appName}.zip`);
		} catch (e) {
			console.error("Error installing the app:", e);
			await new Filer.fs.Shell().promises.rm(`/apps/anura/${appName}`, { recursive: true });
			window.parent.tb.notification.Toast({
				message: `Failed to install ${appName}. Check the console for details.`,
				application: "App Store",
				iconSrc: "/apps/app store.tapp/icon.svg",
				time: 5000,
			});
			displayError(`${appName} wasn't installed sucessfully.`);
		}
	}
	if (appToInstall) {
		install(appToInstall);
	} else {
		displayOutput(`pkg: "${appName}" not found.`);
		createNewCommandInput();
	}
}

async function removeApp(appName) {
	Filer.fs.readFile("//apps/web_apps.json", "utf8", async (err, data) => {
		if (err) return console.log(err);
		let index = JSON.parse(data);
		let apps = index["apps"];
		if (apps.includes(appName)) {
			let appIndex = apps.indexOf(appName);
			apps.splice(appIndex, 1);
			index["apps"] = apps;
			let appData = JSON.parse(await Filer.fs.promises.readFile(`/apps/${appName}/index.json`, "utf8"));
			await parent.window.tb.launcher.removeApp(appData["wmArgs"]["app_id"]);
			if (parent.document.querySelector(`.window[data-app-id="${appData["wmArgs"]["app_id"]}"]`)) {
				parent.document.querySelector(`.window[data-app-id="${appData["wmArgs"]["app_id"]}"]`).querySelector(".close").click();
			}
			await Filer.fs.promises.writeFile("//apps/web_apps.json", JSON.stringify(index));
			await new Filer.fs.Shell().promises.rm(`/apps/${appName}`, { recursive: true });
			try {
				let installedApps = JSON.parse(await Filer.fs.promises.readFile(`/apps/installed.json`, "utf8"));
				installedApps = installedApps.filter(app => app.name !== appName);
				await Filer.fs.promises.writeFile(`/apps/installed.json`, JSON.stringify(installedApps));
			} catch (e) {
				displayError(`Error updating installed.json: ${e}`);
			}
			displayOutput(`Removed ${appName}`);
			createNewCommandInput();
		} else {
			displayOutput(`pkg: "${appName}" is not found.`);
			createNewCommandInput();
		}
	});
}

async function pkg(args) {
	const command = args[0];
	let availableCommands = [
		"pkg <command> -h: Display help for <command>.",
		"pkg install <package-name>: Install an app matching <package-name> from the repo.",
		"pkg remove <package-name>: Uninstall an app matching <package-name> from the repo.",
		"pkg list: Shows a list of installed apps.",
		"pkg search <package-name>: Search for an app matching <package-name> in the repo.",
		"pkg repo: Changes the Package Managers Fetch repo (Use -r to remove the repo you added)",
	];
	if (!command) {
		displayOutput(`Usage: pkg <command>`);
		displayOutput(" ");
		displayOutput("All commands:");
		for (let command in availableCommands) {
			command = availableCommands[command];
			let [cmd, description] = command.split(": ");
			displayOutput(`   ${cmd.padEnd(40)} ${description}`);
		}
		createNewCommandInput();
	} else if (command === "--help" || command === "-h") {
		for (let command in availableCommands) {
			command = availableCommands[command];
			let [cmd, description] = command.split(": ");
			displayOutput(`${cmd.padEnd(30)} ${description}`);
		}
		createNewCommandInput();
	} else if (command === "list") {
		if (args[1] === "--help" || args[1] === "-h") {
			let command = availableCommands.find(command => command.startsWith("pkg list"));
			let [cmd] = command.split(": ");
			displayOutput(`Usage: ${cmd}`);
			displayOutput(`Shows a list of installed apps.`);
			createNewCommandInput();
		} else {
			let appfromindex = JSON.parse(await Filer.fs.promises.readFile("/apps/web_apps.json", "utf8"));
			for (let app in appfromindex["apps"]) {
				app = appfromindex["apps"][app];
				let appinfo = JSON.parse(await Filer.fs.promises.readFile(`/apps/user/${await parent.tb.user.username()}/${app}/index.json`, "utf8"));
				displayOutput(`${appinfo["name"]}: ${appinfo["pkg-name"]}`);
			}
			createNewCommandInput();
		}
	} else if (command === "search") {
		if (args[1] === "--help" || args[1] === "-h") {
			let command = availableCommands.find(command => command.startsWith("pkg search"));
			let [cmd] = command.split(": ");
			displayOutput("Usage:");
			displayOutput(cmd);
			createNewCommandInput();
		} else if (!args[1]) {
			displayOutput("pkg: missing operand: package name");
			createNewCommandInput();
		} else {
			let response = await fetch(repo);
			let apps = await response.json();
			let appToSearch = args[1];
			let app = apps.find(app => app["pkg-name"].toLowerCase() === appToSearch.toLowerCase());
			if (app) {
				displayOutput(`${app.name}: ${app["pkg-name"]}`);
			} else {
				displayOutput(`pkg: Package "${appToSearch}" not found.`);
			}
			createNewCommandInput();
		}
	} else if (command === "remove" || command === "r") {
		const appNameToRemove = args[1];
		if (appNameToRemove) {
			removeApp(appNameToRemove);
		} else {
			displayOutput("Usage: pkg remove <appname>");
			createNewCommandInput();
		}
	} else if (command === "install" || command === "i") {
		if (!args[1]) {
			displayOutput("pkg: missing operand: package name");
			createNewCommandInput();
		} else if (args[1] === "--help") {
			displayOutput("Install an app.");
			displayOutput("Usage: pkg install <package-name>");
			createNewCommandInput();
		} else {
			const appNameToInstall = args[1];
			installApp(appNameToInstall);
		}
	} else if (command === "repo") {
		if (args[1] === "-r" || args[1] === "remove") {
			displayOutput(`Removed repo: ${localStorage.getItem("appsRepo")}`);
			localStorage.removeItem("appsRepo");
		} else {
			if (args[1]) {
				displayOutput(`Set Apps repo to: ${args[1]}`);
				localStorage.setItem("appsRepo", args[1]);
			} else {
				displayOutput("Usage: pkg repo <apps.json-url>");
			}
		}
		createNewCommandInput();
	} else {
		displayError(`pkg: "${command}" is not a pkg command. See "pkg -h".`);
		createNewCommandInput();
	}
}

async function unzip(path, target) {
	const response = await fetch("/fs/" + path);
	const zipFileContent = await response.arrayBuffer();
	if (!(await dirExists(target))) {
		await Filer.fs.promises.mkdir(target, { recursive: true });
	}
	const compressedFiles = window.parent.tb.fflate.unzipSync(new Uint8Array(zipFileContent));
	for (const [relativePath, content] of Object.entries(compressedFiles)) {
		const fullPath = `${target}/${relativePath}`;
		const pathParts = fullPath.split("/");
		let currentPath = "";
		for (let i = 0; i < pathParts.length; i++) {
			currentPath += pathParts[i] + "/";
			if (i === pathParts.length - 1 && !relativePath.endsWith("/")) {
				try {
					console.log(`touch ${currentPath.slice(0, -1)}`);
					await Filer.fs.promises.writeFile(currentPath.slice(0, -1), Filer.Buffer.from(content));
				} catch {
					console.log(`Cant make ${currentPath.slice(0, -1)}`);
				}
			} else if (!(await dirExists(currentPath))) {
				try {
					console.log(`mkdir ${currentPath}`);
					await Filer.fs.promises.mkdir(currentPath);
				} catch {
					console.log(`Cant make ${currentPath}`);
				}
			}
		}
		if (relativePath.endsWith("/")) {
			try {
				console.log(`mkdir fp ${fullPath}`);
				await Filer.fs.promises.mkdir(fullPath);
			} catch {
				console.log(`Cant make ${fullPath}`);
			}
		}
	}
	return "Done!";
}

const dirExists = async path => {
	return new Promise(resolve => {
		Filer.fs.stat(path, (err, stats) => {
			if (err) {
				if (err.code === "ENOENT") {
					resolve(false);
				} else {
					console.error(err);
					resolve(false);
				}
			} else {
				const exists = stats.type === "DIRECTORY";
				resolve(exists);
			}
		});
	});
};

pkg(args);
