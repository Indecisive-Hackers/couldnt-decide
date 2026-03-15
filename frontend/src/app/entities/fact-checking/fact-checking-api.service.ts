import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {IUser, NewUser} from "../user/user.model";
import {Observable} from "rxjs";
import {API_URL} from "../../env";
import {IModeration} from "./fact-checking-result.model";

@Injectable({
  providedIn: 'root'
})
export class FactCheckingApiService {

  constructor(private http: HttpClient) { }

  checkFacts(text: string, user : number): Observable<HttpResponse<IModeration>> {
    return this.http.post<IModeration>(`${API_URL}/api/check-facts`, {'text': text, 'speaker': user}, { observe: 'response' });
  }
}
