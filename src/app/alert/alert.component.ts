import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
public userId:any;
  constructor(public SocketService:SocketService,
    public Toastr:ToastrManager) { }

  ngOnInit() {
    this.userId=Cookie.get('receiverId')
    this.GetNotified()
  }
  //Get notification 
  public GetNotified: any = () => {
      
    this.SocketService.NotificationReceiver(this.userId)
      .subscribe((data) => {
       
        this.Toastr.successToastr(`Notification : ${data.message}`);
      
      })

  }
}
