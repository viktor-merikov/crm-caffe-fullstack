import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsPage } from '../shared/interfaces';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain', { static: false }) gainRef: ElementRef;
  @ViewChild('order', { static: false }) orderRef: ElementRef;

  average: number;
  pending = true;
  aSub: Subscription;

  constructor(private analyticsService: AnalyticsService) { }

  ngAfterViewInit() {

    const gainConfig: any = {
      label: 'Gain',
      color: 'rgb(255, 99, 132)'
    }

    const orderConfig: any = {
      label: 'Order',
      color: 'rgb(54, 162, 235)'
    }

    this.aSub = this.analyticsService.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average;

      gainConfig.labels = data.chart.map(item => item.label);
      gainConfig.data = data.chart.map(item => item.gain);

      orderConfig.labels = data.chart.map(item => item.label);
      orderConfig.data = data.chart.map(item => item.order);

      // // temp Gain
      // gainConfig.labels.push('17.08.2020');
      // gainConfig.labels.push('19.08.2020');
      // gainConfig.labels.push('20.08.2020');
      // gainConfig.data.push(42);
      // gainConfig.data.push(35.5);
      // gainConfig.data.push(39);

      // // temp Orders
      // orderConfig.labels.push('17.08.2020');
      // orderConfig.labels.push('19.08.2020');
      // orderConfig.labels.push('20.08.2020');
      // orderConfig.data.push(7);
      // orderConfig.data.push(10);
      // orderConfig.data.push(9);

      const gainCtx = this.gainRef.nativeElement.getContext('2d');
      const orderCtx = this.orderRef.nativeElement.getContext('2d');
      gainCtx.canvas.height = '300px';
      orderCtx.canvas.height = '300px';

      new Chart(gainCtx, createChartConfig(gainConfig));
      new Chart(orderCtx, createChartConfig(orderConfig));

      this.pending = false;
    });
  }

  ngOnDestroy() {
    this.aSub && this.aSub.unsubscribe();
  }

}

function createChartConfig({ labels, data, label, color }) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}