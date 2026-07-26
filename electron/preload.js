import { contextBridge, ipcRenderer } from 'electron';

// Minimal, safe bridge exposed to the React renderer.
// Kept intentionally small: the showroom app is fully self-contained,
// this just gives the UI a way to know it's running inside Electron
// and a couple of platform helpers (e.g. app version) if ever needed.
contextBridge.exposeInMainWorld('eveMatters', {
  isElectron: true,
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});
