import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { Order, Filter } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip', { static: false }) tooltipRef: ElementRef;

  orders: Order[] = [];
  tooltip: MaterialInstance;
  oSub: Subscription;
  filter: Filter = {};

  offset = 0;
  limit = STEP;

  isFilterVisible = false;
  loading = false;
  reloading = false;
  noMoreOrders = false;

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.reloading = true;
    this.fetch();
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.oSub.unsubscribe();
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.fetch();
  }

  private fetch() {

    const params = Object.assign(
      {},
      this.filter,
      {
        offset: this.offset,
        limit: this.limit
      }
    );

    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = [...this.orders, ...orders];
      this.noMoreOrders = orders.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.fetch();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length > 0;
  }
}
