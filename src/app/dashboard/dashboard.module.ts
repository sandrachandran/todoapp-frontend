import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import {RouterModule,Router} from '@angular/router';
import { DashboardpageComponent } from './dashboardpage/dashboardpage.component';
import { FriendsComponent } from './friends/friends.component';
import { SearchfriendComponent } from './searchfriend/searchfriend.component';
import { FriendrequestComponent } from './friendrequest/friendrequest.component';
import { TodopageComponent } from './todopage/todopage.component';
import { CreatetodoComponent } from './createtodo/createtodo.component';
import { FriendprofileComponent } from './friendprofile/friendprofile.component';
import { EditTodoComponent } from './edit-todo/edit-todo.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RouteGuardService } from '../route-guard.service';
import { FriendeditComponent } from './friendedit/friendedit.component';

@NgModule({
  declarations: [DashboardpageComponent, FriendsComponent, SearchfriendComponent, FriendrequestComponent, TodopageComponent, CreatetodoComponent, FriendprofileComponent, EditTodoComponent, FriendeditComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild([
      
    ]),
    Ng2SearchPipeModule
  ],
  providers:[RouteGuardService]
})
export class DashboardModule { }
