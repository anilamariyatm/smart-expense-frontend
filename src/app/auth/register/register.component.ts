import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  template: `
    <div class="center">

      <mat-card class="card">

        <h2>Register</h2>

        <form [formGroup]="form" (ngSubmit)="register()">

          <mat-form-field appearance="outline" class="full">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name">
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username">
          </mat-form-field>

         <mat-form-field appearance="outline" class="full">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email">

          <mat-error *ngIf="form.get('email')?.hasError('required')">
            Email is required
          </mat-error>

          <mat-error *ngIf="form.get('email')?.hasError('email')">
            Enter a valid email address
          </mat-error>
        </mat-form-field>


          <mat-form-field appearance="outline" class="full">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password">

            <mat-error *ngIf="form.get('password')?.hasError('required')">
              Password is required
            </mat-error>

            <mat-error *ngIf="form.get('password')?.hasError('minlength')">
              Password must be at least 8 characters
            </mat-error>

            <mat-error *ngIf="form.get('password')?.hasError('pattern')">
              Must include uppercase, lowercase, number & special character
            </mat-error>
          </mat-form-field>
          


          <button mat-raised-button color="primary" class="full" type="submit"
            [disabled]="form.invalid">
            Register
          </button>

          <p class="link">
            Already have account?
            <a routerLink="/login">Login</a>
          </p>

        </form>

      </mat-card>

    </div>
  `,
  styles: [`
    .center {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f5f5f5;
    }

    .card {
      width: 350px;
      padding: 20px;
    }

    .full { width: 100%; }

    .link {
      margin-top: 10px;
      text-align: center;
    }
  `]
})
export class RegisterComponent {

  form!: any;

constructor(
  private fb: FormBuilder,
  private service: AuthService,
  private router: Router
) {
 this.form = this.fb.group({
  name: ['', Validators.required],

  username: ['', Validators.required],

  email: ['', [
    Validators.required,
    Validators.email   // ✅ valid email check
  ]],

  password: ['', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
    )
  ]]
});


}


  register() {
    if (this.form.invalid) return;

    this.service.register(this.form.value).subscribe({
      next: () => {
        alert('Registered successfully');
        this.router.navigate(['/login']);
      },
      error: () => alert('Registration failed')
    });
  }
}
