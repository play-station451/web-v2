async function tb(args) {
    function error(err) {
        displayError(err);
        createNewCommandInput();
    }
	switch (args._[0]) {
        case undefined:
        case null:
            error("tb: no subcommand was provided for execution");
            break;
        case "restart":
        case "reboot":
            switch (args._[1]) {
                case "-f":
                case "--force":
                    window.parent.sessionStorage.clear();
					window.parent.location.reload();
                    break;
                default:
                    window.parent.sessionStorage.setItem("logged-in", "false");
					window.parent.location.reload();
                    break;
            }
            break;
        case "lock": 
            window.parent.sessionStorage.setItem("logged-in", false);
            window.parent.location.reload();
            break;
        case "proc":
            switch (args._[1]) {
                case "kill":
                case "delete":
                    if (args._[2] === undefined) {
                        error("tb: proc: expected an argument at pos 2, got nothing");
                    } else {
                        tb.process.kill(args._[2]);
                    }
                    createNewCommandInput();
                    break;
                case "list":
                    const proclist = window.parent.tb.process.list();
                    const proclistIDs = Object.keys(proclist);
                    for (let i = 0; i < proclist.length; i++) {
                        displayOutput(`"${proclist[i].name}" [PID: ${proclistIDs[i]}]`);
                    };
                    createNewCommandInput();
                    break;
                default:
                    error("tb: proc: expected an argument at pos 2, got nothing");
            }
            break;
        case "sys":
        case "system":
            switch (args._[1]) {
                case undefined:
                case null:
                    error("tb: system: expected an argument at pos 1, got nothing");
                    break;
                case "ver":
                case "version":
                    displayOutput(`TerbiumOS version ${window.parent.tb.system.version()}`);
                    break;
                default:
                    error(`tb: system: unknown subcommand: ${args._[1]}`);
            }
            break;
        default:
            error(`tb: unknown subcommand: ${args._[0]}`);
            break;
    }
}
tb(args);