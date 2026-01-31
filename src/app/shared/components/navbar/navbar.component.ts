import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar color="primary">

      <span>Smart Expense Tracker</span>

      <span class="spacer"></span>

      <button mat-button routerLink="/app">Dashboard</button>
      <button mat-button routerLink="/app/expenses">Expenses</button>
      <button mat-button routerLink="/app/add-expense">Add Expense</button>
      <button mat-button routerLink="/app/profile">Profile</button>
      <button mat-stroked-button color="warn" (click)="logout()">Logout</button>

    </mat-toolbar>

    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .content { padding: 20px; }
  `]
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService ) {}
   ngOnInit() {
  this.auth.startIdleTimer();
}

 

  @HostListener('document:mousemove')
@HostListener('document:keydown')
@HostListener('document:click')
@HostListener('document:scroll')
resetTimer() {
  this.auth.startIdleTimer();
}

logout() {
  this.auth.clearIdleTimer();   
  this.auth.logout();          
}

}
