import * as webdav from "/fs/apps/system/files.tapp/webdav.js";

window.webdav = webdav;

function openFile(data) {
	const textarea = document.querySelector("textarea");
	textarea.value = data;
	updateLineNumbers();
}

async function updateLineNumbers() {
	const textarea = document.querySelector("textarea");
	//const lines = textarea.value.split("\n");
	//const lineNumbers = document.querySelector(".lines");
	const obj = await hljs.highlightAuto(document.querySelector("textarea").value);
	console.log(obj.language);
	/*
    lineNumbers.innerHTML = "";
    lines.forEach((line, i) => {
        console.log(i);
        const span = document.createElement("span");
        const linesStyles = [
            "leading-tight", "font-extrabold", "cursor-pointer"
        ]
        span.innerText = i + 1;
        span.classList.add(...linesStyles);
        lineNumbers.appendChild(span);
    })
    document.body.style.setProperty("--lines", lines.length);
    document.body.style.setProperty("--lines-width", lineNumbers.offsetWidth + "px");
    */
}

window.addEventListener("contextmenu", e => {
	e.preventDefault();
	return false;
});

// window.addEventListener("load", () => {
//     updateLineNumbers();
// })

window.addEventListener("message", async function load(e) {
	let data;
	try {
		data = JSON.parse(e.data);
	} catch (err) {
		data = e.data;
	}
	if (data && data.type === "process" && data.path) {
		if (!data.path.includes("http")) {
			let file = await window.parent.tb.fs.promises.readFile(data.path, "utf8");
			if (typeof file === "object") file = JSON.stringify(file);
			document.body.setAttribute("path", data.path);
			openFile(file);
			// updateLineNumbers();
		} else {
			try {
				const davInstances = JSON.parse(await window.parent.tb.fs.promises.readFile(`/apps/user/${sessionStorage.getItem("currAcc")}/files/davs.json`, "utf8"));
				const davUrl = data.path.split("/dav/")[0] + "/dav/";
				const dav = davInstances.find(d => d.url.toLowerCase().includes(davUrl));
				if (!dav) throw new Error("No matching dav instance found");
				const client = window.webdav.createClient(dav.url, {
					username: dav.username,
					password: dav.password,
					authType: window.webdav.AuthType.Password,
				});
				let filePath;
				if (data.path.startsWith("http")) {
					const match = data.path.match(/^https?:\/\/[^\/]+\/dav\/([^\/]+\/)?(.+)$/);
					filePath = match ? "/" + match[2] : data.path;
				} else {
					filePath = data.path.replace(davUrl, "/");
				}
				const response = await client.getFileContents(filePath);
				document.body.setAttribute("path", data.path);
				document.body.setAttribute("isDav", "true");
				const decoder = new TextDecoder("utf-8");
				const text = decoder.decode(response);
				openFile(text);
			} catch (err) {
				window.tb.dialog.Alert({
					title: "Failed to read dav file",
					message: err,
				});
			}
		}
	}
	window.removeEventListener("message", load);
});

function updateScroll(type, e) {
	const textarea = document.querySelector("textarea");
	if (type === "key") {
		const scrollAmount = e === "ArrowUp" ? -20 : 20;
		textarea.scrollTop += scrollAmount;
	} else if (type === "mouse") {
		const scrollAmount = e.deltaY;
		textarea.scrollTop += scrollAmount;
	}
}

const textarea = document.querySelector("textarea");
// hljs.highlightElement(textarea);
textarea.addEventListener("keydown", async e => {
	if ((e.ctrlKey || e.metaKey) && e.key === "s") {
		e.preventDefault();
		const textarea = document.querySelector("textarea");
		let ext;
		const highlightResult = await hljs.highlightAuto(textarea.value);
		if (highlightResult.language) {
			ext = highlightResult.language;
		} else if (highlightResult._top?.aliases) {
			ext = highlightResult._top.aliases[0];
		} else {
			ext = ".txt";
		}
		const path = document.body.getAttribute("path");
		if (path && path !== "undefined") {
			if (document.body.getAttribute("isDav") === "true") {
				try {
					const davInstances = JSON.parse(await window.parent.tb.fs.promises.readFile(`/apps/user/${sessionStorage.getItem("currAcc")}/files/davs.json`, "utf8"));
					const davUrl = path.split("/dav/")[0] + "/dav/";
					const dav = davInstances.find(d => d.url.toLowerCase().includes(davUrl));
					if (!dav) throw new Error("No matching dav instance found");
					const client = window.webdav.createClient(dav.url, {
						username: dav.username,
						password: dav.password,
						authType: window.webdav.AuthType.Password,
					});
					let filePath;
					if (path.startsWith("http")) {
						const match = path.match(/^https?:\/\/[^\/]+\/dav\/([^\/]+\/)?(.+)$/);
						filePath = match ? "/" + match[2] : path;
					} else {
						filePath = path.replace(davUrl, "/");
					}
					console.log(filePath);
					client.putFileContents(filePath, textarea.value);
				} catch (err) {
					window.tb.dialog.Alert({
						title: "Failed to save dav file",
						message: err.message,
					});
				}
			} else {
				window.parent.tb.fs.promises.writeFile(path, textarea.value);
			}
		} else {
			await tb.dialog.SaveFile({
				title: "Save Text File",
				filename: `untitled.${ext}`,
				onOk: async txt => {
					window.parent.tb.fs.writeFile(`${txt}`, textarea.value, err => {
						if (err) return alert(err);
					});
				},
			});
		}
	}
	// else if(e.key === "ArrowUp" || e.key === "ArrowDown") {
	//     updateScroll("key", e.key);
	// }
});

// textarea.addEventListener("input", () => {
//     updateLineNumbers();
//     updateScroll("key", "ArrowUp");
// });

// window.addEventListener("wheel", (e) => {
//     updateScroll("mouse", e);
// });
