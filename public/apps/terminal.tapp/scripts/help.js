async function help(args) {
	if (args.length > 0) {
		const scriptName = args[0];
		const scriptList = JSON.parse(await Filer.fs.promises.readFile(`/apps/user/${sessionStorage.getItem("currAcc")}/terminal/info.json`, "utf8"));
		const script = scriptList.find(script => script.name === scriptName);
		if (script) {
			const scriptInfo = document.createElement("div");
			scriptInfo.textContent = `${script.name}: ${script.usage ? `${script.usage}` : ""}`;
			outputElement.appendChild(scriptInfo);
		} else {
			const errorText = document.createElement("div");
			errorText.textContent = `help: ${scriptName}: No such script`;
			errorText.className = "error-text";
			outputElement.appendChild(errorText);
		}
		createNewCommandInput();
	} else {
		fetch("./scripts/info.json")
			.then(response => response.json())
			.then(scriptList => {
				for (let script of scriptList) {
					displayOutput(`${script.usage.padEnd(30)} ${script.description}`);
				}
				createNewCommandInput();
			});
	}
}
help(args);
