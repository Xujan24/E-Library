import { DashboardComponent } from './../dashboard.component';
import { UserAuthService } from './../../../services/user-auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  show_error = false;
  show_success = false;
  disable_submit = true;
  show_invalid_pwd_warning = false;
  show_pwd_notmatch_warning = false;
  deleteAccountClicked: boolean;
  pwd = '';


  validPasswordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';
  errorMessage = '';

  changeNameForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  passwordChangeForm = new FormGroup({
    old_password: new FormControl('', Validators.required),
    new_password: new FormControl('', Validators.required),
    re_new_password: new FormControl('', Validators.required)
  });
  constructor(
    private userAuth: UserAuthService,
    private dashboard: DashboardComponent,
  ) {}

  ngOnInit() {
    this.getDisplayName();
  }

  getDisplayName() {
    this.userAuth.getCurrentUser()
    .then(
      user => {
      if(user){
        this.changeNameForm.setValue({name: user.displayName});
      }
    })
    .catch(e => console.log(e.message));

  }

  changeName() {
    this.show_success = false;
    const name = this.changeNameForm.get('name').value;
    this.userAuth.updateDisplayName(name)
    .then(() => {
      this.show_success = true;
      this.dashboard.displayName = name;
    })
    .catch(e => console.log(e.message));
  }

  toggleSuccess() {
    this.show_success = !this.show_success;
  }

  toggleMessage(): void {
    this.show_error = !this.show_error;
  }

  matchPassword(): boolean {
    if (this.passwordChangeForm.get('new_password').value === this.passwordChangeForm.get('re_new_password').value) {
      return true;
    }
    return false;
  }

  validateForm() {
    if (this.passwordChangeForm.valid) {
      this.disable_submit = false;
    } else {
      this.disable_submit = true;
    }
  }

  submitForm(): void {

    this.show_invalid_pwd_warning = false;
    this.show_pwd_notmatch_warning = false;
    this.show_error = false;

    if (this.passwordChangeForm.get('new_password').value.match(this.validPasswordPattern)) {

      if (this.matchPassword()) {
        const old_password = this.passwordChangeForm.get('old_password').value;
        const new_password = this.passwordChangeForm.get('new_password').value;

        if (old_password !== new_password) {
          this.userAuth.updatePassword(old_password, new_password).then((message) => {
            this.errorMessage = message;
            if (typeof this.errorMessage !== 'undefined') {
              this.show_error = true;
            }
          });
        } else {
          this.errorMessage = 'Please use another passowrd different from your current one.';
          this.show_error = true;
        }


      } else {
        this.show_pwd_notmatch_warning = true;
      }

    } else {
      this.show_invalid_pwd_warning = true;
    }
  }

  async deleteAccount() {
    this.deleteAccountClicked = true;
    if (this.pwd.length > 0) {
      this.userAuth.deleteAccount(this.pwd);
    }
  }
}
