import { UserAuthService } from './../../services/user-auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  show_success_message: boolean = false;
  show_error_message: boolean = false;

  message: string = "";

  constructor(
    private userAuth: UserAuthService,
    private router: Router
  ) {
    this.userAuth.isUserVerified().then((isVerified) => {
      if(isVerified) {
        this.router.navigate(['/dashboard']);
      }
    })
  }

  ngOnInit() {
  }

  resend_verification_link(): void{
    this.userAuth.resendVerfication().then((message) => {
      if(message != null || message!== ''){
        this.message = 'Verification Link sent successfully!'
        this.show_success_message = true;
        this.show_error_message = false;
      } else{
        this.message = message;
        this.show_success_message = false;
        this.show_error_message = true;
      }
    });
  }

  back_login(): void{
    this.userAuth.logout().then(() => {
      this.router.navigate(['/login']);
    }, (error) => {
      console.log(error.message);
    });
  }

}
