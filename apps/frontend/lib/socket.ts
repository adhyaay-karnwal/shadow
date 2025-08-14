"use client";

import type { ServerToClientEvents, ClientToServerEvents } from "@repo/types";
import { ipcSocket } from "./ipc-socket";

// Define a minimal TypedSocket interface for compatibility
export interface TypedSocket {
  connect(): void;
  disconnect(): void;
  on(event: string, handler: (...args: any[]) => void): void;
  off(event: string, handler: (...args: any[]) => void): void;
  emit(event: string, payload?: any): void;
}

export const socket: TypedSocket = ipcSocket;

import type { ServerToClientEvents, ClientToServerEvents } from "@repo/types";
import { ipcSocket } from "./ipc-socket";

// Define a minimal TypedSocket interface for compatibility
export interface TypedSocket {
  connect(): void;
  disconnect(): void;
  on(event: string, handler: (...args: any[]) => void): void;
  off(event: string, handler: (...args: any[]) => void): void;
  emit(event: string, payload?: any): void;
}

export const socket: TypedSocket = ipcSocket;
