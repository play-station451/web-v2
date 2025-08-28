async function touch(args) {
	if (args._raw.length <= 0) {
		displayError("touch: missing operand");
		createNewCommandInput();
		return;
	}

	if (path.includes("/mnt/")) {
		try {
			const match = path.match(/\/mnt\/([^\/]+)\//);
			const davName = match ? match[1].toLowerCase() : "";
			const davInstances = JSON.parse(await window.parent.tb.fs.promises.readFile(`/apps/user/${sessionStorage.getItem("currAcc")}/files/davs.json`, "utf8"));
			const dav = davInstances.find(d => d.name.toLowerCase() === davName);
			const client = window.webdav.createClient(dav.url, {
				username: dav.username,
				password: dav.password,
				authType: window.webdav.AuthType.Password,
			});
			const np = path.replace(`/mnt/${davName.toLowerCase()}/`, "");
			await client.putFileContents(`${np}/${args._raw}`, "", { overwrite: true });
			createNewCommandInput();
		} catch (e) {
			displayError(`TNSM touch: ${e.message}`);
			createNewCommandInput();
			return;
		}
	} else {
		tb.sh.touch(`${path}/${args._raw}`, err => {
			if (err) {
				displayError(`touch: ${err.message}`);
				createNewCommandInput();
			} else {
				createNewCommandInput();
			}
		});
	}
}
touch(args);
