import { User } from "./UserManager";
let GLOBAL_ID = 1;
export class RoomManager {
  private rooms: Map<string, Room> = new Map<string, Room>();

  createRoom(user1: User, user2: User) {
    const roomId = this.generateId().toString();
    this.rooms.set(roomId.toString(), { user1, user2 });
    user1.socket.emit("send-offer", roomId);
    user2.socket.emit("send-offer", roomId);
  }

  onOffer(roomId: string, sdp: string,senderSocketid: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
        return;
    }
    const receivingUser = room.user1.socket.id === senderSocketid ? room.user2: room.user1;
    receivingUser?.socket.emit("offer", {
        sdp,
        roomId
    })
  }
  onAnswer(roomId: string, sdp: string,senderSocketid:string) {
    const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.socket.id === senderSocketid ? room.user2: room.user1;

        receivingUser?.socket.emit("answer", {
            sdp,
            roomId
        });
  }
  onIceCandidates(roomId: string, senderSocketid: string, candidate: any, type: "sender" | "receiver") {
    const room = this.rooms.get(roomId);
    if (!room) {
        return;
    }
    const receivingUser = room.user1.socket.id === senderSocketid ? room.user2: room.user1;
    receivingUser.socket.emit("add-ice-candidate", ({candidate, type}));
}
  generateId() {
    return GLOBAL_ID++;
  }
}

interface Room {
  user1: User;
  user2: User;
}
