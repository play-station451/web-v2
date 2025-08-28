import { Theme } from "./Theme";

export class AnuraUI {
	/**
	 * This map contains all the built-in components that have been registered.
	 */
	builtins = new Map<string, any>();

	/**
	 * This map contains all the components that have been registered from external libraries.
	 */
	components = new Map<string, { lib: string; name: string }>();

	theme = new Theme();

	/**
	 * This function allows you to register a component to the built-in components registry.
	 * @param component - The name of the component to register.
	 * @param element - A function component that returns an HTMLElement.
	 */
	async registerComponent(component: string, element: HTMLDivElement): Promise<void> {
		this.builtins.set(component, element);
	}
	/**
	 * This function allows you to register a component from an external library.
	 * @param lib - The name of the library to import the component from.
	 * @param component - The name of the component to register.
	 * @param version - (Optional) The version of the library to import the component from.
	 */
	async registerExternalComponent(lib: string, component: string, version?: string): Promise<any> {
		if (version) {
			lib += `@${version}`;
		}

		this.components.set(component, {
			lib,
			name: component,
		});

		window.anura.settings.set("anura.ui.components", Array.from(this.components.entries()));
	}

	/**
	 * This function allows you to import a component, whether it is a built-in component or a component from a library.
	 * @param name - The name of the component to import.
	 * @returns A promise that resolves to a function component that returns an HTMLElement.
	 */
	async get(name: string): Promise<any> {
		const comp = this.components.get(name);

		if (!comp) {
			if (this.builtins.has(name)) {
				return this.builtins.get(name)!;
			}
			throw new Error("Component not registered");
		}

		const [lib, scope_name] = [comp.lib, comp.name];

		const library = await window.anura.import(lib);

		return library[scope_name];
	}

	/**
	 * This function allows you to check if a component is registered.
	 * @param component - The name of the component to check.
	 * @returns Whether the component is registered or not.
	 */
	exists(component: string): boolean {
		return this.components.has(component) || this.builtins.has(component);
	}

	async use(components: string[] | string | "*" = []): Promise<{ [key: string]: any }> {
		const result: {
			[key: string]: any;
		} = {};

		if (components === "*") {
			components = Array.from(this.components.keys()).concat(Array.from(this.builtins.keys()));
		}

		if (typeof components === "string") {
			components = [components];
		}

		for (const component of components) {
			result[component] = await this.get(component);
		}

		return result;
	}

	/**
	 * Install internal components
	 */
	init() {
		const components = window.anura.settings.get("anura.ui.components");

		if (components) {
			try {
				this.components = new Map(components);
			} catch (_e) {
				this.components = new Map();
			}
		}

		// API stub, Rest will not be implemented
	}
}
