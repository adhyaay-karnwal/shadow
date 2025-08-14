import { app, BrowserWindow, protocol } from 'electron';
import path from 'path';
import { spawn } from 'child_process';

const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_DEV === '1';

let mainWindow: BrowserWindow | undefined;

function getRendererUrl() {
  if (isDev) {
    return 'http://localhost:3000';
  } else {
    // Serve exported Next.js build via file:// protocol
    return `file://${path.join(__dirname, '../../frontend/out/index.html')}`;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    },
    show: false
  });

  const url = getRendererUrl();
  mainWindow.loadURL(url);

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (isDev) mainWindow.webContents.openDevTools();
}

app.on('ready', async () => {
  if (isDev) {
    // Start Next.js dev server if not already running
    const nextProc = spawn('pnpm', ['run', 'dev'], {
      cwd: path.join(__dirname, '../../frontend'),
      stdio: 'inherit',
      shell: true,
    });
    // Wait-on handled in dev script
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});