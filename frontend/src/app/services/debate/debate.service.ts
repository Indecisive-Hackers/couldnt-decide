import { Injectable } from '@angular/core';
import {IUser} from "../../entities/user/user.model";
import {map, Subject} from "rxjs";
import { Socket } from 'ngx-socket-io';
import {IMessage} from "../../entities/message/message.model";

@Injectable({
  providedIn: 'root'
})
export class DebateService {
  user : IUser;
  messages : IMessage[] = [];
  debatingWith = new Subject<IUser>();

  constructor(private socket: Socket) {}

  sendMessage(message: IMessage) {
    this.socket.emit('message', message);
  }

  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data: any) => data))
  }

  getUsers() {
    return this.socket.fromEvent('current_users').pipe(map((data: any) => data))
  }

}
