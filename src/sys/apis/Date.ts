export function GetTime() {
	const date = new Date();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? "PM" : "AM";
	const formattedHours = hours % 12 || 12;
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
	const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
	return timeString;
}

export function GetDate() {
	const dateObj = new Date();
	const month = dateObj.getMonth();
	const day = dateObj.getDate();
	const year = dateObj.getFullYear();
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const output = `${days[dateObj.getDay()]} ${months[month]} ${day} ${year}`;
	return output;
}
