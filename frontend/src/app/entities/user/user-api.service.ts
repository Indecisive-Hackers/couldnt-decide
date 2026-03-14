import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {IUser, NewUser} from "./user.model";
import {Observable} from "rxjs";
import {API_URL} from "../../env";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(private http: HttpClient) { }

  registerUser(new_user : NewUser): Observable<HttpResponse<IUser>> {
    return this.http.post<IUser>(`${API_URL}/api/register-user`, new_user, { observe: 'response' })
  }

  loginUser(new_user : NewUser | IUser): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${API_URL}/api/login`, new_user, {observe: 'response'})
  }
}
