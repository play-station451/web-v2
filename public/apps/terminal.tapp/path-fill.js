const pathTypeCommands = ["cd", "ls", "rm", "mkdir", "touch", "cat", "mv", "cp", "rmdir"];

// window.addEventListener("keydown", async (e) => {
//     if (e.key === "Tab") {
//         e.preventDefault();
//         const command = inputElement.value;
//         const [commandName, ...commandArgs] = command.split(" ");

//         if (pathTypeCommands.includes(commandName)) {
//             let args = [];
//             let currentArg = "";
//             let inString = false;

//             commandArgs.forEach(arg => {
//                 if (arg.startsWith('"')) {
//                     inString = true;
//                     currentArg = arg.substring(1);
//                 } else if (arg.endsWith('"')) {
//                     inString = false;
//                     currentArg += " " + arg.substring(0, arg.length - 1);
//                     args.push(currentArg);
//                     currentArg = "";
//                 } else if (inString) {
//                     currentArg += " " + arg;
//                 } else {
//                     args.push(arg);
//                 }
//             });

//             let readingPath;
//             if(args.length === 0) {
//                 readingPath = args[0];
//             } else {
//                 readingPath = args.slice(0, -1).join(' ');
//             }
//             if (readingPath.startsWith("/")) {
//                 readingPath = "/home" + (readingPath ? "/" + readingPath : "");
//                 const readingPathParts = readingPath.split('/');
//                 const lastUnfilledDir = readingPathParts.pop();
//             } else {
//                 const lastUnfilledDir = readingPath

//                 console.log(lastUnfilledDir);
//             }
//         }
//     }
// });

async function listDir(path) {
	return new Promise(resolve => {
		sh.ls(path, (err, files) => {
			if (err) {
				console.error(`Error listing directory: ${err}`);
				resolve([]);
			} else {
				resolve(files);
			}
		});
	});
}

async function autoComplete(readingPath, unfilledDir) {
	console.log(readingPath);
	return;
	const currentDir = readingPath || "/";
	try {
		const files = await listDir(currentDir);
		files.forEach(file => console.log(file.name));
		const matchingDirs = files.filter(file => file.name.startsWith(unfilledDir));

		if (matchingDirs.length === 1) {
			const completedPath = `${readingPath}/${matchingDirs[0].name}`;
			return completedPath;
		} else {
			return "";
		}
	} catch (error) {
		console.error(`Error during auto-completion: ${error}`);
		return "";
	}
}
