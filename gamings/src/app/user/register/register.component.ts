import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(private userService: UserService, private router: Router) {}

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
      return;
    }

    const userData: User = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.userService.register(userData).subscribe({
      next: (response) => {
        // Handle successful registration
        this.userService
          .login({ email: userData.email!, password: userData.password! })
          .subscribe({
            next: () => {
              this.router.navigate(['/home']);
            },
            error: (error) => {
              console.error('Login error after registration:', error);
              // Display error message
            },
          });
      },
      error: (error) => {
        console.error('Registration error:', error);
        // Display error message
      },
    });
  }
}
