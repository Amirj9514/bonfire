import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted: boolean = false;
  dataFromLocal: any;
  showError: any = { show: false, message: '' };
  preLoder: boolean = false;

  constructor(private sharedS: SharedService, private router: Router) {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      dob: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      contactNo: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'
        ),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      // rePass: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.sharedS.getData().subscribe({
      next: (res: any) => {
        this.dataFromLocal = res;
        if (
          res.restaurantDetail === undefined ||
          res.restaurantDetail === null
        ) {
          this.router.navigateByUrl('/');
        }
      },
    });
  }

  onSubmit() {
    this.submitted = true;
    let allData = this.dataFromLocal.allBranches;
    let formData = this.registerForm.value;
    if (this.dataFromLocal.restaurantDetail && allData) {
      if (this.registerForm.valid !== false) {
        this.preLoder = true;
        allData.map((val: any) => {
          let data = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            cell_num: formData.contactNo,
            date_birth: formData.dob,
            password: formData.password,
            branch_id: val.id,
          };
          this.createUser(data, formData);
        });
      }
    } else {
      this.router.navigateByUrl('/');
    }
  }

  createUser(data: any, form: any) {
    this.sharedS.sendPostRequest('WebUserSignUp', data, null).subscribe({
      next: (res: any) => {
      
        if (res.Success === false) {
          this.preLoder = false;
          this.showError = {
            show: true,
            message: res.ErrorMessage,
          };
        } else {
          this.loginUser(form, data.branch_id);
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

  loginUser(formData: any, id: any) {
    if (this.dataFromLocal.restaurantDetail.id === id) {
      if (this.dataFromLocal.restaurantDetail && this.showError.show !== true) {
        let data = {
          email: formData.email,
          password: formData.password,
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
    }
  }
}
