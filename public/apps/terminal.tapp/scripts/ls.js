async function ls(args) {
	if (args._raw === "/mnt/" || path === "/mnt/") {
		function centerText(text, width) {
			const pad = Math.max(0, width - text.length);
			const padLeft = Math.floor(pad / 2);
			const padRight = pad - padLeft;
			return " ".repeat(padLeft) + text + " ".repeat(padRight);
		}
		const columns = [
			{ name: "Name", width: 12 },
			{ name: "URL", width: 32 },
			{ name: "Mounted", width: 10 },
			{ name: "Mounted Path", width: 20 },
		];
		const header = "| " + columns.map(col => centerText(col.name, col.width)).join(" | ") + " |";
		const separator = "|" + columns.map(col => "-".repeat(col.width + 2)).join("|") + "|";
		displayOutput(centerText(`TerbiumOS Network Storage Manager v1.0.1`, header.length));
		displayOutput(header);
		displayOutput(separator);
		const davInstances = JSON.parse(await window.parent.tb.fs.promises.readFile(`/apps/user/${sessionStorage.getItem("currAcc")}/files/davs.json`, "utf8"));
		for (const dav of davInstances) {
			let mounted;
			try {
				const client = window.webdav.createClient(dav.url, {
					username: dav.username,
					password: dav.password,
					authType: window.webdav.AuthType.Password,
				});
				await client.getDirectoryContents("/");
				mounted = true;
			} catch {
				mounted = false;
			}
			const row = [centerText(dav.name, columns[0].width), centerText(dav.url, columns[1].width), centerText(mounted ? "Yes" : "No", columns[2].width), centerText(`/mnt/${dav.name.toLowerCase()}`, columns[3].width)];
			displayOutput("| " + row.join(" | ") + " |");
		}
		createNewCommandInput();
	} else if ((args._raw.includes("/mnt/") && args._raw !== "/mnt/") || (path.includes("/mnt/") && path !== "/mnt/")) {
		try {
			const match = args._raw.match(/\/mnt\/([^\/]+)\//) || path.match(/\/mnt\/([^\/]+)\//);
			const davName = match ? match[1].toLowerCase() : "";
			const davInstances = JSON.parse(await window.parent.tb.fs.promises.readFile(`/apps/user/${sessionStorage.getItem("currAcc")}/files/davs.json`, "utf8"));
			const dav = davInstances.find(d => d.name.toLowerCase() === davName);
			const client = window.webdav.createClient(dav.url, {
				username: dav.username,
				password: dav.password,
				authType: window.webdav.AuthType.Password,
			});
			const np = args._raw.replace(`/mnt/${davName.toLowerCase()}/`, "") || path.replace(`/mnt/${davName.toLowerCase()}/`, "");
			const contents = await client.getDirectoryContents(np);
			for (const entry of contents) {
				if (entry.type === "directory") {
					displayOutput(`${entry.basename}/`);
				} else {
					displayOutput(entry.basename);
				}
			}
		} catch (e) {
			displayError(`TNSM ls: Dav Drive is not mounted with error: ${e.message}`);
			createNewCommandInput();
			return;
		}
		createNewCommandInput();
	} else if (args._raw) {
		try {
			tb.sh.ls(path + args._raw, (err, entries) => {
				if (err) {
					displayError(`ls: ${err.message}`);
					createNewCommandInput();
				} else {
					entries.forEach(entry => {
						displayOutput(entry.name);
					});
					createNewCommandInput();
				}
			});
		} catch {
			tb.sh.ls(args._raw, (err, entries) => {
				if (err) {
					displayError(`ls: ${err.message}`);
					createNewCommandInput();
				} else {
					entries.forEach(entry => {
						displayOutput(entry.name);
					});
					createNewCommandInput();
				}
			});
		}
	} else {
		tb.sh.ls(path, (err, entries) => {
			if (err) {
				displayError(`ls: ${err.message}`);
				createNewCommandInput();
			} else {
				entries.forEach(entry => {
					displayOutput(entry.name);
				});
				createNewCommandInput();
			}
		});
	}
}
ls(args);
