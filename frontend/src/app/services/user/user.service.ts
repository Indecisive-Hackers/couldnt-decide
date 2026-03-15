import { Injectable } from '@angular/core';
import {IUser} from "../../entities/user/user.model";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSave = new BehaviorSubject<null | IUser>(null);

  constructor() { }

  setCurrentUser(user : IUser) {
    this.userSave.next(user)
  }
  
  clearCurrentUser() {
    this.userSave.next(null)
  }
}
