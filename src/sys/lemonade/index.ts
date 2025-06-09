import { Notification } from "./notification";
import { BrowserWindow } from "./window";
import { Dialog } from "./dialog";
import { Net } from "./net";

export class Lemonade {
    get version(): string {
        return "1.0.0";
    }

    Notification = Notification
    BrowserWindow = BrowserWindow
    dialog = new Dialog
    net = new Net
}