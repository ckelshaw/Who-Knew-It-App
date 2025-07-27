import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createServer } from "http";
import app from "./app";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./sockets/gameSocket";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" }
});

registerSocketHandlers(io); // init socket events

const PORT = process.env.PORT || 5050;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});