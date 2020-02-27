import { Component, OnInit } from '@angular/core';

import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  public email: any;
  public recoverKey: any;
  public showSpinner:Boolean=false;
  constructor(
    public Toastr: ToastrManager,
    public AppService: AppService,
    public Router:Router
  ) {

  }

  ngOnInit() {
  }

  //reset functionality for UserName and 
  reset = () => {
    console.log(this.recoverKey)
    if (!this.email) {
      this.Toastr.infoToastr('Enter Email')
    }
    else if (!this.recoverKey) {
      this.Toastr.infoToastr('Choose UserName or Password ')
    }
    else {
      if (this.recoverKey == 'userName') {
        this.showSpinner=true;
        let data = {
          email: this.email
        }
        this.AppService.getUserNameRecover(data)
          .subscribe((apiResponse) => {
            if (apiResponse.status === 200) {
              this.showSpinner=false;
              this.Toastr.successToastr('A Email with User Details sent to your registered Email')
            }
            else {
              this.Toastr.infoToastr(apiResponse.message)
              this.showSpinner=false;
            }
          }, (err) => {
           
          this.Router.navigate(['/technical'])
          })

      }
      else {
        this.showSpinner=true;
        let data = {
          email: this.email
        }
        this.AppService.getPasswordRecover(data)
          .subscribe((apiResponse) => {
            if (apiResponse.status === 200) {
              this.Toastr.successToastr('A Email with User Details sent to your registered Email')
              this.showSpinner=false;
            }
            else {
              this.Toastr.infoToastr(apiResponse.message)
              this.showSpinner=false;
            }
          }, (err) => {
            
          this.Router.navigate(['/technical'])
          })

      }
    }
  }

}
