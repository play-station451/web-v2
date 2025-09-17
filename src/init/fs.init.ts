import paths from "../installer.json";

export async function copyfs() {
	paths.forEach(async item => {
		if (item.toString().includes("browser.tapp")) return;
		if (item.toString().endsWith("/")) {
			await window.tb.fs.promises.mkdir(`/apps/system/${item.toString()}`);
		} else {
			await fetch(`/apps/${item.toString()}`).then(async res => {
				const data = await res.text();
				await window.tb.fs.promises.writeFile(`/apps/system/${item.toString()}`, data);
			});
		}
	});
	return "Success";
}
