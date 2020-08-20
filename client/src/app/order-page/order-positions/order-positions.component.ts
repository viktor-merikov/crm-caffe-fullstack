import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { Observable, of } from 'rxjs';
import { Position } from 'src/app/shared/interfaces';
import { switchMap, map } from 'rxjs/operators';
import { OrderService } from '../order.service';
import { MaterialService } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  positions: Observable<Position[]>;

  constructor(private route: ActivatedRoute, private positionsService: PositionsService, private orderService: OrderService) { }

  ngOnInit() {
    this.positions = this.route.params.pipe(
      switchMap(
        (params: Params) => {
          return this.positionsService.fetch(params['id']);
        }
      ),
      map(
        (positions: Position[]) => {
          return positions.map(
            (position: Position) => {
              position.quantity = 1;
              return position;
            }
          )
        }
      )
    )
  }

  addToOrder(position: Position) {
    this.orderService.add(position);
    MaterialService.toast(`${position.name} : ${position.quantity} added`)
  }

}
