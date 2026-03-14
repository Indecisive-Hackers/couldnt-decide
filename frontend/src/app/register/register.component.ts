import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {IUser, NewUser} from "../entities/user/user.model";
import {UserApiService} from "../entities/user/user-api.service";
import {finalize, Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent{

  model : NewUser = {id: null, username: "", password: "", email_address: ""}
  submitted = false;
  userAPI = inject(UserApiService);

  onSubmit() {
    this.subscribeToSaveResponse(this.userAPI.registerUser(this.model))
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IUser>>) : void {
    result.pipe(
    finalize(() => this.submitted = true)).subscribe({
      next: () => history.back(),
      error: err => {
        document.getElementById("error-div")!.innerHTML = err.error.split("\n").reverse()[1].toString();
        document.getElementById("error-div")!.style.visibility = "visible";
      },
    })
  }

}
