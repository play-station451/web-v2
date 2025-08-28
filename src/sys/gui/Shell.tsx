import Mediaisland from "../apis/Mediaisland";
import Battery from "./Battery";
import "./styles/shell.css";
import Wifi from "./Wifi";
import getTime from "../apis/Time";
import { useEffect, useState } from "react";
import Weather from "./Weather";
import NotificationCenter from "./NotificationCenter";
import AppIsland from "./AppIsland";
import Power from "./Power";

const Shell = () => {
	const [time, setTime] = useState<number>(0);
	useEffect(() => {
		const int = setInterval(() => {
			// @ts-expect-error
			setTime(getTime());
		}, 100);
		return () => clearInterval(int);
	}, []);
	return (
		<div className="shell flex z-100 w-full gap-[6px] text-[#5f5f5f] px-1.5 py-0.5 justify-between">
			<div className="islands_left relative flex gap-[6px] items-center">
				<AppIsland />
				<Mediaisland />
			</div>
			<div className="islands_right flex gap-[6px] items-center">
				<div className="island p-2.5 gap-[6px] rounded-lg select-none" style={{ backgroundImage: "url(/assets/img/grain.png)" }}>
					<div className="weather font-[700] cursor-default">
						<Weather />
					</div>
					<div className="time font-[700] cursor-default">{time}</div>
				</div>
				<div className="island system_island gap-3 pl-2.5 pr-1.5 py-1.5 rounded-lg" style={{ backgroundImage: "url(/assets/img/grain.png)" }}>
					<Power />
					<Wifi />
					<NotificationCenter />
					<Battery />
					{/* Desktop */}
					<div className="show_desk bg-[#ffffff3e] h-[calc(48px-16px)] w-4 rounded-[5px] cursor-pointer" onClick={() => window.dispatchEvent(new Event("min-wins"))}></div>
				</div>
			</div>
		</div>
	);
};

export default Shell;
