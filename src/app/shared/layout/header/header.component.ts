import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuItems: MenuItem[] = [];


  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<MenuItem[]>('assets/data/menubar.json').toPromise().then((data) => this.menuItems = data || []);
  }

}
