import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';

// Angular Material
import { ReactiveFormsModule } from '@angular/forms';
import { AngularmaterialModule } from './angularmaterial/angularmaterial.module';
import { HomeComponent } from './Components/home/home.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { Router } from './router/router.module';

import { ChatComponent } from './Components/chat/chat.component';

// npm packages
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { environment } from '../environments/environment.prod';

// HTTP
import { HttpClientModule } from '@angular/common/http';

// Socket.io
import { getStorage, provideStorage } from '@angular/fire/storage';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const config: SocketIoConfig = {
  url: 'https://chatapi-socket-dev-mgdp.2.us-1.fl0.io', // socket server url;
  options: {
    transports: ['websocket'],
  },
};

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    NotfoundComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularmaterialModule,
    Router,
    ReactiveFormsModule,
    PickerComponent,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
