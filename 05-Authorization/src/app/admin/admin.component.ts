import { Component, OnInit } from '@angular/core';

declare var jwt_decode: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  idToken: string;

  constructor() { }

  ngOnInit() {
    let idToken = localStorage.getItem('id_token');
    this.idToken = jwt_decode(idToken);
  }

}
