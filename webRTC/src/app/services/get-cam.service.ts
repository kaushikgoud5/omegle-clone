import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetCamService {
  private localAudioTrack = new BehaviorSubject<MediaStreamTrack | null>(null);
  private localVideoTrack = new BehaviorSubject<MediaStreamTrack | null>(null);

  localAudioTrack$: Observable<MediaStreamTrack | null> = this.localAudioTrack.asObservable();
  localVideoTrack$: Observable<MediaStreamTrack | null> = this.localVideoTrack.asObservable();

  constructor() {}

  async getCam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];
      this.localAudioTrack.next(audioTrack);
      this.localVideoTrack.next(videoTrack);
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  }
}
