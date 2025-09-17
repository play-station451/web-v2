const icons = await (await fetch(localPathToURL("icons.json"))).json();

export function openFile(path) {
    const fs = anura.fs || tb.fs;
    function openImage(path, mimetype) {
        fs.readFile(path, function (err, data) {
            tb.file.handler.openFile(path, 'image')
        });
    }

    function openPDF(path) {
        fs.readFile(path, function (err, data) {
            tb.file.handler.openFile(path, 'pdf')
        });
    }

    function openAudio(path, mimetype) {
        fs.readFile(path, function (err, data) {
            tb.file.handler.openFile(path, 'audio')
        });
    }
    function openVideo(path, mimetype) {
        fs.readFile(path, function (err, data) {
            tb.file.handler.openFile(path, 'video')
        });
    }

    function openText(path) {
        fs.readFile(path, function (err, data) {
            tb.file.handler.openFile(path, 'text')
        });
    }

    function openHTML(path) {
        fs.readFile(path, function (err, data) {
            tb.file.handler.openFile(path, 'webpage')
        });
    }

    let ext = path.split(".").slice("-1")[0];
    switch (ext) {
        case "txt":
        case "js":
        case "mjs":
        case "cjs":
        case "json":
        case "css":
            openText(path);
            break;
        case "ajs":
            anura.processes.execute(path);
            break;
        case "mp3":
            openAudio(path, "audio/mpeg");
            break;
        case "flac":
            openAudio(path, "audio/flac");
            break;
        case "wav":
            openAudio(path, "audio/wav");
            break;
        case "ogg":
            openAudio(path, "audio/ogg");
            break;
        case "mp4":
            openVideo(path, "video/mp4");
            break;
        case "mov":
            openVideo(path, "video/mp4");
            break;
        case "webm":
            openVideo(path, "video/webm");
            break;
        case "gif":
            openImage(path, "image/gif");
            break;
        case "png":
            openImage(path, "image/png");
            break;
        case "svg":
            openImage(path, "image/svg+xml");
            break;
        case "jpg":
        case "jpeg":
            openImage(path, "image/jpeg");
            break;
        case "pdf":
            openPDF(path);
            break;
        case "html":
            openHTML(path);
            break;
        default:
            openText(path);
            break;
    }
}

export function getIcon(path) {
    let ext = path.split(".").slice("-1")[0];
    let iconObject = icons.files.find((icon) => icon.ext == ext);
    if (iconObject) {
        return localPathToURL(iconObject.icon);
    }
    return localPathToURL(icons.default);
}

export function getFileType(path) {
    let ext = path.split(".").slice("-1")[0];
    let iconObject = icons.files.find((icon) => icon.ext == ext);
    if (iconObject) {
        return iconObject.type;
    }
    return "Anura File";
}

function localPathToURL(path) {
    return (
        import.meta.url.substring(0, import.meta.url.lastIndexOf("/")) +
        "/" +
        path
    );
}
