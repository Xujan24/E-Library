import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  isFormValid: boolean = false;
  showPwdError: boolean = false;
  showEmailError: boolean = false;
  showEmailMismatchError: boolean = false;

  validPasswordPattern: string = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';
  emailError: string = "";

  signupForm = new FormGroup({
    displayName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    re_email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private userAuth: UserAuthService,
    private router: Router
  ) {
    this.userAuth.isLoggedIn().then((isLoggedIn) => {
      if(isLoggedIn){
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngOnInit() {
  }

  matchEmail(): void{
    if(this.signupForm.get('email').value === this.signupForm.get('re_email').value){
      this.showEmailMismatchError = false;
    } else{
      this.showEmailMismatchError = true;
    }

    this.checkForm();
  }

  checkForm(): void{
    this.isFormValid=this.signupForm.valid && !this.showEmailMismatchError;
  }

  btnClick(): void{
    if(this.signupForm.get('password').value.match(this.validPasswordPattern)){
      // go ahead with the signup process;
      this.showPwdError = false;

      const displayName = this.signupForm.get('displayName').value;
      const email = this.signupForm.get('email').value;
      const pwd = this.signupForm.get('password').value;
      
      this.userAuth.signup(email, pwd, displayName).then((message)=>{
        if(message != null || message !== '') {
          this.emailError = message;
          this.showEmailError = true;
        }
      });
    } else {
      this.showPwdError = true;
    }
  }

}
