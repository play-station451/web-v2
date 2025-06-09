import { Notification } from "./notification";

export class Lemonade {
    static get version(): string {
        return "1.0.0";
    }

    notification = Notification
}