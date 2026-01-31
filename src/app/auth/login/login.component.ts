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
  selector: 'app-login',
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

        <h2>Login</h2>

        <form [formGroup]="form" (ngSubmit)="login()">

          <mat-form-field appearance="outline" class="full">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password">
          </mat-form-field>

          <button mat-raised-button color="primary" class="full" type="submit"
            [disabled]="form.invalid">
            Login
          </button>

          <p class="link">
            New user?
            <a routerLink="/register">Register here</a>
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
export class LoginComponent {

  form!: any;

constructor(
  private fb: FormBuilder,
  private service: AuthService,
  private router: Router
) {
  this.form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
}


 

 login() {
  if (this.form.invalid) return;

  this.service.login(this.form.value).subscribe({
    next: () => {
      this.service.startIdleTimer();   // ✅ START AUTO-LOGOUT TIMER
      this.router.navigate(['/app']);  // go to dashboard
    },
    error: () => alert('Invalid credentials')
  });
}

}
