import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents, Role } from '../../../shared/types/socketTypes';

export function makeSocket(auth: { userId: string; role: Role; gameId: string }) {
    console.log("[makeSocket", auth);
    return io("http://localhost:5050", {
        transports: ["polling", "websocket"],
        path: "/socket.io",
        autoConnect: false,
        withCredentials: true,
        auth,
    }) as Socket<ServerToClientEvents, ClientToServerEvents>;
}