function ls(args) {
    let currentPath = terminal.getAttribute("path");
    if(currentPath.startsWith("~")) currentPath = currentPath.replace("~", `/home/${window.parent.sessionStorage.getItem("currAcc")}`);
    if (args) {
        try {
            sh.ls(currentPath + args, (err, entries) => {
            if(err) {
                const errorText = document.createElement("div");
                errorText.textContent = `ls: ${err.message}`;
                errorText.className = "error-text";
                outputElement.appendChild(errorText);
                createNewCommandInput();
            } else {
                entries.forEach(entry => {
                    const entryText = document.createElement("div");
                    entryText.textContent = entry.name;
                    outputElement.appendChild(entryText);
                })
                createNewCommandInput();   
            }
        })
        } catch {
            sh.ls(args, (err, entries) => {
                if(err) {
                    const errorText = document.createElement("div");
                    errorText.textContent = `ls: ${err.message}`;
                    errorText.className = "error-text";
                    outputElement.appendChild(errorText);
                    createNewCommandInput();
                } else {
                    entries.forEach(entry => {
                        const entryText = document.createElement("div");
                        entryText.textContent = entry.name;
                        outputElement.appendChild(entryText);
                    })
                    createNewCommandInput();   
                }
            })
        }
    } else {
        sh.ls(currentPath, (err, entries) => {
            if(err) {
                const errorText = document.createElement("div");
                errorText.textContent = `ls: ${err.message}`;
                errorText.className = "error-text";
                outputElement.appendChild(errorText);
                createNewCommandInput();
            } else {
                entries.forEach(entry => {
                    const entryText = document.createElement("div");
                    entryText.textContent = entry.name;
                    outputElement.appendChild(entryText);
                })
                createNewCommandInput();   
            }
        })
    }
}
ls(args)