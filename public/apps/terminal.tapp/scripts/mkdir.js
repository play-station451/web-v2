async function mkdir(args) {
	if (!args._raw) {
		displayError("mkdir: Please provide a directory name");
		createNewCommandInput();
		return;
	}

	if (path.includes("/mnt/")) {
		try {
			const match = path.match(/\/mnt\/([^\/]+)\//);
			const davName = match ? match[1].toLowerCase() : "";
			const davInstances = JSON.parse(await Filer.fs.promises.readFile(`/apps/user/${sessionStorage.getItem("currAcc")}/files/davs.json`, "utf8"));
			const dav = davInstances.find(d => d.name.toLowerCase() === davName);
			const client = window.webdav.createClient(dav.url, {
				username: dav.user,
				password: dav.pass,
				authType: window.webdav.AuthType.Digest,
			});
			const np = path.replace(`/mnt/${davName.toLowerCase()}/`, "");
			await client.createDirectory(`${np}/${args._raw}`);
			createNewCommandInput();
		} catch (e) {
			displayError(`TNSM mkdir: ${e.message}`);
			createNewCommandInput();
			return;
		}
	} else {
		try {
			await Filer.fs.promises.mkdir(path + args._raw);
			createNewCommandInput();
		} catch (error) {
			if (error.code === "ENOENT") {
				error = "No such file or directory";
			}
			displayError(`mkdir: cannot create directory "${args._raw}': ${error}`);
			createNewCommandInput();
		}
	}
}
mkdir(args);
