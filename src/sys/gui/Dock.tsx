import { FC, ReactNode, useEffect, useRef, useState } from "react"
import { MagnifyingGlassIcon, ChevronRightIcon, PuzzlePieceIcon } from "@heroicons/react/24/solid"
import "./styles/dock.css"
import { dirExists, Filer, isURL, WindowConfig } from "../types"
import { useWindowStore } from "../Store"

export type TDockItem = {
    className?: string;
    title: string
    icon: string | undefined
    src: string
    size?: number[] | any
    children?: Array<TDockItem>
    isPinnable?: boolean
    snapable?: boolean
    pid?: string
    wid?: string
    proxy?: boolean
    onClick?: (e: MouseEvent) => void
    onContextMenu?: (e: MouseEvent) => void
}

export type TStartItem = {
    title: string
    icon: string | ReactNode | undefined
    pid: string | undefined
    onClick?: (e: MouseEvent) => void
    inPins?: boolean,
    className?: string
    src?: string
    proxy?: boolean
}

interface IDockProps {
    showPins?: boolean
    pinned: Array<TDockItem> | null
}

const Dock: FC<IDockProps> = ({ pinned }) => {
    const windowStore = useWindowStore();

    const [isStartOpen, setStartOpen] = useState<boolean>(false);

    const startRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const searchDockRef = useRef<HTMLDivElement>(null);
    const [searchHasText, setSearchHasText] = useState<boolean>((searchRef.current?.value?.length ?? 0) >= 1);
    const [searchActive, setSearchActive] = useState<boolean>(false);
    const placeholderRef = useRef<HTMLSpanElement>(null);
    const openAppsRef = useRef<HTMLDivElement>(null);
    const startButtonRef = useRef<SVGSVGElement>(null);
    const systemAppsRef = useRef<HTMLDivElement>(null);
    const pinnedAppsRef = useRef<HTMLDivElement>(null);
    const searchMatchRef = useRef<HTMLDivElement>(null);
    const pinnedAppsDockRef = useRef<HTMLDivElement>(null);
    const openedAppsDockRef = useRef<HTMLDivElement>(null);
    const [searchMatch, setSearchMatch] = useState<boolean>(false);
    const [systemApps, setSysApps] = useState<Array<TDockItem>>([]);
    const [pins, setPins] = useState<Array<TDockItem>>([]);

    useEffect(() => {
        const fetchData = async () => {
            if(await dirExists("/system")) {
                setSysApps(JSON.parse(await Filer.promises.readFile("/system/var/terbium/start.json", "utf8")).system_apps);
                setPins(JSON.parse(await Filer.promises.readFile("/system/var/terbium/start.json", "utf8")).pinned_apps);
            }
        }
        fetchData();
        if(isStartOpen === true) {
            setStartOpen(false);
        }
        window.addEventListener("updApps", fetchData)
        return () => window.removeEventListener("updApps", fetchData)
    }, [])

    const filteredSysApps = (systemApps).filter((item, index, self) =>
        index === self.findIndex((t) =>
            t.title === item.title && t.icon === item.icon && t.src === item.src
        )
    )

    // @ts-expect-error
    const filteredPins = pinned.filter((item, index, self) =>
        index === self.findIndex((t) =>
            t.src === item.src && t.title === item.title && t.icon === item.icon
        )
    )

    const openStart = (focusSearch: boolean) => {
        const clickElsewhere = (e: MouseEvent) => {
            if(e.target !== startRef.current && e.target !== startButtonRef.current && !startRef.current?.contains(e.target as Node) && !searchDockRef.current?.contains(e.target as Node)) {
                setStartOpen(false);
                setSearchHasText(false);
                if (searchRef.current) {
                    searchRef.current.value = "";
                }
                const systemApps = systemAppsRef.current;
                const pinnedApps = pinnedAppsRef.current;
                if(systemApps !== null && pinnedApps !== null) {
                    const systemAppsChildren = systemApps.children;
                    const pinnedAppsChildren = pinnedApps.children;
                    for(let i = 0; i < systemAppsChildren.length; i++) {
                        const child: Element = systemAppsChildren[i];
                        child.classList.remove("hidden");
                        child.classList.remove("-translate-x-2");
                        child.classList.remove("opacity-0");
                    }
                    for(let i = 0; i < pinnedAppsChildren.length; i++) {
                        const child: Element = pinnedAppsChildren[i];
                        child.classList.remove("hidden");
                        child.classList.remove("-translate-x-2");
                        child.classList.remove("opacity-0");
                    }
                }
                window.removeEventListener("mousedown", clickElsewhere);
            }
        }
        window.addEventListener("mousedown", clickElsewhere);
        setStartOpen(true);
        if (focusSearch) {
            setTimeout(() => {
                searchRef.current?.focus()
            }, 150)
        }
        setTimeout(() => {
            if (searchRef.current) {
                searchRef.current.value = "";
            }
            setSearchHasText(false);
            const systemApps = systemAppsRef.current;
            const pinnedApps = pinnedAppsRef.current;
            if(systemApps !== null && pinnedApps !== null) {
                const systemAppsChildren = systemApps.children;
                const pinnedAppsChildren = pinnedApps.children;
                for(let i = 0; i < systemAppsChildren.length; i++) {
                    const child: Element = systemAppsChildren[i];
                    child.classList.remove("hidden");
                    child.classList.remove("-translate-x-2");
                    child.classList.remove("opacity-0");
                }
                for(let i = 0; i < pinnedAppsChildren.length; i++) {
                    const child: Element = pinnedAppsChildren[i];
                    child.classList.remove("hidden");
                    child.classList.remove("-translate-x-2");
                    child.classList.remove("opacity-0");
                }
            }
        }
        , 150)
    }

    return (
        <div className="flex relative justify-center pb-[6px] z-9999999">
            <div ref={startRef} className={`
                absolute flex flex-col
                bg-[#2020208c] shadow-tb-border-shadow backdrop-blur-[8px] p-2 rounded-xl
                w-max min-w-[440px] h-max min-h-[200px] ease-in
                ${isStartOpen ? "opacity-100 bottom-[calc(6px+54px)] duration-150" : "opacity-0 pointer-events-none bottom-[calc(6px+14px)] duration-200"}
                ${searchHasText ? "scale-110" : ""}
            `} style={{backgroundImage: "url(/assets/img/grain.png)"}}>
                <div className={`flex gap-2 items-center
                        ${
                            isStartOpen ? "" : "translate-y-2 opacity-0"
                        } duration-700
                `}>
                    <MagnifyingGlassIcon className="w-6 h-6 text-white stroke-current stroke-[1.4px]" />
                    <div className="relative flex items-center w-full">
                        <span ref={placeholderRef} className={`absolute font-[680] text-lg pointer-events-none duration-150 ${searchHasText ? "opacity-0" : searchActive ? "opacity-100" : "opacity-75"}`}>Search</span>
                        <input ref={searchRef} className={`bg-transparent focus-within:outline-hidden text-lg font-[680] cursor-[var(--cursor-text)] w-full`} type="text"
                        onFocus={() => {
                            setSearchActive(true);
                        }} onBlur={() => {
                            setSearchActive(false);
                        }} onInput={(e: any) => {
                            if(e.target.value.length > 0) {
                                setSearchHasText(true);
                            } else {
                                setSearchHasText(false);
                            }
                            const query = e.target.value.toLowerCase();
                            const systemApps = systemAppsRef.current;
                            const pinnedApps = pinnedAppsRef.current;
                            if(systemApps !== null && pinnedApps !== null) {
                                const systemAppsChildren = systemApps.children;
                                const pinnedAppsChildren = pinnedApps.children;
                                let systemAppsMatch = 0;
                                let pinnedAppsMatch = 0;
                                for(let i = 0; i < systemAppsChildren.length; i++) {
                                    const child: Element = systemAppsChildren[i];
                                    if(child.textContent && child.textContent.toLowerCase().includes(query)) {
                                        child.classList.remove("hidden");
                                        setTimeout(() => {
                                            child.classList.remove("opacity-0");
                                            child.classList.remove("-translate-x-2")
                                        }, 150)
                                        systemAppsMatch++;
                                    } else {
                                        child.classList.add("-translate-x-2")
                                        child.classList.add("opacity-0");
                                        setTimeout(() => {
                                            child.classList.add("hidden");
                                        }, 150)
                                    }
                                }
                                for(let i = 0; i < pinnedAppsChildren.length; i++) {
                                    const child: Element = pinnedAppsChildren[i];
                                    if(child.textContent && child.textContent.toLowerCase().includes(query)) {
                                        child.classList.remove("hidden");
                                        setTimeout(() => {
                                            child.classList.remove("opacity-0");
                                            child.classList.remove("-translate-x-2")
                                        }, 150)
                                        pinnedAppsMatch++;
                                    } else {
                                        child.classList.add("-translate-x-2")
                                        child.classList.add("opacity-0");
                                        setTimeout(() => {
                                            child.classList.add("hidden");
                                        }, 150)
                                    }
                                }
                                if(systemAppsMatch === 0 && pinnedAppsMatch === 0) {
                                    setSearchMatch(true);
                                } else {
                                    setSearchMatch(false);
                                }
                            }
                        }} />
                    </div>
                </div>
                <div className={`flex justify-between items-center h-full w-full gap-2
                        ${
                            isStartOpen ? "" : "translate-y-4 opacity-0"
                        } duration-1000
                `}>
                    <div ref={systemAppsRef} className={`
                        grid ${pins.length > 0 ? "max-h-[188px] grid-cols-2" : "w-full grid-cols-3"} gap-1 overflow-y-auto
                    `}>
                        {
                            filteredSysApps.map((item, index) => (
                                <StartItem key={index} title={item.title} icon={item.icon} pid={undefined} src={item.src} onClick={() => {
                                    item.onClick?.(new MouseEvent('click'));
                                    windowStore.addWindow({
                                        src: item.src,
                                        size: item.size,
                                        icon: typeof item.icon === 'string' ? item.icon : undefined,
                                        title: item.title,
                                        proxy: item.proxy,
                                        snapable: item.snapable
                                    });
                                    setStartOpen(false);
                                }} />
                            ))
                        }
                    </div>
                    <div ref={pinnedAppsRef} className={`
                        flex flex-col bg-[#ffffff10] max-h-[200px] overflow-y-auto w-max rounded-lg last:rounded-b-lgration-1000
                    `}>
                        {
                            pins.length > 0 ? pins.map((item, index) => (
                                <StartItem className="first:rounded-t-lg last:rounded-b-lg" inPins pid={undefined} key={index} title={item.title} icon={item.icon} onClick={(e: MouseEvent) => {
                                    if(e.button === 0)
                                    item.onClick?.(new MouseEvent('click'));
                                    windowStore.addWindow({
                                        src: item.src,
                                        icon: typeof item.icon === 'string' ? item.icon : undefined,
                                        size: item.size,
                                        title: item.title,
                                        proxy: item.proxy,
                                        snapable: item.snapable
                                    });
                                    setStartOpen(false);
                                }} />
                            )) : null
                        }
                    </div>
                </div>
                <span ref={searchMatchRef} className={`absolute top-1/2 left-1/2 -translate-x-1/2 font-black duration-150 ${searchMatch === false ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}>No Search Match.</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 shadow-tb-border-shadow backdrop-blur-[8px] bg-[#2020208c] p-2 rounded-[8px]">
                    <svg ref={startButtonRef} viewBox="0 0 24 24" fill="currentColor" className="cursor-pointer w-7 h-7" onClick={() => openStart(false)}>
                        <path className="pointer-events-none" fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z" clipRule="evenodd" />
                    </svg>
                    <div ref={searchDockRef} className="flex items-center min-w-34 gap-1 p-2 bg-[#ffffff10] rounded-full cursor-text shadow-tb-border-shadow" onMouseDown={() => openStart(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 text-[#ffffff] pointer-events-none stroke-1 stroke-current">
                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                        </svg>
                        <span className="leading-none text-[#ffffffa6] font-bold pointer-events-auto">Search</span>
                    </div>
                </div>
                <div ref={openAppsRef} className={`
                    shadow-tb-border-shadow backdrop-blur-[8px] bg-[#2020208c]
                    flex items-center
                    gap-2 py-1.5 px-2 rounded-[8px]
                    duration-150 ease-in
                        ${
                            pinned != null ?
                            pinned.length > 0 && windowStore.windows.length > 0 || pinned.length > 0 || windowStore.windows.length > 0 ? "translate-x-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none" : null
                        }
                `} style={{backgroundImage: "url(/assets/img/grain.png)"}}>
                    {
                        pinned != null && pinned.length > 0 ? (
                            <div ref={pinnedAppsDockRef} className="flex items-center">
                                {
                                    filteredPins.map((item, index) => (
                                        <PinnedDockItem src={item.src} key={index} title={item.title} icon={item.icon ?? "/assets/img/null.svg"} size={item.size} proxy={item.proxy} snapable={item.snapable} onContextMenu={(e: MouseEvent) => {
                                            e.preventDefault();
                                        }}/>
                                    ))
                                }
                            </div>
                        ) : null
                    }
                    {
                        (pinned?.length ?? 0) > 0 && windowStore.windows.length > 0 ? (
                            <span className="flex bg-[#ffffff38] backdrop-blur-[20px] h-[20px] w-1 rounded-full"></span>
                        ) : null
                    }
                    <div ref={openedAppsDockRef} className={`
                        flex items-center gap-0.5
                        ${
                            windowStore.windows.length > 0 ? "flex" : "hidden"
                        }
                    `}>
                        {
                            windowStore.windows.filter((item, index, self) =>
                                index === self.findIndex((t) => (typeof t.title === 'string' ? t.title : t.title?.text) === (typeof item.title === 'string' ? item.title : item.title?.text))
                            ).map((item, index) => (
                                <DockItem src={item.src} key={index} title={typeof item.title === "string" ? item.title : item.title.text} icon={item.icon ?? "/assets/img/null.svg"} size={item.size} proxy={item.proxy} wid={item.wid} pid={item.pid} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

const DockItem: FC<TDockItem> = ({ className, icon, title, src, onClick, onContextMenu, size, snapable, pid, wid, proxy }) => {
    const windowStore = useWindowStore();
    const dockItemRef = useRef<HTMLDivElement>(null);
    const [currWID, setcurrWID] = useState(wid);
    const [winfocused, setwinfocused] = useState(windowStore.windows.find((w: any) => w.wid === currWID)?.focused);
    const mm = (e: MouseEvent) => {
        const withinRadius = (e: MouseEvent) => {
            if (!dockItemRef.current) return false;
            const rect = dockItemRef.current.getBoundingClientRect();
            const xDistance = Math.abs(e.clientX - (rect.left + rect.width / 2));
            const yDistance = Math.abs(e.clientY - (rect.top + rect.height / 2));
            const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
            return distance > 350;
        }
        if (withinRadius(e)) {
            window.removeEventListener("mousemove", mm);
            window.dispatchEvent(new CustomEvent("windows-prev", { detail: JSON.stringify({ open: false, location: null }) }));
        }
    }
    useEffect(() => {
        const setWID = (e: CustomEvent) => {
            setcurrWID(e.detail);
            setwinfocused(windowStore.windows.find((w: any) => w.wid === e.detail)?.focused);
        }
        const updsel = (e: CustomEvent) => {
            if (e.detail !== title) {
                setwinfocused(false);
            } else {
                setwinfocused(true);
            }
        }
        window.addEventListener("selwin-upd", updsel as EventListener);
        window.addEventListener("currWID", setWID as EventListener);
        return () => {
            window.removeEventListener("currWID", setWID as EventListener);
            window.removeEventListener("mousemove", mm);
        }
    }, [currWID, winfocused])
    return (
        // @ts-expect-error
        <dock-item ref={dockItemRef} wid={wid} class={
            className ? className +
            " cursor-pointer p-1 hover:bg-[#ffffff28] rounded-md duration-100 ease-in select-none" : "cursor-pointer p-1 hover:bg-[#ffffff28] rounded-md duration-100 ease-in select-none" + `
            ${winfocused ? "bg-[#ffffff28] shadow-tb-border-shadow" : ""}
            `
        }
        onMouseEnter={() => {
            setTimeout(() => {
                const rect = dockItemRef.current?.getBoundingClientRect();
                const x = rect ? rect.x : 0;
                window.addEventListener("mousemove", mm);
                window.dispatchEvent(new CustomEvent("windows-prev", { detail: JSON.stringify({ open: true, windows: [windowStore.matchedWindows.find((group: any[]) => 
                    group.some((w: WindowConfig) => {
                        if (typeof w.title === 'string') {
                            return w.title === title;
                        } else if (w.title && w.title.text) {
                            return w.title.text === title;
                        }
                        return false;
                    })
                )], location: x }) }));
            }, 950);
        }}
        onClick={() => {
            onClick?.(new MouseEvent('click'));
            window.dispatchEvent(new CustomEvent("sel-win", { detail: currWID }))
        }} onContextMenu={(e: React.MouseEvent) => {
            e.preventDefault();
            onContextMenu?.(new MouseEvent('contextmenu'));
            const { clientX, clientY } = e;
            window.tb.contextmenu.create({
                x: clientX - 10,
                y: clientY - 150,
                options: [
                    { text: "New Window", click: () => {
                        windowStore.addWindow({
                            src: src,
                            icon: typeof icon === 'string' ? icon : undefined,
                            size: size,
                            title: title,
                            proxy: proxy,
                            snapable: snapable
                        });
                    } },
                    { text: "Pin", click: () => {
                        window.tb.desktop.dock.pin({
                            src: src,
                            icon: typeof icon === 'string' ? icon : undefined,
                            size: size,
                            title: title,
                            snapable: snapable
                        })
                    } },
                    { text: "Close", click: () => {
                        window.tb.process.kill(pid)
                    } }
                ]
            })
        }}>
            {
                typeof icon === "undefined" || icon === null ? <img src={"/assets/img/null.svg"} alt={title} className="w-7 h-7 flex items-center justify-center pointer-events-none" /> :
                typeof icon === "string" ? <img src={icon} alt={title} className="w-7 h-7 flex items-center justify-center pointer-events-none" /> : <div className="w-7 h-7 flex items-center justify-center pointer-events-none">{icon}</div>
            }
        </dock-item>
    );
}

const PinnedDockItem: FC<TDockItem> = ({ className, icon, title, src, onClick, onContextMenu, size, snapable, proxy }) => {
    const windowStore = useWindowStore();
    return (
        // @ts-expect-error
        <dock-item class={className ? className + " cursor-pointer p-1 hover:bg-[#ffffff28] rounded-md duration-100 ease-in select-none" : "cursor-pointer p-1 hover:bg-[#ffffff28] rounded-md duration-100 ease-in select-none"} onContextMenu={() => {return}} title={title}
        onClick={() => {
            onClick?.(new MouseEvent('click'));
            windowStore.addWindow({
                src: src,
                icon: typeof icon === 'string' ? icon : undefined,
                size: size,
                title: title,
                proxy: proxy,
                snapable: snapable
            });
        }} onContextMenuCapture={(e: React.MouseEvent) => {
            e.preventDefault();
            onContextMenu?.(new MouseEvent('contextmenu'));
            const { clientX, clientY } = e;
            window.tb.contextmenu.create({
                x: clientX - 10,
                y: clientY - 100,
                options: [
                    { text: "New Window", click: () => {
                        windowStore.addWindow({
                            src: src,
                            icon: typeof icon === 'string' ? icon : undefined,
                            size: size,
                            title: title,
                            proxy: proxy,
                            snapable: snapable
                        });
                    } },
                    { text: "Unpin from Dock", click: () => {
                        window.tb.desktop.dock.unpin(title)
                    } },
                ]
            })
        }}>
            {
                typeof icon === "undefined" || icon === null ? <img src={"/assets/img/null.svg"} alt={title} className="w-7 h-7 flex items-center justify-center pointer-events-none" /> :
                typeof icon === "string" ? <img src={icon} alt={title} className="w-7 h-7 flex items-center justify-center pointer-events-none" /> : <div className="w-7 h-7 flex items-center justify-center pointer-events-none">{icon}</div>
            }
        </dock-item>
    );
}

const StartItem: FC<TStartItem> = ({ icon, title, onClick, inPins, className, src }) => {
    // @ts-expect-error
    const chars = typeof title === 'string' ? title.split("") : title?.text.split("");
    const [resolvedIcon, setResolvedIcon] = useState<string | boolean | undefined>(false);
    let sysapps = [
        { "title": "Terminal" },
        { "title": "Files" },
        { "title": "Settings" },
        { "title": { "text": "App Store" } },
        { "title": "Browser" },
        { "title": "Calculator" },
        { "title": "Feedback" },
        { "title": "About" },
        { "title": "Text Editor" },
        { "title": "Task Manager" },
        { "title": "Anura File Manager" }
    ];
    // @ts-expect-error
    const isSystemApp = sysapps.map(app => typeof app.title === 'string' ? app.title : app.title.text).includes(typeof title === 'string' ? title : title?.text);

    useEffect(() => {
        const checkIcon = async (icon: string | ReactNode | null) => {
            if (typeof icon === "undefined" || icon === null) {
                setResolvedIcon(false);
            } else if (typeof icon === "string") {
                setResolvedIcon(true);
                if(icon.startsWith("/")) {
                    let origin: string
                    let path: string
                    let url: string
                    if(icon.match(isURL)) {
                        url = icon;
                    } else {
                        origin = window.location.origin;
                        path = icon.startsWith("/") ? icon : `/${icon}`;
                        url = `${origin}${path}`;
                    }
                    try {
                        const response = await fetch(url);
                        const data = await response.text();
                        if (!data.startsWith("<!")) {
                            setResolvedIcon(true);
                        } else {
                            setResolvedIcon(false);
                        }
                    } catch {
                        setResolvedIcon(false);
                    }
                }
            } else {
                setResolvedIcon(false);
            }
        }
        checkIcon(icon);
    }, [icon]);

    return (
        inPins ? (
            <div className={`${className ? className : ""} group p-2 pr-2.5 gap-4 flex justify-between items-center hover:bg-[#ffffff28] hover:shadow-tb-border duration-150 cursor-pointer w-full`} onClick={() => onClick?.(new MouseEvent("click"))} onContextMenu={(e: React.MouseEvent) => {
                e.preventDefault();
                const { clientX, clientY } = e;
                console.log(src, src?.replace("/fs", "").replace(/\/[^/]+\.html$/, "/").replace(/\/\.\//, "/"))
                window.tb.contextmenu.create({
                    x: clientX - 10,
                    y: clientY - 150,
                    options: [
                        { text: "Open", click: () => {
                            onClick?.(new MouseEvent("click"))
                        } },
                        { text: "Pin to Dock", click: () => {
                            window.tb.desktop.dock.pin({
                                src: src,
                                icon: typeof icon === 'string' ? icon : undefined,
                                title: title,
                            })
                        } },
                        { text: "Unpin from Start", click: async () => {
                            const apps: any = JSON.parse(await Filer.promises.readFile("/system/var/terbium/start.json", "utf8"));
                            apps.pinned_apps = apps.pinned_apps.filter((app: any) =>
                                !(app.title === title && app.icon === icon)
                            );
                            await Filer.promises.writeFile("/system/var/terbium/start.json", JSON.stringify(apps, null, 2));
                            window.dispatchEvent(new Event("updApps"));
                        } },
                        // @ts-expect-error
                        ...(isSystemApp ? [] : [{ text: "Uninstall", click: async () => { await (new Filer.Shell()).promises.rm(src?.replace("/fs", "").replace(/\/[^/]+\.html$/, "/").replace(/\/\.\//, "/"), { recursive: true }); await window.tb.launcher.removeApp(chars); window.dispatchEvent(new Event("updApps")) } }])
                    ]
                })
            }}>
                <div className="flex gap-2 items-center">
                    {
                        // @ts-expect-error
                        resolvedIcon === true ? <img src={icon} className="w-7 h-7 flex items-center justify-center" /> : <div className="w-7 h-7 flex items-center justify-center">{<PuzzlePieceIcon className="size-7"/>}</div>
                    }
                    <span className="text-white font-[680]">{chars.length > 10 ? chars.slice(0, 10).join("") + "..." : chars.join("")}</span>
                </div>
                <ChevronRightIcon onClick={async () => {
                    const apps: any = JSON.parse(await Filer.promises.readFile("/system/var/terbium/start.json", "utf8"));
                    apps.pinned_apps = apps.pinned_apps.filter((app: any) => 
                        !(app.title === title && app.icon === icon)
                    );
                    await Filer.promises.writeFile("/system/var/terbium/start.json", JSON.stringify(apps, null, 2));
                    window.dispatchEvent(new Event("updApps"));
                }} className="size-7 bg-[#ffffff18] backdrop-blur-[20px] shadow-tb-border-shadow p-1.5 rounded-full text-white stroke-current stroke-[3px] opacity-0 group-hover:opacity-100 duration-150 ease-in" />
            </div>
        ) : (
            <div className={`${className ? className : ""} group p-2 pr-2.5 gap-2 flex justify-between items-center hover:bg-[#ffffff28] hover:shadow-tb-border duration-150 cursor-pointer rounded-lg w-full`} onClick={(e: React.MouseEvent) => {
                if(e.button === 0)
                onClick?.(new MouseEvent("click"))
            }} onContextMenu={async (e: React.MouseEvent) => {
                e.preventDefault();
                const { clientX, clientY } = e;
                const appsStart: any = JSON.parse(await Filer.promises.readFile("/system/var/terbium/start.json", "utf8"));
                const appsDock: any = JSON.parse(await Filer.promises.readFile("/system/var/terbium/dock.json", "utf8"));
                const isPinnedStart = appsStart.pinned_apps.some((app: any) => app.title === title && app.icon === icon);
                const isPinnedDock = appsDock.some((app: any) => app.src === src && app.icon === icon);
                window.tb.contextmenu.create({
                    x: clientX - 10,
                    y: clientY - 150,
                    options: [
                        { text: "Open", click: () => {
                            onClick?.(new MouseEvent("click"))
                        } },
                        isPinnedDock ? { text: "Unpin from Dock", click: () => {
                            window.tb.desktop.dock.unpin(title)
                        } } : { text: "Pin to Dock", click: () => {
                            window.tb.desktop.dock.pin({
                                src: src,
                                icon: typeof icon === 'string' ? icon : undefined,
                                title: title,
                            })
                        } },
                        isPinnedStart ? { text: "Unpin from Start", click: async () => {
                            const apps: any = JSON.parse(await Filer.promises.readFile("/system/var/terbium/start.json", "utf8"));
                            apps.pinned_apps = apps.pinned_apps.filter((app: any) =>
                                !(app.title === title && app.icon === icon)
                            );
                            await Filer.promises.writeFile("/system/var/terbium/start.json", JSON.stringify(apps, null, 2));
                            window.dispatchEvent(new Event("updApps"));
                        } } :
                        { text: "Pin to Start", click: async () => {
                            const path = src?.replace("/fs", "").replace(/\/[^/]+\.html$/, "/").replace(/\/\.\//, "/");
                            const appConfig = JSON.parse(await Filer.promises.readFile(path + "index.json", "utf8"));
                            if (appsStart.pinned_apps.some((app: any) => app.title === appConfig.config.title && app.icon === appConfig.config.icon)) {
                                return;
                            }
                            appsStart.pinned_apps.push(appConfig.config);
                            await Filer.promises.writeFile("/system/var/terbium/start.json", JSON.stringify(appsStart, null, 2));
                            window.dispatchEvent(new Event("updApps"));
                        } },
                        // @ts-expect-error
                        ...(isSystemApp ? [] : [{ text: "Uninstall", click: async () => { await (new Filer.Shell()).promises.rm(src?.replace("/fs", "").replace(/\/[^/]+\.html$/, "/").replace(/\/\.\//, "/"), { recursive: true }); await window.tb.launcher.removeApp(chars); window.dispatchEvent(new Event("updApps")) } }])
                    ]
                })
            }}>
                <div className="flex gap-2 items-center">
                    {
                        // @ts-expect-error
                        resolvedIcon === true ? <img src={icon} className="w-7 h-7 flex items-center justify-center" /> : <div className="w-7 h-7 flex items-center justify-center">{<PuzzlePieceIcon className="size-7"/>}</div>
                    }
                    <span className="text-white font-[680]">{chars.length > 10 ? chars.slice(0, 10).join("") + "..." : chars.join("")}</span>
                </div>
                <ChevronRightIcon onClick={async () => {
                    const apps: any = JSON.parse(await Filer.promises.readFile("/system/var/terbium/start.json", "utf8"));
                    apps.pinned_apps.push({
                        title: title,
                        icon: icon,
                        src: src
                    });
                    await Filer.promises.writeFile("/system/var/terbium/start.json", JSON.stringify(apps, null, 2));
                    window.dispatchEvent(new Event("updApps"));
                }} className="size-7 bg-[#ffffff18] backdrop-blur-[20px] shadow-tb-border-shadow p-1.5 rounded-full text-white stroke-current stroke-[3px] opacity-0 group-hover:opacity-100 duration-150 ease-in" />
            </div>
        )
    )
}

export default Dock