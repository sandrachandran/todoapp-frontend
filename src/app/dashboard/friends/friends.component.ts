import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  public allFriends = []
  public userId:any;
  public friendsFound:Boolean;
  public term:any;
  constructor(public Toastr: ToastrManager,
    public AppService: AppService,
    public Router: Router,
    public SocketService:SocketService) { }

  ngOnInit() {
    //initialize the friend list
    this.getFriendList()
    this.userId = Cookie.get('receiverId')
    this.GetChanges()
   
  }

  //get all the friend list for a user
  public getFriendList = () => {
    this.AppService.getAllFriends()
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
        
          this.allFriends = apiResponse.data
          this.friendsFound = true;
        }
        else {
          this.friendsFound = false;
        }
      }, (err) => {
        
      this.Router.navigate(['/technical'])
      })
  }

  //remove a friend from list
  deleteFriends = (data) => {
    this.AppService.deleteFriends(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.allFriends = []
          this.getFriendList()
          this.Toastr.successToastr(apiResponse.message)
          this.sendChanges()
        }
        else {
          this.Toastr.infoToastr(apiResponse.message)
        }
      }, (err) => {
        
      this.Router.navigate(['/technical'])
      })
  }

  //view friend profile button click
  viewToDo = (data) => {
    
    this.Router.navigate(['/friendprofile', data.friendId])
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
      this.allFriends=[]
      this.getFriendList()
    })
  }

  
}
