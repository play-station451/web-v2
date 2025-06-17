function touch(args) {
	if (args.length <= 0) {
		displayError("touch: missing operand");
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

	sh.touch(currentPath, err => {
		if (err) {
			displayError(`touch: ${err.message}`);
			createNewCommandInput();
		} else {
			createNewCommandInput();
		}
	});
}
touch(args);
