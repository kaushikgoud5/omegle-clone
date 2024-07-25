import express from 'express';
import http from "http";
import { Server, Socket } from "socket.io";
import cors from 'cors';
import { UserManger } from './Managers/UserManager';

const app = express();
const port = 3000;
const server = http.createServer(app);
let username:string="";
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: 'http://localhost:4200', 
  methods: ['GET', 'POST'],
  credentials: true
}));

const userManager = new UserManger();

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  socket.on('message', (msg) => {
    io.emit('message', msg);
  });
  socket.on('username',(name:string)=>{
    username=name;
    console.log(name + " is joined in the room")
  })
  userManager.addUser(username, socket);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    userManager.removeUser(socket.id)
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
