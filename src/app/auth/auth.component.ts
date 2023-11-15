import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  activeRoute: any = null;

  checkRoute: any = null;

  logoImg: any;

  imageUrl: any = environment.apiImg;
  constructor(private router: Router, private sharedS: SharedService) {}

  ngOnInit(): void {
    this.chgActiveForm();
    if (this.router.url === '/auth') {
      this.router.navigateByUrl('/auth/login');
    }

    this.checkRoute = this.router.url;

    this.sharedS.getData().subscribe({
      next: (res: any) => {
        this.logoImg =
          environment.apiImg +
          res.allBranches[0].id +
          '/images/' +
          res.allBranches[0].logo;
      },
    });
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
