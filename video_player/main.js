import { app, BrowserWindow, ipcMain } from 'electron'
import path from'node:path'
import fs from'node:fs' // Add fs for checking file existence
const __dirname = import.meta.dirname;
let mainWindow

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

  // Define your predefined video path here
  // For development, place 'sample.mp4' in the same directory as main.js
  
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

// New IPC handler to send the predefined video path to the renderer
ipcMain.handle('get-predefined-video-path', async (event, filename) => {
  if (!filename) {
    console.warn("No filename provided from renderer.");
    return null;
  }
  // Use path.join to correctly combine the base_dir and the relative path
  // path.join handles '/' and '\' correctly based on the OS.
  //const fullVideoPath = path.join(BASE_DIR, relativePathFromBase);

  const potentialVideoPath = filename;
  console.log("potentialVideoPath", potentialVideoPath)
  if (fs.existsSync(potentialVideoPath)) {
    console.log(`Loading video: ${potentialVideoPath}`);
    return potentialVideoPath;
  } else {
    console.warn(`Video file not found at: ${potentialVideoPath}`);
    return null; // Ensure it's null if not found
  }
})
