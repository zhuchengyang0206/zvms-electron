'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import {
    createProtocol,
    /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'
const electron = require('electron')
const Menu = electron.Menu
const Tray = electron.Tray

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let tray = null
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

const openDefaultBrowser = function (url) {
    var exec = require('child_process').exec;
    switch (process.platform) {
        case "darwin":
            exec('open ' + url);
            break;
        case "win32":
            exec('start ' + url);
            break;
        default:
            exec('xdg-open', [url]);
    }
}

function createWindow() {
    // Create the browser window.
    Menu.setApplicationMenu(null)
    win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__static,'logo.png'),
        frame: false,
        titleBarStyle: 'hidden',
        show: false,
        skipTaskbar: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
    win.once('ready-to-show', () => {
        win.show()
    })
    win.on('closed', function (e) {
        e.preventDefault()
        win = null
    })
    win.on('close', (event) => {
        win.hide()
        win.setSkipTaskbar(true)
        event.preventDefault()
    })
    win.on('show', () => {
        //tray.setHighlightMode('always')

    })
    win.on('hide', () => {
        //tray.setHighlightMode('never')
    })
    ipcMain.on('minwindow', () => {
        win.minimize()
    })
    ipcMain.on('maxwindow', () => {
        if (win.isMaximized()) {
            win.restore()
        } else {
            win.maximize()
        }
    })
    ipcMain.on('closewindow', () => {
        win.hide()
    })
    //图标找不到啊草
    tray = new Tray(path.join(__static,'logo.ico'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'ZVMS', click: () => { openDefaultBrowser('https://zvms.gitee.io/zvms-doc') } },
        { label: '显示', click: () => { win.show() } },
        { label: '退出', click: () => { win.destroy() } }
    ])
    tray.setToolTip('ZVMS')
    tray.setContextMenu(contextMenu)
    tray.on('click', () => {
        win.isVisible() ? win.hide() : win.show()
        win.isVisible() ? win.setSkipTaskbar(false) : win.setSkipTaskbar(true)
    })
    let timericon;
    ipcMain.on('flash', () => {
        if (timericon) return;
        win.flashFrame(true);
        let type = 0;
        timericon = setInterval(() => {
            tray.setImage(path.join(__static,type ? 'logo.ico' : 'empty.ico'));
            type ^= 1;
        },
            500
        );
    })
    ipcMain.on('endflash', () => {
        if (!timericon) return;
        clearInterval(timericon);
        timericon = undefined;
        tray.setImage(path.join(__static,'logo.ico'));
    })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        // Devtools extensions are broken in Electron 6.0.0 and greater
        // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
        // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
        // If you are not using Windows 10 dark mode, you may uncomment these lines
        // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
        // try {
        //   await installVueDevtools()
        // } catch (e) {
        //   console.error('Vue Devtools failed to install:', e.toString())
        // }

    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}