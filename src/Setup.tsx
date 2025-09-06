import Cropper from "cropperjs";
import Compressor from "compressorjs";
import { useState, useRef } from "react";
import "./sys/gui/styles/login.css";
import "./sys/gui/styles/cropper.css";
import "./sys/gui/styles/oobe.css";
import "./sys/gui/styles/dropdown.css";
import pwd from "./sys/apis/Crypto";
import { init } from "./init";
import { fileExists, User } from "./sys/types";
const pw = new pwd();

export default function Setup() {
	const [beforeSetup, setBeforeSetup] = useState(1);
	const [currentStep, setCurrentStep] = useState(1);
	const currentViewRef = useRef<HTMLDivElement | null>(null);
	var nextButtonClick = () => void 0;

	const Next = () => {
		setBeforeSetup(currentStep);
		setCurrentStep(prevStep => Math.min(prevStep + 1, 5));
	};
	const Back = () => {
		setBeforeSetup(currentStep);
		setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
	};
	const saveData = async () => {
		await init();
		let data: User = JSON.parse(sessionStorage.getItem("new-user") as string);
		sessionStorage.setItem("new-user", JSON.stringify(data));
		const usr = data["username"];
		data["id"] = usr;
		let pass: any;
		if (typeof data["password"] === "string" && data["password"].length > 0) {
			pass = pw.harden(data["password"]);
		} else {
			pass = false;
		}
		const userInf: User = {
			id: usr,
			username: usr,
			password: pass,
			pfp: data["pfp"],
			perm: data["perm"],
		};
		if (data.securityQuestion) {
			userInf["securityQuestion"] = {
				question: data.securityQuestion.question,
				answer: pw.harden(data.securityQuestion.answer),
			};
		}
		await window.tb.fs.promises.writeFile(`/home/${usr}/user.json`, JSON.stringify(userInf), "utf8");
		await window.tb.fs.promises.writeFile("/system/etc/terbium/sudousers.json", JSON.stringify([usr]), "utf8");
		await window.tb.fs.promises.mkdir(`/home/${usr}/documents/`);
		await window.tb.fs.promises.mkdir(`/home/${usr}/images/`);
		await window.tb.fs.promises.mkdir(`/home/${usr}/videos/`);
		await window.tb.fs.promises.mkdir(`/home/${usr}/music/`);
		let settings = JSON.parse(await window.tb.fs.promises.readFile(`/home/${usr}/settings.json`, "utf8"));
		let syssettings = JSON.parse(await window.tb.fs.promises.readFile("/system/etc/terbium/settings.json", "utf8"));
		if (!syssettings["setup"] || syssettings["setup"] === false) {
			syssettings["setup"] = true;
		}
		syssettings["defaultUser"] = usr;
		const transport = sessionStorage.getItem("selectedTransport") || "Default (Epoxy)";
		if (transport === "Default (Epoxy)") {
			settings["transport"] = "Default (Epoxy)";
		} else if (transport === "Anura BCC") {
			settings["transport"] = "Anura BCC";
		} else {
			settings["transport"] = "Libcurl";
		}
		const wsrv = sessionStorage.getItem("selectedBare") || `${location.protocol.replace("http", "ws")}//${location.hostname}:${location.port}/wisp/`;
		settings["wispServer"] = wsrv;
		await window.tb.fs.promises.writeFile(`/home/${usr}/settings.json`, JSON.stringify(settings), "utf8");
		await window.tb.fs.promises.writeFile("/system/etc/terbium/settings.json", JSON.stringify(syssettings), "utf8");
		const wispExist = await fileExists("//apps/system/settings.tapp/wisp-servers.json");
		if (!wispExist) {
			const stockDat = [
				{ id: `${location.protocol.replace("http", "ws")}//${location.hostname}:${location.port}/wisp/`, name: "Backend" },
				{ id: "wss://wisp.terbiumon.top/wisp/", name: "TB Wisp Instance" },
			];
			await window.tb.fs.promises.writeFile("//apps/system/settings.tapp/wisp-servers.json", JSON.stringify(stockDat));
		}
		localStorage.setItem("setup", "true");
		if (sessionStorage!.getItem("logged-in") === null || sessionStorage!.getItem("logged-in") === undefined || sessionStorage!.getItem("logged-in") === "false") {
			window.location.reload();
			sessionStorage.setItem("firstRun", "true");
		} else {
			window.location.reload();
			sessionStorage.setItem("firstRun", "true");
		}
		sessionStorage.removeItem("new-user");
	};

	const Step1 = () => {
		setTimeout(() => {
			currentViewRef.current?.classList.remove("-translate-x-6");
			currentViewRef.current?.classList.remove("opacity-0");
		}, 150);
		return (
			<div
				ref={el => {
					currentViewRef.current = el;
				}}
				className="duration-150 -translate-x-6 opacity-0 flex flex-col justify-center items-center"
			>
				<div className="text-container relative flex flex-col justify-center items-end">
					<div className="bg-linear-to-b from-[#ffffff] to-[#ffffff77] text-transparent bg-clip-text flex flex-col lg:items-end md:items-center sm:items-center">
						<span className="font-[700] lg:text-[34px] md:text-[28px] sm:text-[22px] text-right duration-150">
							The next generation of <span className="font-[1000] duration-150">Terbium.</span>
						</span>
						<span className="font-[1000] lg:text-[34px] md:text-[28px] sm:text-[22px] duration-150">Built to last.</span>
					</div>
				</div>
			</div>
		);
	};
	const Step2 = () => {
		setTimeout(() => {
			currentViewRef.current?.classList.remove("-translate-x-6");
			currentViewRef.current?.classList.remove("opacity-0");
		}, 150);
		const usernameRef = useRef<HTMLInputElement>(null);
		const passwordRef = useRef<HTMLInputElement>(null);
		const pfpRef = useRef<HTMLDivElement>(null);
		const secQ = useRef<HTMLInputElement>(null);
		const secA = useRef<HTMLInputElement>(null);
		const [showSec, setShowsec] = useState(false);

		nextButtonClick = () => {
			const pfp = pfpRef.current?.getAttribute("data-src");
			const randomColors = ["orange", "red", "green", "blue", "purple", "pink", "yellow"];
			const finalPfp = pfp || `/assets/img/default - ${randomColors[Math.floor(Math.random() * randomColors.length)]}.png`;
			let passdata: any = JSON.parse(sessionStorage.getItem("new-user") as string) || {};
			passdata["pfp"] = finalPfp;
			sessionStorage.setItem("new-user", JSON.stringify(passdata));
			const password = passwordRef.current?.value || false;
			const username = usernameRef.current?.value || "Guest";
			let data: any = JSON.parse(sessionStorage.getItem("new-user") as string) || {};
			data["username"] = username;
			data["password"] = password;
			data["perm"] = "admin";
			if (secA.current?.value && secQ.current?.value && secA.current.value.length > 0 && secQ.current.value.length > 0) {
				data["securityQuestion"] = {
					question: secQ.current.value,
					answer: secA.current.value,
				};
			}
			sessionStorage.setItem("new-user", JSON.stringify(data));
			currentViewRef.current?.classList.add("-translate-x-6");
			currentViewRef.current?.classList.add("opacity-0");
			setTimeout(() => {
				Next();
			}, 150);
		};
		return (
			<div
				ref={el => {
					currentViewRef.current = el;
				}}
				className="duration-150 -translate-x-6 opacity-0 flex flex-col justify-center items-center"
			>
				<div className="relative flex flex-col justify-center items-end">
					<span className="font-[800] text-[34px] bg-linear-to-b from-[#ffffff] to-[#ffffff77] text-transparent bg-clip-text mb-[20px]">Setup your account.</span>
					<div className="flex flex-col gap-[10px] justify-center items-center mr-[40px]">
						<div
							ref={pfpRef}
							className="pfp relative group w-[100px] h-[100px] rounded-[50%] bg-[#ffffff0a] border-[#3b3b3b] border-[2px] transition duration-150 ring-[transparent] ring-0 cursor-pointer"
							onMouseDown={() => {
								const uploader = document.createElement("input");
								uploader.type = "file";
								uploader.accept = "img/*";
								uploader.onchange = () => {
									const files = uploader!.files;
									const file = files![0];
									const reader = new FileReader();
									reader.onload = () => {
										const img = document.createElement("img");
										img.classList.add("opacity-0", "pointer-events-none");
										img.src = reader.result as string;
										img.onload = () => {
											const cropper_container = document.createElement("div");
											const cropper_container_styles = ["w-screen", "h-screen", "fixed", "top-0", "left-0", "right-0", "bottom-0", "z-999999", "bg-[#000000a6]", "flex", "flex-col", "justify-center", "items-center", "gap-[10px]"];
											cropper_container_styles.forEach(style => cropper_container.classList.add(style));
											const cropper_img_container = document.createElement("div");
											cropper_img_container.className = "cropper-img-container";
											let cropper_img_container_sizes = ["bg-[#ffffff0a]", "lg:w-[500px]", "lg:h-[500px]", "md:w-[400px]", "md:h-[400px]", "sm:w-[300px]", "sm:h-[300px]", "flex", "justify-center", "items-center", "rounded-[8px]", "overflow-hidden"];
											cropper_img_container_sizes.forEach(size => cropper_img_container.classList.add(size));
											const cropper_img = document.createElement("img");
											cropper_img.src = img.src;
											cropper_img.classList.add("cropper-img");
											cropper_img_container.classList.add("w-[500px]");
											cropper_img_container.classList.add("h-[500px]");
											cropper_img.style.objectFit = "cover";
											cropper_img.style.objectPosition = "center";
											cropper_img_container.appendChild(cropper_img);
											cropper_container.appendChild(cropper_img_container);
											document.body.appendChild(cropper_container);
											const cropper = new Cropper(cropper_img, { aspectRatio: 1, viewMode: 1, cropBoxResizable: false, movable: true, rotatable: true, scalable: true, responsive: true });
											const buttons = document.createElement("div");
											buttons.className = "flex w-[500px] justify-between items-center";
											cropper_container.appendChild(buttons);
											const save = document.createElement("button");
											save.className = "save broken_button cursor-pointer";
											save.innerText = "Save";
											const save_styles = [
												"bg-[#1d1d1d]",
												"text-[#ffffff38]",
												"border-[#ffffff22]",
												"hover:bg-[#414141]",
												"hover:text-[#ffffff8d]",
												"focus:bg-[#ffffff1f]",
												"focus:text-[#ffffff8d]",
												"focus:border-[#73a9ffd6]",
												"focus:ring-[#73a9ff74]",
												"focus:outline-hidden",
												"focus:ring-2",
												"ring-[transparent]",
												"ring-0",
												"border-[1px]",
												"font-[600]",
												"px-[20px]",
												"py-[8px]",
												"h-[18px]",
												"rounded-[6px]",
												"transition",
												"duration-150",
											];
											save_styles.forEach(style => save.classList.add(style));
											save.onclick = () => {
												const canvas = cropper.getCroppedCanvas();
												const pfp = document.querySelector(".pfp");
												canvas.toBlob(blob => {
													new Compressor(blob as Blob, {
														quality: 0.5,
														success(result) {
															const reader = new FileReader();
															reader.readAsDataURL(result);
															reader.onload = () => {
																(pfp! as HTMLImageElement).style.background = `url(${reader.result})`;
																(pfp! as HTMLImageElement).style.backgroundSize = "cover";
																(pfp! as HTMLImageElement).style.backgroundPosition = "center";
																(pfp! as HTMLImageElement).style.backgroundRepeat = "no-repeat";
																(pfp! as HTMLImageElement).setAttribute("data-src", reader.result as string);
																document.body.removeChild(cropper_container);
															};
														},
													});
												});
											};
											const cancel = document.createElement("button");
											cancel.className = "cancel broken_button cursor-pointer";
											cancel.innerText = "Cancel";
											const cancel_styles = [
												"bg-[#1d1d1d]",
												"text-[#ffffff38]",
												"border-[#ffffff22]",
												"hover:bg-[#414141]",
												"hover:text-[#ffffff8d]",
												"focus:bg-[#ffffff1f]",
												"focus:text-[#ffffff8d]",
												"focus:border-[#73a9ffd6]",
												"focus:ring-[#73a9ff74]",
												"focus:outline-hidden",
												"focus:ring-2",
												"ring-[transparent]",
												"ring-0",
												"border-[1px]",
												"font-[600]",
												"px-[20px]",
												"py-[8px]",
												"h-[18px]",
												"rounded-[6px]",
												"transition",
												"duration-150",
											];
											cancel_styles.forEach(style => cancel.classList.add(style));
											cancel.onclick = () => {
												document.body.removeChild(cropper_container);
											};
											buttons.appendChild(cancel);
											buttons.appendChild(save);
										};
									};
									reader.readAsDataURL(file);
								};
								uploader.click();
							}}
						>
							<div className="uploader opacity-0 size-full rounded-[50%] bg-[#00000060] transition duration-150 group-hover:opacity-100 cursor-pointer"></div>
							<p className="absolute top-1/2 cursor-pointer left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 text-[#cccccc] text-[16px] font-[600] group-hover:opacity-100 transition duration-150 pointer-events-none">Upload</p>
						</div>
						<div className="inputs flex flex-col gap-[10px] justify-center items-left">
							<input
								ref={usernameRef}
								type="text"
								className="username cursor-[var(--cursor-text)] rounded-[6px] px-[10px] py-[8px] text-[#ffffff] placeholder-[#ffffff38] bg-[#ffffff0a] border-[#ffffff22] border-[1px] transition duration-150 ring-[transparent] ring-0 focus:bg-[#ffffff1f] focus:border-[#73a9ffd6] focus:ring-[#73a9ff74] focus:placeholder-[#ffffff48] focus:text-[#ffffff] focus:outline-hidden focus:ring-2"
								placeholder="Username"
								onKeyDown={(e: any) => {
									if (e.key === "Enter" && passwordRef.current) {
										passwordRef.current.focus();
									}
								}}
							/>
							<div className="pass relative flex justify-center items-center gap-[10px]">
								<input
									ref={passwordRef}
									type="password"
									className="password cursor-[var(--cursor-text)] rounded-[6px] px-[10px] py-[8px] text-[#ffffff] caret-[#ffffff] placeholder-[#ffffff38] bg-[#ffffff0a] border-[#ffffff22] border-[1px] transition duration-150 ring-[transparent] ring-0 focus:bg-[#ffffff1f] focus:border-[#73a9ffd6] focus:ring-[#73a9ff74] focus:text-[#ffffff] focus:placeholder-[#ffffff48] focus:outline-hidden focus:ring-2"
									placeholder="Password"
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										if (e.target.value.length > 0) {
											setShowsec(true);
										} else {
											setShowsec(false);
										}
									}}
								/>
							</div>
							{showSec ? (
								<div className="security-section mt-4 p-3 rounded bg-[#ffffff0a] border border-[#ffffff22] w-[250]">
									<div className="font-semibold text-[#ffffffa0] mb-2">Security Question (optional)</div>
									<input
										ref={secQ}
										type="text"
										className="security-question mb-2 w-full rounded-[6px] px-[10px] py-[8px] text-[#ffffff] placeholder-[#ffffff38] bg-[#ffffff0a] border-[#ffffff22] border-[1px] transition duration-150 ring-[transparent] ring-0 focus:bg-[#ffffff1f] focus:border-[#73a9ffd6] focus:ring-[#73a9ff74] focus:text-[#ffffff] focus:placeholder-[#ffffff48] focus:outline-hidden focus:ring-2"
										placeholder="Enter a security question"
									/>
									<input
										ref={secA}
										type="text"
										className="security-answer w-full rounded-[6px] px-[10px] py-[8px] text-[#ffffff] placeholder-[#ffffff38] bg-[#ffffff0a] border-[#ffffff22] border-[1px] transition duration-150 ring-[transparent] ring-0 focus:bg-[#ffffff1f] focus:border-[#73a9ffd6] focus:ring-[#73a9ff74] focus:text-[#ffffff] focus:placeholder-[#ffffff48] focus:outline-hidden focus:ring-2"
										placeholder="Enter your answer"
									/>
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>
		);
	};
	const Step3 = () => {
		setTimeout(() => {
			currentViewRef.current?.classList.remove("-translate-x-6");
			currentViewRef.current?.classList.remove("opacity-0");
		}, 150);

		nextButtonClick = () => {
			currentViewRef.current?.classList.add("-translate-x-6");
			currentViewRef.current?.classList.add("opacity-0");
			setTimeout(() => {
				Next();
			}, 150);
		};

		const [selectedProxy, setSelectedProxy] = useState(() => sessionStorage.getItem("selectedProxy") || "Ultraviolet");
		const [proxyDropdownOpen, setProxyDropdownOpen] = useState(false);
		const toggleProxyDropDown = () => {
			setProxyDropdownOpen(prev => {
				return !prev;
			});
		};
		const proxyClick = (optionLabel: any) => {
			setSelectedProxy(optionLabel);
			sessionStorage.setItem("selectedProxy", optionLabel);
			setProxyDropdownOpen(false);
		};

		return (
			<div
				ref={el => {
					currentViewRef.current = el;
				}}
				className="duration-150 -translate-x-6 opacity-0 flex flex-col justify-center items-center"
			>
				<span className="font-[800] text-[34px] bg-linear-to-b from-[#ffffff] to-[#ffffff77] text-transparent bg-clip-text lg:mb-[20px] md:mb-[20px] sm:mb-[10px] lg:text-[34px] md:text-[28px] sm:text-[22px] duration-150">Choose your default proxy.</span>
				<div className="dropdown def-proxy">
					<div className="dropdown-title" onMouseDown={toggleProxyDropDown}>
						<span className="pointer-events-none">{selectedProxy}</span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px] pointer-events-none">
							<path fillRule="evenodd" d="M11.47 4.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 01-1.06-1.06l3.75-3.75zm-3.75 9.75a.75.75 0 011.06 0L12 17.69l3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 010-1.06z" clipRule="evenodd" />
						</svg>
					</div>
					{proxyDropdownOpen && (
						<div className="dropdown-options active">
							<div className="dropdown-option" onMouseDown={() => proxyClick("Scramjet")}>
								<span className="pointer-events-none">Scramjet</span>
							</div>
							<div className="dropdown-option" onMouseDown={() => proxyClick("Ultraviolet")}>
								<span className="pointer-events-none">Ultraviolet</span>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	};
	const Step4 = () => {
		setTimeout(() => {
			currentViewRef.current?.classList.remove("-translate-x-6");
			currentViewRef.current?.classList.remove("opacity-0");
		}, 150);

		nextButtonClick = () => {
			currentViewRef.current?.classList.add("-translate-x-6");
			currentViewRef.current?.classList.add("opacity-0");
			setTimeout(() => {
				Next();
			}, 150);
		};

		const [selectedBare, setSelectedBare] = useState(() => sessionStorage.getItem("selectedBare") || "Backend (Default)");
		const [selectedTransport, setSelectedTransport] = useState(() => sessionStorage.getItem("selectedTransport") || "Default (Epoxy)");
		const [bareDropdownOpen, setBareDropdownOpen] = useState(false);
		const [transportDropdownOpen, setTransportDropdownOpen] = useState(false);
		const [customServer, setCustomServer] = useState("");
		const bareOptions = [{ label: "Backend (Default)" }, { label: "TB Wisp Instance" }, { label: "Custom Server" }];
		const transportOptions = [{ label: "Default (Epoxy)" }, { label: "Libcurl" }, { label: "Anura BCC" }];
		const bClick = (label: any) => {
			setSelectedBare(label);
			if (label === "Custom Server") {
				setCustomServer("");
			} else if (label === "Backend (Default)") {
				sessionStorage.setItem("selectedBare", `${location.protocol.replace("http", "ws")}//${location.hostname}:${location.port}/wisp/`);
			} else if (label === "TB Wisp Instance") {
				sessionStorage.setItem("selectedBare", `wss://wisp.terbiumon.top/wisp/`);
			}
			setBareDropdownOpen(false);
		};
		const transportOnClick = (label: any) => {
			setSelectedTransport(label);
			sessionStorage.setItem("selectedTransport", label);
			setTransportDropdownOpen(false);
		};
		const ServerChange = async (e: any) => {
			const value = e.target.value;
			setCustomServer(value);
			sessionStorage.setItem("selectedBare", value);
			const stockDat = [
				{ id: `${location.protocol.replace("http", "ws")}//${location.hostname}:${location.port}/wisp/`, name: "Backend" },
				{ id: "wss://wisp.terbiumon.top/wisp/", name: "TB Wisp Instance" },
				{ id: value, name: "Custom Wisp" },
			];
			await window.tb.fs.promises.writeFile("//apps/system/settings.tapp/wisp-servers.json", JSON.stringify(stockDat));
		};

		return (
			<div
				ref={el => {
					currentViewRef.current = el;
				}}
				className="duration-150 -translate-x-6 opacity-0 flex flex-col justify-center items-center"
			>
				<span className="font-[800] text-[34px] bg-linear-to-b from-[#ffffff] to-[#ffffff77] text-transparent bg-clip-text lg:mb-[20px] md:mb-[20px] sm:mb-[10px] lg:text-[34px] md:text-[28px] sm:text-[22px] duration-150">Customize Proxy Settings</span>
				<div className="dropdown def-proxy mr-[185px]">
					<div className="dropdown-title" onMouseDown={() => setBareDropdownOpen(prev => !prev)}>
						<span className="pointer-events-none">{selectedBare}</span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px] pointer-events-none">
							<path fillRule="evenodd" d="M11.47 4.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 01-1.06-1.06l3.75-3.75zm-3.75 9.75a.75.75 0 011.06 0L12 17.69l3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 010-1.06z" clipRule="evenodd" />
						</svg>
					</div>
					{bareDropdownOpen && (
						<div className="dropdown-options active">
							{bareOptions.map((option, index) => (
								<div className="dropdown-option" key={index} onMouseDown={() => bClick(option.label)}>
									<span className="pointer-events-none">{option.label}</span>
								</div>
							))}
						</div>
					)}
				</div>
				<div className="dropdown def-transport ml-[230px] mt-[-42px]">
					<div className="dropdown-title" onMouseDown={() => setTransportDropdownOpen(prev => !prev)}>
						<span className="pointer-events-none">{selectedTransport}</span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px] pointer-events-none">
							<path fillRule="evenodd" d="M11.47 4.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 01-1.06-1.06l3.75-3.75zm-3.75 9.75a.75.75 0 011.06 0L12 17.69l3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 010-1.06z" clipRule="evenodd" />
						</svg>
					</div>
					{transportDropdownOpen && (
						<div className="dropdown-options active">
							{transportOptions.map((option, index) => (
								<div className="dropdown-option" key={index} onMouseDown={() => transportOnClick(option.label)}>
									<span className="pointer-events-none">{option.label}</span>
								</div>
							))}
						</div>
					)}
				</div>
				{selectedBare === "Custom Server" && (
					<input
						type="url"
						value={customServer}
						onChange={ServerChange}
						placeholder="Enter custom server"
						className="custom rounded-[6px] px-[10px] py-[8px] mt-[10px] bg-[#ffffff0a] border-[#ffffff22] border-[1px] text-[#ffffff] caret-[#ffffff] placeholder-[#ffffff38] ring-[transparent] ring-0 focus:bg-[#ffffff1f] focus:border-[#73a9ffd6] focus:outline-hidden duration-150"
					/>
				)}
			</div>
		);
	};
	const Step5 = () => {
		setTimeout(() => {
			currentViewRef.current?.classList.remove("-translate-x-6");
			currentViewRef.current?.classList.remove("opacity-0");
		}, 150);
		saveData();
		return (
			<p
				ref={el => {
					currentViewRef.current = el;
				}}
				className="font-[700] text-[28px] duration-150 -translate-x-6 opacity-0"
			>
				Welcome to Terbium.
			</p>
		);
	};

	const Buttons = () => {
		const currentMotionEl = useRef<HTMLDivElement | HTMLButtonElement | null>(null);
		setTimeout(() => {
			currentMotionEl.current?.classList.remove("translate-y-8", "opacity-0");
		}, 150);

		return (
			<div className={`absolute bottom-2.5 left-2.5 right-2.5 h-max flex justify-center items-center max-w-full overflow-x-auto overflow-y-hidden`}>
				{currentStep === 1 ? (
					<button
						ref={el => {
							currentMotionEl.current = el;
						}}
						className="translate-y-8 opacity-0 cursor-pointer bg-[#ffffff0a] text-[#ffffff38] border-[#ffffff22] hover:bg-[#ffffff10] hover:text-[#ffffff8d] focus:bg-[#ffffff1f] focus:text-[#ffffff8d] focus:border-[#73a9ffd6] focus:ring-[#73a9ff74] focus:outline-hidden focus:ring-2 ring-[transparent] ring-0 border-[1px] font-[600] px-[20px] py-[8px] rounded-[6px] duration-150"
						onMouseDown={() => {
							currentViewRef.current?.classList.add("-translate-x-6");
							currentViewRef.current?.classList.add("opacity-0");
							setTimeout(() => {
								Next();
							}, 150);
						}}
					>
						Start
					</button>
				) : null}
				{currentStep > 1 ? (
					<div
						ref={el => {
							currentStep < 4 && (currentMotionEl.current = el);
						}}
						className={`${currentStep === 2 && beforeSetup !== 3 && "translate-y-8 opacity-0"} duration-150 w-full flex flex-wrap justify-between gap-2 max-w-full`}
					>
						{currentStep < 5 && (
							<button
								className={`cursor-pointer bg-[#ffffff0a] text-[#ffffff38] border-[#ffffff22] hover:bg-[#ffffff10] hover:text-[#ffffff8d] focus:bg-[#ffffff1f] focus:text-[#ffffff8d] focus:border-[#73a9ffd6] focus:ring-[#73a9ff74] focus:outline-hidden focus:ring-2 ring-[transparent] ring-0 border-[1px] font-[600] px-[20px] py-[8px] rounded-[6px] duration-150 ${currentStep === 5 ? "translate-y-8 opacity-0 pointer-events-none" : ""}`}
								onMouseDown={Back}
							>
								Previous
							</button>
						)}
						<button
							ref={el => {
								currentStep === 4 && (currentMotionEl.current = el);
							}}
							className={`${currentStep === 5 && "translate-y-8 opacity-0"} cursor-pointer bg-[#ffffff0a] text-[#ffffff38] border-[#ffffff22] hover:bg-[#ffffff10] hover:text-[#ffffff8d] focus:bg-[#ffffff1f] focus:text-[#ffffff8d] focus:border-[#73a9ffd6] focus:ring-[#73a9ff74] focus:outline-hidden focus:ring-2 ring-[transparent] ring-0 border-[1px] font-[600] px-[20px] py-[8px] rounded-[6px] duration-150`}
							onMouseDown={() => {
								currentStep < 5 ? nextButtonClick() : null;
							}}
						>
							{currentStep < 4 ? "Next" : "Finish"}
						</button>
					</div>
				) : null}
			</div>
		);
	};

	return (
		<div className="bg-[#0e0e0e] h-full">
			<div className="steps-container flex flex-col lg:flex-row md:flex-row w-full h-full overflow-y-hidden">
				<div className="logo sm:h-full sm:w-1/2 h-1/2 w-full flex flex-col justify-end items-center sm:justify-center sm:items-center overflow-y-hidden">
					<img src="/assets/img/logo.png" alt="TB" className="w-[240px] lg:w-[480px] h-auto" />
				</div>
				<div className="sm:h-full sm:w-1/2 h-1/2 w-full flex flex-col justify-start items-center text-center sm:justify-center sm:items-center overflow-y-hidden">
					{currentStep === 1 ? <Step1 /> : currentStep === 2 ? <Step2 /> : currentStep === 3 ? <Step3 /> : currentStep === 4 ? <Step4 /> : currentStep === 5 ? <Step5 /> : null}
				</div>
			</div>
			<Buttons />
		</div>
	);
}
