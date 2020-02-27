import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;
  public userName: any;
  public countryCode:any;
  public countries = []
  public codes = []
  public complete = []
  public showSpinner:Boolean=false;
  public phoneCode:any;
  constructor(  
    public appService: AppService,
    public router: Router,
    private toastr: ToastrManager,
   ) {

     }

  ngOnInit() {
  this.country()
  }

  //getcountrydetails

  country =() =>{
    this.appService.getCountryName()
    .subscribe((apiResponse)=>{
      for(let country in apiResponse){
        this.countries.push({name:apiResponse[country],code:country})
      }
      
      })

      }

  addphonecode = () =>{
    let result = this.countries.filter(output =>{
      this.codes.filter(suboutput =>{
        if(suboutput.code == output.code){
          output.phone = suboutput.phone
        }
      })
      return output;
    })

    this.complete = result
    console.log(result)
  }

  countryChanges = () =>{
    
    if(this.countryCode !== null || this.countryCode !==undefined){
      this.appService.getCountryNumber()
      .subscribe((apiResponse)=>{
        for(let i in apiResponse){
          if(this.countryCode === i){
            this.phoneCode =  apiResponse[i]
            console.log(this.phoneCode)
          }
        }
      })
    }
  }

  //change country code
  onCountryChange(e){
    this.countryCode = e.dialCode;
    console.log(this.countryCode)
  }

  //go to signin page
  public goToSignIn: any = () => {

    this.router.navigate(['/']);

  } // end goToSignIn

  //register funciton
  public signupFunction: any = () => {

    if (!this.firstName) {
      this.toastr.infoToastr('enter first name')
     

    } else if (!this.lastName) {
      this.toastr.infoToastr('enter last name')

    } else if (!this.mobile) {
      this.toastr.infoToastr('enter mobile')

    } else if (!this.email) {
      this.toastr.infoToastr('enter email')

    } else if (!this.password) {
      this.toastr.infoToastr('enter password')
     

    } else if (!this.userName) {
      this.toastr.infoToastr('Enter your UserName')

    } else {
      this.showSpinner = true;

     let  mobilenumber = this.phoneCode+this.mobile
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: mobilenumber,
        email: this.email,
        password: this.password,
        userName: this.userName
      }

      

      this.appService.signupFunction(data)
        .subscribe((apiResponse) => {

          console.log(apiResponse);

          if (apiResponse.status === 200) {

            this.toastr.successToastr('Signup successful');
            this.showSpinner=false;
            setTimeout(() => {

              this.goToSignIn();

            }, 2000);

          } else {

            this.toastr.errorToastr(apiResponse.message);
            this.showSpinner=false;

          }

        }, (err) => {

          this.router.navigate(['/technical'])

        });

    } // end condition

  } // end signupFunction

}
