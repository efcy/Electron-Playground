const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited set of APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Base Directory Management API
  getMySetting: () => ipcRenderer.invoke('get-my-setting'),
  setMySetting: (newValue) => ipcRenderer.invoke('set-my-setting', newValue),
});

// You no longer need to expose ipcRenderer directly.
// The renderer will interact with the functions defined above.