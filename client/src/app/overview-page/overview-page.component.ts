import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { Observable } from 'rxjs';
import { OverviewPage } from '../shared/interfaces';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabTarget', { static: false }) tapTargetRef: ElementRef;

  data$: Observable<OverviewPage>;
  yesterdayDate = new Date();
  tapTarget: MaterialInstance;


  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.data$ = this.analyticsService.getOverview();
    this.yesterdayDate.setDate(this.yesterdayDate.getDate() - 1);
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTabTarget(this.tapTargetRef);
  }

  ngOnDestroy(): void {
    this.tapTarget.destroy();
  }

  openInfo() {
    this.tapTarget.open();
  }

}
