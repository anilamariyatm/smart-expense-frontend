import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ExpenseService } from '../../core/services/expense.service';
import { CategoryService } from '../../core/services/category.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
  <form [formGroup]="form" (ngSubmit)="submit()">

  <!-- NAME -->
  <mat-form-field appearance="outline" class="full">
    <mat-label>Name</mat-label>
    <input matInput formControlName="note">
  </mat-form-field>

  <!-- AMOUNT -->
  <mat-form-field appearance="outline" class="full">
    <mat-label>Amount</mat-label>
    <input matInput type="number" formControlName="amount">

    <!-- ✅ AMOUNT ERROR -->
    <mat-error *ngIf="form.get('amount')?.hasError('required')">
      Amount is required
    </mat-error>
  </mat-form-field>

  <!-- CATEGORY -->
  <mat-form-field appearance="outline" class="full">
    <mat-label>Category</mat-label>
    <mat-select formControlName="category">
      <mat-option *ngFor="let c of categories" [value]="c.name">
        {{ c.name }}
      </mat-option>
    </mat-select>

    <!-- ✅ CATEGORY ERROR -->
    <mat-error *ngIf="form.get('category')?.hasError('required')">
      Category is required
    </mat-error>
  </mat-form-field>

  <!-- ADD CATEGORY BUTTON -->
  <button mat-stroked-button color="primary" type="button"
    (click)="showCat = !showCat" class="full">
    + Add Category
  </button>

  <!-- NEW CATEGORY INPUT -->
  <div *ngIf="showCat" class="full" style="margin-top:10px">

    <mat-form-field appearance="outline" class="full">
      <mat-label>New Category</mat-label>
      <input matInput formControlName="newCategory">
    </mat-form-field>

    <button mat-raised-button color="accent" type="button"
      (click)="saveCategory()">
      Save Category
    </button>

  </div>

  <!-- DATE -->
  <mat-form-field appearance="outline" class="full">
    <mat-label>Date</mat-label>
    <input matInput [matDatepicker]="picker" formControlName="date">
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>

    <!-- ✅ DATE ERROR -->
    <mat-error *ngIf="form.get('date')?.hasError('required')">
      Date is required
    </mat-error>
  </mat-form-field>

  <!-- SUBMIT -->
  <button mat-raised-button color="primary" class="full" type="submit"
    [disabled]="form.invalid">
    Save
  </button>

</form>

  `,
  styles: [`
    .full { width: 100%; margin-bottom: 12px; }
  `]
})
export class FormComponent implements OnInit {

  categories: any[] = [];
  showCat = false;
  form!: any;

 constructor(
  private fb: FormBuilder,
  private service: ExpenseService,
  private catService: CategoryService,
  private snack: MatSnackBar
) {
  this.form = this.fb.group({
    amount: ['', Validators.required],
    category: ['', Validators.required],
    note: [''],
    date: ['', Validators.required],
    newCategory: ['']
  });
}


  ngOnInit() {
    this.loadCategories();
  }

  /* LOAD CATEGORIES */
  loadCategories() {
    this.catService.getCategories().subscribe((res: any[]) => {
      this.categories = res;
    });
  }

  /* SAVE CATEGORY */
  saveCategory() {
    const name = this.form.value.newCategory;

    if (!name || !name.trim()) return;

    this.catService.addCategory(name).subscribe(() => {
      this.loadCategories();                     // refresh dropdown
      this.form.patchValue({ newCategory: '' }); // clear input
      this.showCat = false;
    });
  }

  /* SAVE EXPENSE */
  submit() {
    if (this.form.invalid) return;

    const data = {
      amount: this.form.value.amount,
      category: this.form.value.category,
      note: this.form.value.note,
      date: this.form.value.date
    };

    this.service.addExpense(data).subscribe(() => {
this.snack.open('Expense saved', 'OK', { duration: 3000 });
      this.form.reset();
    });
  }
}
