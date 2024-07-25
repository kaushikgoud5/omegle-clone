import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'OmeagleClone';


  // peerConnection;
  // offer;
  // localStream;
  // remoteStream;
  // servers={
  //   iceServers:[{
  //       urls:[  
  //         'stun:stun.l.google.com:19302']
  //   }]
  // }
  // @ViewChild('videoElement1', { static: true }) videoElement: ElementRef<HTMLVideoElement>;
  // @ViewChild('videoElement2', { static: true }) videoElement1: ElementRef<HTMLVideoElement>;
  // video: HTMLVideoElement;
  // video1: HTMLVideoElement;
  // constraints: MediaStreamConstraints = {
  //   video: true,
  //   audio: false
  // };

  // ngOnInit(): void {
  //   this.video = this.videoElement.nativeElement;
  //   navigator.mediaDevices.getUserMedia(this.constraints).then(stream => {
  //     if ("srcObject" in this.video) {
  //       this.video.srcObject = stream;
  //       this.localStream=stream;
  //     }
  //   }).catch(error => {
  //     console.error('Error accessing media devices.', error);
  //   });

  // //  this.createOffer();
  // }
//  async createOffer(){
//     this.peerConnection= new RTCPeerConnection(this.servers);
//     this.video1=this.videoElement1.nativeElement;
//    this.remoteStream=new MediaStream();
//    this.video1.srcObject = this.remoteStream;
//     this.localStream.getTracks().forEach((track) => {
//       this.peerConnection.addTrack(track,this.localStream)
//     });
//     this.peerConnection.ontrack=(event)=>{
//       // event.streams[0].getTracks().forEach((track) => {
//       //   this.remoteStream.addTrack()
//       // });
//       console.log(event)
//     }
//     this.peerConnection.onicecandidate=async (event)=>{
//       if(event.candidate){
//         console.log('ice:',event.candidate)
//       }
//     }
//     this.peerConnection.createOffer().then((x)=>{
  //       this.offer=x
  //     await this.peerConnection.setLocalDescription(this.offer);
  //     });
  //   }
//     console.log(this.offer)


// async makeCall() {
//   const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
//   const peerConnection = new RTCPeerConnection(configuration);
//   signalingChannel.addEventListener('message', async message => {
//       if (message.answer) {
//           const remoteDesc = new RTCSessionDescription(message.answer);
//           await peerConnection.setRemoteDescription(remoteDesc);
//       }
//   });
//   const offer = await peerConnection.createOffer();
//   await peerConnection.setLocalDescription(offer);
//   signalingChannel.send({'offer': offer});
// }


}



