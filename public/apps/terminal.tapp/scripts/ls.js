function ls(args) {
	if (args._raw) {
		try {
			tb.sh.ls(path + args._raw, (err, entries) => {
				if (err) {
					displayError(`ls: ${err.message}`);
					createNewCommandInput();
				} else {
					entries.forEach(entry => {
						displayOutput(entry.name);
					});
					createNewCommandInput();
				}
			});
		} catch {
			tb.sh.ls(args._raw, (err, entries) => {
				if (err) {
					displayError(`ls: ${err.message}`);
					createNewCommandInput();
				} else {
					entries.forEach(entry => {
						displayOutput(entry.name);
					});
					createNewCommandInput();
				}
			});
		}
	} else {
		tb.sh.ls(path, (err, entries) => {
			if (err) {
				displayOutput(`ls: ${err.message}`);
				createNewCommandInput();
			} else {
				entries.forEach(entry => {
					displayOutput(entry.name);
				});
				createNewCommandInput();
			}
		});
	}
}
ls(args);
