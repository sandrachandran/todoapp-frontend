import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { UserModule } from './user/user.module';
import {RouterModule,Routes} from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { ToastrModule } from 'ng6-toastr-notifications';
import { AppService } from './app.service';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { DashboardModule } from './dashboard/dashboard.module';
import { SocketService } from './socket.service';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RouteGuardService } from './route-guard.service';
import { LoginGuardService } from './login-guard.service';
import { NotfoundComponent } from './notfound/notfound.component';
import { UnauthorComponent } from './unauthor/unauthor.component';
import { TechnicalerrorComponent } from './technicalerror/technicalerror.component';
import { DashboardpageComponent } from './dashboard/dashboardpage/dashboardpage.component';
import { FriendsComponent } from './dashboard/friends/friends.component';
import { CreatetodoComponent } from './dashboard/createtodo/createtodo.component';
import { FriendprofileComponent } from './dashboard/friendprofile/friendprofile.component';
import { EditTodoComponent } from './dashboard/edit-todo/edit-todo.component';
import { FriendeditComponent } from './dashboard/friendedit/friendedit.component';
import { AlertComponent } from './alert/alert.component';


@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    UnauthorComponent,
    TechnicalerrorComponent,
    AlertComponent,
    
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    UserModule,
    DashboardModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent, pathMatch: 'full',canActivate:[LoginGuardService]},
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {path:'dashboard',component:DashboardpageComponent,canActivate:[RouteGuardService]},
      {path:'friends',component:FriendsComponent,canActivate:[RouteGuardService]},
      { path:'createtodo',component:CreatetodoComponent,canActivate:[RouteGuardService]},
      {path:'friendprofile/:userId',component:FriendprofileComponent,canActivate:[RouteGuardService]},
      {path:'editToDo/:toDoId',component:EditTodoComponent,canActivate:[RouteGuardService]},
      {path:'editfriendToDo/:userId/:toDoId',component:FriendeditComponent,canActivate:[RouteGuardService]},
      
      
      {path:'unauthorized',component:UnauthorComponent},
      {path:'technical',component:TechnicalerrorComponent},
      {path:'notfound',component:NotfoundComponent},
      {path:'**',component:NotfoundComponent},
      
    ]),
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    Ng2TelInputModule,
    Ng2SearchPipeModule
    
  ],
  providers: [AppService,SocketService,RouteGuardService,LoginGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
