function taskkill(args) {
	if (args._raw.includes("list")) {
		const windows = tb.process.list();
		Object.values(windows).forEach(window => {
			displayOutput(`${window.name}, ${window.pid}`);
		});
		createNewCommandInput();
	} else {
		try {
			window.tb.process.kill(args._raw);
			displayOutput(`Successfully killed task with pid: ${args._raw}`);
		} catch {
			displayError("Not task found with that PID");
		}
		createNewCommandInput();
	}
}

taskkill(args);
