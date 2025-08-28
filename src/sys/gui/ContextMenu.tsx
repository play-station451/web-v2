import { useEffect, useRef, useState } from "react";
import "./styles/contextmenu.css";
import { useContextMenuStore } from "../Store";

const ContextMenuArea = () => {
	const contextMenuStore = useContextMenuStore();
	const menuAreaRef = useRef<HTMLDivElement | null>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [menuPos, setmenuPos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const ctx = (e: CustomEvent) => {
			contextMenuStore.setContextMenu(e.detail.props);
			setTimeout(() => {
				setMenuOpen(true);
			}, 50);
		};
		const withinRadius = (e: MouseEvent) => {
			if (!menuRef.current) return false;
			const rect = menuRef.current.getBoundingClientRect();
			const xBound = e.clientX >= rect.left - 75 && e.clientX <= rect.right + 75;
			const yBound = e.clientY >= rect.top - 75 && e.clientY <= rect.bottom + 75;
			return xBound && yBound;
		};
		const onDown = (e: MouseEvent) => {
			if (e.button === 0) {
				if (!menuRef.current?.contains(e.target as Node) && !withinRadius(e)) {
					setMenuOpen(false);
					setTimeout(() => {
						contextMenuStore.clearContextMenu();
					}, 150);
				}
			}
		};
		const close = () => {
			setMenuOpen(false);
			setTimeout(() => {
				contextMenuStore.clearContextMenu();
			}, 1000);
		};
		if (contextMenuStore.menu.options.length > 0) {
			let x = contextMenuStore.menu.x;
			let y = contextMenuStore.menu.y;
			if (x > window.innerWidth - 190) {
				x = window.innerWidth - 190;
			}
			if (y > window.innerHeight - 160) {
				y = window.innerHeight - 160;
			}
			setmenuPos({ x, y });
		}
		window.addEventListener("ctxm", ctx as unknown as EventListener);
		window.addEventListener("close-ctxm", close);
		document.addEventListener("click", onDown);
		return () => {
			window.removeEventListener("ctxm", ctx as unknown as EventListener);
			window.removeEventListener("close-ctxm", close);
			document.removeEventListener("click", onDown);
		};
	}, [contextMenuStore]);

	return (
		<div ref={menuAreaRef} onClick={() => {}}>
			{contextMenuStore.menu.options.length > 0 && (
				<div
					className={`
                        absolute z-99999999 flex flex-col rounded-lg overflow-hidden bg-[#ffffff10] text-white shadow-tb-border-shadow backdrop-blur-[10px]
                        ${menuOpen ? "translate-y-0" : "opacity-0 -translate-y-6"} duration-200
                    `}
					ref={menuRef}
					style={{ backdropFilter: "brightness(0.8) blur(10px)", top: `${menuPos.y}px`, left: `${menuPos.x}px` }}
				>
					{contextMenuStore.menu.titlebar ? typeof contextMenuStore.menu.titlebar === "string" ? <div className="flex items-center px-3 py-2.5 bg-[#ffffff3c] w-full text-left select-none">{contextMenuStore.menu.titlebar}</div> : contextMenuStore.menu.titlebar : null}
					<div className={`${menuOpen ? "" : "-translate-y-2 opacity-0"} duration-700`}>
						{contextMenuStore.menu.options.map((option, i) => {
							return (
								<button
									key={i}
									className="flex text-lg font-bold leading-none px-3 py-2.5 hover:bg-[#ffffff3c] w-full text-left select-none duration-150 cursor-pointer"
									style={{ color: option.color }}
									onClick={() => {
										option.click();
										contextMenuStore.clearContextMenu();
										setMenuOpen(false);
									}}
								>
									{option.text}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default ContextMenuArea;
