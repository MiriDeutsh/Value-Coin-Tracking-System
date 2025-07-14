import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, NgxChartsModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent {
  currencies = ['USD', 'EUR', 'GBP', 'JPY'];
  timeRanges = ['שבוע', 'חודש', 'חצי שנה', ' שנה'];

  selectedCurrency = this.currencies[0];
  selectedTimeRange = this.timeRanges[0];

  chartData: { name: string; series: { name: string; value: number }[] }[] = [
    {
      name: 'מטבע',
      series: [
        { name: 'יום 1', value: 30 },
        { name: 'יום 2', value: 50 },
        { name: 'יום 3', value: 80 },
      ]
    }
  ];

  colorScheme = 'cool';

  onSelectionChange(): void {
    console.log('מטבע:', this.selectedCurrency);
    console.log('טווח זמן:', this.selectedTimeRange);
    this.updateChartData();
  }

  updateChartData(): void {
    const data: { name: string; value: number }[] = [];

    let numberOfEntries = 0;
    let namePrefix = '';

    switch (this.selectedTimeRange) {
      case 'שבוע':
        numberOfEntries = 7;
        namePrefix = 'יום ';
        break;
      case 'חודש':
        numberOfEntries = 4;
        namePrefix = 'שבוע ';
        break;
      case 'חצי שנה':
        numberOfEntries = 6;
        namePrefix = 'חודש ';
        break;
      case 'שנה':
        numberOfEntries = 12;
        namePrefix = 'חודש ';
        break;
    }

    for (let i = 1; i <= numberOfEntries; i++) {
      data.push({ name: `${namePrefix}${i}`, value: Math.floor(Math.random() * 100) });
    }

    this.chartData = [
      {
        name: this.selectedCurrency,
        series: data
      }
    ];
  }
}
