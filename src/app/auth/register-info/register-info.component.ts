import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-info',
  templateUrl: './register-info.component.html',
  styleUrls: ['./register-info.component.scss'],
})
export class RegisterInfoComponent implements OnInit {
  registerForm!: FormGroup;
  submitted: boolean = false;

  constructor() {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      contactNo: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'
        ),
      ]),
      password: new FormControl('', Validators.required),
      rePass: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    // console.log(this.registerForm.get('contactNo')?.valid);
  }
}
