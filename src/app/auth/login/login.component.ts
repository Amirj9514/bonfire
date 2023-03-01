import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
declare const FB: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  dataFromLocal: any;
  submitted: boolean = false;
  preLoder: boolean = false;
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
    FB.init({
      appId: '406432459708823',
      cookie: true,
      xfbml: true,
      version: 'v11.0',
    });
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

  loginWithFacebook() {
    FB.login((res: any) => {
      if (res.authResponse) {
        this.getFacebookData(res.authResponse);
      }
    });
  }

  getFacebookData(data: any) {
    const fields = 'id,first_name,last_name,birthday,email';
    const url = `https://graph.facebook.com/v12.0/me?fields=${fields}&access_token=${data.accessToken}`;

    fetch(url).then((response) => {
      response.json().then((data) => {
        if (data) {
          let allDetail = this.dataFromLocal.allBranches;
          if (allDetail && allDetail.length > 0) {
            allDetail.map((val: any) => {
              let userData = {
                login_type_id: 1,
                social_app_id: data.id,
                first_name: data.first_name,
                last_name: data.last_name,
                branch_id: val.id,
              };
              this.saveUser(userData);
            });
          }
        }
      });
    });
  }

  saveUser(data: any) {

    this.sharedS.sendPostRequest('WebSaveSocialUser', data, 'N/A').subscribe({
      next: (res: any) => {
        if (res.Success !== false) {
          if (this.dataFromLocal.restaurantDetail.id === data.branch_id) {
            this.sharedS.insertData({ key: 'user', val: res.Data });
            this.router.navigateByUrl('/');
          }
        } else {

          alert(res.ErrorMessage);
        }
      },
      error: (err: any) => {
        alert(err.error.ErrorMessage);
      },
    });
  }

  loginByEmail() {
    this.submitted = true;
    if (this.dataFromLocal.restaurantDetail) {
      if (this.loginForm.valid !== false) {
        this.preLoder = true;
        let data = {
          email: this.loginForm.get('email')?.value,
          password: this.loginForm.get('password')?.value,
          branch_id: this.dataFromLocal.restaurantDetail.id,
        };
        this.sharedS.sendPostRequest('WebUserLogin', data, null).subscribe({
          next: (res: any) => {
            this.preLoder = false;
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
            this.preLoder = false;
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
