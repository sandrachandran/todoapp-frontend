import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from './../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userName: any;
  public password: any;
  public showSpinner:Boolean=false;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrManager,

  ) {



  }

  ngOnInit() {
  }

  //router to go to signup
  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  }

  //signin function
  public signin: any = () => {

    if (!this.userName) {
      this.toastr.infoToastr('enter email')


    } else if (!this.password) {

      this.toastr.infoToastr('enter password')


    } else {
      this.showSpinner=true;

      let data = {
        userName: this.userName,
        password: this.password
      }

      this.appService.signinFunction(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status === 200) {
            console.log(apiResponse)

            Cookie.set('authtoken', apiResponse.data.authToken);

            Cookie.set('receiverId', apiResponse.data.userDetails.userId);

            Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);

            this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)

            this.router.navigate(['/dashboard']);
            this.showSpinner = false;

          } else {
            this.toastr.errorToastr(apiResponse.message)
            this.showSpinner=false;
          }

        }, (err) => {
          this.router.navigate(['/technical'])

        });

    } // end condition

  } // end signinFunction




}