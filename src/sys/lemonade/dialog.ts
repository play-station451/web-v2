interface diagArgs {
	title?: string;
	defaultPath?: string;
	properties?: ("openFile" | "openDirectory")[];
}

export class Dialog {
	showOpenDialogSync(win: any, options: diagArgs) {
		console.log(`property: ${win} wont be used sorry`);
		return new Promise((resolve, reject) => {
			window.tb.dialog.FileBrowser({
				title: options.title || "Open File",
				defualtDir: options.defaultPath || "/",
				onOk: (path: string) => {
					resolve(path);
					console.log(path);
				},
				onCancel: () => reject("canceled"),
			});
		});
	}
	showOpenDialog(win: any, options: diagArgs) {
		return this.showOpenDialogSync(win, options);
	}
	showSaveDialogSync(win: any, options: diagArgs) {
		console.log(`property: ${win} wont be used sorry`);
		return new Promise((resolve, reject) => {
			window.tb.dialog.SaveFile({
				title: options.title || "Save File",
				defualtDir: options.defaultPath || "/",
				onOk: (path: string) => {
					resolve(path);
					console.log(path);
				},
				onCancel: () => reject("canceled"),
			});
		});
	}
	showSaveDialog(win: any, options: diagArgs) {
		return this.showSaveDialogSync(win, options);
	}
	showMessageBoxSync(win: any, options: { message: string; title: string }) {
		console.log(`property: ${win} wont be used sorry`);
		return new Promise(resolve => {
			window.tb.dialog.Message({
				title: options.title,
				defaultValue: options.message,
				onOk: (val: string) => {
					resolve(val);
				},
			});
		});
	}
	showMessageBox(win: any, options: { message: string; title: string }) {
		return this.showMessageBoxSync(win, options);
	}
	showErrorBox(title: string, content: string) {
		window.tb.dialog.Alert({
			title: title,
			message: content,
			onOk: () => {},
		});
	}
}
