import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MainService } from 'src/app/shared/services/main.service';
import { NgbOffcanvas, NgbOffcanvasConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  $sharedSubsc!: Subscription;
  @ViewChild('sidebar') sidebar: any;
  showSidebar: boolean = false;

  dataFromLoacal: any;
  constructor(
    private mainS: MainService,
    private sharedS: SharedService,
    configs: NgbOffcanvasConfig,
    private offcanvasService: NgbOffcanvas,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDataFromLoc();
    this.openSidebar();
  }

  getDataFromLoc() {
    this.$sharedSubsc = this.sharedS.getData().subscribe({
      next: (res: any) => {
        this.dataFromLoacal = res;
      },
    });
  }

  openSidebar() {
    this.mainS.showSidebarSubject.subscribe((val: any) => {
      this.showSidebar = val;
      if (this.showSidebar === true) {
        if (this.offcanvasService.hasOpenOffcanvas() !== true) {
          this.openDa(this.sidebar);
        }
      }
    });
  }

  openDa(sidebar: any) {
    this.offcanvasService
      .open(sidebar, {
        ariaLabelledBy: 'offcanvas-basic-title',
        position: 'start',
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
  logout() {
    this.sharedS.insertData({
      key: 'user',
      val: undefined,
    });
    this.router.navigateByUrl('/auth/login');
  }
  ngOnDestroy(): void {
    this.mainS.showSidebar(false);
  }
}
