"use strict";

import {
  app,
  protocol,
  BrowserWindow,
  Menu,
  globalShortcut,
  MenuItem,
  shell,
  dialog,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater, AppUpdater } from "electron-updater";
const isDevelopment = process.env.NODE_ENV !== "production";

const isDev = !app.isPackaged; // electron-is-dev does not work

const USE_AUTO_UPDATER = false;

if (USE_AUTO_UPDATER) {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
}

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

  let extrasEnabled = false;
  function addMenus() {
    let template;
    if (!extrasEnabled) {
      template = [
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
            {
              label: "Sonnenkuppel (3D)",
              click: () => {
                win.loadURL("app://./index.html/#/extra/sun");
              },
            }
          ],
        },
      ];

    } else {
      template = [ // ChatGPT generated code
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
            {
              label: "Sonnenkuppel (3D)",
              click: () => {
                win.loadURL("app://./index.html/#/extra/sun");
              },
            },
            // Easter Category
            {
              label: "Easter Eggs",
              submenu: [
                {label: "Uhr", click: () => win.loadURL("app://./index.html#/easter/clock")},
                {label: "Snake", click: () => win.loadURL("app://./index.html#/easter/snake")},
                {label: "Pacman", click: () => win.loadURL("app://./index.html#/easter/pacman")},
                {label: "Farbsimulation", click: () => win.loadURL("app://./index.html#/easter/colors")},
                {label: "Großer Text", click: () => win.loadURL("app://./index.html#/easter/text")},
              ],
            },
            // Extra Category
            {
              label: "Zusätzliche Funktionen",
              submenu: [
                {label: "Beispiel", click: () => win.loadURL("app://./index.html#/extra/example")},
              ],
            },
          ],
        },
      ];
    }
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
  addMenus();
  globalShortcut.register("F4", () => {
    extrasEnabled = !extrasEnabled;
    addMenus();
  });

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

  if (!isDev && USE_AUTO_UPDATER) {
    autoUpdater.checkForUpdates();
  }
});

if (USE_AUTO_UPDATER) {
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

    const answer = dialog.showMessageBoxSync({
      type: "question",
      buttons: ["Ja", "Nein"],
      title: "Update verfügbar",
      message: "Ein Update ist verfügbar. Möchten Sie es jetzt installieren?",
    });
    if (answer === 1) return;
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on("error", (err) => {
    console.log("Update error");
    console.log(err);
  });
}

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

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
