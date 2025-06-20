const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited set of APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Function to request loading a video by filename
  getVideoByFilename: (filename) => ipcRenderer.invoke('get-predefined-video-path', filename),

});

// You no longer need to expose ipcRenderer directly.
// The renderer will interact with the functions defined above.