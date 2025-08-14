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
  on: (channel: string, listener: (event: any, payload: any) => void) => void;
  off: (channel: string, listener: (event: any, payload: any) => void) => void;
  emit: (channel: string, payload?: any) => void;
};

const api: IpcAPI = {
  chat: async (input) => ipcRenderer.invoke('chat', input),
  tasks: async () => ipcRenderer.invoke('tasks'),
  files: async () => ipcRenderer.invoke('files'),
  terminal: async (input) => ipcRenderer.invoke('terminal', input),
  wikiStatus: async () => ipcRenderer.invoke('wikiStatus'),
  git: async (cmd, args) => ipcRenderer.invoke('git', cmd, args),
  settings: async () => ipcRenderer.invoke('settings'),
  on: (channel, listener) => ipcRenderer.on(channel, listener),
  off: (channel, listener) => ipcRenderer.removeListener(channel, listener),
  emit: (channel, payload) => ipcRenderer.send(channel, payload),
};

contextBridge.exposeInMainWorld('shade', api);