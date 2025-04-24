# <span style="color: #32ae62;">Creating Terminal Commands</span>

Creating Terminal Commands is fairly easy to setup. To add external scripts to the Terminal first go to the Root Dir (Can be done in Terbium File Manager by Navigating to `//`) and opening the `scripts` folder and putting your file there. If you want to know what a good command looks like heres an example.

```js
function hello(args) {
    displayOutput(`Hi, how are you ${args[0]}`)
    createNewCommandInput()
}

hello() // this here tell the terminal what to execute when you run "hello" in the terminal app
```

If you wish to have argument actions setup (Example: `node <arg1>`) You can do that like this:

```js
function hello(args) {
    if (args.length === 0 || args[0] === 'hello') {
        displayOutput(`Hi, how are you ${args[2]}`);
        createNewCommandInput();
    } else if (args[0] === 'test1') {
        displayOutput('I hate you')
        createNewCommandInput()
    } else {
        displayOutput('Command not found?')
        createNewCommandInput()
    }
}

hello(args)
```

## Components

You are probably wondering: What the hell is `displayOutput` so Heres a list of components in the terminal and what they do:
- displayOutput()  -  Essentially Console.log for the terminal
- displayError()  -  Essentially Console.error for the terminal
- createNewCommandInput()  -  Returns a new Command Line

And just like that your ready to create a new command! Enjoy
