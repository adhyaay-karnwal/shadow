import type { ServerToClientEvents, ClientToServerEvents } from "@repo/types";

type Handler = (payload?: any) => void;

interface ISocketLike {
  connect: () => void;
  disconnect: () => void;
  on: (event: string, handler: Handler) => void;
  off: (event: string, handler: Handler) => void;
  emit: (event: string, payload?: any) => void;
}

// Electron IPC implementation
function createElectronIpcSocket(): ISocketLike {
  // @ts-ignore
  const shade = typeof window !== "undefined" ? window.shade : undefined;
  const listeners = new Map<string, Set<Handler>>();

  return {
    connect: () => {},
    disconnect: () => {},
    on: (event, handler) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(handler);
      shade?.on(event, handler);
    },
    off: (event, handler) => {
      listeners.get(event)?.delete(handler);
      shade?.off(event, handler);
    },
    emit: (event, payload) => {
      shade?.emit?.(event, payload);
    }
  };
}

// Browser (socket.io-client) fallback
function createSocketIoSocket(): ISocketLike {
  // Dynamic import to avoid bundling in Electron
  const { io } = require("socket.io-client");
  const socketUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4001";
  const socket = io(socketUrl, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    forceNew: false,
    withCredentials: true,
  });

  return {
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
    on: (event, handler) => socket.on(event, handler),
    off: (event, handler) => socket.off(event, handler),
    emit: (event, payload) => socket.emit(event, payload),
  };
}

// Main export: auto-detect Electron vs browser
export const ipcSocket: ISocketLike = (
  typeof window !== "undefined" && !!window.shade
)
  ? createElectronIpcSocket()
  : createSocketIoSocket();