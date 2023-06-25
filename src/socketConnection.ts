import { io } from "socket.io-client";

io("http://localhost:3000", {
  reconnectionDelayMax: 10000,
  auth: {
    token: "123",
  },
  query: {
    "my-key": "my-value",
  },
});
