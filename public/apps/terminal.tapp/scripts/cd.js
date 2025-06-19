function cd(args) {
	if (args._raw === "../") {
		if (path.endsWith("/")) {
			path = path.slice(0, -1);
		}
		let pathParts = path.split("/").filter(Boolean);
		if (pathParts.length > 1) {
			pathParts.pop();
			let newPath = "/" + pathParts.join("/") + "/";
			window.dispatchEvent(
				new CustomEvent("updPath", {
					detail: newPath,
				}),
			);
		} else {
			window.dispatchEvent(
				new CustomEvent("updPath", {
					detail: "//",
				}),
			);
		}
		createNewCommandInput();
	} else {
		Filer.fs.exists(`${path}/${args._raw}`, exists => {
			if (!exists) {
				displayError(`cd: ${path}/${args._raw}: No such file or directory`);
				createNewCommandInput();
			} else {
				window.dispatchEvent(
					new CustomEvent("updPath", {
						detail: `${path}/${args._raw}`,
					}),
				);
				createNewCommandInput();
			}
		});
	}
}
cd(args);
