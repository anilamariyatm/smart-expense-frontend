import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../core/services/auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    RouterModule
],
  template: `
    <div class="center">

      <mat-card class="card">

        <h2>My Profile</h2>

        <form [formGroup]="form" (ngSubmit)="save()">

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
  </mat-form-field>

  <mat-form-field appearance="outline" class="full">
    <mat-label>Role</mat-label>
    <input matInput formControlName="role" readonly>
  </mat-form-field>

  <button mat-raised-button color="primary"
  [disabled]="form.invalid || loading || form.pristine">
  Save Changes
</button>


 <button
  mat-stroked-button
  color="accent"
  type="button"
  routerLink="/app/change-password">
  Change Password
</button>




</form>


      </mat-card>

    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .center {
      display: flex;
      justify-content: center;
      margin-top: 40px;
    }

    .card {
      width: 380px;
      padding: 24px;
      border-radius: 16px;
    }

    .full {
      width: 100%;
      margin-bottom: 12px;
    }

    h2 {
      text-align: center;
      margin-bottom: 20px;
    }
  `]
})
export class ProfileComponent implements OnInit {

  form: any;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: [''],
      role: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.auth.getProfile().subscribe({
      next: user => this.form.patchValue(user),
      error: () => this.snack.open('Failed to load profile', 'Close', { duration: 3000 })
    });
  }

  save() {

    if (this.form.invalid) return;

    this.loading = true;

    const data = {
      name: this.form.value.name,
      username: this.form.value.username,
       email: this.form.value.email
    };

    this.auth.updateProfile(data).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Profile updated successfully', 'OK', { duration: 2000 });
      },
     error: (err) => {
  console.log(err);
  this.loading = false;
  this.snack.open(
    err?.error?.message || 'Update failed',
    'Close',
    { duration: 3000 }
  );
}
    });
  }
}
