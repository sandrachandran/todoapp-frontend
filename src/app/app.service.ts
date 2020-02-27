import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';

import { Cookie } from 'ng2-cookies/ng2-cookies';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";


@Injectable()
export class AppService {

  private url = 'http://localhost:3000';

  constructor(
    public http: HttpClient
  ) {



  } // end constructor  


  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) => {

    localStorage.setItem('userInfo', JSON.stringify(data))


  }

  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password)
      .set('userName', data.userName);

    return this.http.post(`${this.url}/api/v1/users/signup`, params);

  } // end of signupFunction function.

  public signinFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userName', data.userName)
      .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);
  } // end of signinFunction function.

  //phone country code and name

  public getCountryName(): Observable<any> {

    return this.http.get("./../assets/countryName.json");

  }

 
  public getCountryNumber(): Observable<any> {

    return this.http.get("./../assets/countryCode.json");
    
  }

  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))
      .set('userId', Cookie.get('receiverId'))
    return this.http.post(`${this.url}/api/v1/users/logout`, params);
  } // end logout function

  //get All User
  public getAllUser(): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/view/all`);
  }

  //get specific user details
  public getSingleUser(data): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/${data}/view`);
  }

  //Get username in email
  public getUserNameRecover(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
    return this.http.post(`${this.url}/api/v1/users/recoverUserName`, params);
  }

  //Get Password Recoverymail
  public getPasswordRecover(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
    return this.http.post(`${this.url}/api/v1/users/recoverPassword`, params);
  }

  //set Password Email
  public setPasswordRecover(data): Observable<any> {
    const params = new HttpParams()
      .set('userId', data.userId)
      .set('authToken', data.authToken)
      .set('password', data.password)
    return this.http.post(`${this.url}/api/v1/users/resetPassword`, params);

  }

  //get All UserList

  public getAllUserName():Observable<any>{
    const params = new HttpParams()
    .set('authToken',Cookie.get('authtoken'))
    return this.http.post(`${this.url}/api/v1/users/view/all`,params)
  }

  //send friend req
  public sendFriendReq(data):Observable<any>{
    const params = new HttpParams()
  
    .set('authToken',Cookie.get('authtoken'))
    .set('userId',data.userId)
    .set('userFirstName',data.userFirstName)
    .set('friendReqName',data.friendReqName)
    .set('friendReqId',data.friendReqId)
    

    return this.http.post(`${this.url}/api/v1/friend/sendReq`,params)
  
  }

  //get all request for a particular user
  public getAllReq():Observable<any>{
    const params = new HttpParams()
    .set('authToken',Cookie.get('authtoken'))
    .set('userId',Cookie.get('receiverId'))
    return this.http.post(`${this.url}/api/v1/friend/view/all`,params)
  }

    //get all request for a particular user
    public getAllUserReq():Observable<any>{
      const params = new HttpParams()
      .set('authToken',Cookie.get('authtoken'))
      .set('friendId',Cookie.get('receiverId'))
      return this.http.post(`${this.url}/api/v1/friend/view/allreq`,params)
    }

  //delete all request for a particular user
  public deleteReq(data):Observable<any>{
    const params = new HttpParams()
    .set('authToken',Cookie.get('authtoken'))
    .set('friendsReqId',data)
    return this.http.post(`${this.url}/api/v1/friend/deletereq`,params)
  }

  //accept a friend req

   public acceptReq(data):Observable<any>{
    const params = new HttpParams()
    .set('authToken',Cookie.get('authtoken'))
    .set('friendsReqId',data.friendsReqId)
    .set('userId',data.userId)
    .set('userFirstName',data.userFirstName)
    .set('friendReqId',data.friendReqId)
    .set('friendReqName',data.friendReqName)
    return this.http.post(`${this.url}/api/v1/friend/acceptreq`,params)
  }

  //get friend for a particular user
  
  //get all request for a particular user
  public getAllFriends():Observable<any>{
    const params = new HttpParams()
    .set('authToken',Cookie.get('authtoken'))
    .set('userId',Cookie.get('receiverId'))
    return this.http.post(`${this.url}/api/v1/friend/view/allfriends`,params)
  }

  //remove a friend
  
  //delete all request for a particular user
  public deleteFriends(data):Observable<any>{
    const params = new HttpParams()
    .set('authToken',Cookie.get('authtoken'))
    .set('friendsId',data)
    return this.http.post(`${this.url}/api/v1/friend/deletefriend`,params)
  }

  //create a new Todo

  public createnewToDo(title,data):Observable<any>{
    // const params = new HttpParams()
    // .set('authToken',Cookie.get('authtoken'))
    // .set('userId',Cookie.get('receiverId'))
    // .set('createrName',Cookie.get('receiverName'))
    // .set('modifierId',Cookie.get('receiverId'))
    // .set('modifierName',Cookie.get('receiverName'))
    // .set('listdata',data)
    // console.log(params)
    let senddata={
      authToken:Cookie.get('authToken'),
      userId:Cookie.get('receiverId'),
      createrName:Cookie.get('receiverName'),
      modifierId:Cookie.get('receiverId'),
      modifierName:Cookie.get('receiverName'),
      listdata:data,
      title:title
    }
    data.authToken=Cookie.get('authToken')
    return this.http.post(`${this.url}/api/v1/todo/create`,senddata)
  }

 //get all ToDo based on a ID
 public getAllToDo(data):Observable<any>{
  const params = new HttpParams()
  .set('authToken',Cookie.get('authtoken'))
  .set('userId',Cookie.get('receiverId'))
  .set('skip',data)
  
  return this.http.post(`${this.url}/api/v1/todo/view/all`,params)
}

//get all friend ToDo


 //get all ToDo based on a ID
 public getAllFriendToDo(skip,data):Observable<any>{
  const params = new HttpParams()
  .set('authToken',Cookie.get('authtoken'))
  .set('userId',data)
  .set('skip',skip)
  .set('friendId',Cookie.get('receiverId'))
  
  return this.http.post(`${this.url}/api/v1/todo/view/allfriend`,params)
}

//Get Todo based on ID


 //get all ToDo based on a ID
 public getToDo(data):Observable<any>{
  const params = new HttpParams()
  .set('authToken',Cookie.get('authtoken'))
  .set('toDoId',data)
  
  return this.http.post(`${this.url}/api/v1/todo/view/todo`,params)
}

public getToDoFriend(data,friend):Observable<any>{
  const params = new HttpParams()
  .set('authToken',Cookie.get('authtoken'))
  .set('toDoId',data)
  .set('userId',Cookie.get('receiverId'))
  .set('friendId',friend)
  
  return this.http.post(`${this.url}/api/v1/todo/view/friendtodo`,params)
}

//Delete a Todo

public deleteToDo(data):Observable<any>{
  const params = new HttpParams()
  .set('authToken',Cookie.get('authtoken'))
  .set('toDoId',data)
  return this.http.post(`${this.url}/api/v1/todo/delete/todo`,params)
}

//edit ToDo
public editToDo(data):Observable<any>{
  // const params = new HttpParams()
  // .set('authToken',Cookie.get('authtoken'))
  // .set('userId',Cookie.get('receiverId'))
  // .set('createrName',Cookie.get('receiverName'))
  // .set('modifierId',Cookie.get('receiverId'))
  // .set('modifierName',Cookie.get('receiverName'))
  // .set('listdata',data)
  // console.log(params)
  let senddata={
    authToken:Cookie.get('authtoken'),
    title:data.title,
    userId:data.userId,
    createrName:data.createrName,
    modifierId:data.modifierId,
    modifierName:data.modifierName,
    toDoId:data.toDoId,
    createdOn:data.createdOn,
    listdata:data.listdata
  }
  return this.http.post(`${this.url}/api/v1/todo/edit`,senddata)
}


//edit ToDo
public editFriendToDo(data):Observable<any>{
  // const params = new HttpParams()
  // .set('authToken',Cookie.get('authtoken'))
  // .set('userId',Cookie.get('receiverId'))
  // .set('createrName',Cookie.get('receiverName'))
  // .set('modifierId',Cookie.get('receiverId'))
  // .set('modifierName',Cookie.get('receiverName'))
  // .set('listdata',data)
  // console.log(params)
  let senddata={
    authToken:Cookie.get('authtoken'),
    title:data.title,
    userId:data.userId,
    createrName:data.createrName,
    modifierId:data.modifierId,
    modifierName:data.modifierName,
    toDoId:data.toDoId,
    createdOn:data.createdOn,
    listdata:data.listdata,
    friendId:Cookie.get('receiverId')
  }
  return this.http.post(`${this.url}/api/v1/todo/editfriend`,senddata)
}
public undoAction(data):Observable<any>{
  let senddata={
    authToken:Cookie.get('authtoken'),
    toDoId:data.toDoId,
    historyToDoId:data.historyToDoId

  }
  return this.http.post(`${this.url}/api/v1/todo/undo`,senddata)

}
//get notification 

public viewNotification(data):Observable<any>{
  return this.http.get(`${this.url}/api/v1/notification/view/${data}`);
}

}

