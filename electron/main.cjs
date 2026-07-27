const { app, BrowserWindow, Menu, globalShortcut, screen, ipcMain } = require('electron');
const path = require('node:path');

const isDev = process.env.NODE_ENV === 'development';
let mainWindow = null;

function createWindow() {
  Menu.setApplicationMenu(null);
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    resizable: false,
    fullscreen: !isDev,
    kiosk: !isDev,
    backgroundColor: '#050505',
    icon: path.join(__dirname, '../build/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: isDev
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (!isDev) mainWindow.setFullScreen(true);
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost:5173') && !url.startsWith('file://')) {
      event.preventDefault();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  globalShortcut.register('Control+Shift+Q', () => app.quit());
  globalShortcut.register('F11', () => {
    if (mainWindow) mainWindow.setFullScreen(!mainWindow.isFullScreen());
  });
  globalShortcut.register('Control+Shift+R', () => {
    if (mainWindow) mainWindow.reload();
  });
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Lets the renderer (the React app's exit button) ask the main process to
// quit gracefully, since a frameless kiosk window has no OS close button.
ipcMain.on('app:quit', () => {
  app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
