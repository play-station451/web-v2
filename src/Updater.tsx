import { useEffect, useState, useRef } from "react";
import { dirExists, fileExists } from "./sys/types";
import { hash } from "./hash.json";
import paths from "./installer.json";

export default function Updater() {
    const [progress, setProgress] = useState(0);
    const statusref = useRef<HTMLDivElement>(null);

    async function copyDir(inp: string, dest: string, rn?: boolean) {
        if (rn === true) {
            if (!await dirExists(dest)) {
                await Filer.fs.promises.mkdir(dest);
            }
        }
        const files = await Filer.fs.promises.readdir(inp);
        const totalFiles = files.length;
        for (const [index, file] of files.entries()) {
            const stats = await Filer.fs.promises.stat(`${inp}/${file}`);
            if (stats.isDirectory()) {
                await Filer.fs.promises.mkdir(`${dest}/${file}`);
                await copyDir(`${inp}/${file}`, `${dest}/${file}`, true);
            } else {
                await Filer.fs.promises.writeFile(`${dest}/${file}`, await Filer.fs.promises.readFile(`${inp}/${file}`, "utf8"));
            }
            statusref.current!.innerText = `Creating a copy of: ${file}...`;
            setProgress(Math.floor(((index + 1) / totalFiles) * 100));
        }
    }

    useEffect(() => {
        const main = async () => {
            let sysapps = [
                "about.tapp", "app store.tapp", "browser.tapp", "calculator.tapp", "feedback.tapp", "files.tapp", "media viewer.tapp", "settings.tapp", "task manager.tapp", "terminal.tapp", "text editor.tapp"
            ]
            if (await dirExists("/system/tmp/terb-upd/")) {
                // @ts-expect-error
                await (new Filer.fs.Shell()).promises.rm(`/system/tmp/terb-upd/`, {recursive: true})
            }
            statusref.current!.innerText = "Installing latest version of TB..."
            await Filer.fs.promises.mkdir("/system/tmp/terb-upd/")
            const apps = await Filer.fs.promises.readdir("/apps/system/")
            setProgress(20);
            statusref.current!.innerText = "Creating a backup";
            if (await fileExists("/apps/system/settings.tapp/wisp-servers.json")) {
                await Filer.fs.promises.writeFile("/system/tmp/terb-upd/wisp-servers.json", await Filer.fs.promises.readFile("/apps/system/settings.tapp/wisp-servers.json"))
            } else {
                const stockDat = [
                    { "id": `${location.protocol.replace("http", "ws")}//${location.hostname}:${location.port}/wisp/`, "name": "Backend" },
                    { "id": "wss://wisp.terbiumon.top/wisp/", "name": "TB Wisp Instance" }
                ];
                await Filer.fs.promises.writeFile('/system/tmp/terb-upd/wisp-servers.json', JSON.stringify(stockDat));
            }
            for (const item of apps) {
                setProgress(prevProgress => prevProgress + 1);
                if (sysapps.includes(item)) {
                    await copyDir(`/apps/system/${item}/`, `/system/tmp/terb-upd/${item}.old`, true);
                    // @ts-expect-error
                    await (new Filer.fs.Shell()).promises.rm(`/apps/system/${item}/`, {recursive: true});
                } else {
                    console.log(`Skipping ${item}...`);
                }
            }
            setProgress(50);
            statusref.current!.innerText = "Updating Terbium...";
            setProgress(0);
            for (const item of paths) {
                setProgress(prevProgress => prevProgress + 1);
                statusref.current!.innerText = `Installing ${item}...`;
                const isDir = item.toString().endsWith("/");
                if (isDir) {
                    try {
                        // @ts-expect-error
                        await Filer.fs.promises.mkdir(`/apps/system/${item.toString()}`, { recursive: true });
                    } catch (err) {
                        console.error(err);
                    }
                } else {
                    const path = `/apps/system/${item.toString()}`;
                    const dir = path.substring(0, path.lastIndexOf('/'));
                    try {
                        if (!(await dirExists(dir))) {
                            // @ts-expect-error
                            await Filer.fs.promises.mkdir(dir, { recursive: true });
                        }
                        const res = await fetch(`/apps/${item.toString()}`);
                        const data = await res.text();
                        await Filer.fs.promises.writeFile(path, data);
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
            await Filer.fs.promises.writeFile("/apps/system/settings.tapp/wisp-servers.json", await Filer.fs.promises.readFile("/system/tmp/terb-upd/wisp-servers.json"))
            await Filer.fs.promises.writeFile("/system/etc/terbium/hash.cache", hash);
            setProgress(80);
            statusref.current!.innerText = "Cleaning up...";
            setProgress(95);
            // @ts-expect-error
            await (new Filer.fs.Shell()).promises.rm(`/system/tmp/terb-upd/`, {recursive: true})
            setProgress(100);
            statusref.current!.innerText = "Restarting...";
            window.location.reload();
        }
        main();
    }, []);

    return (
        <div className="bg-[#0e0e0e] h-full justify-center items-center flex flex-col lg:h-full md:h-full">
            <img src="/tb.svg" alt="Terbium" className="w-[25%] h-[25%]" />
            <div className="duration-150 flex flex-col justify-center items-center">
                <div className="text-container relative flex flex-col justify-center items-end">
                    <div className="bg-linear-to-b from-[#ffffff] to-[#ffffff77] text-transparent bg-clip-text flex flex-col lg:items-center md:items-center sm:items-center">
                        <span className="font-[700] lg:text-[34px] md:text-[28px] sm:text-[22px] text-right duration-150">
                            <span className="font-[1000] duration-150">Terbium is updating</span>
                        </span>
                        <br />
                        <p>Please DO NOT close this tab</p>
                    </div>
                </div>
            </div>
            <p ref={statusref} className="mt-1">Downloading Updates...</p>
            <div className="relative flex w-[30%] h-3 rounded-full bg-[#00000020] overflow-hidden mt-4">
                <div className="absolute h-full bg-[#50bf66] rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    )
}