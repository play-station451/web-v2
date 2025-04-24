export function selectFile(options) {
    return new Promise(async (resolve, reject) => {
        await window.tb.dialog.FileBrowser({
            title: "Select a File",
            onOk: async (val) => {
                resolve(val)
            },
            onCancel: () => {
                reject('User Rejected')
            }
        })
    })
}

export function selectFolder(options) {
    return new Promise(async (resolve, reject) => {
        await window.tb.dialog.DirectoryBrowser({
            title: "Select a Directory",
            onOk: async (val) => {
                resolve(val)
            },
            onCancel: () => {
                reject('User Rejected')
            }
        })
    })
}
