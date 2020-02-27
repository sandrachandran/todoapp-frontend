import { Component, OnInit, Output } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-createtodo',
  templateUrl: './createtodo.component.html',
  styleUrls: ['./createtodo.component.css']
})
export class CreatetodoComponent implements OnInit {
  public todolist = []
  public item: any;
  public subitem: any;
  public userName:any;
  public title:any;
  public showSpinner:Boolean=false;
  constructor(
    public Toastr: ToastrManager,
    public AppService: AppService,
    public Router: Router,
    public SocketService:SocketService
  ) { }

  ngOnInit() {
    this.userName = Cookie.get('receiverName')
  }

  //add a item in array
  addItem = () => {
    if (!this.item) {
      this.Toastr.infoToastr('Please Enter a Item')
    } else {
      this.todolist.push({ itemname: this.item, itemcompleted: false, subTodoitem: [] })
    
      this.item = ''
    }
  }

  //add a subtodo item in array
  addSubItem = (data) => {
    if (!this.subitem) {
      this.Toastr.infoToastr('Please Enter a Sub Item')
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

  //delete a subtodo item
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

  //switch between complete and incomplete of todo item
  completeItemAction = (item) => {
    let result = this.todolist.filter((output) => {
      if (output.itemname === item) {
        output.itemcompleted = !output.itemcompleted
      }
      return output
    })
    this.todolist = result
  }

  //create a Todo function
  createToDo = () => {
    
    if (this.todolist.length == 0 || this.todolist == null || this.todolist == undefined) {
      this.Toastr.infoToastr('Please Enter a ToDo')
    }
    else if(!this.title){
      this.Toastr.infoToastr('Enter a Title')
    }
    else {
      this.showSpinner=true;
      this.AppService.createnewToDo(this.title,this.todolist)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.Toastr.successToastr('The ToDo has been created')
            this.sendGroupNotification(apiResponse.data.toDoId,`${this.userName} has created a ToDo ${apiResponse.data.title}`)
            this.sendChanges()
            this.showSpinner=false;
            this.Router.navigate(['/dashboard']);
          }
          else {
            this.Toastr.infoToastr(apiResponse.message)
          }
        }, (err) => {
          this.Toastr.errorToastr('Some Internal Error Occured')
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

  //sendchanges 
  sendChanges = () =>{
    this.SocketService.SendGroupChanges()
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
    this.Toastr.errorToastr('some error occured')


  });

}

//dashboard navigate

navigateToDashboard = ()=>{
  this.Router.navigate(['/dashboard'])
} 
}