import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "../../../shared/types/socketTypes";

type S = Socket<ServerToClientEvents, ClientToServerEvents>;
export const SocketCtx = createContext<{ socket: S | null }>({ socket: null });
export const useSocket = () => useContext(SocketCtx).socket;