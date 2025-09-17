async function rmdir(args) {
	if (args._raw.length <= 0) {
		displayError("rmdir: missing operand");
		createNewCommandInput();
		return;
	}
	if (path.includes("/mnt/")) {
		displayError("TNSM rmdir: Removing directories from mounted drives is not supported by the webdav library at this time.");
	} else {
		window.parent.tb.sh.rm(`${path}/${args._raw}`, err => {
			if (err) {
				displayError(`rmdir: ${err.message}`);
				createNewCommandInput();
			} else {
				createNewCommandInput();
			}
		});
	}
}
rmdir(args);
