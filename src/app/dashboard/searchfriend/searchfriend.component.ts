import { Component, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchfriend',
  templateUrl: './searchfriend.component.html',
  styleUrls: ['./searchfriend.component.css']
})
export class SearchfriendComponent implements OnInit {
  public allUser: any = []
  public allFriends = []
  public allReq = []
  public currentUser = Cookie.get('receiverId')
  public term:any;
  public userId:any;
  constructor(
    public AppService: AppService,
    public Toastr: ToastrManager,
    public SocketService:SocketService,
    public Router:Router
  ) { }

  ngOnInit() {
    //initialize friendlist and all user list
    this.userId = Cookie.get('receiverId')
    this.getUserReqList()
    this.getFriendList()
   setTimeout(() => {
     this.getUserList()
   }, 500);
    this.GetChanges()
  }

  //get userlist
  public getUserList = () => {
    this.AppService.getAllUserName()
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
         //remove friends list from all user list
          if (this.allFriends === null || this.allFriends === undefined || this.allFriends.length == 0 ) {
            let reqSent = apiResponse.data.filter(Output=>{
              this.allReq.filter(subOutput=>{
                if(subOutput.userId === Output.userId){
                Output.reqSend=true;
                }
               
                })
              return Output;
            })
            
            this.allUser = reqSent
            console.log(this.allUser)
          }
          else {
            let unRemovedUser = apiResponse.data
            
            let missing = unRemovedUser.filter(output => this.allFriends.some(({ friendId }) => output.userId !== friendId));
            let reqSent = missing.filter(Output=>{
              this.allReq.filter(subOutput=>{
                if(subOutput.userId === Output.userId){
                Output.reqSend=true;
                }
               
                })
              return Output;
            })
            this.allUser = reqSent
          }
        }
        else {
          this.Toastr.infoToastr(apiResponse.message)
        }
      }, (err) => {
        
      this.Router.navigate(['/technical'])
      })
  }

  
  //get all the request list 
  public getUserReqList = () => {
    this.AppService.getAllUserReq()
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
        
          this.allReq = apiResponse.data
        
        }
        else {
        this.allReq=[]
        }
      }, (err) => {
        
      this.Router.navigate(['/technical'])
      })
  }

  //get friendlist
  public getFriendList = () => {
    this.AppService.getAllFriends()
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
      
          this.allFriends = apiResponse.data
        }
        else {
          this.allFriends = []
        }
      }, (err) => {
        
      this.Router.navigate(['/technical'])
      })
  }

  //send request function
  public sendRequest = (data) => {
    let sendData = {
      userId: data.userId,
      userFirstName: data.firstName + ' ' + data.lastName,
      friendReqId: Cookie.get('receiverId'),
      friendReqName: Cookie.get('receiverName')
    }

    this.AppService.sendFriendReq(sendData)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.Toastr.successToastr('Friend Request sent')
          this.sendNotication(null,sendData.userId,`${sendData.friendReqName} has sent you an friend Request`)
          this.sendChanges()
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
      this.allUser=[]
      this.getUserReqList()
      this.getFriendList()
     setTimeout(() => {
       this.getUserList()
     }, 500);
    })
  }


}
