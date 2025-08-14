import { contextBridge, ipcRenderer } from 'electron';

// Types for IPC bridge
export type IpcAPI = {
  chat: (input: string) => Promise<string>;
  tasks: () => Promise<any>;
  files: () => Promise<any>;
  terminal: (input: string) => Promise<any>;
  wikiStatus: () => Promise<any>;
  git: (cmd: string, args?: any) => Promise<any>;
  settings: () => Promise<any>;
};

const api: IpcAPI = {
  chat: async (input) => ipcRenderer.invoke('chat', input),
  tasks: async () => ipcRenderer.invoke('tasks'),
  files: async () => ipcRenderer.invoke('files'),
  terminal: async (input) => ipcRenderer.invoke('terminal', input),
  wikiStatus: async () => ipcRenderer.invoke('wikiStatus'),
  git: async (cmd, args) => ipcRenderer.invoke('git', cmd, args),
  settings: async () => ipcRenderer.invoke('settings'),
};

contextBridge.exposeInMainWorld('shade', api);