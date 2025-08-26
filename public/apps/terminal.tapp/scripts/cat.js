async function cat(args) {
	if (args._raw.length <= 0) {
		displayError("cat: missing operand");
		createNewCommandInput();
		return;
	}
	displayOutput(`%cRight now cat only outputs the contents of a file.\n`, "color: #e39d34");
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
			const content = await client.getFileContents(`${np}/${args._raw}`);
			const text = new TextDecoder().decode(content);
			displayOutput(text);
			createNewCommandInput();
		} catch (e) {
			displayError(`TNSM cat: ${e.message}`);
			createNewCommandInput();
			return;
		}
	} else {
		tb.sh.cat(`${path}/${args._raw}`, (err, data) => {
			if (err) {
				displayError(`cat: ${err.message}`);
				createNewCommandInput();
			} else {
				displayOutput(data);
				createNewCommandInput();
			}
		});
	}
}
cat(args);
