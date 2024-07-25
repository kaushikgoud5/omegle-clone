"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const UserManager_1 = require("./Managers/UserManager");
const app = (0, express_1.default)();
const port = 3000;
const server = http_1.default.createServer(app);
let username = "";
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true
}));
const userManager = new UserManager_1.UserManger();
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', (msg) => {
        io.emit('message', msg);
    });
    socket.on('username', (name) => {
        username = name;
        console.log(name + " is joined in the room");
    });
    userManager.addUser(username, socket);
    socket.on('disconnect', () => {
        console.log('user disconnected');
        userManager.removeUser(socket.id);
    });
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
