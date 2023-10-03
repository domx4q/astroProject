"use strict";

import { app, protocol, BrowserWindow, Menu, MenuItem, shell } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater, AppUpdater } from "electron-updater";
const isDev = require('electron-is-dev');
const isDevelopment = process.env.NODE_ENV !== "production";

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: { secure: true, standard: true, supportFetchAPI: true },
  },
]);

const SHOW_DEV_TOOLS = false;

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Required for Spectron testing
      enableRemoteModule: !!process.env.IS_TEST,

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
    icon: __dirname + "/img/icons/favicon-256x256.png",
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST && SHOW_DEV_TOOLS) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
  win.maximize();

  function addMenus() {
    const template = [
      {
        label: "Anwendungen",
        submenu: [
          {
            label: "Planeten (3D)",
            click: () => {
              win.loadURL("app://./index.html");
            },
          },
          {
            label: "Drehbare Sternkarte",
            click: () => {
              win.loadURL("app://./index.html/#/extra/stars");
            },
          },
        ],
      },
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
  addMenus();

  win.webContents.on("did-finish-load", () => {
    const version = app.getVersion();
    win.setTitle(`AstroProjekt - ${version}`);
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();

  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
});


autoUpdater.on("update-available", (info) => {
  console.log("Update available");
  console.log(info);
  let pth = autoUpdater.downloadUpdate();
  console.log(pth);
});

autoUpdater.on("update-not-available", (info) => {
  console.log("Update not available");
  console.log(info);
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("Update downloaded");
  console.log(info);

  const dialog = confirm("Es ist ein Update verfügbar. Möchten Sie es jetzt installieren?");
  if (dialog) {
    autoUpdater.quitAndInstall();
  }
});

autoUpdater.on("error", (err) => {
  console.log("Update error");
  console.log(err);
});


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
