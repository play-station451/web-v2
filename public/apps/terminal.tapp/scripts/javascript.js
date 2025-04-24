async function JS(args) {
  if (args.length === 0 || args[0] === 'javascript') {
    displayOutput('Welcome to JS v11.4')
    displayOutput('Type "node -h" for more information.')
    createNewCommandInput()
  } else if (args[0] === '-v') {
    displayOutput('v11.4 (JS)')
    createNewCommandInput()
  } else if (args[0] === '-h') {
    displayOutput('Usage: JS [options] [ -e script | script.js ] [arguments]')
    createNewCommandInput()
  } else {
    try {
      const scriptPath = `${window.location.origin}/fs/home/${args[0]}`
      const scriptContent = await fetch(scriptPath).then((response) =>
        response.text()
      )
      const modifiedScript = scriptContent
        .replace(/console\.log\(([^)]+)\);?/g, 'displayOutput($1);')
        .replace(/console\.error\(([^)]+)\);?/g, 'displayError($1);')
      eval(modifiedScript)
    } catch (error) {
      displayError(error)
    }
    createNewCommandInput()
  }
}

JS(args)
