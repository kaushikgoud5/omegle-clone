import { state } from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GetCamService } from '../../services/get-cam.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {


@ViewChild('localVideo', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;

  constructor(private router: Router, private getCamService: GetCamService) {}

  ngOnInit() {
    this.getCamService.getCam();
    this.getCamService.localVideoTrack$.subscribe((videoTrack) => {
      if (videoTrack && this.videoRef.nativeElement) {
        this.videoRef.nativeElement.srcObject = new MediaStream([videoTrack]);
        this.videoRef.nativeElement.play();
      }
    });
  }

  onclickJoin(inp: HTMLInputElement) {
    this.router.navigate(['room', inp.value]);
  }
} 
