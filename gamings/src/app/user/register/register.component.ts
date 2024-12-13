import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { UserService } from '../user.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { ErrorMsgComponent } from '../../core/error-msg/error-msg.component';
import { ErrorMsgService } from '../../core/error-msg/error-msg.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ErrorMsgComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private errorMsgService: ErrorMsgService
  ) {}

  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    repass: new FormControl('', Validators.required),
  });

  register() {
    if (
      this.form.invalid ||
      this.form.value.password !== this.form.value.repass
    ) {
      this.errorMsgService.setError('Please fill in all fields');
      return;
    }

    const userData: User = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.userService.register(userData).subscribe({
      next: (response) => {
        this.userService
          .login({ email: userData.email!, password: userData.password! })
          .subscribe({
            next: () => {
              this.router.navigate(['/home']);
            },
            error: (err) => {
              if (err instanceof Error) {
                this.errorMsgService.setError(err.message);
              } else if (err.error && err.error.message) {
                this.errorMsgService.setError(err.error.message);
              } else if (err.message) {
                this.errorMsgService.setError(err.message);
              } else {
                this.errorMsgService.setError('An unexpected error occurred.');
              }
              return of(null);
            },
          });
      },
      error: (err) => {
        if (err instanceof Error) {
          this.errorMsgService.setError(err.message);
        } else if (err.error && err.error.message) {
          this.errorMsgService.setError(err.error.message);
        } else if (err.message) {
          this.errorMsgService.setError(err.message);
        } else {
          this.errorMsgService.setError('An unexpected error occurred.');
        }
        return of(null);
      },
    });
  }
}
