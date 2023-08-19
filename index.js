const express = require("express");
const helmet = require("helmet");
const { Server } = require("socket.io");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const {
  sessionMidleware,
  wrap,
  corsConfig,
} = require("./controllers/serverController");
const {
  authorizeUser,
  initializeUser,
  addFriend,
} = require("./controllers/socketController");
require("dotenv").config();

const app = express();
const server = require("http").createServer(app);

const io = new Server(server, {
  cors: corsConfig,
});

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(sessionMidleware);

app.use("/auth", authRouter);

io.use(wrap(sessionMidleware));
io.use(authorizeUser);
io.on("connect", (socket) => {
  initializeUser(socket);
  socket.on("add_friend", (friendName, cb) => {
    addFriend(socket, friendName, cb);
  });
});

server.listen(4000, () => {
  console.log("Server listenting on port 4000");
});
