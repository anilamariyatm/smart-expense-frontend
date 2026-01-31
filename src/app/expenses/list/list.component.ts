import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import * as Papa from 'papaparse';
import { ExpenseService } from '../../core/services/expense.service';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,

    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
MatDialogModule

  ],
  template: `
    <mat-card class="table-card">

      <h2>My Expenses</h2>
      <input type="file" accept=".csv" (change)="importCSV($event)">

      <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z0">

        <!-- Index -->
        <ng-container matColumnDef="index">
          <th mat-header-cell *matHeaderCellDef>#</th>
          <td mat-cell *matCellDef="let row; let i = index">{{ i + 1 }}</td>
        </ng-container>

        <!-- Amount -->
        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount</th>
          <td mat-cell *matCellDef="let row">₹ {{ row.amount }}</td>
        </ng-container>

        <!-- Category -->
        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
          <td mat-cell *matCellDef="let row">{{ row.category }}</td>
        </ng-container>

        <!-- Date -->
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let row">{{ row.date | date }}</td>
        </ng-container>

        <!-- Actions -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let row">

            <button mat-icon-button color="primary" (click)="edit(row._id)">
              <mat-icon>edit</mat-icon>
            </button>

            <button mat-icon-button color="accent" (click)="clone(row)">
              <mat-icon>content_copy</mat-icon>
            </button>

            <button mat-icon-button color="warn" (click)="delete(row._id)">
              <mat-icon>delete</mat-icon>
            </button>

          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

      </table>

      <mat-paginator
        [pageSize]="5"
        [pageSizeOptions]="[5,10,20]"
        showFirstLastButtons>
      </mat-paginator>

    </mat-card>
  `,
  styles: [`
    .table-card {
      background: #121212;
      color: #fff;
      padding: 20px;
      border-radius: 16px;
    }

    table {
      width: 100%;
      color: white;
    }

    th, td {
      color: white;
    }

    mat-paginator {
      background: transparent;
      color: white;
    }
  `]
})
export class ListComponent implements OnInit {

  displayedColumns: string[] = ['index', 'amount', 'category', 'date', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: ExpenseService,
    private router: Router,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getExpenses().subscribe(res => {
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  delete(id: string) {

  const ref = this.dialog.open(ConfirmDialogComponent, {
    data: { message: 'Delete this expense?' }
  });

  ref.afterClosed().subscribe(ok => {

    if (!ok) return;

    this.service.deleteExpense(id).subscribe({
      next: () => {
        this.snack.open('Expense deleted', 'OK', { duration: 2000 });
        this.load();
      },
      error: () => {
        this.snack.open('Delete failed', 'Close', { duration: 3000 });
      }
    });

  });
}


  edit(id: string) {
    this.router.navigate(['/app/edit-expense', id]);
  }

 clone(expense: any) {

  const cloned = {
    amount: expense.amount,
    category: expense.category,
    note: expense.note,
    date: expense.date
  };

  this.service.addExpense(cloned).subscribe({
    next: () => {
      this.snack.open('Expense cloned', 'OK', { duration: 2000 });
      this.load();
    },
    error: () => {
      this.snack.open('Clone failed', 'Close', { duration: 3000 });
    }
  });
}

importCSV(event: any) {

  const file = event.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result: any) => {

      this.service.importExpenses(result.data).subscribe({
        next: () => {
        this.snack.open('Expenses imported successfully', 'OK', { duration: 3000 });
          this.load();   // refresh list
        },
        error: (err) => {
  console.error(err);
  this.snack.open('Import failed', 'Close', { duration: 3000 });
}

      });

    }
  });
}


}
