import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { RoomComponent } from './components/room/room.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
    },
  {
    path: 'home',
    component: LandingComponent,
  },
  {
    path:'room/:name',
    component:RoomComponent
  }
];
