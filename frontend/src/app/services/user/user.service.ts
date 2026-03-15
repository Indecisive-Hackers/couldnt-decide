import { Injectable } from '@angular/core';
import {IUser} from "../../entities/user/user.model";
import {BehaviorSubject} from "rxjs";
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSave = new BehaviorSubject<null | IUser>(null);
  currentUser = this.userSave.asObservable();
  isAuthenticated = false;

  constructor(private socket : Socket) { }

  setCurrentUser(user : IUser) {
    this.userSave.next(user);
    this.isAuthenticated = true;
    this.currentUser.subscribe(usr => {this.socket.emit('sign_in',usr)});
  }

  clearCurrentUser() {
    this.userSave.next(null);
  }
}
