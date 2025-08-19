import { useEffect, useState } from "react";

export default function CustomOS() {
	const [loaded, setloaded] = useState(false);

	useEffect(() => {
		const rep = (content: string) => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(content, "text/html");
			console.log(`Terbium Bootloader v2.1.0 is now loading: ${sessionStorage.getItem("bootfile")}`);
			if (doc.body && doc.head) {
				const b = document.createElement("base");
				b.href = `/fs/${sessionStorage.getItem("bootfile")!.replace(/\/?[^\/]+\.html$/, "")}/`;
				doc.head.insertBefore(b, doc.head.firstChild);
				document.body.innerHTML = doc.body.innerHTML;
				document.head.innerHTML = doc.head.innerHTML;
				const scripts = doc.querySelectorAll("script");
				scripts.forEach(script => {
					const newScript = document.createElement("script");
					if (script.src) {
						if (script.src.includes("http")) {
							newScript.src = script.src;
						} else if (!script.src.includes(`${window.location.origin}/fs/`)) {
							newScript.src = `/fs/${sessionStorage.getItem("bootfile")!.replace(/\/?[^\/]+\.html$/, "")}${script.src.replace(window.location.origin, "")}`;
						} else {
							newScript.src = script.src;
						}
					} else {
						newScript.textContent = script.textContent;
					}
					document.head.appendChild(newScript);
					script.parentNode?.removeChild(script);
				});
				setloaded(true);
			} else {
				console.error(`Failed to boot: ${sessionStorage.getItem("bootfile")}`);
				sessionStorage.clear();
				window.location.reload();
			}
		};

		Filer.fs.promises
			.readFile(sessionStorage.getItem("bootfile")!, "utf8")
			.then(data => {
				rep(data);
			})
			.catch(err => {
				console.error(`Failed to read bootfile because of: ${err}`);
				sessionStorage.clear();
				window.location.reload();
			});
	}, []);

	useEffect(() => {
		const back = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				sessionStorage.clear();
				window.location.reload();
			}
		};

		if (loaded) {
			window.removeEventListener("keydown", back);
		} else {
			window.addEventListener("keydown", back);
		}

		return () => {
			window.removeEventListener("keydown", back);
		};
	}, [loaded]);

	return (
		<div className="bg-[#0e0e0e] h-full justify-center items-center flex flex-col lg:h-full md:h-full">
			<img src="/tb.svg" alt="Terbium" className="w-[25%] h-[25%]" />
			<div className="duration-150 flex flex-col justify-center items-center">
				<div className="text-container relative flex flex-col justify-center items-end">
					<div className="bg-linear-to-b from-[#ffffff] to-[#ffffff77] text-transparent bg-clip-text flex flex-col lg:items-center md:items-center sm:items-center">
						<span className="font-[700] lg:text-[34px] md:text-[28px] sm:text-[22px] text-right duration-150">
							<span className="font-[1000] duration-150">Terbium Bootloader</span>
						</span>
						<br />
						<p>Press ESC to return to boot menu</p>
					</div>
				</div>
			</div>
		</div>
	);
}
