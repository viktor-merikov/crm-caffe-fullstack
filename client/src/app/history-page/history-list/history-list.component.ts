import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Order } from 'src/app/shared/interfaces';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})

export class HistoryListComponent implements OnDestroy, AfterViewInit {

  @Input() orders: Order[];
  @ViewChild('modal', { static: false }) modalRef: ElementRef;

  modal: MaterialInstance;
  selectedOrder: Order;

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => total += item.quantity * item.cost, 0)
  }

  selectOrder(order: Order) {
    this.selectedOrder = order;
    this.modal.open();
  }

  closeModal() {
    this.modal.close();
  }

}
