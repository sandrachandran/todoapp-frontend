import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import {RouterModule,Router} from '@angular/router';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { ResetComponent } from './reset/reset.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { LoginGuardService } from '../login-guard.service';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ResetComponent, PasswordChangeComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild([
      {path:'register',component:SignupComponent,canActivate:[LoginGuardService]},
      {path:'reset',component:ResetComponent,canActivate:[LoginGuardService]},
      {path:'passwordChange/:userId/:authToken',component:PasswordChangeComponent}
    ]),
    Ng2TelInputModule
  ],
  providers:[LoginGuardService]
})
export class UserModule { }
