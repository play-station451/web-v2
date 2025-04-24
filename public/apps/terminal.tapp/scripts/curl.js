function curl(args) {
    if (!args) {
        displayOutput('Usage: curl <scriptURL>');
        createNewCommandInput();
        return;
    }

    window.parent.tb.libcurl.fetch(args).then(response => response.text())
    .then(scriptContent => {
        try {
            eval(scriptContent);
        } catch (error) {
            displayOutput('Error executing script:', error);
        }
        createNewCommandInput();
    }).catch(error => {displayOutput('Error fetching script:', error); createNewCommandInput();});
}

curl(args);