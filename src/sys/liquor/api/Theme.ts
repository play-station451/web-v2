interface ThemeProps {
	foreground: string;
	secondaryForeground: string;
	border: string;
	darkBorder: string;
	background: string | any;
	secondaryBackground: string;
	darkBackground: string;
	accent: string | any;
}

export class Theme implements ThemeProps {
	// @ts-expect-error
	settings: ThemeProps = {};

	constructor() {
		window.tb.fs.promises.readFile("/system/etc/anura/theme.json", "utf8")
			.then((data: string) => {
				this.settings = JSON.parse(data);
			})
			.catch((err: any) => {
				if (localStorage.getItem("setup")) console.warn("Error reading theme settings:", err);
			});
	}

	get foreground() {
		return this.settings.foreground;
	}

	set foreground(value) {
		window.tb.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
			if (err) {
				console.error(err);
				return;
			}
			const settings: ThemeProps = JSON.parse(data.toString());
			settings.foreground = value;
			window.tb.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
		});
	}

	get secondaryForeground() {
		return this.settings.secondaryForeground;
	}

	set secondaryForeground(value) {
		window.tb.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
			if (err) {
				console.error(err);
				return;
			}
			const settings: ThemeProps = JSON.parse(data.toString());
			settings.secondaryForeground = value;
			window.tb.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
		});
	}

	get border() {
		return this.settings.border;
	}

	set border(value) {
		window.tb.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
			if (err) {
				console.error(err);
				return;
			}
			const settings: ThemeProps = JSON.parse(data.toString());
			settings.border = value;
			window.tb.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
		});
	}

	get darkBorder() {
		return this.settings.darkBorder;
	}

	set darkBorder(value) {
		window.tb.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
			if (err) {
				console.error(err);
				return;
			}
			const settings: ThemeProps = JSON.parse(data.toString());
			settings.darkBorder = value;
			window.tb.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
		});
	}

	get background() {
		return this.settings.background;
	}

	set background(value) {
		window.tb.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
			if (err) {
				console.error(err);
				return;
			}
			const settings: ThemeProps = JSON.parse(data.toString());
			settings.background = value;
			window.tb.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
		});
	}

	get secondaryBackground() {
		return this.settings.secondaryBackground;
	}

	set secondaryBackground(value) {
		window.tb.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
			if (err) {
				console.error(err);
				return;
			}
			const settings: ThemeProps = JSON.parse(data.toString());
			settings.secondaryBackground = value;
			window.tb.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
		});
	}

	get darkBackground() {
		return this.settings.darkBackground;
	}

	set darkBackground(value) {
		window.tb.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
			if (err) {
				console.error(err);
				return;
			}
			const settings: ThemeProps = JSON.parse(data.toString());
			settings.darkBackground = value;
			window.tb.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
		});
	}

	get accent() {
		return this.settings.accent;
	}

	set accent(value) {
		window.tb.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
			if (err) {
				console.error(err);
				return;
			}
			const settings: ThemeProps = JSON.parse(data.toString());
			settings.accent = value;
			window.tb.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
		});
	}

	cssPropMap: Record<keyof ThemeProps, string[]> = {
		background: ["--theme-bg", "--material-bg"],
		border: ["--theme-border", "--material-border"],
		darkBorder: ["--theme-dark-border"],
		foreground: ["--theme-fg"],
		secondaryBackground: ["--theme-secondary-bg"],
		secondaryForeground: ["--theme-secondary-fg"],
		darkBackground: ["--theme-dark-bg"],
		accent: ["--theme-accent", "--matter-helper-theme"],
	};

	state: ThemeProps = this.settings;

	css(): string {
		const lines = [];
		lines.push(":root {");
		for (const key in this.state) {
			for (const prop of this.cssPropMap[key as keyof ThemeProps]) {
				lines.push(`  ${prop}: ${this.state[key as keyof ThemeProps]};`);
			}
		}
		lines.push("}");
		return lines.join("\n");
	}

	reset() {
		(this.foreground = "#ffffff"), (this.secondaryForeground = "#ffffff38"), (this.border = "#ffffff28"), (this.darkBorder = "#333333"), (this.background = "#0e0e0e"), (this.secondaryBackground = "#383838"), (this.darkBackground = "#161616"), (this.accent = "#32ae62");
	}
}
