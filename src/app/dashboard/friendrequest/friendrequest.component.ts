import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { SocketService } from 'src/app/socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friendrequest',
  templateUrl: './friendrequest.component.html',
  styleUrls: ['./friendrequest.component.css']
})
export class FriendrequestComponent implements OnInit {
  public allReq = []
  public userId :any;
  public noReqFound:Boolean;
  constructor(public Toastr: ToastrManager,
    public AppService: AppService,
    public SocketService:SocketService,
    public Router:Router) { }

  ngOnInit() {
    //initialize the friend request list
    this.getReqList()
    this.userId = Cookie.get('receiverId')
    this.GetChanges()

  }

  //get all the request list 
  public getReqList = () => {
    this.AppService.getAllReq()
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
        
          this.allReq = apiResponse.data
          this.noReqFound = true;
        }
        else {
          this.noReqFound = false;
        }
      }, (err) => {
        
      this.Router.navigate(['/technical'])
      })
  }

  //button click to delete request
  public deleteRequest = (data) => {
    console.log(data)
    this.AppService.deleteReq(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.allReq =[]
          this.getReqList()
          setTimeout(() => {
            this.Toastr.successToastr(apiResponse.message)

          }, 500);

        }
        else {
          this.Toastr.infoToastr(apiResponse.message)
        }
      }, (err) => {
        this.Router.navigate(['/technical'])
      })
  }

  //accept a friend request
  public acceptRequest = (data) => {
    this.AppService.acceptReq(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.allReq = []
          this.getReqList()
          setTimeout(() => {
          
            this.Toastr.successToastr(apiResponse.message)
            this.sendNotication(null,data.friendReqId,`${data.userFirstName} has accepted your Friend Request`)  
          }, 500);

        }
        else {
          this.Toastr.infoToastr(apiResponse.message)
        }
      }, (err) => {
        
      this.Router.navigate(['/technical'])
      })
  }

   //Send Notification

   public sendNotication = (toDoId, userId, message) => {
    let data = {
      toDoId: toDoId,
      userId: userId,
      message: message
    }
    this.SocketService.SendNotificationMessage(data);
  }
  
  
  //send changes
    //sendchanges 
    sendChanges = () =>{
      this.SocketService.SendGroupChanges()
    }
  

  //get changes
  public GetChanges = () =>{
    
    this.SocketService.ChangesReceiver(this.userId)
    .subscribe(()=>{
      this.allReq=[]
      this.getReqList()
    })
  }
}
