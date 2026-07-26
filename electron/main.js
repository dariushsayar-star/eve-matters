import { app, BrowserWindow, Menu, globalShortcut, screen } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';

// EVE Matters Experience Center — designed to run as a fullscreen kiosk
// on a 55" touch display inside the showroom. No menu bar, no title bar,
// not resizable, launches fullscreen automatically.
let mainWindow = null;

function createWindow() {
  // Menu is fully removed application-wide (also hides it on macOS-style apps)
  Menu.setApplicationMenu(null);

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    show: false,
    frame: false, // hide title bar
    autoHideMenuBar: true,
    resizable: false, // disable resize
    fullscreen: !isDev, // auto fullscreen in production (kiosk showroom mode)
    kiosk: !isDev,
    backgroundColor: '#050505',
    icon: path.join(__dirname, '../build/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: isDev
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (!isDev) {
      mainWindow.setFullScreen(true);
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Prevent the showroom kiosk from accidentally navigating away or opening popups
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

  // Staff-only escape hatches: Ctrl+Shift+Q to quit, F11 to toggle fullscreen for setup
  globalShortcut.register('Control+Shift+Q', () => app.quit());
  globalShortcut.register('F11', () => {
    if (mainWindow) mainWindow.setFullScreen(!mainWindow.isFullScreen());
  });
  // Reload the experience (useful if a customer leaves it in a weird state)
  globalShortcut.register('Control+Shift+R', () => {
    if (mainWindow) mainWindow.reload();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
