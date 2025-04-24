function taskkill(args) {
    if (args.includes("list")) {
        const windows = tb.process.list()
        Object.values(windows).forEach(window => {
            displayOutput(`${window.name}, ${window.pid}`)
        })
        createNewCommandInput()
    } else {
        try {
            window.tb.process.kill(args[0])
            displayOutput(`Successfully killed task with pid: ${args[0]}`)
        } catch {
            displayError('Not task found with that PID')
        }
        createNewCommandInput()
    }
}

taskkill(args)