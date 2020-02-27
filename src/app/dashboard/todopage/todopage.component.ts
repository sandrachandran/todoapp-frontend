import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { SocketService } from 'src/app/socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
@Component({
  selector: 'app-todopage',
  templateUrl: './todopage.component.html',
  styleUrls: ['./todopage.component.css']
})
export class TodopageComponent implements OnInit {
public allToDo=[]
public userId:any;
public toDoFound:Boolean;
public skip:number=0;
public userName:any;
  constructor(
    public Router:Router,
    public Toastr:ToastrManager,
    public AppService:AppService,
    public SocketService:SocketService
  ) { }

  ngOnInit() {
    //initialize all todo
    this.getAllToDo(this.skip)
    this.userId=Cookie.get('receiverId')
    this.GetChanges()
    this.userName = Cookie.get('receiverName')
  }

    //Pagination Funtion

    public previouspage () {
      if(this.skip===0){
        this.Toastr.infoToastr('NO PREVIOUS TODO FOUND')
      }
      else {
        this.skip = this.skip-3;
        this.allToDo=[]
        this.getAllToDo(this.skip);
      }
    }
  
  public nextpage() {
     this.skip = this.skip+3;
     
     this.allToDo=[]
     this.getAllToDo(this.skip);
     if(this.allToDo.length ===0){
      this.skip=3
      
    }
    
  }
  
  //router to edit todo
  editToDo = (data) =>{
    this.Router.navigate(['/editToDo',data])
  }

  //router to create todo
  routeToCreate = () =>{
    this.Router.navigate(['/createtodo'])
  }

  //get all todo function
  getAllToDo = (data) =>{
    this.AppService.getAllToDo(data)
    .subscribe((apiResponse)=>{
      if(apiResponse.status == 200){
        this.allToDo = apiResponse.data
        this.toDoFound = true;
      }
      else{
        this.allToDo=[]
        this.toDoFound = false;
      }
      
    },(err)=>{
      
      this.Router.navigate(['/technical'])
    })
  }
  
  //delete a Todo function
  deleteToDo = (data) =>{
    this.AppService.deleteToDo(data)
    .subscribe((apiResponse)=>{
      if(apiResponse.status == 200){
        this.allToDo=[]
        this.getAllToDo(this.skip)
        this.Toastr.successToastr('ToDo Deleted')
        
        this.sendGroupNotification(data,`${this.userName} has Deleted ToDo ${apiResponse.data.title} `)
        this.sendChanges()

      }
      else{
        this.Toastr.infoToastr(apiResponse.message)
      }
      
    },(err)=>{
      
      this.Router.navigate(['/technical'])
    })
  }

  
  //send Group Notification
  sendGroupNotification = (todoId,message) =>{
    let data = {
      todoId:todoId,
      message:message
    }
    this.SocketService.SendGroupNotificationMessage(data)
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
      
      this.getAllToDo(this.skip)
    })
  }
}
