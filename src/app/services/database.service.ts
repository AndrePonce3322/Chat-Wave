import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

export interface UserData {
  img: string | null;
  email: string | null;
  name: string | null;
}

export interface UserDataAndMessages {
  img: string | null;
  email: string | null;
  name: string | null;
  msgs: Array<MessageDataResponse>;
}

export interface UserDataResponse {
  name: string;
  email: string;
  img: string;
  CreatedAt: Date;
  notes: Array<string>;
  _id: string;
}

export interface MessageDataResponse {
  _id: string;
  messageText: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
    img: string;
  };
}

export interface MessagesWithUser {
  mesagges: Array<MessageDataResponse>;
}

@Injectable({
  providedIn: 'root',
})
export class DataBaseService {
  private URL = environment.url;

  constructor(private http: HttpClient) {}

  SendUser(body: UserData) {
    return this.http.post<UserDataResponse>(this.URL, body);
  }

  getMessages() {
    return this.http.get<MessagesWithUser>(this.URL);
  }

  getUsers() {
    return this.http.get<Array<UserDataAndMessages>>(`${this.URL}/users`);
  }
}
