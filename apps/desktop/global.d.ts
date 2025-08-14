import type { IpcAPI } from './src/preload';

declare global {
  interface Window {
    shade: IpcAPI & {
      on: (channel: string, listener: (event: any, payload: any) => void) => void;
      off: (channel: string, listener: (event: any, payload: any) => void) => void;
      emit: (channel: string, payload?: any) => void;
    };
  }
};
  }
}