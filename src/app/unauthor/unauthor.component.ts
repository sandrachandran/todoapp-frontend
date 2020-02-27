import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthor',
  templateUrl: './unauthor.component.html',
  styleUrls: ['./unauthor.component.css']
})
export class UnauthorComponent implements OnInit {

  constructor(public Router:Router) { }

  ngOnInit() {
  }

  navigate = () =>{
    this.Router.navigate(['/dashboard'])
  }

}
