async function sysfetch(args) {
    if (args.includes('-v')) {
        displayOutput('Sysfetch v1.0.0');
        createNewCommandInput();
    } else {
        let accent = "#32ae62"
        let settings = JSON.parse(await Filer.fs.promises.readFile(`/home/${sessionStorage.getItem('currAcc')}/settings.json`, "utf8"));
        if(settings["accent"]) {
            accent = settings["accent"]
        }
        displayOutput("(%^33)" + "    %cSystem Information", "color: #3cc3f0; font-weight: bold; text-decoration: underline;");
        displayOutput("%c@@@@@@@@@@@@@@~ B@@@@@@@@#G?." + "     %cOS%c: TerbiumOS v2.0.0", `color: ${accent}`, `color: ${accent}`, "color: #b6b6b6");
        displayOutput("%cB###&@@@@&####^ #@@@&PPPB@@@G." + "    %cKernel%c: Ayla v1.0.0", `color: ${accent}`, `color: ${accent}`, "color: #b6b6b6");
        displayOutput("%c    ~@@@@J     .#@@@P   ~&@@@^" + "    %cDE%c: Alexa", `color: ${accent}`, `color: ${accent}`, "color: #b6b6b6");
        displayOutput("%c    ^@@@@?     .#@@@@###&@@&7  ", `color: ${accent}`);
        displayOutput("%c    ^@@@@?     .#@@@#555P&@@B7" + "   %cHardware Information (estimated)", `color: ${accent}`, "color: #3cc3f0; font-weight: bold; text-decoration: underline;")
        await displayCPUInfo()
        await displayMemoryInfo();
        await getStorage();
        await displayGPUInfo();
        createNewCommandInput();
    }
}

async function displayCPUInfo() {
    let accent = "#32ae62"
    let settings = JSON.parse(await Filer.fs.promises.readFile(`/home/${sessionStorage.getItem('currAcc')}/settings.json`, "utf8"));
    if(settings["accent"]) {
        accent = settings["accent"]
    }
    let cpuCors = navigator.hardwareConcurrency
    let cpuInfo = "%c    ^@@@@?     .#@@@P    G@@@@" + "    %cCPU%c: " + cpuCors + " Logical Cores " + `(${Math.floor(cpuCors / 2)} Cores ${cpuCors} threads)`;
    displayOutput(cpuInfo, `color: ${accent}`, `color: ${accent}`, "color: #b6b6b6");
    return true
}

async function displayMemoryInfo() {
    let accent = "#32ae62"
    let settings = JSON.parse(await Filer.fs.promises.readFile(`/home/${sessionStorage.getItem('currAcc')}/settings.json`, "utf8"));
    if(settings["accent"]) {
        accent = settings["accent"]
    }
    let mem = navigator.deviceMemory ? navigator.deviceMemory + "GB" : "Unknown";
    
    let memoryInfo = "%c    ^@@@@?     .#@@@&GGG#@@@@Y " + "   %cMemory%c: " + mem;
    displayOutput(memoryInfo, `color: ${accent}`, `color: ${accent}`, "color: #b6b6b6");
    return true
}

async function displayGPUInfo() {
    let accent = "#32ae62"
    let settings = JSON.parse(await Filer.fs.promises.readFile("//system/etc/terbium/settings.json", "utf8"));
    if(settings["accent"]) {
        accent = settings["accent"]
    }
    let canvas = document.createElement("canvas");
    let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
        displayOutput("%cGPU%c: Information not available", `color: ${accent}`, "color: #b6b6b6");
        return;
    }
    let dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (dbgRenderInfo) {
        let rndr = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
        let regex = /ANGLE \(.+?,\s*(.+?) \(/;
        let match = rndr.match(regex);
        let gpuName = match ? match[1] : '';
        displayOutput("(%^34)" + `%cGPU%c: ${gpuName}`, `color: ${accent}`, "color: #b6b6b6");
    } else {
        displayOutput("(%^34)" + "%cGPU%c: Information not available", `color: ${accent}`, "color: #b6b6b6");
    }
    return true
}

async function getStorage() {
    let accent = "#32ae62"
    let settings = JSON.parse(await Filer.fs.promises.readFile(`/home/${sessionStorage.getItem('currAcc')}/settings.json`, "utf8"));
    if(settings["accent"]) {
        accent = settings["accent"]
    }
    navigator.storage.estimate().then((estimate) => {
        const totalSize = estimate.quota;
        const usedSize = estimate.usage;
        const usedPercentage = (usedSize / totalSize) * 100;
        let formattedUsedSize, formattedTotalSize;
        if (usedSize >= 1024 * 1024 * 1024) {
            formattedUsedSize = `${(usedSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        } else {
            formattedUsedSize = `${(usedSize / (1024 * 1024)).toFixed(2)} MB`;
        }
        if (totalSize >= 1024 * 1024 * 1024) {
            formattedTotalSize = `${(totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        } else {
            formattedTotalSize = `${Math.round((totalSize / (1024 * 1024)).toFixed(2))} MB`;
        }
        displayOutput("%c    ^&@@@?      B@@@@@@@@&B5~ " + `    %cStorage%c: ${formattedUsedSize} of ${formattedTotalSize}`, `color: ${accent}`, `color: ${accent}`, "color: #b6b6b6");
    })
}

sysfetch(args);