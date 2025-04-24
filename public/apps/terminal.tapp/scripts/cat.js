function cat(args) {
    if (args.length <= 0) {
        displayError("cat: missing operand");
        createNewCommandInput();
        return;
    }
    var path = args[0];
    var currentPath = terminal.getAttribute("path");
    if (path.startsWith("/")) {
        currentPath = path;
    } else {
        currentPath = currentPath + "/" + path;
    }
    if (currentPath.includes("~")) {
        currentPath = currentPath.replace("~", `/home/${window.parent.sessionStorage.getItem("currAcc")}`);
    }
    displayOutput(`%cRight now cat only outputs the contents of a file.\n`, "color: #e39d34");
    sh.cat(currentPath, (err, data) => {
        if (err) {
            displayError(`cat: ${err.message}`);
            createNewCommandInput();
        } else {
            displayOutput(data);
            createNewCommandInput();
        }
    })
}
cat(args);