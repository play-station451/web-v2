import { Notification } from "./notification";
import { BrowserWindow } from "./window";
import { Dialog } from "./dialog";

export class Lemonade {
    static get version(): string {
        return "1.0.0";
    }

    Notification = Notification
    BrowserWindow = BrowserWindow
    dialog = new Dialog
}