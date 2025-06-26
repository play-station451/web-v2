async function curl(args) {
	let url = args._raw;
	if (!url) {
		displayOutput("Usage: curl <scriptURL>");
		createNewCommandInput();
		return;
	}

	let shouldSave = false;
	if (url.includes("-k")) {
		shouldSave = true;
		url = url.replace("-k", "").trim();
	}

	if (shouldSave) {
		tb.dialog.SaveFile({
			title: "Save Script",
			onOk: async loc => {
				try {
					await window.parent.tb.system.download(url, loc);
					displayOutput(`Saved to ${loc}`);
				} catch (e) {
					displayError("Error saving script:", e);
					return;
				}
				createNewCommandInput();
			},
		});
	} else {
		const response = await window.parent.tb.libcurl.fetch(url);
		const scriptContent = await response.text();
		try {
			eval(scriptContent);
		} catch (error) {
			displayError("Error executing script:", error);
		}
		createNewCommandInput();
	}
}

curl(args);
