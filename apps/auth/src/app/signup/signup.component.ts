/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'nexus-arcade-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitted = false;
  errorMessage = '';
  success = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // If already logged in, redirect to main app
    if (this.authService.isLoggedIn()) {
      this.redirectToMain();
    }
  }

  get f() {
    return this.signupForm.controls;
  }

  async onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    // Stop if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    const username = this.f['username'].value;
    const email = this.f['email'].value;
    const password = this.f['password'].value;
    const confirmPassword = this.f['confirmPassword'].value;

    // Check if passwords match
    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    try {
      // Register the user
      await this.authService.register(username, email, password);
      this.success = true;

      // Redirect to login after successful registration
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    } catch (error) {
      this.errorMessage = error as string;
    }
  }

  private redirectToMain() {
    // Redirect to the main application on port 4200
    window.location.href = 'http://localhost:4200';
  }
}
