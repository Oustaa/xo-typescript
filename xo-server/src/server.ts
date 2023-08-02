import express from "express";
import { createServer } from "http";
import path from "path";
import { socketIOConnect } from "./socketIoConnect";
import cors from "cors";

const app = express();
const server = createServer(app);
app.use((req, res, next) => {
  console.log(req.method, "|", req.url);
  next();
});

app.use(
  cors({
    origin: ["*", "https://admin.socket.io"],
  })
);

app.use(express.static(path.join(__dirname, "..", "public")));

socketIOConnect(server);

server.listen(3000, () => {
  console.log("Started listening on Port 3000");
});
