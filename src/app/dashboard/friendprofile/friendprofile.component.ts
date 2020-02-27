import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-friendprofile',
  templateUrl: './friendprofile.component.html',
  styleUrls: ['./friendprofile.component.css']
})
export class FriendprofileComponent implements OnInit {
  public friendId:any;
  public allToDo:any;
  public userId:any;
  public skip:number =0;
  public found:Boolean;
  public userName:any;
  constructor(public ActivatedRoute: ActivatedRoute,
    public Router: Router,
    public AppService: AppService,
    public Toastr: ToastrManager,
    public SocketService:SocketService
    ) { }

  ngOnInit() {
    //intialize all the todo for friend 
    this.friendId = this.ActivatedRoute.snapshot.paramMap.get('userId')
    this.getAllToDo()
    this.userId = Cookie.get('receiverId')
    this.GetChanges()
    this.userName = Cookie.get('receiverName')
  }

  //get all the todo data
  getAllToDo = () =>{
  if(this.friendId === null){
    console.log("no friend id")
  } 
  else {
    this.AppService.getAllFriendToDo(this.skip,this.friendId)
    .subscribe((apiResponse)=>{
      if(apiResponse.status == 200){
        this.allToDo = apiResponse.data
        this.found = true;
      }
      else if(apiResponse.status === 204){
        this.Router.navigate(['/unauthorized'])
        this.friendId=null
      }
      else{
        this.found = false;
        
      }
      
    },(err)=>{
      
      this.Router.navigate(['/technical'])
    })
 
  } 
  }

  
  //delete a Todo function
  deleteToDo = (data) =>{
    this.AppService.deleteToDo(data)
    .subscribe((apiResponse)=>{
      if(apiResponse.status == 200){
        this.allToDo=[]
        this.getAllToDo()
        this.Toastr.successToastr('ToDo Deleted')
        this.sendGroupNotification(data,`${this.userName} has Deleted ToDo ${apiResponse.data.title} created by ${apiResponse.data.createrName}`)
        this.sendChanges()
      }
      else{
        this.Toastr.infoToastr(apiResponse.message)
      }
      
    },(err)=>{
      
      this.Router.navigate(['/technical'])
    })
  }

  //router to edit todo
  editToDo = (data) =>{
    this.Router.navigate(['/editfriendToDo',this.friendId,data])
  }

  
  //send changes
    //sendchanges 
    sendChanges = () =>{
      this.SocketService.SendGroupChanges()
    }
  

  //get changes
  public GetChanges = () =>{
    console.log('get changes called')
    this.SocketService.ChangesReceiver(this.userId)
    .subscribe(()=>{
      this.allToDo=[]
      this.getAllToDo()
    })
  }

  
    //Pagination Funtion

    public previouspage () {
      if(this.skip===0){
        this.Toastr.infoToastr('No Previous ToDo found')
      }
      else {
        this.skip = this.skip-3;
        this.allToDo=[]
        this.getAllToDo();
      }
    }
  
  public nextpage() {
     this.skip = this.skip+3;
    
     this.allToDo=[]
     this.getAllToDo();
    if(this.allToDo.length ===0){
      this.skip=3
      
    }
  }

  //logout
  
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

//dashboard navigate

navigateToDashboard = ()=>{
  this.Router.navigate(['/dashboard'])
}

//send Group Notification
sendGroupNotification = (todoId,message) =>{
  let data = {
    todoId:todoId,
    message:message
  }
  this.SocketService.SendGroupNotificationMessage(data)
}

}
