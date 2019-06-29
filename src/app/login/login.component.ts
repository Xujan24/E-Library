import { Router } from '@angular/router';
import { UserAuthService } from './../../services/user-auth.service';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errorMessage: string = "";
  is_visible: boolean = false; // flag to show or hide the message pannel

  // login form
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private userAuth: UserAuthService,
    private router: Router
    ){
      this.userAuth.isLoggedIn().then(isLoggedIn => {
        if(isLoggedIn){
          this.router.navigate(['/dashboard']);
        }
      });
    }

  // function to toggle the error message
  public toggleMessage(): void{
    this.is_visible = !this.is_visible;
  }

  // function to handle user login
  public login(): void{
    if(this.loginForm.valid){
      // do login
      this.userAuth.login(this.loginForm.get('username').value, this.loginForm.get('password').value).then(message => {
        if(message != "" || message != null){
          this.errorMessage = message;
          this.is_visible = true;
        }
      });
    } else{
      this.errorMessage = "Empty username and/or password!";
      this.is_visible = true;
    }
  }

}
