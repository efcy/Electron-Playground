import { app, BrowserWindow, ipcMain } from 'electron'
import path from'node:path'
import fs from'node:fs' // Add fs for checking file existence
import Store from 'electron-store';
const __dirname = import.meta.dirname;
let mainWindow

const store = new Store({
  defaults: {
    // Define default values for your settings
    baseDirectory: "D:/logs" // Default to user's videos folder or another suitable default
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')

  // Open the DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC handler to get the current string setting
ipcMain.handle('get-my-setting', async () => {
  return store.get('baseDirectory');
})

// IPC handler to set and save the string setting
ipcMain.handle('set-my-setting', async (event, newValue) => {
  if (typeof newValue === 'string' && newValue.length > 0 && newValue.length <= 255) {
    store.set('baseDirectory', newValue)
    return true // Indicate success
  } else {
    console.warn(`Invalid value provided for 'baseDirectory': ${newValue}`)
    return false // Indicate failure
  }
})
