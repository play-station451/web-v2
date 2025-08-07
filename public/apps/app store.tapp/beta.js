let currRepo;
/**
 * Loads the repos content
 * @param {string} url
 */
async function loadRepo(url) {
	const repo = await window.parent.tb.libcurl.fetch(url);
	let data = await repo.json();
	let type = "Terbium";
	if (data.maintainer) {
		type = "Anura";
		const list = await window.parent.tb.libcurl.fetch(url.replace("manifest.json", "list.json"));
		currRepo = {
			name: data.name,
			url: url,
		};
		data = await list.json();
	} else if (data.title) {
		type = "Xen";
	} else {
		currRepo = data.repo.name;
	}
	document.querySelector(".app-prev").classList.remove("flex");
	document.querySelector(".app-prev").classList.add("hidden");
	document.querySelector(".main").classList.remove("hidden");
	document.querySelector(".main").classList.add("flex");
	const featured = document.querySelector(".featured");
	switch (type) {
		case "Terbium":
			const featuredList1 = data.apps;
			const randomIndex1 = Math.floor(Math.random() * featuredList1.length);
			data.featured = featuredList1[randomIndex1] || {};
			const icn1 = await window.parent.tb.libcurl.fetch(data.featured.icon);
			const blob1 = await icn1.blob();
			const icnurl1 = URL.createObjectURL(blob1);
			featured.classList.forEach(cls => {
				if (cls.startsWith("bg-[url")) {
					featured.classList.remove(cls);
				}
			});
			featured.classList.add(`bg-[url('${icnurl1 || "/tb.svg"}')]`);
			featured.onclick = () => {
				loadApp(data.featured, type);
			};
			featured.querySelector("h3").textContent = data.featured.name;
			if (data.featured.version) {
				featured.querySelector("h4:nth-child(2)").textContent = `Version ${data.featured.version}`;
			} else {
				featured.querySelector("h4:nth-child(2)").textContent = `Progressive Web App`;
			}
			featured.querySelector("h4:nth-child(3)").textContent = `By ${data.featured.developer || "Unknown"}`;
			const appCards1 = await Promise.all(
				data.apps.map(async app => {
					const icn1 = await window.parent.tb.libcurl.fetch(app.icon);
					const blob1 = await icn1.blob();
					const icnurl1 = URL.createObjectURL(blob1);
					const displayName = app.name && app.name.length > 10 ? app.name.slice(0, 10) + "..." : app.name || "Unknown";
					const cardHtml = `
					<div class="app-card w-[100%] h-[105px] bg-[#00000032] rounded-[12px] flex flex-col items-center justify-center" data-app-index="${data.apps.indexOf(app)}">
						<img src="${icnurl1 || "/tb.svg"}" alt="App Icon" class="w-[50px] h-[50px] rounded-[12px] mb-4 object-cover" />
						<span class="text-white text-lg font-bold">${displayName}</span>
					</div>
				`;
					return { html: cardHtml, hasWmArgs: !!app.wmArgs };
				}),
			);
			const pwaCards = appCards1.filter(card => card.hasWmArgs).map(card => card.html);
			const appCards = appCards1.filter(card => !card.hasWmArgs).map(card => card.html);
			document.querySelector(".pwa-list").innerHTML = pwaCards.join("");
			document.querySelector(".apps-list").innerHTML = appCards.join("");
			document.querySelectorAll(".app-card").forEach(card => {
				card.addEventListener("click", function () {
					const idx = parseInt(this.getAttribute("data-app-index"), 10);
					loadApp(data.apps[idx], type);
				});
			});
			break;
		case "Anura":
			const featuredList2 = data.apps;
			const randomIndex2 = Math.floor(Math.random() * featuredList2.length);
			data.featured = featuredList2[randomIndex2] || {};
			const icn2 = await window.parent.tb.libcurl.fetch(`${url.replace("manifest.json", "")}/apps/${data.featured.package}/${data.featured.icon}`);
			const blob2 = await icn2.blob();
			const icnurl2 = URL.createObjectURL(blob2);
			featured.classList.forEach(cls => {
				if (cls.startsWith("bg-[url")) {
					featured.classList.remove(cls);
				}
			});
			featured.classList.add(`bg-[url('${icnurl2 || "/tb.svg"}')]`);
			featured.onclick = () => {
				loadApp(data.featured, type);
			};
			featured.querySelector("h3").textContent = data.featured.name;
			if (data.featured.version) {
				featured.querySelector("h4:nth-child(2)").textContent = `Version ${data.featured.version}`;
			} else {
				featured.querySelector("h4:nth-child(2)").textContent = `Progressive Web App`;
			}
			featured.querySelector("h4:nth-child(3)").textContent = `Anura Application`;
			const appCards2 = await Promise.all(
				data.apps.map(async app => {
					const icn1 = await window.parent.tb.libcurl.fetch(`${url.replace("manifest.json", "")}/apps/${app.package}/${app.icon}`);
					const blob1 = await icn1.blob();
					const icnurl1 = URL.createObjectURL(blob1);
					const displayName = app.name && app.name.length > 10 ? app.name.slice(0, 10) + "..." : app.name || "Unknown";
					const cardHtml = `
					<div class="app-card w-[100%] h-[105px] bg-[#00000032] rounded-[12px] flex flex-col items-center justify-center" data-app-index="${data.apps.indexOf(app)}">
						<img src="${icnurl1 || "/tb.svg"}" alt="App Icon" class="w-[50px] h-[50px] rounded-[12px] mb-4 object-cover" />
						<span class="text-white text-lg font-bold">${displayName}</span>
					</div>
				`;
					return { html: cardHtml, hasWmArgs: !!app.wmArgs };
				}),
			);
			const pwaCards2 = appCards2.filter(card => card.hasWmArgs).map(card => card.html);
			const appCards_2 = appCards2.filter(card => !card.hasWmArgs).map(card => card.html);
			document.querySelector(".pwa-list").innerHTML = pwaCards2.join("");
			document.querySelector(".apps-list").innerHTML = appCards_2.join("");
			document.querySelectorAll(".app-card").forEach(card => {
				card.addEventListener("click", function () {
					const idx = parseInt(this.getAttribute("data-app-index"), 10);
					loadApp(data.apps[idx], type);
				});
			});
			break;
		case "Xen":
			console.log("Xen repo not implemented yet.");
			document.querySelector(".featured h3").textContent = "Xen App Store";
			break;
	}
}

/**
 * Loads the app content in the preview
 * @param {Object} app - The app to load
 * @param {string} type - The type of app (Terbium, Anura, Xen)
 */
async function loadApp(app, type) {
	document.querySelector(".app-prev").classList.remove("hidden");
	document.querySelector(".app-prev").classList.add("flex");
	document.querySelector(".main").classList.remove("flex");
	document.querySelector(".main").classList.add("hidden");
	switch (type) {
		case "Terbium":
			const icn1 = await window.parent.tb.libcurl.fetch(app.icon);
			const blob1 = await icn1.blob();
			const icnurl1 = URL.createObjectURL(blob1);
			document.querySelector(".app-prev").innerHTML = `
				<h1 class="font-black text-3xl" onclick="document.querySelector('.app-prev').classList.remove('flex'); document.querySelector('.app-prev').classList.add('hidden'); document.querySelector('.main').classList.remove('hidden'); document.querySelector('.main').classList.add('flex');">${currRepo} → ${app.name}</h1>
				<div class="featured flex w-[97%] h-[175px] bg-[#00000032] rounded-[22px] p-2 items-center gap-6 relative bg-no-repeat bg-[url('${icnurl1 || "/tb.svg"}')] bg-center bg-cover">
					<div class="info flex flex-col justify-end text-white absolute left-6 bottom-6">
						<h3 class="text-2xl font-bold mb-2">${app.name}</h3>
						<h4 class="text-[16px] text-[#ffffff75]">By ${app.developer || "Unknown"}</h4>
					</div>
					<div class="info flex flex-col justify-end text-white absolute right-6 bottom-6">
						<button class="bg-[#5DD881] text-black rounded-lg p-1.5">Install</button>
					</div>
				</div>
				<div class="flex w-[97%] h-[45%] mt-6 gap-6">
					<div class="w-1/2 bg-[#00000032] rounded-[12px] h-full p-4 overflow-auto">
						<h2 class="font-black text-3xl mb-2">About ${app.name}</h2>
						<p class="text-white text-base">${app.description || "No description available."}</p>
						<ul class="text-white text-base">
							<li><strong>Version:</strong> ${app.version || "1.0.0"}</li>
							<li><strong>Developer:</strong> ${app.developer || "Unknown"}</li>
							<li><strong>License:</strong> ${app.license || "N/A"}</li>
							<li><strong>Scanned:</strong> ${app.scanned || "N/A"}</li>
							<li><strong>Size:</strong> ${app.size || "N/A"}</li>
							<ul>
								<h2 class="font-black text-3xl mb-2">Requirements:</h2>
								<li><strong>OS: ${(app.requirements && app.requirements.os) || "Any"}</strong></li>
								<li><strong>Proxy: ${(app.requirements && app.requirements.proxy) || "Any"}</strong></li>
							</ul>
						</ul>
					</div>
					<div class="w-1/2 bg-[#00000032] rounded-[12px] h-full p-4 overflow-auto">
						<h2 class="font-black text-3xl mb-2">Images</h2>
						<div class="flex flex-wrap gap-4">
							${
								app.images
									? app.images
											.map(
												img => `
								<div class="w-full">
									<img src="${img}" alt="App Image" class="w-full h-[200px] rounded-[12px] object-cover" />
								</div>
							`,
											)
											.join("")
									: "<p class='text-white'>No images available.</p>"
							}
						</div>
					</div>
				</div>
			`;
			break;
		case "Anura":
			const icn2 = await window.parent.tb.libcurl.fetch(`${currRepo.url.replace("manifest.json", "")}/apps/${app.package}/${app.icon}`);
			const blob2 = await icn2.blob();
			const icnurl2 = URL.createObjectURL(blob2);
			document.querySelector(".app-prev").innerHTML = `
				<h1 class="font-black text-3xl" onclick="document.querySelector('.app-prev').classList.remove('flex'); document.querySelector('.app-prev').classList.add('hidden'); document.querySelector('.main').classList.remove('hidden'); document.querySelector('.main').classList.add('flex');">${currRepo.name} → ${app.name}</h1>
				<div class="featured flex w-[97%] h-[175px] bg-[#00000032] rounded-[22px] p-2 items-center gap-6 relative bg-no-repeat bg-[url('${icnurl2 || "/tb.svg"}')] bg-center bg-cover">
					<div class="info flex flex-col justify-end text-white absolute left-6 bottom-6">
						<h3 class="text-2xl font-bold mb-2">${app.name}</h3>
						<h4 class="text-[16px] text-[#ffffff75]">By ${app.developer || "Unknown"}</h4>
					</div>
					<div class="info flex flex-col justify-end text-white absolute right-6 bottom-6">
						<button class="bg-[#5DD881] text-black rounded-lg p-1.5">Install</button>
					</div>
				</div>
				<div class="flex w-[97%] h-[45%] mt-6 gap-6">
					<div class="w-1/2 bg-[#00000032] rounded-[12px] h-full p-4 overflow-auto">
						<h2 class="font-black text-3xl mb-2">About ${app.name}</h2>
						<p class="text-white text-base">${app.description || "No description available."}</p>
						<ul class="text-white text-base">
							<li><strong>Version:</strong> ${app.version || "1.0.0"}</li>
							<li><strong>Developer:</strong> ${app.developer || "Unknown"}</li>
							<li><strong>License:</strong> ${app.license || "N/A"}</li>
							<li><strong>Scanned:</strong> ${app.scanned || "N/A"}</li>
							<li><strong>Size:</strong> ${app.size || "N/A"}</li>
							<ul>
								<h2 class="font-black text-3xl mb-2">Requirements:</h2>
								<li><strong>OS: ${(app.requirements && app.requirements.os) || "Any"}</strong></li>
								<li><strong>Proxy: ${(app.requirements && app.requirements.proxy) || "Any"}</strong></li>
							</ul>
						</ul>
					</div>
					<div class="w-1/2 bg-[#00000032] rounded-[12px] h-full p-4 overflow-auto">
						<h2 class="font-black text-3xl mb-2">Images</h2>
						<div class="flex flex-wrap gap-4">
							${
								app.images
									? app.images
											.map(
												img => `
								<div class="w-full">
									<img src="${img}" alt="App Image" class="w-full h-[200px] rounded-[12px] object-cover" />
								</div>
							`,
											)
											.join("")
									: "<p class='text-white'>No images available.</p>"
							}
						</div>
					</div>
				</div>
			`;
			break;
		case "Xen":
			break;
	}
}

/**
 * Loads the current list of repos
 */
async function loadRepos() {
	const repoList = document.querySelector(".repo-list");
	repoList.innerHTML = "";
	const repos = JSON.parse(await window.parent.tb.fs.promises.readFile(`/apps/user/${sessionStorage.getItem("currAcc")}/app store/repos.json`, "utf8"));
	for (const repo of repos) {
		const repoinfo = await window.parent.tb.libcurl.fetch(repo.url);
		if (!repoinfo.ok) {
			const displayName = repo.name && repo.name.length > 8 ? repo.name.slice(0, 8) + "..." : repo.name || "Unknown";
			repoList.innerHTML += `
				<div class="repo-card flex flex-row items-center bg-[#00000032] rounded-lg h-[50px] p-1 gap-1" onclick="loadRepo('${repo.url}')">
					<img src="/tb.svg" alt="Featured App" class="w-[32px] h-[32px] rounded-[12px] object-cover" />
					<h3 class="text-white text-base font-black">${displayName}</h3>
					<svg class="flex-1" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="16" cy="16" r="16" fill="#D8645D"/>
					</svg>
				</div>
			`;
			continue;
		}
		const data = await repoinfo.json();
		if (data.maintainer) {
			const displayName = data.name && data.name.length > 8 ? data.name.slice(0, 8) + "..." : data.name || "Unknown";
			repoList.innerHTML += `
				<div class="repo-card flex flex-row items-center bg-[#00000032] rounded-lg h-[50px] p-1 gap-1" onclick="loadRepo('${repo.url}')">
	                <img src="/tb.svg" alt="Featured App" class="w-[32px] h-[32px] rounded-[12px] object-cover" />
    	            <h3 class="text-white text-base font-black">${displayName}</h3>
        	        <svg class="flex-1" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            	        <circle cx="16" cy="16" r="16" fill="#5DD881"/>
                	</svg>
            	</div>
			`;
		} else if (data.title) {
			throw new Error("Xen repo not implemented yet.");
		} else {
			const icn = await window.parent.tb.libcurl.fetch(data.repo.icon);
			const blob = await icn.blob();
			const icnurl = URL.createObjectURL(blob);
			const displayName = data.repo.name && data.repo.name.length > 8 ? data.repo.name.slice(0, 8) + "..." : data.repo.name || "Unknown";
			repoList.innerHTML += `
			<div class="repo-card flex flex-row items-center bg-[#00000032] rounded-lg h-[50px] p-1 gap-1" onclick="loadRepo('${repo.url}')">
                <img src="${icnurl}" alt="Featured App" class="w-[32px] h-[32px] rounded-[12px] object-cover" />
                <h3 class="text-white text-base font-black">${displayName}</h3>
                <svg class="flex-1" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#5DD881"/>
                </svg>
            </div>
		`;
		}
	}
}

/**
 * Changes the view between apps and PWAs
 * @param {string} type - The type of view ("apps" or "pwa")
 */
function view(type) {
	if (type === "apps") {
		document.querySelector(".apps-list").classList.remove("hidden");
		document.querySelector(".pwa-list").classList.add("hidden");
		document.querySelector(".apps-list").classList.remove("flex");
		document.querySelector(".apps-list").classList.add("grid");
		document.querySelector(".pwa-list").classList.remove("grid");
		document.querySelector(".pwa-list").classList.add("hidden");
		document.querySelector(".app-togg").classList.add("bg-[#5DD88122]");
		document.querySelector(".app-togg").classList.remove("bg-[#00000022]");
		document.querySelector(".pwa-togg").classList.remove("bg-[#5DD88122]");
		document.querySelector(".pwa-togg").classList.add("bg-[#00000022]");
	} else if (type === "pwa") {
		document.querySelector(".pwa-list").classList.remove("hidden");
		document.querySelector(".apps-list").classList.add("hidden");
		document.querySelector(".pwa-list").classList.remove("flex");
		document.querySelector(".pwa-list").classList.add("grid");
		document.querySelector(".apps-list").classList.remove("grid");
		document.querySelector(".apps-list").classList.add("hidden");
		document.querySelector(".app-togg").classList.remove("bg-[#5DD88122]");
		document.querySelector(".app-togg").classList.add("bg-[#00000022]");
		document.querySelector(".pwa-togg").classList.add("bg-[#5DD88122]");
		document.querySelector(".pwa-togg").classList.remove("bg-[#00000022]");
	}
}

/**
 * Adds a new repo to the repo list
 */
function addRepo() {
	const repoList = document.querySelector(".repo-list");
	const newRepoCard = document.createElement("div");
	newRepoCard.className = "repo-card flex flex-row items-center bg-[#00000032] rounded-lg h-[50px] p-1 gap-1";
	newRepoCard.innerHTML = `
			<img src="/tb.svg" alt="New Repo" class="w-[32px] h-[32px] rounded-[12px] object-cover" />
			<h3 class="text-white text-base font-black">https://raw.githubusercontent.com/MercuryWorkshop/anura-repo/refs/heads/master/manifest.json</h3>
			<svg class="flex-1" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="16" cy="16" r="16" fill="#5DD881"/>
			</svg>
		`;
	repoList.appendChild(newRepoCard);
}

/**
 * Installs the requested app
 * @param {Object} app - The app to install
 * @param {string} type - The type of app (Terbium, tb-PWA, Anura, Xen)
 */
async function install(app, type) {
	switch (type) {
		case "Terbium":
			break;
		case "tb-PWA":
			break;
		case "Anura":
			break;
		case "Xen":
			throw new Error("Xen repo not implemented yet.");
	}
}

window.addEventListener("load", async () => {
	await loadRepo("https://raw.githubusercontent.com/TerbiumOS/tb-repo/refs/heads/main/manifest.json");
	loadRepos();
});
