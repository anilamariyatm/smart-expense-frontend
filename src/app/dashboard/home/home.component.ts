import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../core/services/expense.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import {
  NgApexchartsModule,
  ApexNonAxisChartSeries,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive
} from 'ng-apexcharts';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    MatCardModule,
    MatGridListModule
  ],
  template: `
    <h2>Dashboard</h2>

    <mat-grid-list cols="3" rowHeight="130px" gutterSize="16">

      <mat-grid-tile>
        <mat-card class="stat-card">
          <p>Total Expenses</p>
          <h2>{{ stats?.count }}</h2>
        </mat-card>
      </mat-grid-tile>

      <mat-grid-tile>
        <mat-card class="stat-card">
          <p>Total Amount</p>
          <h2>₹ {{ stats?.totalAmount }}</h2>
        </mat-card>
      </mat-grid-tile>

      <mat-grid-tile>
        <mat-card class="stat-card">
          <p>This Month</p>
          <h2>₹ {{ thisMonthTotal }}</h2>
        </mat-card>
      </mat-grid-tile>

    </mat-grid-list>

    <hr>

    <h3>Category-wise Expenses</h3>

    <mat-card class="chart-card">
      <apx-chart
        *ngIf="pieSeries.length"
        [series]="pieSeries"
        [chart]="pieChart"
        [labels]="pieLabels"
        [responsive]="responsive">
      </apx-chart>
    </mat-card>

    <hr>

    <h3>Monthly Trend</h3>

    <mat-card class="chart-card">
      <apx-chart
        *ngIf="barSeries.length"
        [series]="barSeries"
        [chart]="barChart"
        [xaxis]="barXAxis"
        [plotOptions]="plotOptions"
        [dataLabels]="dataLabels">
      </apx-chart>
    </mat-card>
  `,
  styles: [`
    h2 {
      margin-bottom: 20px;
    }

    .stat-card {
      text-align: center;
      padding: 16px;
      background: #ffffff;
      border-radius: 12px;
    }

    .stat-card p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .stat-card h2 {
      margin-top: 8px;
      font-size: 26px;
      color: #3f51b5;
    }

    .chart-card {
      margin-top: 16px;
      padding: 16px;
      background: #ffffff;
      border-radius: 12px;
    }

    hr {
      margin: 30px 0;
    }
  `]
})
export class HomeComponent implements OnInit {

  stats: any;
  allExpenses: any[] = [];
  filteredExpenses: any[] = [];
  categories: string[] = [];
  thisMonthTotal = 0;

  /* -------- PIE CHART -------- */
  pieSeries: ApexNonAxisChartSeries = [];
  pieLabels: string[] = [];

  pieChart: ApexChart = {
    type: 'pie',
    width: 380
  };

  /* -------- BAR CHART -------- */
  barSeries: ApexAxisChartSeries = [];
  barChart: ApexChart = { type: 'bar', height: 350 };
  barXAxis: ApexXAxis = { categories: [] };

  dataLabels: ApexDataLabels = { enabled: true };
  plotOptions: ApexPlotOptions = { bar: { distributed: true } };

  responsive: ApexResponsive[] = [
    {
      breakpoint: 480,
      options: {
        chart: { width: 300 },
        legend: { position: 'bottom' }
      }
    }
  ];

  constructor(private service: ExpenseService) {}

  ngOnInit() {

    this.service.getStats().subscribe(res => this.stats = res);

    this.service.getExpenses().subscribe(list => {
      this.allExpenses = list;
      this.filteredExpenses = list;
      this.categories = [...new Set(list.map(e => e.category))];
      this.updateCharts(this.filteredExpenses);
    });
  }

  updateCharts(list: any[]) {

    const categoryMap: any = {};
    const monthMap: any = {};
    const now = new Date();

    this.thisMonthTotal = list
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() &&
               d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0);

    list.forEach(e => {

      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;

      const d = new Date(e.date);
      const month = d.toLocaleString('default', { month: 'short' });
      monthMap[month] = (monthMap[month] || 0) + e.amount;
    });

    this.pieLabels = Object.keys(categoryMap);
    this.pieSeries = Object.values(categoryMap);

    this.barXAxis = { categories: Object.keys(monthMap) };
    this.barSeries = [
      { name: 'Expense', data: Object.values(monthMap) as number[] }
    ];
  }

  /* -------- EXPORT -------- */

  exportExcel() {

    if (!this.filteredExpenses.length) {
      alert('No data to export');
      return;
    }

    const data = this.filteredExpenses.map(e => ({
      Date: new Date(e.date).toLocaleDateString(),
      Category: e.category,
      Amount: e.amount,
      Note: e.note || ''
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { Expenses: worksheet },
      SheetNames: ['Expenses']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    saveAs(blob, `expenses_${new Date().getTime()}.xlsx`);
  }
}
