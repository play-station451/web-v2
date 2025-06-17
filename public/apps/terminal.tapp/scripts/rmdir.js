function rmdir(args) {
	if (args.length <= 0) {
		displayError("rmdir: missing operand");
		createNewCommandInput();
		return;
	}
	var path = args[0];
	var currentPath = terminal.getAttribute("path");
	if (path.startsWith("/")) {
		currentPath = path;
	} else {
		currentPath = currentPath + "/" + path;
	}
	if (currentPath.includes("~")) {
		currentPath = currentPath.replace("~", `/home/${window.parent.sessionStorage.getItem("currAcc")}`);
	}
	sh.rmdir(currentPath, err => {
		if (err) {
			displayError(`rmdir: ${err.message}`);
			createNewCommandInput();
		} else {
			createNewCommandInput();
		}
	});
}
rmdir(args);
