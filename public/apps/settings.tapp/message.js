window.addEventListener("message", function (event) {
	var data;
	if (typeof event.data === "object") {
		try {
			data = event.data;
		} catch (e) {
			console.warn(e);
		}
	} else {
		try {
			data = JSON.parse(event.data);
		} catch {
			console.warn("No Message");
		}
	}
	if (data && document.querySelector(`[data-category="${data.page}"]`)) {
		let button = document.querySelector(`[data-category="${data.page}"]`);
		button.click();
	}
});
