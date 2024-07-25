import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { GetCamService } from '../../services/get-cam.service';
import { SocketIoService } from '../../services/socket.io.service';
import { ActivatedRoute, Router } from '@angular/router';

// const URL = "http://localhost:3000";
const URL = "http://localhost:3000";
// const URL = "wss://omegle-clone.glitch.me/";


@Component({
  selector: 'app-room',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  @ViewChild('localVideo', { static: true }) localVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo', { static: true }) remoteVideoRef!: ElementRef<HTMLVideoElement>;

  name = '';  // Replace with actual name logic
  localAudioTrack!: MediaStreamTrack | null;
  localVideoTrack!: MediaStreamTrack | null;
  socket!: Socket;
  lobby = true;
  sendingPc!: RTCPeerConnection | null;
  receivingPc!: RTCPeerConnection | null;
  remoteVideoTrack!: MediaStreamTrack | null;
  remoteAudioTrack!: MediaStreamTrack | null;
  remoteMediaStream!: MediaStream | null;
  constructor(private cam:GetCamService,private socketService:SocketIoService,private router:Router) {
    this.socket = io(URL); 
    // this.initializeMediaTracks();
  }
  
  // ngOnInit() {
  //   this.cam.getCam();
  //   this.setupSocketListeners();
  // }
  ngOnInit() {
    // this.cam.getCam();
    this.name=this.router.url.split("/")[2];
    this.socketService.sendUsername(this.name);
    this.socketService.checklobby();
    this.socketService.inLobbyObs.subscribe((res)=>{this.lobby=res})
    this.cam.localVideoTrack$.subscribe((videoTrack) => {
      this.localVideoTrack=videoTrack;
      if (videoTrack && this.localVideoRef.nativeElement) {
        this.localVideoRef.nativeElement.srcObject = new MediaStream([videoTrack]);
        this.localVideoRef.nativeElement.play();
      }
    });
    this.cam.localAudioTrack$.subscribe((audioTrack)=>{
      this.localAudioTrack=audioTrack;
    })
    this.setupSocketListeners();
  }

 setupSocketListeners() {
    this.socket.on('send-offer', async ( roomId : { roomId: string }) => {
      console.log('sending ofefer',roomId)
      this.setLobby(false);
      this.sendingPc = new RTCPeerConnection();
      // this.cam.localAudioTrack$.subscribe((res:MediaStreamTrack)=>{this.localAudioTrack=res;
      // console.log(res)})
      // this.cam.localVediotrack$.subscribe((res:MediaStreamTrack)=>{this.localVideoTrack=res;console.log(res)})
      if (this.localVideoTrack) {
        console.log("trrack added")
        this.sendingPc.addTrack(this.localVideoTrack);
      }
      if (this.localAudioTrack) {
        console.log("trrack auido added")
        this.sendingPc.addTrack(this.localAudioTrack);
      }

      this.sendingPc.onicecandidate = (e) => {
        if (e.candidate) {
          console.log(e.candidate)
          this.socket.emit('add-ice-candidate', {
            candidate: e.candidate,
            type: 'sender',
            roomId
          });
        }
      };

      this.sendingPc.onnegotiationneeded = async () => {
        const sdp = await this.sendingPc!.createOffer();
        await this.sendingPc!.setLocalDescription(sdp);
        this.socket.emit('offer', { sdp, roomId });
      };
    });

    this.socket.on('offer', async ({ roomId, sdp: remoteSdp }: { roomId: string, sdp: RTCSessionDescriptionInit }) => {
      this.setLobby(false);
      this.receivingPc = new RTCPeerConnection();
      await this.receivingPc.setRemoteDescription(remoteSdp);
      const sdp = await this.receivingPc.createAnswer();
      await this.receivingPc.setLocalDescription(sdp);

      // if (this.remoteVideoRef.nativeElement) {
      //   console.log(stream)
      //   this.remoteVideoRef.nativeElement.srcObject = stream;
      // }

      // this.remoteMediaStream = stream;
      // this.receivingPc.ontrack = (e) => {
      //   this.remoteMediaStream!.addTrack(e.track);
      //   console.log("remote track "+ e.track)
      //   this.remoteVideoRef.nativeElement.play();
      // };

      this.receivingPc.onicecandidate = (e) => {
        if (e.candidate) {
          this.socket.emit('add-ice-candidate', {
            candidate: e.candidate,
            type: 'receiver',
            roomId
          });
        }
      };

      this.socket.emit('answer', { roomId, sdp });
         setTimeout(() => {
        const track1 = this.receivingPc.getTransceivers()[0].receiver.track
        const track2 = this.receivingPc.getTransceivers()[1].receiver.track
        console.log(track1);
        if (track1.kind === "video") {

            this.remoteAudioTrack=track2;
            this.remoteVideoTrack=track1;
        } else {

            this.remoteAudioTrack=track1;
            this.remoteVideoTrack=track2;
        }
        console.log("ccccc"+this.remoteVideoTrack)
        this.remoteVideoRef.nativeElement.srcObject=new MediaStream([this.remoteVideoTrack,this.remoteAudioTrack])
        // this.remoteVideoRef.nativeElement.srcObject=new MediaStream([this.remoteAudioTrack])
        this.remoteVideoRef.nativeElement.play()
        console.log(this.remoteVideoRef.nativeElement.srcObject)
    },5000);

    });

    this.socket.on('answer', ({ roomId, sdp: remoteSdp }: { roomId: string, sdp: RTCSessionDescriptionInit }) => {
      this.setLobby(false);
      if (this.sendingPc) {
        console.log(remoteSdp+" remoteSDP")
        this.sendingPc.setRemoteDescription(remoteSdp);
      }
    });

    this.socket.on('add-ice-candidate', ({ candidate, type }: { candidate: RTCIceCandidate, type: string }) => {
      if (type === 'sender' && this.receivingPc) {
        this.receivingPc.addIceCandidate(candidate);
      } else if (type === 'receiver' && this.sendingPc) {
        this.sendingPc.addIceCandidate(candidate);
      }
    });

    this.socket.on('lobby', () => {
      this.setLobby(true);
    });
  }

  // async initializeMediaTracks() {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //     this.localAudioTrack = stream.getAudioTracks()[0];
  //     this.localVideoTrack = stream.getVideoTracks()[0];
  //     console.log(this.localAudioTrack)
  //     if (this.localVideoRef.nativeElement) {
  //       this.localVideoRef.nativeElement.srcObject = new MediaStream([this.localVideoTrack]);
  //       this.localVideoRef.nativeElement.play();
  //     }
  //   } catch (err) {
  //     console.error('Error accessing media devices.', err);
  //   }
  // }

  setLobby(state: boolean) {
    this.lobby = state;
  }
}
