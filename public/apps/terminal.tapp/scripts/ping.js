async function ping(args) {
	const numPings = 5;
	let url = args._raw;
	let totalResponseTime = 0;
	let packetsReceived = 0;

	if (!url) displayError("No Url was Provided");
	if (!url.includes("http://") && !url.includes("https://")) {
		url = "http://" + url;
	}

	for (let i = 0; i < numPings; i++) {
		const startTime = Date.now();
		console.log(url);
		try {
			const response = await window.parent.tb.libcurl.fetch(url);
			console.log(response);
			if (response.ok) {
				packetsReceived++;
			}
		} catch (error) {
			displayOutput(`Error Reaching Site: Site turned ${error.response?.status} Error when pinged`);
		}

		const endTime = Date.now();
		const responseTime = endTime - startTime;
		totalResponseTime += responseTime;
		displayOutput(`Ping ${url} - Time: ${responseTime}ms`);
	}

	const avgResponseTime = totalResponseTime / numPings;
	const percentReceived = (packetsReceived / numPings) * 100;
	const percentLost = 100 - percentReceived;
	displayOutput(`Pinged ${url} ${numPings} times: ${avgResponseTime.toFixed(2)}ms average, ${percentLost.toFixed(2)}% packet loss, ${percentReceived.toFixed(2)}% packets received`);
	createNewCommandInput();
}

ping(args);
