var Filer = window.parent.Filer;
var tb = window.parent.tb;
async function qwick(args) {
	try {
		var stubBase = await Filer.fs.promises.readFile("/system/qwick/qwick.js", "utf8");
		var stub = new Function("args", "displayOutput", "createNewCommandInput", "displayError", "term", "path", "terbium", stubBase);
		await stub(args, displayOutput, createNewCommandInput, displayError, term, path, terbium);
	} catch (err) {
		displayError("Qwick stub failed to launch: " + err.message);
		createNewCommandInput();
	}
}
qwick(args);
