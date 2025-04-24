function mkdir(args) {
    if (!args) {
        displayError("mkdir: Please provide a directory name")
        createNewCommandInput();
        return;
    }
    let path = terminal.getAttribute("path");
    if(args[0].startsWith("/")) {
        path = args[0].split("/").join("/");
    } else {
        path = terminal.getAttribute("path") + "/" + args[0];
    }
    if(path.includes("~")) {
        path = path.replace("~", `/home/${window.parent.sessionStorage.getItem("currAcc")}`);
    }
    Filer.fs.promises.mkdir(path).then(() => {
        createNewCommandInput();
    }).catch(error => {
        if(error.code === "ENOENT") {
            error = "No such file or directory";
        }
        displayError(`mkdir: cannot create directory "${args[0]}': ${error}`);
        createNewCommandInput();
    });
}
mkdir(args)