import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  activeRoute: any = null;

  checkRoute: any = null;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.chgActiveForm();
    if (this.router.url === '/auth') {
      this.router.navigateByUrl('/auth/login');
    }

    this.checkRoute = this.router.url;
  }

  chgActiveForm() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
        this.checkRoute = event.url;
      });
  }
}
