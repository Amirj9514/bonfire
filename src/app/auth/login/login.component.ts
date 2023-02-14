import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  dataFromLocal: any;
  submitted: boolean = false;
  showError: any = {
    show: false,
    message: '',
  };
  loginForm!: FormGroup;
  constructor(private sharedS: SharedService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnInit(): void {
    this.getDataFromLocal();
  }

  getDataFromLocal() {
    this.sharedS.getData().subscribe({
      next: (res: any) => {
        this.dataFromLocal = res;
      },
    });
  }

  hideError() {
    this.showError = {
      show: false,
      message: '',
    };
  }
  loginByEmail() {
    this.submitted = true;
    if (this.dataFromLocal.restaurantDetail) {
      if (this.loginForm.valid !== false) {
        let data = {
          email: this.loginForm.get('email')?.value,
          password: this.loginForm.get('password')?.value,
          branch_id: this.dataFromLocal.restaurantDetail.id,
        };
        this.sharedS.sendPostRequest('WebUserLogin', data, null).subscribe({
          next: (res: any) => {
            if (res.Success === true) {
              this.sharedS.insertData({ key: 'user', val: res.Data });
              this.router.navigateByUrl('/');
            } else {
              this.showError = {
                show: true,
                message: res.ErrorMessage,
              };
            }
          },
          error: (err: any) => {
            this.showError = {
              show: true,
              message: err.error.ErrorMessage,
            };
          },
        });
      }
    } else {
      alert('Please First Select A Branch ');
      this.router.navigateByUrl('/');
    }
  }
}
