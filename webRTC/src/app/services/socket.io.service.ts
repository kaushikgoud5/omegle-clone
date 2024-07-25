import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  @ViewChild('remoteVideo', { static: true }) remoteVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('localVideo', { static: true }) localVideoRef!: ElementRef<HTMLVideoElement>;

  private socket: Socket;
  localAudioTrack!: MediaStreamTrack | null;
  localVideoTrack!: MediaStreamTrack | null;
  sendingPc!: RTCPeerConnection | null;
  receivingPc!: RTCPeerConnection | null;
  remoteMediaStream!: MediaStream | null;
  private inLobby=new BehaviorSubject<boolean>(false);
  inLobbyObs:Observable<any>=this.inLobby.asObservable();

  constructor() {
    this.socket = io('http://localhost:3000'); 
  }

  sendMessage(message: string) {
    this.socket.emit('message', message);
  }
  sendUsername(name:string){
    this.socket.emit("username",name)
  }

  sendOffer() {
    this.socket.on('send-offer', (roomId) => {
      this.inLobby.next(false);
      this.sendingPc=new RTCPeerConnection();
      if (this.localVideoTrack) {
        this.sendingPc.addTrack(this.localVideoTrack);
      }
      if (this.localAudioTrack) {
        this.sendingPc.addTrack(this.localAudioTrack);
      }
      this.sendingPc.onicecandidate = (e) => {
        if (e.candidate) {
          this.socket.emit('add-ice-candidate', {
            candidate: e.candidate,
            type: 'sender',
            roomId
          });
        }
      };
      alert('send offer please!! ' + roomId);
      this.sendingPc.onnegotiationneeded = async () => {
        console.log("on negoataion needed")
        const sdp = await this.sendingPc!.createOffer();
        await this.sendingPc!.setLocalDescription(sdp);
        this.socket.emit('offer', { sdp, roomId });
      };
      
    });
  }
  onOffer() {
    this.socket.on('offer',async ({ sdp:remoteSdp, roomId }) => {
      this.inLobby.next(false);
      this.receivingPc = new RTCPeerConnection();
      await this.receivingPc.setRemoteDescription(remoteSdp);
      const sdp = await this.receivingPc.createAnswer();
      await this.receivingPc.setLocalDescription(sdp);
      const stream = new MediaStream();
      if (this.remoteVideoRef.nativeElement) {
        this.remoteVideoRef.nativeElement.srcObject = stream;
      }
      this.remoteMediaStream = stream;
      this.receivingPc.ontrack = (e) => {
        this.remoteMediaStream!.addTrack(e.track);
        this.remoteVideoRef.nativeElement.play();
      };
      this.receivingPc.onicecandidate = (e) => {
      console.log("on ice candidate on receiving seide");
        if (e.candidate) {
          this.socket.emit('add-ice-candidate', {
            candidate: e.candidate,
            type: 'receiver',
            roomId
          });
        }
      };
       this.socket.emit('answer', {
        sdp,
        roomId,
      });
    });
  }
  onAnswer() {
    this.socket.on('answer', ({ roomId, sdp:remoteSdp }) => {
      this.inLobby.next(false);
      if(this.sendingPc){
        this.sendingPc.setRemoteDescription(remoteSdp);
      }
      alert('connection is done!!');
    });
  }
  onIceCandidate(){
    this.socket.on('add-ice-candidate', ({ candidate, type }: { candidate: RTCIceCandidate, type: string }) => {
      if (type === 'sender' && this.receivingPc) {
        this.receivingPc.addIceCandidate(candidate);
      } else if (type === 'receiver' && this.sendingPc) {
        this.sendingPc.addIceCandidate(candidate);
      }
    });
  }
  checklobby() {
    this.socket.on('lobby', () => {
      this.inLobby.next(true);
    });
  }
 
  onMessage() {
    return new Observable((observer) => {
      this.socket.on('message', (msg: string) => {
        observer.next(msg);
      });
    });
  }
}
