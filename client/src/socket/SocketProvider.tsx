import React, { useEffect, useMemo } from "react";
import { makeSocket } from "./makeSocket";
import { SocketCtx } from "./socket-context";
import type { Role } from "../../../shared/types/socketTypes";

export function SocketProvider({
    userId, role, gameId, children, }: {
        userId: string; role: Role; gameId: string; children: React.ReactNode
    }) {
        const socket = useMemo(() => makeSocket({ userId, role, gameId }), [userId, role, gameId]);

        useEffect(() => {
            console.log("[provider] connecting...");
            socket.connect();

            socket.on("connected", () => {
                console.log("[provider] connected");
                socket.emit("join_game", { gameId });
            });

            socket.on("connect_error", (e) => console.log("[provider] connect_error", e.message));

            return () => {
                socket.off();
                socket.disconnect();
            };
        }, [socket, gameId]);
    
    return <SocketCtx.Provider value={{ socket }}>{children}</SocketCtx.Provider> 
}
