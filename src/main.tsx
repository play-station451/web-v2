import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import Boot from "./Boot.tsx";
import CustomOS from "./CustomOS.tsx";
import { hash } from "./hash.json";
import Loader from "./Loading.tsx";
import Login from "./Login.tsx";
import Recovery from "./Recovery.tsx";
import Setup from "./Setup.tsx";
import { fileExists } from "./sys/types.ts";
import Updater from "./Updater.tsx";

const Root = () => {
	const [currPag, setPag] = useState(<Loader />);
	// @ts-expect-error expected, api is limited to fs untill boot
	if (typeof window.tb === "undefined") window.tb = {};
	if (typeof window.tb.fs === "undefined" && typeof Filer !== "undefined" && Filer.fs) {
		console.log("[FS] File System Ready");
		window.tb.fs = Filer.fs;
		window.tb.sh = new Filer.fs.Shell();
	}
	const params = new URLSearchParams(window.location.search);
	useEffect(() => {
		const tempTransport = async () => {
			const connection = new BareMuxConnection("/baremux/worker.js");
			await connection.setTransport("/epoxy/index.mjs", [{ wisp: "wss://wisp.terbiumon.top/wisp/" }]);
			const { ScramjetController } = $scramjetLoadController();
			window.scramjetTb = {
				prefix: "/service/",
				files: {
					wasm: "/scram/scramjet.wasm.wasm",
					all: "/scram/scramjet.all.js",
					sync: "/scram/scramjet.sync.js",
				},
				defaultFlags: {
					rewriterLogs: false,
				},
				codec: {
					encode: `
						let result = "";
						let len = url.length;
						for (let i = 0; i < len; i++) {
							const char = url[i];
							result += i % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char;
						}
						return encodeURIComponent(result);
					`,
					decode: `
						if (!url) return url;
						url = decodeURIComponent(url);
						let result = "";
						let len = url.length;
						for (let i = 0; i < len; i++) {
							const char = url[i];
							result += i % 2 ? String.fromCharCode(char.charCodeAt(0) ^ 2) : char;
						}
						return result;
					`,
				},
			};
			window.scramjet = new ScramjetController(scramjetTb);
			scramjet.init();
			navigator.serviceWorker.register("/anura-sw.js");
		};
		tempTransport();
		if (sessionStorage.getItem("recovery")) {
			setPag(<Recovery />);
		} else if (sessionStorage.getItem("boot") || params.get("boot")) {
			const upd = async () => {
				let sha;
				if (await fileExists("/system/etc/terbium/hash.cache")) {
					sha = await window.tb.fs.promises.readFile("/system/etc/terbium/hash.cache", "utf8");
				} else {
					sha = hash;
				}
				if (localStorage.getItem("setup")) {
					if (localStorage.getItem("setup") && (sha !== hash || sessionStorage.getItem("skipUpd"))) {
						setPag(<Updater />);
					} else {
						if (sessionStorage.getItem("logged-in") && sessionStorage.getItem("logged-in") === "true") {
							setPag(<App />);
						} else {
							setPag(<Login />);
						}
					}
				} else {
					setPag(<Setup />);
				}
			};
			upd();
		} else if (sessionStorage.getItem("cusboot")) {
			setPag(<CustomOS />);
		} else {
			setPag(<Boot />);
		}
	}, []);
	return currPag;
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Root />
	</StrictMode>,
);
