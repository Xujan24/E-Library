import { PoliciesComponent } from './policies/policies.component';
import { VerifyGuard } from './../guards/verify.guard';
import { AuthGuard } from './../guards/auth.guard';
import { VerifyComponent } from './verify/verify.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'password-reset', component: ResetPasswordComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'verify', component: VerifyComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'terms-and-conditions', component: PoliciesComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
