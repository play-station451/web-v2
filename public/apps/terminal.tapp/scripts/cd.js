function cd(args) {
	let destination = args._[0];
	const raw_destination = destination;

	if (!destination || destination === "~") {
		const homePath = `/home/${sessionStorage.getItem("currAcc")}/`;
		window.dispatchEvent(new CustomEvent("updPath", { detail: homePath }));
		createNewCommandInput();
		return;
	}

	if (destination.startsWith("~/")) {
		destination = destination.replace("~", `/home/${sessionStorage.getItem("currAcc")}`);
	}

	let newPath;
	if (destination.startsWith("/")) {
		newPath = destination;
	} else {
		newPath = path + destination;
	}

	const resolvedParts = [];
	for (const part of newPath.split("/").filter(p => p)) {
		if (part === "..") {
			resolvedParts.pop();
		} else if (part !== ".") {
			resolvedParts.push(part);
		}
	}

	let finalPath = "/" + resolvedParts.join("/") + "/";
	if (finalPath === "//") {
		finalPath = "/";
	}

	const checkPath = finalPath.length > 2 ? finalPath.slice(0, -1) : finalPath;
	window.parent.tb.fs.stat(checkPath, (err, stats) => {
		if (err) {
			if (destination.includes("/mnt/") || checkPath.includes("/mnt/")) {
				window.dispatchEvent(
					new CustomEvent("updPath", {
						detail: finalPath,
					}),
				);
				createNewCommandInput();
			} else {
				displayError(`cd: ${raw_destination}: No such file or directory`);
				createNewCommandInput();
			}
		} else if (!stats.isDirectory()) {
			displayError(`cd: ${raw_destination}: Not a directory`);
			createNewCommandInput();
		} else {
			window.dispatchEvent(
				new CustomEvent("updPath", {
					detail: finalPath,
				}),
			);
			createNewCommandInput();
		}
	});
}
cd(args);
