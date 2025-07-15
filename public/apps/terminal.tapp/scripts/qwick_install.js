const Filer = window.parent.Filer;
const tb = window.parent.tb;
function installer(args) {
	displayOutput("Qwick Installer");
	Filer.fs.exists("/system/qwick", async rootExists => {
		let rootCallback = async () => {
			displayOutput("Fetching version data from remote...");
			const versionRaw = await tb.libcurl.fetch("https://raw.githubusercontent.com/TerbiumOS/qwick/refs/heads/main/version");
			const version = await versionRaw.text();
			displayOutput(`Found version: v${version}`);
			displayOutput("Creating Metafile...");
			const metafile = {
				root: "/system/qwick",
				version: version.replace("\n", ""),
				lockfile: "$ROOT/Lockfile",
			};
			await Filer.fs.promises.writeFile("/system/qwick/Metafile", JSON.stringify(metafile, null, 2));
			displayOutput("Finshed creating Metafile");
			displayOutput("Creating master Lockfile...");
			const lockfile = {
				id: "core.qwick",
				dependencies: {},
				env: {},
				runtime: "runtime.bare",
				installed: {},
			};
			await Filer.fs.promises.writeFile("/system/qwick/Lockfile", JSON.stringify(lockfile, null, 2));
			displayOutput("Finished creating master Lockfile");
			displayOutput("Fetching main installer...");
			const installerRaw = await tb.libcurl.fetch(`https://raw.githubusercontent.com/TerbiumOS/qwick/refs/heads/main/installer/installer.js?ts=${Date.now()}`);
			const installerBody = await installerRaw.text();
			displayOutput("Fetched installer, executing...");
			const wrappedInstallerBody = `(async (tb, Filer, displayOutput, displayError) => {
              ${installerBody}
            })`;
			const installerFn = eval(wrappedInstallerBody);
			await installerFn(tb, Filer, displayOutput, displayError);
			createNewCommandInput();
		};
		if (!rootExists) Filer.fs.mkdir("/system/qwick", { recursive: true }, rootCallback);
		else rootCallback();
	});
}
installer(args);
