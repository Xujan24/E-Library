import { UserAuthService } from './../../services/user-auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  errorMessage: string = ""
  is_err_visible: boolean = false;     // flag to show hide the error message
  email: string = "";                  // variable to hold the email
  showSuccessMessage: boolean = false; // flag toggle between password reset form and successful message

  constructor(
    private userAuth: UserAuthService,
    private router: Router
  ) {
    this.userAuth.isLoggedIn().then((loggedIn) => {
      if(loggedIn){
        this.router.navigate(['/dashboard']);
      }
    })
  }

  ngOnInit() {
  }

  public toggleErrMessage(): void{
    this.is_err_visible = !this.is_err_visible;
  }

  public sendCode(): void{
    if(this.email === ""){
      this.errorMessage="Sorry the email doesn't exists!"
      this.is_err_visible=true;
    } else{
      this.errorMessage = "";
      this.is_err_visible = false;

      this.userAuth.sendPwdResetLink(this.email).then((message) => {
        if(message!=='' || message != null){
          
          this.errorMessage = message;
          this.is_err_visible = true;
          this.showSuccessMessage = false;
        } else{
          this.showSuccessMessage = true;
          this.errorMessage = "";
          this.is_err_visible= false;
        }
      });
    }
    
  }

}
