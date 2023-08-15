import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';

export interface MessageData {
  _id: string;
  messageText: string;
  img?: string;
  video?: string;
  createdAt: Date;
  user: {
    name: string;
    img: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  sendMessage(body: MessageData) {
    const bodyMessage = {
      _id: body._id,
      messageText: body.messageText,
      img: body.img,
      video: body.video,
      createdAt: new Date(),
      user: {
        name: body.user.name,
        img: body.user.img,
      },
    };

    this.socket.emit('message', JSON.stringify(bodyMessage));
  }

  getMessage() {
    return this.socket.fromEvent('recibido').pipe(map((data) => data));
  }

}
