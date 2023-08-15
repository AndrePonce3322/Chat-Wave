import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../Components/home/home.component';
import { NotfoundComponent } from '../Components/notfound/notfound.component';
import { ChatComponent } from '../Components/chat/chat.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const Routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'chat',
    component: ChatComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/'])),
  },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(Routes)],
  exports: [RouterModule],
})
export class Router {}
