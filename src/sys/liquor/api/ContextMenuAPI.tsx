import "../../gui/styles/liquor.css";

export class ContextMenuAPI {
	element: HTMLDivElement;
	item(text: string, callback: VoidFunction) {
		const menuItem = document.createElement("div");
		menuItem.className = "custom-menu-item";
		menuItem.onclick = () => {
			callback();
		};
		menuItem.innerText = text;
		return menuItem;
	}
	isShown = false;
	constructor() {
		this.element = document.createElement("div");
		this.element.className = "custom-menu";
		setTimeout(
			() =>
				document.addEventListener("click", event => {
					const withinBoundaries = event.composedPath().includes(this.element);

					if (!withinBoundaries) {
						this.element.remove();
					}
				}),
			100,
		);
	}
	removeAllItems() {
		this.element.innerHTML = "";
	}
	addItem(text: string, callback: VoidFunction) {
		this.element.appendChild(
			this.item(text, () => {
				this.hide();
				callback();
			}),
		);
	}
	show(x: number, y: number) {
		this.element.style.top = `${y.toString()}px`;
		this.element.style.left = `${x.toString()}px`;
		document.body.appendChild(this.element);
		this.isShown = true;
		this.element.focus();
		return this.element;
	}
	hide() {
		if (this.isShown) {
			document.body.removeChild(this.element);
			this.isShown = false;
		}
	}
}
