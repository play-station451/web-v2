import { setDialogFn } from "../../apis/Dialogs";
export class Dialog {
    alert(message: string, title = "Alert") {
        // @ts-expect-error types
        setDialogFn("alert", {
            message: message,
            title: title
        })
    }
    async confirm(message: string, title = "Confirmation"): Promise<boolean> {
        return new Promise((resolve) => {
            setDialogFn("permissions", {
                message: message,
                title: title,
                onOk: () => {
                    resolve(true);
                },
                onCancel: () => {
                    resolve(false);
                }
            })
        })
    }
    async prompt(message: string, defaultValue?: any): Promise<any> {
        return new Promise((resolve) => {
            setDialogFn("message", {
                title: message,
                message: defaultValue,
                onOk: (val: any) => {
                    resolve(val);
                }
            })
        })
    }
}