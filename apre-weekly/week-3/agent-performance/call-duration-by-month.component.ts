import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChartComponent } from '../../../shared/chart/chart.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-call-duration-by-month',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ChartComponent],
  providers: [DatePipe],
  template: `
    <h1>Call Duration by Month</h1>
    <div class="month-container">
      <form class="form" [formGroup]="monthForm" (ngSubmit)="onSubmit()">
        @if (errorMessage) {
        <div class="message message--error">{{ errorMessage }}</div>
        }

        <div class="form__group">
          <label class="label" for="month">Month</label>
          <select
            class="select"
            formControlName="month"
            id="month"
            name="month"
          >
            @for(month of months; track month) {
            <option value="{{ month.value }}">{{ month.name }}</option>
            }
          </select>
          <label class="label" for="year">Year</label>
          <select class="select" formControlName="year" id="year" name="year">
            @for(year of years; track year) {
            <option value="{{ year.value }}">{{ year.name }}</option>
            }
          </select>
        </div>
        <div class="form__actions">
          <button class="button button--primary" type="submit">Submit</button>
        </div>
      </form>

      @if (agentPerformanceData.length && agentNames.length) {
      <div class="card chart-card">
        <app-chart
          [type]="'bar'"
          [label]="'Agent Performance: Call Duration by Month'"
          [data]="agentPerformanceData"
          [labels]="agentNames"
        >
        </app-chart>
      </div>
      }
    </div>
  `,
  styles: `
  .month-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .form, .chart-card {
      width: 50%;
      margin: 20px 0;
    }

  `,
})
export class CallDurationByMonthComponent {
  startDate: Date | null = null;
  endDate: Date | null = null;
  callDurationData: number[] = []; // Initially empty
  agents: string[] = []; // Initially empty
  showChart: boolean = false; // Initially hidden
  agentPerformanceData: any[] = [];
  agentNames: string[] = [];

  months: any[] = [];
  years: any[] = [];
  errorMessage: string;

  monthForm = this.fb.group({
    month: [null, Validators.compose([Validators.required])],
    year: [null, Validators.compose([Validators.required])],
  });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.months = this.loadMonths();
    this.years = this.loadYears();
    this.errorMessage = '';
  }

  loadMonths() {
    return [
      { value: 1, name: 'January' },
      { value: 2, name: 'February' },
      { value: 3, name: 'March' },
      { value: 4, name: 'April' },
      { value: 5, name: 'May' },
      { value: 6, name: 'June' },
      { value: 7, name: 'July' },
      { value: 8, name: 'August' },
      { value: 9, name: 'September' },
      { value: 10, name: 'October' },
      { value: 11, name: 'November' },
      { value: 12, name: 'December' },
    ];
  }

  loadYears() {
    return [
      { value: 2023, name: '2023' },
      { value: 2024, name: '2024' }
    ];
  }

  onSubmit() {
    if (this.monthForm.invalid) {
      this.errorMessage = 'Please select a month and a year';
      return;
    }

    const month = this.monthForm.controls['month'].value;
    const year = this.monthForm.controls['year'].value;

    console.log('Fetching performance data for month and year: ', month, year);

    this.http
      .get(
        `${environment.apiBaseUrl}/reports/agent-performance/call-duration-by-month?month=${month}&year=${year}`
      )
      .subscribe({
        next: (data: any) => {
          if (data.length === 0) {
            const selectedMonth = this.months.find(m => m.value === Number(month));
            console.error('No data found for', selectedMonth.name);
            this.errorMessage = `No data found for ${selectedMonth.name}`
            return;
          }
          this.errorMessage = ``;
          this.agentPerformanceData = data.map(
            (d: any) => d.averagePerformance
          );
          this.agentNames = data.map((d: any) => d.name);
        },
      });
  }
}
