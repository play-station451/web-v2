const Filer = window.Filer;
const fs = new Filer.FileSystem();
const sh = new fs.Shell();
const outputElement = document.getElementById("output");
let inputElement
let terminal = document.querySelector("#terminal")
const userPromptElement = document.getElementById("user-prompt");
const recentcmds = JSON.parse(sessionStorage.getItem('terminalRecents')) || [];
let currentIndex = recentcmds.length - 1;

if (!Array.isArray(recentcmds)) {
  console.warn('Invalid data');
  recentcmds = [];
}

function executeCommand(command) {
  const [commandName, ...commandArgs] = command.split(" ");
  let inString = false;
  let args = [];
  let currentArg = "";
  commandArgs.forEach(arg => {
    if(arg.startsWith('"')) {
      inString = true;
      currentArg = arg.substring(1);
    } else if(arg.endsWith('"')) {
      inString = false;
      currentArg += " " + arg.substring(0, arg.length - 1);
      args.push(currentArg);
      currentArg = "";
    } else if(inString) {
      currentArg += " " + arg;
    } else {
      args.push(arg);
    }
  })

  const scriptPaths = [
    `http://localhost:3001/apps/terminal.tapp/scripts/${commandName.toLowerCase()}.js`,
    //`./scripts/${commandName.toLowerCase()}.js`,
    //`/fs/scripts/${commandName.toLowerCase()}.js`
  ];
  fetchScript(scriptPaths).then(scriptContent => {
    if (scriptContent) {
      try {
        new Function("args", scriptContent)(args);
        if (args) {
          recentcmds.push(`${commandName} ${args}`)
        } else {
          recentcmds.push(`${commandName}`)
        }
        sessionStorage.setItem('terminalRecents', JSON.stringify(recentcmds))
      } catch (error) {
        displayError(`${commandName.toLowerCase()}: ${error.message}`);
        inputElement.setAttribute("disabled", true);
        createNewCommandInput();
      }
    } else {
      displayError(`Command not found: ${command}`);
      inputElement.setAttribute("disabled", true);
      createNewCommandInput();
    }
  });
}

function fetchScript(scriptPaths) {
  return Promise.all(
    scriptPaths.map(scriptPath =>
      fetch(scriptPath).then(response =>
        response.ok ? response.text() : null
      ).catch(error => {
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          return null;
        } else {
          throw error;
        }
      })
    )
  ).then(scriptContents => scriptContents.find(content => content !== null));
}

function displayError(message) {
  const errorText = document.createElement("div");
  errorText.textContent = message;
  errorText.className = "error-text";
  outputElement.appendChild(errorText);
}

function displayOutput(message, ...styles) {
  const output = document.createElement('div');
  let messageParts = message.split("%c");
  if (message.startsWith('(%^')) {
    const match = message.match(/\(%\^(\d+)\)/);
    if (match) {
      const spacerAmount = parseInt(match[1]);
      const spacer = '&nbsp;'.repeat(spacerAmount);
      output.innerHTML += `<span style="white-space: pre;">${spacer}</span>`;
    }
  }

  if (message.includes("%c")) {
    for (let i = 1; i < messageParts.length; i++) {
      const part = messageParts[i];
      if (part !== '') {
        const style = i - 1 < styles.length ? styles[i - 1] : '';
        const formattedMessage = `<span style="${style}">${part}</span>`;
        output.innerHTML += formattedMessage;
      }
    }
  } else {
    output.textContent = message;
  }

  outputElement.appendChild(output);
}

const createNewCommandInput = async () => {
  if(inputElement !== undefined) inputElement.setAttribute("disabled", true);
  const newCommandInputContainer = document.createElement("div");
  newCommandInputContainer.className = "user-input";
  const newCommandInput = document.createElement("input");
  newCommandInput.id = "input";
  newCommandInput.type = "text";
  document.querySelectorAll(".user-input").forEach((input) => {
    input.classList.remove("current")
  })
  newCommandInput.setAttribute("autocomplete", "off");
  newCommandInput.setAttribute("autocorrect", "off");
  newCommandInput.setAttribute("autocapitalize", "off");
  newCommandInput.setAttribute("spellcheck", "false");
  newCommandInput.style.pointerEvents = "none";
  newCommandInput.style.marginLeft = "4px";
  newCommandInputContainer.classList.add("current");
  const userPrompt = document.createElement("div");
  let userhost;
  let accent = "#32ae62"
  let settings = JSON.parse(await Filer.fs.promises.readFile(`/home/${sessionStorage.getItem('currAcc')}/settings.json`, "utf8"))
  if(settings["accent"]) {
    accent = settings["accent"]
  }
  userhost = `<span style="color: ${accent}">${await tb.user.username()}@${JSON.parse(await Filer.fs.promises.readFile("//system/etc/terbium/settings.json"))["host-name"]}</span>`
  userPrompt.innerHTML = `${userhost}:${terminal.getAttribute("path") ? `<span style="color: #4070f2;">${terminal.getAttribute("path")}</span>` : `<span style="color: #4070f2;"`}$`;
  userPrompt.style.width = "max-content";
  newCommandInputContainer.appendChild(userPrompt);
  newCommandInputContainer.appendChild(newCommandInput);
  outputElement.appendChild(newCommandInputContainer);
  let userPromptWidth = parseInt(userPrompt.offsetWidth) + 14;
  userPrompt.style.width = userPromptWidth + "px";
  newCommandInput.style.width = "calc(100% - " + userPromptWidth + "px)";
  userPrompt.style.color = "#ffffff";
  userPrompt.style.width = "max-content";
  inputElement = newCommandInput;
  inputElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = inputElement.value;
      executeCommand(command);
    } if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      const outputChildren = Array.from(outputElement.children);
      outputChildren.forEach(child => {
        if (!child.classList.contains("current") && !child.classList.contains("initial-message")) {
          outputElement.removeChild(child);
        }
      });
    }
  });
  inputElement.focus();
}

window.addEventListener("load", () => {
  const initialMessage = document.createElement("div");
  initialMessage.classList.add("initial-message");
  initialMessage.textContent = `TerbiumOS [Version ${parent.window.tb.system.version()}]`;
  initialMessage.style.color = "#ffffff";
  initialMessage.style.fontSize = "14px";
  initialMessage.style.fontFamily = "Inter"
  initialMessage.style.fontWeight = "700";
  outputElement.appendChild(initialMessage);
  createNewCommandInput();
  terminal.setAttribute("path", "~")
})

window.addEventListener("message", (e) => {
  let data;
  try {
    data = JSON.parse(e.data);
  } catch (error) {
    data = e.data;
  }

  if(data === "focus") {
    inputElement.focus();
  }
  if(data === "clear") {
    createNewCommandInput();
    const outputChildren = Array.from(outputElement.children);
    outputChildren.forEach(child => {
      if (!child.classList.contains("current") && !child.classList.contains("initial-message")) {
        outputElement.removeChild(child);
      }
    });
  }
})

class clipboard {
  constructor() {
    this.text = "";
    this.#clearSelection();
  }
  #clearSelection() {
    let selection = window.getSelection();
    if(selection.toString() !== "") {
      selection.removeAllRanges();
    }
  }
  copy(text) {
    this.text = text;
    if(navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.text);
    } else {
      document.execCommand("copy");
    }
  }
  paste() {
    if(navigator.clipboard.readText) {
      navigator.clipboard.readText().then(text => {
        inputElement.value += text;
      })
    }
  }
  cut(text) {
    this.copy(text);
    if(inputElement.value.includes(text)) {
      inputElement.value = inputElement.value.replace(text, "");
    }
  }
}

window.addEventListener("keydown", async (e) => {
  if (e.key === "ArrowUp") {
    if (currentIndex > 0) {
      currentIndex--;
      inputElement.value = recentcmds[currentIndex] || '';
    }
  } else if (e.key === "ArrowDown") {
    if (currentIndex < recentcmds.length) {
      currentIndex++;
      inputElement.value = recentcmds[currentIndex] || '';
    } else {
      inputElement.value = '';
    }
  } else if (e.key === "Tab") {
    e.preventDefault();
    let command = inputElement.value;
    if(command.includes("help")) {
      let [_, commandName] = command.split("help ");
      if(commandName === "") {
        fetch(`/fs/apps/user/${await tb.user.username()}/terminal/info.json`)
        .then(response => response.json())
        .then(scriptList => {
          scriptList.forEach(script => {
            if(script.name.startsWith(commandName)) {
              inputElement.value = `help ${script.name}`;
            }
          })
        });
      } else {
        fetch(`/fs/apps/user/${await tb.user.username()}/terminal/info.json`)
        .then(response => response.json())
        .then(scriptList => {
          scriptList.forEach(script => {
            if(script.name.startsWith(commandName)) {
              inputElement.value = `help ${script.name}`;
            }
          })
        });
      }
    } else if(!command.includes(" ")) {
      fetch(`/fs/apps/user/${await tb.user.username()}/terminal/info.json`)
        .then(response => response.json())
        .then(scriptList => {
          const [commandName, ...commandArgs] = inputElement.value.split(" ");
          if(commandArgs.length === 0) {
            const possibleCommands = [];
            scriptList.forEach(script => {
              if(script.name.startsWith(commandName)) {
                possibleCommands.push(script.name);
              }
            })
            if(possibleCommands.length === 1) {
              inputElement.value = possibleCommands[0];
            }
          }
        });
    }
  }
})

window.addEventListener("click", (e) => {
  if(e.button === 0) {
    if(window.getSelection().toString() === "") {
      inputElement.focus();
    }
  }
})
