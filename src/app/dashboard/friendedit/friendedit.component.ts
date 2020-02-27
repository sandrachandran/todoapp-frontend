
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-friendedit',
  templateUrl: './friendedit.component.html',
  styleUrls: ['./friendedit.component.css']
})
export class FriendeditComponent implements OnInit {
  public TodoId: any;
  public todolist = [];
  public todo: any;
  public item: any;
  public subitem: any;
  public userName:any;
  public userId:any;
  public title:any;
  public friendId:any;
  public showSpinner:Boolean=false;
  constructor(
    public Router: Router,
    public Toastr: ToastrManager,
    public AppService: AppService,
    public ActivatedRoute: ActivatedRoute,
    public SocketService:SocketService) { }

  ngOnInit() {
//initialize the Todo data
    this.TodoId = this.ActivatedRoute.snapshot.paramMap.get('toDoId')
    this.friendId = this.ActivatedRoute.snapshot.paramMap.get('userId')
    this.getToDo()
    this.userName = Cookie.get('receiverName')
    this.userId = Cookie.get('receiverId')
    this.GetChanges()
  }
  
  //add an item in array
  addItem = () => {
    if (!this.item) {
      this.Toastr.infoToastr('PLEASE ENTER A ITEM')
    } else {
      this.todolist.push({ itemname: this.item, itemcompleted: false, subTodoitem: [] })
      
      this.item = ''
    }
  }

  //add a subToDo item
  addSubItem = (data) => {
    if (!this.subitem) {
      this.Toastr.infoToastr('PLEASE ENTER A SUB ITEM')
    }
    else {
      for (let i = 0; i < this.todolist.length; i++) {
        if (this.todolist[i].itemname == data) {
          this.todolist[i].subTodoitem.push({ subitemname: this.subitem, completed: false })
        }
      }
      this.subitem = ''
    
    }
  }

  //delete a item from array
  deleteItem = (data) => {
    let result = this.todolist.filter((output) => {
      if (output.itemname !== data) {
        return output;
      }
    })
    this.todolist = result
    
  }

  //delete a subtodoItem
  deleteSubItem = (item, data) => {
    
    let result = this.todolist.filter((output) => {
      if (output.itemname === item) {

        let sub = output.subTodoitem.filter(suboutput => {
          if (suboutput.subitemname != data) {
            
            return suboutput;
          }
        })
        output.subTodoitem = sub
      }
      return output
    })
    this.todolist = result
  }

  //switch between complete and incomplete for subtodoitem
  completeAction = (item, data) => {
    let result = this.todolist.filter((output) => {
      if (output.itemname === item) {

        let sub = output.subTodoitem.filter(suboutput => {
          if (suboutput.subitemname == data) {
            suboutput.completed = !suboutput.completed
            return suboutput;
          }
          else {
            return suboutput
          }
        })
        output.subTodoitem = sub
      }
      return output
    })
    this.todolist = result
  }

  //switch betwen complete and incomplete for todoitem
  completeItemAction = (item) => {
    let result = this.todolist.filter((output) => {
      if (output.itemname === item) {
        output.itemcompleted = !output.itemcompleted
      }
      return output
    })
    this.todolist = result
  }

  
  //keyevent

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
      this.undoAction()
    }
  }

  //Get tOdo by Id
  getToDo = () => {
    if(this.friendId==null || this.TodoId==null){
      console.log('No DETAILS PRESENT')
    }
    else{
      
    this.AppService.getToDoFriend(this.TodoId,this.friendId)
    .subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
      
        this.todolist = apiResponse.data.listdata
        this.todo = apiResponse.data
        this.title=apiResponse.data.title

      }
      else if(apiResponse.status === 204 ){
        this.Router.navigate(['/unauthorized'])
        this.TodoId=null
      }
      else {
      this.Router.navigate(['/notfound'])
      this.TodoId=null;
      }

    }, (err) => {
      
    this.Router.navigate(['/technical'])
    })
    }
  }

  //Edit Todo
  editToDo = () => {
    if (this.todolist.length == 0 || this.todolist == null || this.todolist == undefined) {
      this.Toastr.infoToastr('PLEASE ENTER A TODO')
    }
    else if(!this.title){
      this.Toastr.infoToastr('ENTER A TITLE')
    }
    else {
      this.showSpinner=true;
      let data = {
        userId: this.todo.userId,
        title:this.title,
        createrName: this.todo.createrName,
        modifierId: Cookie.get('receiverId'),
        modifierName: Cookie.get('receiverName'),
        listdata: this.todolist,
        createdOn: this.todo.createdOn,
        toDoId: this.todo.toDoId
      }
      
      this.AppService.editFriendToDo(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.Toastr.successToastr('Edited Sucessfully')
            this.sendGroupNotification(this.TodoId,`${this.userName} has edited the ToDo ${apiResponse.data.title} created by ${apiResponse.data.createrName}`)
            this.sendChanges()
            this.showSpinner=false;
            this.Router.navigate(['/friendprofile',this.friendId])
          }
          else if(apiResponse.status == 204){
            this.Router.navigate(['/unauthorized'])
          }
          else {
            this.Router.navigate(['/notfound'])
          }
        }, (err) => {
          
      this.Router.navigate(['/technical'])
        })
  
    }

  }

  //undo action
  undoAction = () => {
    if (!this.todo.historyToDoId) {
      this.Toastr.infoToastr('NO PREVIOUS DATA FOUND')

    }
    else {
      let data = {
        toDoId: this.TodoId,
        historyToDoId: this.todo.historyToDoId
      }
      
      this.AppService.undoAction(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            console.log(apiResponse.data)
          this.sendGroupNotification(this.TodoId,`${this.userName} has undo action of a ToDo ${apiResponse.data.title} created by ${apiResponse.data.createrName}`)
            this.Toastr.successToastr('Past Action Restored')
            this.sendChanges()
            this.getToDo()
          }
          else {
            this.Toastr.infoToastr(apiResponse.message)
          }
        }, (err) => {
          
      this.Router.navigate(['/technical'])
        })
    }
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
      this.getToDo()
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

//dashboard navigate

navigateToDashboard = ()=>{
  this.Router.navigate(['/friendprofile',this.friendId])
}

}
