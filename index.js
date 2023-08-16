const express = require("express");
const helmet = require("helmet");
const { Server } = require("socket.io");
const cors = require("cors");
const authRouter = require("./routers/authRouter");

const app = express();
const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: "true",
  },
});

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", authRouter);

// app.get("/", (req, res) => {
//   res.json("hi");
// });

io.on("connect", (socket) => {});

server.listen(4000, () => {
  console.log("Server listenting on port 4000");
});
