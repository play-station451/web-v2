function touch(args) {
	if (args._raw.length <= 0) {
		displayError("touch: missing operand");
		createNewCommandInput();
		return;
	}
	if (path.startsWith("/")) {
		currentPath = path;
	} else {
		currentPath = currentPath + "/" + path;
	}

	tb.sh.touch(`${path}/${args._raw}`, err => {
		if (err) {
			displayError(`touch: ${err.message}`);
			createNewCommandInput();
		} else {
			createNewCommandInput();
		}
	});
}
touch(args);
