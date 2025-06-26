function rmdir(args) {
	if (args._raw.length <= 0) {
		displayError("rmdir: missing operand");
		createNewCommandInput();
		return;
	}
	tb.sh.rm(`${path}/${args._raw}`, err => {
		if (err) {
			displayError(`rmdir: ${err.message}`);
			createNewCommandInput();
		} else {
			createNewCommandInput();
		}
	});
}
rmdir(args);
