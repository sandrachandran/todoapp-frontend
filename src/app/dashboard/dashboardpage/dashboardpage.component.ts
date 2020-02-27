import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from 'src/app/app.service';
@Component({
  selector: 'app-dashboardpage',
  templateUrl: './dashboardpage.component.html',
  styleUrls: ['./dashboardpage.component.css']
})
export class DashboardpageComponent implements OnInit {
  public userId;
  public Notifications=[]
  constructor(
    public Router: Router,
    public SocketService: SocketService,
    public Toastr: ToastrManager,
    public AppService:AppService
  ) { }

  ngOnInit() {
    this.userId = Cookie.get('receiverId')
    this.getNotification()
    this.GetChanges()
    
  }

  //navigation

  navigate =(data) =>{
    if(data !== null){
      this.Router.navigate(['/editToDo',data])
    }
  }

  
  
//get notification

public getNotification = () =>{
  this.AppService.viewNotification(this.userId)
  .subscribe((apiResponse)=>{
    if(apiResponse.status===200){
     
      this.Notifications = apiResponse.data.reverse()
    }
    else {
      this.Notifications = []
    }
  },(err)=>{
    this.Router.navigate(['/technical'])
  })
}

  //get changes
  public GetChanges = () =>{
    
    this.SocketService.ChangesReceiver(this.userId)
    .subscribe(()=>{
     setTimeout(() => {
      this.Notifications=[]
      this.getNotification()
     }, 3000);
    })
  }


//logout
public logout: any = () => {
  
    this.AppService.logout()
    .subscribe((apiResponse) => {

      if (apiResponse.status === 200) {
        console.log("logout called")
        Cookie.delete('authtoken');

        Cookie.delete('receiverId');

        Cookie.delete('receiverName');

       // this.SocketService.exitSocket()

        this.Router.navigate(['/']);

      } else {
        this.Toastr.errorToastr(apiResponse.message)

      } // end condition

    }, (err) => {
      
      this.Router.navigate(['/technical'])


    });

  }


}
