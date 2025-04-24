import Mediaisland from "../apis/Mediaisland";
import Battery from "./Battery";
import "./styles/shell.css"
import Wifi from "./Wifi";
import getTime from "../apis/Time";
import { useEffect, useState, useRef } from "react";
import Weather from "./Weather";
import NotificationCenter from "./NotificationCenter";
import AppIsland from "./AppIsland";
import Power from "./Power";

const Shell = () => {
    const [time, setTime] = useState<number>(0)
    const [username, setUsername] = useState<string>("");
    const [pfp, setPfp] = useState<string>("");
    const accountRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // @ts-expect-error
        const int = setInterval(() => {setTime(getTime())}, 100);
        return () => clearInterval(int);
    }, [])
    useEffect(() => {
        const getUserInfo = async () => {
            const user = window.sessionStorage.getItem("currAcc");
            const res = JSON.parse(await Filer.fs.promises.readFile(`/home/${user}/user.json`, "utf8"));
            setUsername(res.username);
            setPfp(res.pfp);
        }
        getUserInfo();
        window.addEventListener("accUpd", getUserInfo);
        return () => window.removeEventListener("accUpd", getUserInfo);
    })
    return (
        <div className="shell flex z-100 w-full gap-[6px] text-[#5f5f5f] px-1.5 py-0.5 justify-between">
            <div className="islands_left relative flex gap-[6px] items-center">
                <AppIsland />
                <Mediaisland />
            </div>
            <div className="islands_right flex gap-[6px] items-center">
                <div className="island py-1 pl-1 p-2.5 gap-[6px] rounded-lg select-none" style={{backgroundImage: "url(/assets/img/grain.png)"}}>
                    <div ref={accountRef} className="flex gap-1.5 p-1.5 hover:bg-[#ffffff1f] rounded-[5px] cursor-pointer duration-150" onMouseUp={() => {
                        accountRef.current?.classList.remove("scale-[0.96]")
                        window.tb.window.create({
                            title: "Settings",
                            src: "/apps/settings.tapp/index.html",
                            icon: "/apps/settings.tapp/icon.svg",
                            single: true,
                            message: JSON.stringify({page: "privacy"})
                        })
                    }} onMouseLeave={() => {
                        accountRef.current?.classList.remove("scale-[0.96]")
                    }} onMouseOver={() => {
                        accountRef.current?.classList.add("scale-[0.96]")
                    }} onMouseDown={() => {
                        accountRef.current?.classList.add("scale-[0.96]")
                    }}>
                        {pfp && <img className="size-6 rounded-full select-none pointer-events-none" src={pfp} alt={username} />}
                        <div className="font-extrabold select-none pointer-events-none">{username}</div>
                    </div>
                    <span className="h-6 w-1 bg-[#ffffff48] rounded-xs mr-0.5"></span>
                    <div className="weather font-[700] cursor-default">
                        <Weather />
                    </div>
                    <div className="time font-[700] cursor-default">{time}</div>
                </div>
                <div className="island system_island gap-3 pl-2.5 pr-1.5 py-1.5 rounded-lg" style={{backgroundImage: "url(/assets/img/grain.png)"}}>
                    <Power />
                    <Wifi />
                    <NotificationCenter />
                    <Battery />
                    {/* Desktop */}
                    <div className="show_desk bg-[#ffffff3e] h-[calc(48px-16px)] w-4 rounded-[5px] cursor-pointer" onClick={() => window.dispatchEvent(new Event('min-wins'))}></div>
                </div>
            </div>
        </div>
    )
}

export default Shell;