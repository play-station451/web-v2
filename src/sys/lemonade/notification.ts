interface NotificationOptions {
	title: string;
	subtitle: string;
	body: string;
	silent: boolean;
	icon: string;
}

type NotificationEvent = "click";

export class Notification {
	private eventHandlers: { [K in NotificationEvent]?: ((...args: any[]) => void)[] } = {};

	static isSupported(): boolean {
		return true;
	}

	constructor(options: NotificationOptions) {
		window.tb.notification.Toast({
			message: options.body,
			iconSrc: options.icon || "/assets/img/logo.png",
			application: options.title || "Lemonade Communicator",
			onOk: (...args: any[]) => {
				this.emit("click", ...args);
			},
		});
	}

	on(event: NotificationEvent, handler: (...args: any[]) => void): void {
		if (!this.eventHandlers[event]) {
			this.eventHandlers[event] = [];
		}
		this.eventHandlers[event]!.push(handler);
	}

	off(event: NotificationEvent, handler: (...args: any[]) => void): void {
		const handlers = this.eventHandlers[event];
		if (handlers) {
			this.eventHandlers[event] = handlers.filter(h => h !== handler);
		}
	}

	private emit(event: NotificationEvent, ...args: any[]): void {
		const handlers = this.eventHandlers[event];
		if (handlers) {
			handlers.forEach(handler => handler(...args));
		}
	}

	show(): string {
		return "API Stub";
	}

	close(): string {
		return "API Stub";
	}
}
