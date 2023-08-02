import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export async function socketIOConnect(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.emit("message", "everyone");

  io.on("connection", (socket) => {
    socket.on("joinRoom", (gameid, cb) => {
      socket.to(gameid).emit("roomJoined", gameid);
      cb();
    });
  });
}
