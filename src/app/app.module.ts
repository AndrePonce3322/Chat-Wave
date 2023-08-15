import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material
import { AngularmaterialModule } from './angularmaterial/angularmaterial.module';
import { HomeComponent } from './Components/home/home.component';
import { Router } from './router/router.module';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { ReactiveFormsModule } from '@angular/forms';

import { ChatComponent } from './Components/chat/chat.component';

// npm packages
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';

// HTTP
import { HttpClientModule } from '@angular/common/http';

// Socket.io
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { provideStorage, getStorage } from '@angular/fire/storage';

const config: SocketIoConfig = {
  url: 'https://chat-api-hhzn-dev.fl0.io', // socket server url;
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
