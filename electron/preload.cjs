const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eveMatters', {
  isElectron: true,
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },
  quit: function () {
    ipcRenderer.send('app:quit');
  }
});
