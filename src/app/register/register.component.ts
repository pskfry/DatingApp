import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../_models/User';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User;
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;

  constructor(private authService: AuthService,
    private alertifyService: AlertifyService,
    private fb: FormBuilder,
    private router: Router ) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      birthDate: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(24)
        ]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(fg: FormGroup) {
    return fg.get('password').value === fg.get('confirmPassword').value ? null : { 'mismatch': true };
  }

  register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);

      this.authService.register(this.user).subscribe(() => {
        this.alertifyService.success('Registered successfully!');
      }, error => {
        this.alertifyService.error(error);
      }, () => {
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/member-list']);
        });
      });
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
