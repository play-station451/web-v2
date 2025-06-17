function cd(args) {
	let path = args[0].toString();
	if (path === "../") {
		let currentPath = terminal.getAttribute("path");
		if (currentPath === "~" || currentPath.startsWith("/home")) {
			terminal.setAttribute("path", "//home");
		} else {
			let pathParts = currentPath.split("/");
			pathParts.pop();
			let newPath = pathParts.join("/");
			terminal.setAttribute("path", newPath);
		}
		createNewCommandInput();
	} else {
		let currentPath = terminal.getAttribute("path");
		if (path === "/home") {
			if (currentPath.startsWith("~")) displayError("cd: already in home directory");
		}
		if (path.includes("/home")) {
			path = path.replace("/home/", "");
		}
		if (path === "") path = "~";
		let newPath = `${currentPath}/${path}`;
		let filerPath = newPath.replace("~", `/home/${window.parent.sessionStorage.getItem("currAcc")}`);
		Filer.fs.exists(filerPath, exists => {
			if (!exists) {
				const errorText = document.createElement("div");
				errorText.textContent = `cd: ${path}: No such file or directory`;
				errorText.className = "error-text";
				outputElement.appendChild(errorText);
				createNewCommandInput();
			} else {
				terminal.setAttribute("path", newPath);
				createNewCommandInput();
			}
		});
	}
}
cd(args);
