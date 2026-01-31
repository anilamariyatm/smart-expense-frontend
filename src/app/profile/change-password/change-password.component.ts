import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="center">
      <mat-card class="card">
        <h2>Change Password</h2>

        <form [formGroup]="form" (ngSubmit)="submit()">

          <mat-form-field appearance="outline" class="full">
            <mat-label>Old Password</mat-label>
            <input matInput type="password" formControlName="oldPassword">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>New Password</mat-label>
            <input matInput type="password" formControlName="newPassword">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Confirm Password</mat-label>
            <input matInput type="password" formControlName="confirmPassword">
          </mat-form-field>

          <button mat-raised-button color="primary"
            [disabled]="form.invalid || loading">
            Update Password
          </button>

        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .center { display: flex; justify-content: center; margin-top: 40px; }
    .card { width: 380px; padding: 24px; border-radius: 16px; }
    .full { width: 100%; margin-bottom: 12px; }
    h2 { text-align: center; margin-bottom: 20px; }
  `]
})
export class ChangePasswordComponent {

  form!: any;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;

    if (this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.snack.open('Passwords do not match', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;

    this.auth.changePassword({
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.newPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Password changed. Please login again.', 'OK', { duration: 3000 });
        this.auth.logout();
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.loading = false;
        this.snack.open(err?.error?.message || 'Update failed', 'Close', { duration: 3000 });
      }
    });
  }
}
