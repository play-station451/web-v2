const Filer = window.parent.Filer;
const tb = window.parent.tb;
function installer(args) {
	displayOutput("Qwick Installer");
	Filer.fs.exists("/system/qwick", async rootExists => {
		let rootCallback = async () => {
			displayOutput("Fetching version data from remote...");
			const versionRaw = await tb.libcurl.fetch("https://terbiumos.github.io/qwick/version");
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
			displayOutput("Creating repo list file...");
			const repofile = ["https://terbiumos.github.io/qwick-main-repo/"];
			await Filer.fs.promises.writeFile("/system/qwick/repo-list.json", JSON.stringify(repofile, null, 2));
			displayOutput("Finished creating repo list file");
			Filer.fs.exists("/system/qwick/cache", async cacheExists => {
				let cacheCallback = async () => {
					await Filer.fs.promises.writeFile("/system/qwick/cache/cache.lock", "{}");
				};
				if (!rootExists) Filer.fs.mkdir("/system/qwick/cache", { recursive: true }, cacheCallback);
				else rootCallback();
			});
			Filer.fs.exists("/system/qwick/coredeps", async cacheExists => {
				if (!rootExists) Filer.fs.mkdir("/system/qwick/coredeps", { recursive: true }, cacheCallback);
				else rootCallback();
			});
			displayOutput("Fetching main installer...");
			const installerRaw = await tb.libcurl.fetch(`https://terbiumos.github.io/qwick/installer/installer.js?ts=${Date.now()}`);
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
