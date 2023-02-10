import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { MainService } from 'src/app/shared/services/main.service';

@Component({
  selector: 'app-opt',
  templateUrl: './opt.component.html',
  styleUrls: ['./opt.component.scss'],
})
export class OptComponent implements OnInit {
  @ViewChild('input1') first!: ElementRef;
  @ViewChild('input2') second!: ElementRef;
  @ViewChild('input3') third!: ElementRef;
  @ViewChild('input4') four!: ElementRef;

  val1: any = '';
  val2: any = '';
  val3: any = '';
  val4: any = '';

  activeRoute: any;
  constructor(private router: Router, private mainS: MainService) {}

  ngOnInit(): void {
    this.chgActiveForm();
  }

  ngAfterViewInit() {
    this.first.nativeElement.focus();
  }

  nextInput(data: any) {
    if (data === 1) {
      this.val1 = this.val1.replace(/[^0-9]/g, '');
      if (this.val1 !== '') {
        this.second.nativeElement.focus();
        this.confirmOtp();
      }
    } else if (data === 2) {
      this.val2 = this.val2.replace(/[^0-9]/g, '');
      if (this.val2 !== '') {
        this.third.nativeElement.focus();
        this.confirmOtp();
      }
    } else if (data === 3) {
      this.val3 = this.val3.replace(/[^0-9]/g, '');
      if (this.val3 !== '') {
        this.four.nativeElement.focus();
        this.confirmOtp();
      }
    } else if (data === 4) {
      this.val4 = this.val4.replace(/[^0-9]/g, '');
      if (this.val4 !== '') {
        this.confirmOtp();
      }
    }
  }

  confirmOtp() {
    let otp = this.val1 + this.val2 + this.val3 + this.val4;
    if (otp.length === 4) {
    
    }

  }
  chgActiveForm() {
    // this.mainS.activeRoute(this.router.url);

    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe((event: any) => {
    //   });
  }
}
