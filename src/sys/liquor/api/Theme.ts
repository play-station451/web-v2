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
let settings: ThemeProps;

(async () => {
    try {
        const data = await Filer.fs.promises.readFile("/system/etc/anura/theme.json", "utf8");
        settings = JSON.parse(data);
    } catch (err) {
        console.error("Error reading theme settings:", err);
    }
})();

export class Theme implements ThemeProps {
    get foreground() {
        return settings.foreground;
    }

    set foreground(value) {
        Filer.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
            if (err) {
                console.error(err);
                return;
            }
            const settings: ThemeProps = JSON.parse(data.toString());
            settings.foreground = value;
            Filer.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
        });
    }

    get secondaryForeground() {
        return settings.secondaryForeground;
    }

    set secondaryForeground(value) {
        Filer.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
            if (err) {
                console.error(err);
                return;
            }
            const settings: ThemeProps = JSON.parse(data.toString());
            settings.secondaryForeground = value;
            Filer.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
        });
    }

    get border() {
        return settings.border
    }

    set border(value) {
        Filer.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
            if (err) {
                console.error(err);
                return;
            }
            const settings: ThemeProps = JSON.parse(data.toString());
            settings.border = value;
            Filer.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
        });
    }

    get darkBorder() {
        return settings.darkBorder;
    }

    set darkBorder(value) {
        Filer.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
            if (err) {
                console.error(err);
                return;
            }
            const settings: ThemeProps = JSON.parse(data.toString());
            settings.darkBorder = value;
            Filer.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
        });
    }

    get background() {
        return settings.background;
    }

    set background(value) {
        Filer.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
            if (err) {
                console.error(err);
                return;
            }
            const settings: ThemeProps = JSON.parse(data.toString());
            settings.background = value;
            Filer.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
        });
    }

    get secondaryBackground() {
        return settings.secondaryBackground;
    }

    set secondaryBackground(value) {
        Filer.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
            if (err) {
                console.error(err);
                return;
            }
            const settings: ThemeProps = JSON.parse(data.toString());
            settings.secondaryBackground = value;
            Filer.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
        });
    }

    get darkBackground() {
        return settings.darkBackground;
    }

    set darkBackground(value) {
        Filer.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
            if (err) {
                console.error(err);
                return;
            }
            const settings: ThemeProps = JSON.parse(data.toString());
            settings.darkBackground = value;
            Filer.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
        });
    }

    get accent() {
        return settings.accent;
    }

    set accent(value) {
        Filer.fs.readFile("/system/etc/anura/theme.json", (err: Error | null, data: Uint8Array) => {
            if (err) {
                console.error(err);
                return;
            }
            const settings: ThemeProps = JSON.parse(data.toString());
            settings.accent = value;
            Filer.fs.writeFile("/system/etc/anura/theme.json", JSON.stringify(settings));
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

    state: ThemeProps = settings;

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
        this.foreground = "#ffffff",
        this.secondaryForeground = "#ffffff38",
        this.border = "#ffffff28",
        this.darkBorder = "#333333",
        this.background = "#0e0e0e",
        this.secondaryBackground = "#383838",
        this.darkBackground = "#161616",
        this.accent = "#32ae62"
    }
}