import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from './socket.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'realtimeToDo';
  public userId
  constructor(
    public Router: Router,
    public SocketService: SocketService,
    public Toastr: ToastrManager
  ) { }

  ngOnInit() {
 
  }


  
  
 

  

  
}
