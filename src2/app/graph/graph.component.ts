import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CoinsService, CoinModel }  from  "../service/service.service" // ודאי שהנתיב נכון
import { from } from 'rxjs';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxChartsModule
  ],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  currencies = ['USD', 'EUR', 'GBP', 'JPY'];
  timeRanges = ['שבוע', 'חודש', 'חצי שנה', 'שנה'];

  selectedCurrency = this.currencies[0];
  selectedTimeRange = this.timeRanges[0];

  chartData: { name: string; series: { name: string; value: number }[] }[] = [];
  colorScheme = 'cool';
  errorMessage = '';

  constructor(private coinsService: CoinsService) {}

  ngOnInit(): void {
    this.updateChartData();
  }

  onSelectionChange(): void {
    this.updateChartData();
  }

  updateChartData(): void {
    this.errorMessage = '';
    const coin = this.selectedCurrency.toLowerCase();
    let serviceCall;

    switch (this.selectedTimeRange) {
      case 'שבוע':
        serviceCall = this.coinsService.getWeek(coin);
        break;
      case 'חודש':
        serviceCall = this.coinsService.getMonth(coin);
        break;
      case 'חצי שנה':
        serviceCall = this.coinsService.getHalfYear(coin);
        break;
      case 'שנה':
        serviceCall = this.coinsService.getYear(coin);
        break;
      default:
        this.errorMessage = 'טווח זמן לא חוקי';
        return;
    }

    serviceCall.subscribe({
      next: (data: CoinModel[]) => {
        const series = data.map((item) => ({
          name: new Date(item.date).toLocaleDateString('he-IL'),
          value: item.price
        })).reverse(); // כדי שיהיה מהישן לחדש

        this.chartData = [{
          name: this.selectedCurrency,
          series
        }];
      },
      error: (err) => {
        this.errorMessage = err.message || 'אירעה שגיאה בטעינת הנתונים';
        this.chartData = [];
      }
    });
  }
}
