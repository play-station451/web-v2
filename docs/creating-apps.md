# <span style="color: #32ae62;">Creating new applications</span>

Table of Contents:

- [Introduction](#introduction)
- [Using TB Features](#using-tb-features)
    - [Island Controls](#island-controls)
    - [WM Controls](#wm-controls)
- [Generating Manifests](#generating-manifests)
- [Adding your application to the app launcher](#adding-your-application-to-the-app-launcher)
- [Creating and Submiting your Application to the app store repo](#creating-new-applications)
    - [Formatting PWAs](#formatting-pwas)
    - [Formatting TAPPs](#formatting-tapps)
    - [Formatting Anura Apps](#formatting-anura-apps)

## <span style="color: #32ae62;">Introduction</span>

Creating a Terbium Application is really easy to do. First you need to decide wither or not you want your app to be a PWA or a TAPP. Once you have decided you can follow the steps bellow.

## <span style="color: #32ae62;">Using TB Features</span>

Terbium v2 has Introduced many changes to the WM and General Window Functionality compared to ["Legacy Terbium"](https://github.com/terbiumos/webOS). 
Some of these new API Implementations for the WM that you want to use are as follows:

```json
title: {
    text: "<appname>",
},
icon: "<locationappicon>",
src: "<locationofapp>",
native: true,
size: {
    width: 900,
    height: 650,
},
single: false,
resizable: true,
snapable: false,
```

- <span style="color: #32ae62;">title</span>: The Title of the Application
    - if you want to customize the weight follow the title example from above, if not just simply make the `title` field a string
- <span style="color: #32ae62;">icon</span>: The Applications Icon
- <span style="color: #32ae62;">src</span>: The Applications Main Page (Commonly index.html or an internet url)
- <span style="color: #32ae62">native</span>: Weither or not the application uses a custom UI or a normal ui
- <span style="color: #32ae62;">size</span>: The Size of the applications window
    - <span style="color: #32ae62;">width</span>: The Width of the Application
    - <span style="color: #32ae62;">height</span>: The Height of the Application
    - <span style="color: #32ae62;">minWidth</span>: The Minimum Width of the Application
    - <span style="color: #32ae62;">minHeight</span>: The Minimum Height of the Application
- <span style="color: #32ae62;">single</span>: Determiens if the Application allows you to open multiple windows or not
- <span style="color: #32ae62;">resizable</span>: Determines if the Application allows you to resize it
- <span style="color: #32ae62;">snapable</span>: Toggle for allowing window snapping
- <span style="color: #32ae62;">minimizable</span>: Toggle for allowing window to be minimized
- <span style="color: #32ae62;">maximizable</span>: Toggle for allowing the window to be maximized
- <span style="color: #32ae62;">closable</span>: Toggle for allowing the window to be closed
- <span style="color: #32ae62;">controls</span>: An array of which buttons are allowed to be on the window

> A few new API's to be aware of:
> - parent.window.tb.window.create({`wmargs`}): Allows you to create a Window in JS. Fill in `wmargs` with the Arguments you made above
> - parent.window.tb.file.handler.openFile(fileItem.getAttribute("path"), "<extfromextentions.json>"): Allows you to open a File in its respective app easily
> - For API's in more in debpt visit the [API Docs](./apis/readme.md)

### <a id="island-controls" style="color: #32ae52;">Island Controls</a>

The App Island allows you to have custom items in the left corner where it says the App Title.

To set it up you will be needing the app id and you will need to create a JS Script in your application to have the following JS Code:

```js
const tb = parent.window.tb
const tb_island = tb.window.island;
const tb_window = tb.window;
const tb_context_menu = tb.context_menu;

tb_island.addControl({
    text: "<titleofcontrol>",
    app_id: "com.tb.<appid>",
    id: "<giverandomname>",
    click: () => {
        // Execute code here for when clicked
    }
})
```

If you wish to use a context menu instead you can use this code instead

```js
const tb = parent.window.tb
const tb_island = tb.window.island;
const tb_window = tb.window;
const tb_context_menu = tb.context_menu;
const tb_dialog = tb.dialog;

tb_island.addControl({
    text: "<titleofcontrol>",
    app_id: "com.tb.<appid>",
    id: "<giverandomname>",
    click: () => {
        const ctx = document.createElement("div");
        ctx.classList.add("context-menu", "fade-in");
        if(parent.document.querySelector(".context-menu")) {
            parent.document.querySelector(".context-menu").remove();
        }
        ctx.id = "<controlname_action>_ctx";
        ctx.style.left = `6px`;
        ctx.style.top = parent.document.querySelector(".app_island").clientHeight + 12 + "px";
        let isTrash = document.querySelector(".exp").getAttribute("path") === "/home/trash" ? true : false;
        const options = [
            {
                text: "<controltitle>",
                click: () => {
                    // Execute code here for when clicked
                }
            }
        ]
        options.forEach(option => {
            if(option === null) return;
            const btn = document.createElement("button");
            btn.classList.add("context-menu-button");
            btn.innerText = option.text;
            btn.onclick = option.click;
            ctx.appendChild(btn);
        })
        parent.document.body.appendChild(ctx);
        parent.window.addEventListener("click", (e) => {
            if (!e.target.classList.contains("app_control")) {
                if(parent.document.querySelector(".context-menu")) {
                    parent.document.querySelector(".context-menu").classList.add("fade-out");
                    setTimeout(() => {
                        if(parent.document.querySelector(".context-menu"))
                        parent.document.querySelector(".context-menu").remove();
                    }, 150);
                }
            }
        });
    }
})

parent.document.querySelector(`[control-id="files-et"]`).classList.add("hidden");
```

What you can implement in the click is tottally up to you and you can do things like open a new window, alert something, etc

### <a id="wm-controls" style="color: #32ae62;">WM Controls</a>

The WM Controls for the title bar are the only ones around right now.
Those can be added by adding the following to the WM args:

```json
title: {
    text: "<appname>",
    weight: <text weight as number>,
    html: `<html here>`
},
```

## <span style="color: #32ae62;">Generating Manifests</span>

To generate a TAPP Manifest for your TAPP Package you can use the TB Dev SDK 24 App avalible in the XSTARS XTRAS Repo and either use the manifest tool in the app gui or use it via the command line with tbsdk --gen-manifest --{args}

## <span style="color: #32ae62;">Adding your Application to the App Launcher</span>

> <span style="font-family: url('https://fonts.googleapis.com/css2?family=Roboto&display=swap'); color: #ffd900;">⚠</span> <span style="color: #ffd900;">NOTE:</span> If you are going to submit this app to the app store ignore this step and follow the app store specific steps

Adding your Application to the app launcher is pretty easy to do. If you want it to be installed on your site itself add the entry to the array in `/src/init/index.ts` or you can do the same thing within your terbium window itself using the api `tb.launcher.addApp({propshere})` or by editing the file: `/system/var/terbium/start.json`

```json
{
    title: "Calculator",
    icon: "/apps/calculator.tapp/icon.svg",
    src: "/apps/calculator.tapp/index.html",
    snapable: false,
    maximizable: false,
    size: {
        width: 338,
        height: 556
    },
},
```

Once you fill and insert that you should notice your app has appeared in your launcher!

## <span style="color: #32ae62;">Creating and Submiting your Application to the app store repo</span>

> Make sure you forked the repository: https://github.com/TerbiumOS/app-repo so you can make changes

To submit your repo follow the instructions below and make sure to follow our basic guidelines for your app to get accepted:

## <span style="color: #32ae62;">Formatting PWAs</span>

Pull Requests for apps are always viewed and heres some basic guidelines for your app to get accepted

- App is in the repo in the folder `assets/com.tb.{appname}`
- Icon should be defined in the `assets/com.tb.{appname}/icon.[ext]`
- WM Arguments and Metadata is in the `apps.json` file in this repo
    - Example
    ```json
    {
        "name": "YouTube",
        "icon": "https://raw.githubusercontent.com/TerbiumOS/app-repo/main/assets/com.tb.youtube/icon.png",
        "description": "Share your videos with friends, family, and the world.",
        "authors": ["Google"],
        "pkg-name": "youtube",
        "images": [
            "https://raw.githubusercontent.com/TerbiumOS/app-repo/main/assets/com.tb.youtube/images/1.png"
        ],
        "wmArgs": {
            "title": {
                "text": "YouTube",
                "weight": 600
            },
            "icon": "https://raw.githubusercontent.com/TerbiumOS/app-repo/main/assets/com.tb.youtube/icon.png",
            "src": "https://youtube.com",
            "size": {
                "width": 600,
                "height": 400
            },
            "single": true,
            "resizable": true
        }
    }
    ```

## <span style="color: #32ae62;">Formatting TAPP's</span>

- The easiest way to creat TAPP's is to download the TB Dev SDK 2025 from the XSTARZ XTRAS repo and use the feilds to generate your TAPP and Manifest.
- The app should be put into the assets folder with the naming scheme: {appname}.TAPP.zip or com.tb.{appname}.TAPP.zip
- Also you can put into the app repo manifest where you want to download the TAPP from if you want to host it somewhere else for some reason, Image assets can still be stored in a folder in the assets folder as long as it follows the naming scheme of com.tb.{appname}
  - Example
  ```json
    {
        "name": "About Proxy",
        "icon": "https://aboutproxy.pages.dev/aboutbrowser/darkfavi.png",
        "description": "Chrome for your browser",
        "images": [
            "https://raw.githubusercontent.com/TerbiumOS/app-repo/main/assets/com.tb.youtube/images/1.png"
        ],
        "authors": ["r58playz"],
        "pkg-name": "aboutproxy",
        "pkg-download": "https://tbapps.pages.dev/assets/aboutproxy.TAPP.zip"
    },
  ```

## <span style="color: #32ae62;">Formatting Anura Apps</span>

- Terbium app repos also support having Anura Apps however they must be formatted like so:
- You can store the app in the assets folder as a regular zip file
  - Example
  ```json
    {
        "name": "Snae Player",
        "icon": "https://raw.githubusercontent.com/MercuryWorkshop/anura-repo/master/apps/anura.music/icon.png",
        "description": "A music client ported to Anura",
        "authors": ["Mercury Workshop"],
        "pkg-name": "snaeplayer",
        "anura-pkg": "https://raw.githubusercontent.com/MercuryWorkshop/anura-repo/master/apps/anura.music/app.zip"
    }
  ```
