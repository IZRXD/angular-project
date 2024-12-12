import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../user.service';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ErrorMsgComponent } from '../../core/error-msg/error-msg.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorMsgComponent, RouterModule, CommonModule], // Import necessary modules
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  emailError: string = '';
  passwordError: string = '';
  generalError: string = '';
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.emailError = '';
    this.passwordError = '';
    this.generalError = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      if (this.loginForm.get('email')?.invalid) {
        this.emailError = 'Invalid email';
      }
      if (this.loginForm.get('password')?.invalid) {
        this.passwordError = 'Password must be at least 6 characters';
      }
      return;
    }
    this.loading = true;
    this.userService
      .login(this.loginForm.value)
      .pipe(
        catchError((err) => {
          if (err.status === 409) {
            this.generalError = 'This email is already registered.';
            // Set specific error message
            return of(null); // Prevent further processing
          } else {
            this.generalError = err.error?.message;
            // Handle other errors
            return of(null);
          }
        })
      )
      .subscribe((response) => {
        if (response) {
          this.router.navigate(['/home']);
        }
        this.loading = false;
      });
  }
}
