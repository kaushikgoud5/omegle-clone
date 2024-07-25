"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManger = void 0;
const RoomManager_1 = require("./RoomManager");
class UserManger {
    constructor() {
        this.roomManager = new RoomManager_1.RoomManager();
        this.users = [];
        this.queue = [];
    }
    addUser(name, socket) {
        this.users.push({
            name,
            socket,
        });
        this.queue.push(socket.id);
        socket.emit("lobby");
        this.clearQueue();
        this.initHandlers(socket);
    }
    removeUser(socketId) {
        const user = this.users.find(x => x.socket.id === socketId);
        this.users = this.users.filter(x => x.socket.id !== socketId);
        this.queue = this.queue.filter(x => x === socketId);
    }
    clearQueue() {
        if (this.queue.length < 2) {
            return;
        }
        const id1 = this.queue.pop();
        const id2 = this.queue.pop();
        console.log("id1", id1);
        console.log("id2", id2);
        const user1 = this.users.find((id) => id1 === id.socket.id);
        const user2 = this.users.find((id) => id2 === id.socket.id);
        if (!user1 || !user2) {
            return;
        }
        console.log("creating room");
        this.roomManager.createRoom(user1, user2);
        this.clearQueue();
    }
    initHandlers(socket) {
        socket.on("offer", ({ sdp, roomId }) => {
            console.log("offer recieved");
            this.roomManager.onOffer(roomId, sdp, socket.id);
        });
        socket.on("answer", ({ sdp, roomId }) => {
            console.log("answer recieved");
            console.log("room Id", roomId);
            this.roomManager.onAnswer(roomId, sdp, socket.id);
        });
        socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
            console.log("ice candidates " + candidate + " " + type);
            this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
        });
    }
}
exports.UserManger = UserManger;
