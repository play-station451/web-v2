import type React from "react";
import { useEffect, useState } from "react";
import "./styles/win_switcher.css";
import { useWindowStore } from "../Store";
import type { WindowConfig } from "../types";

const WinSwitcher: React.FC = () => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const windows = useWindowStore(state => state.windows);
	useEffect(() => {
		const os = navigator.userAgent;
		let switcherTimer: NodeJS.Timeout;
		const onDown = (e: KeyboardEvent) => {
			if (os.includes("Mac") ? e.metaKey && e.shiftKey && e.key === "Tab" : e.key === "Tab" && e.shiftKey) {
				e.preventDefault();
				showSwitch();
			} else if (isVisible && e.key === "Tab") {
				e.preventDefault();
				onSwitch(1);
			}
		};
		const onUp = (e: KeyboardEvent) => {
			if (os.includes("Mac") ? e.metaKey && e.shiftKey && e.key === "Tab" : e.key === "Tab" || !e.shiftKey) {
				e.preventDefault();
				clearTimeout(switcherTimer);
				switcherTimer = setTimeout(() => {
					setIsVisible(false);
				}, 1000);
			}
		};
		const showSwitch = () => {
			setIsVisible(true);
			setActiveIndex(0);
			clearTimeout(switcherTimer);
			switcherTimer = setTimeout(() => {
				setIsVisible(false);
			}, 1000);
		};
		const onSwitch = (direction: number) => {
			if (windows.length > 0) {
				const nextIndex = (activeIndex + direction + windows.length) % windows.length;
				setActiveIndex(nextIndex);
				const win = windows[nextIndex];
				console.log(win);
				window.dispatchEvent(new CustomEvent("sel-win", { detail: win.wid }));
			}
		};
		window.addEventListener("keydown", onDown);
		window.addEventListener("keyup", onUp);
		return () => {
			window.removeEventListener("keydown", onDown);
			window.removeEventListener("keyup", onUp);
			clearTimeout(switcherTimer);
		};
	}, [activeIndex, isVisible, windows]);
	return (
		<div className={`win-switcher absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-[10px] px-[14px] bg-[#00000028] backdrop-blur-[100px] rounded-[10px] z-999999999 opacity-${isVisible ? "100" : "0"} duration-150 pointer-events-${isVisible ? "auto" : "none"}`}>
			{windows.map((window: WindowConfig, index: number) => (
				<div key={window.wid} data-index={index} className={`window-item ${index === activeIndex ? "active" : ""}`}>
					{window.icon && <img src={window.icon} alt={typeof window.title === "string" ? window.title : window.title.text} className="icon" />}
					{typeof window.title === "string" ? window.title : window.title.text}
				</div>
			))}
		</div>
	);
};

export default WinSwitcher;
