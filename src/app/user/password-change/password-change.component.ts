import { Component, OnInit } from '@angular/core';

import { AppService } from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {
  public password: any;
  public confirmpassword: any;
  public userId: any;
  public authToken: any;
  constructor(
    public ActivatedRoute: ActivatedRoute,
    public Router: Router,
    public AppService: AppService,
    public Toastr: ToastrManager,

  ) { }

  ngOnInit() {
    //ger userid and authtoken from link
    this.userId = this.ActivatedRoute.snapshot.paramMap.get('userId')
    this.authToken = this.ActivatedRoute.snapshot.paramMap.get('authToken')

  }

  //reset password
  passwordreset = () => {
    console.log(this.userId)
    console.log(this.authToken)
    if (!this.password) {
      this.Toastr.infoToastr('Enter Password')
    }
    else if (!this.confirmpassword) {
      this.Toastr.infoToastr('Enter Confirm Password')
    }
    else if (this.password != this.confirmpassword) {
      this.Toastr.infoToastr('Password does not match')
    }
    else {
      let data = {
        userId: this.userId,
        password: this.password,
        authToken: this.authToken
      }
      this.AppService.setPasswordRecover(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.Toastr.successToastr('Password Reset Sucessfull')
            setTimeout(() => {
              this.Router.navigate(['/login']);
            }, 1000);
          }
          else {
            this.Toastr.infoToastr(apiResponse.message)
          }
        }, (err) => {
          
          this.Router.navigate(['/technical'])
        })
    }
  }
}
