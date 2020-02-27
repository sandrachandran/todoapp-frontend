import { Injectable } from '@angular/core';


import * as io from 'socket.io-client';

import { Observable, observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { AppService } from './app.service';

@Injectable()
export class SocketService {

  private url = 'http://api.realtimetodo.xyz';

  private socket;

  public friendList=[]
  constructor(public http: HttpClient,
    public AppService:AppService) {
    // connection is being created.
    // that handshake
    this.socket = io(this.url);
    console.log('socket created')
    this.getAllFriends()
  }

  public getAllFriends = () =>{
    this.AppService.getAllFriends()
    .subscribe((apiResponse)=>{
      if(apiResponse.status === 200){
        this.friendList = apiResponse.data
      }
      else{
        this.friendList = []
      }
    })
  }

  public NotificationReceiver = (userId) =>{
    return Observable.create((observer)=>{
      this.socket.on(userId,(data)=>{
        observer.next(data);
      })
    })
  }

  public ChangesReceiver = (userId) =>{
    return Observable.create((observer)=>{
      this.socket.on('changesMade',(userId)=>{
        observer.next(userId)
      })
    })
  }

  
  //public SendGroup Notification  
  public SendGroupNotificationMessage = (data) => {
    this.getAllFriends()
    
console.log(data)
    setTimeout(() => { 
    for(let x in this.friendList){
      let notificationMsgObject ={
        userId:this.friendList[x].friendId,
        todoId:data.todoId,
        message:data.message
      }
      this.socket.emit('Notification',notificationMsgObject)
    }
    },1000);
  }

  public SendGroupChanges = () =>{
    this.getAllFriends()
    setTimeout(() => {
      for(let x in this.friendList){
        let data= {
          userId:this.friendList[x].friendId
        }
        this.socket.emit('Changes',data)
      }
    }, 1000);
  }

 //send notification 
  public SendNotificationMessage = (notificationMsgObject) => {
    this.socket.emit('Notification', notificationMsgObject);

  } // end Notification Message


  public exitSocket = () =>{


    this.socket.disconnect();


  }// end exit socket




  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

}
