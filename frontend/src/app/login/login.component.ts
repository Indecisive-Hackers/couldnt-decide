import { Component, inject } from '@angular/core';
import { IUser, NewUser } from '../entities/user/user.model';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common'
import { UserAPI } from '../entities/user/user-api.service';
import { finalize, Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [ FormsModule ]
})
export class LoginComponent {

  model : NewUser = {username: "", password: "", id: null, email_address: ""}
  submitted = false;
  userAPI = inject(UserAPI);
  userService = inject(UserService);

  onSubmit() {
    this.subscribeToSaveResponse(this.userAPI.loginUser(this.model));
  }

  private subscribeToSaveResponse(result : Observable<HttpResponse<IUser>>) : void {
    result.pipe(finalize(() => this.submitted = true)).subscribe({
      next: response => this.loginUser(response.body!),
      error: () => alert("Please check your username or password."),
    });
  }

  loginUser(response : any) : void {
    localStorage.setItem('token', response['token']);
    this.userService.setCurrentUser(response['user'] as IUser);
  }

}