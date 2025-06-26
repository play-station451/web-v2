function mkdir(args) {
	if (!args._raw) {
		displayError("mkdir: Please provide a directory name");
		createNewCommandInput();
		return;
	}
	Filer.fs.promises
		.mkdir(path + args._raw)
		.then(() => {
			createNewCommandInput();
		})
		.catch(error => {
			if (error.code === "ENOENT") {
				error = "No such file or directory";
			}
			displayError(`mkdir: cannot create directory "${args._raw}': ${error}`);
			createNewCommandInput();
		});
}
mkdir(args);
