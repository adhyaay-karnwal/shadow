import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { spawn, ChildProcess } from 'child_process'
import getPort from 'get-port'
import waitOn from 'wait-on'
import { EventEmitter } from 'events'

let serverProcess: ChildProcess | null = null

async function startNextStandaloneServer(resourcesRoot: string): Promise<{ url: string, port: number }> {
  const serverDir = path.join(resourcesRoot, 'frontend', 'standalone')
  const serverEntry = path.join(serverDir, 'server.js')
  const port = await getPort({ port: getPort.makeRange(5123, 5200) })
  const env = { ...process.env, PORT: String(port) }

  serverProcess = spawn(process.execPath, [serverEntry], {
    cwd: serverDir,
    env,
    stdio: 'inherit'
  })

  await waitOn({ resources: [`tcp:127.0.0.1:${port}`], timeout: 15000 })
  return { url: `http://127.0.0.1:${port}`, port }
}

function createWindow(url: string) {
  const win = new BrowserWindow({
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
  })
  win.loadURL(url)
  win.once('ready-to-show', () => {
    win.show()
  })
  if (process.env.NODE_ENV === 'development') win.webContents.openDevTools()
}

async function launch() {
  let url = 'http://localhost:3000'
  if (app.isPackaged) {
    const resourcesRoot = app.isPackaged
      ? process.resourcesPath
      : path.resolve(__dirname, '../../frontend')
    const { url: prodUrl } = await startNextStandaloneServer(resourcesRoot)
    url = prodUrl
  }
  createWindow(url)
}

app.whenReady().then(launch)

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill()
    serverProcess = null
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

/** --- IPC Skeletons --- */
type IpcAPI = {
  chat: (message: string) => Promise<string>
  tasks: () => Promise<any[]>
  files: () => Promise<any[]>
  terminal: (cmd: string) => Promise<{ output: string }>
  wikiStatus: () => Promise<{ status: string }>
  git: (cmd: string) => Promise<any>
  settings: () => Promise<any>
}

// === IPC Event Bus setup ===
import { EventEmitter } from 'events'

const allowedChannels = [
  "stream-state",
  "stream-chunk",
  "stream-complete",
  "stream-error",
  "task-status-updated",
  "terminal-output",
  "terminal-cleared",
  "message-error",
  "chat-history",
  "chat-history-error",
  "auto-pr-status",
  "queued-action-processing"
] as const;

const eventBus = new EventEmitter();

// Listen for renderer "emit" events (from preload)
ipcMain.onAny?.((channel: string, ...args: any[]) => {
  if (allowedChannels.includes(channel as any)) {
    eventBus.emit(channel, ...args);
  }
});

// Subscribe/unsubscribe event forwarding
allowedChannels.forEach(channel => {
  ipcMain.on(channel, (event, payload) => {
    // These are stubs -- in future, real event producers will emit here
    // For now, just log or do nothing
  });
});

// Allow renderer to subscribe/unsubscribe to events
ipcMain.handle('on', (event, channel) => {
  if (!allowedChannels.includes(channel)) return;
  const listener = (_event: any, payload: any) => {
    event.sender.send(channel, payload);
  };
  eventBus.on(channel, listener);
  return () => eventBus.off(channel, listener);
});
ipcMain.handle('off', (event, channel) => {
  if (!allowedChannels.includes(channel)) return;
  eventBus.removeAllListeners(channel);
});
ipcMain.handle('emit', (_event, channel, payload) => {
  if (allowedChannels.includes(channel)) {
    eventBus.emit(channel, payload);
  }
});

// --- Existing handlers ---
ipcMain.handle('chat', async (_event, message) => message)
ipcMain.handle('tasks', async () => [])
ipcMain.handle('files', async () => [])
ipcMain.handle('terminal', async (_event, cmd) => ({ output: `Executed: ${cmd}` }))
ipcMain.handle('wikiStatus', async () => ({ status: 'ok' }))
ipcMain.handle('git', async (_event, cmd) => ({ result: `Ran git: ${cmd}` }))
ipcMain.handle('settings', async () => ({}))