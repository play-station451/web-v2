async function open(args) {
    if (args.length == 0) {
        displayError("open: missing operand.");
        createNewCommandInput();
        return;
    }
    let path = args[0];
    if (path.startsWith("/")) {
        path = path.slice(1);
    }
    let file = await Filer.fs.promises.readFile(path, "utf8");
    displayOutput(file);
    createNewCommandInput();
}

open(args)