import type { IpcAPI } from './src/preload';

declare global {
  interface Window {
    shade: IpcAPI;
  }
}