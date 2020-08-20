import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { Position, Message } from '../../../shared/interfaces';
import { MaterialService, MaterialInstance } from 'src/app/shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('modal', { static: false }) modalRef: ElementRef;
  @Input('categoryId') categoryId: string;

  loading = false;
  positions: Position[] = [];
  modal: MaterialInstance;
  form: FormGroup;
  positionId = null;

  constructor(private positionsService: PositionsService) { }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnInit() {
    this.loading = true;
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    });
    this.positionsService.fetch(this.categoryId).subscribe((positions: Position[]) => {
      this.positions = positions;
      this.loading = false;
    });
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset();
    this.modal.open();
  }

  onCancel() {
    this.modal.close();
  }

  completed = () => {
    this.onCancel();
    this.form.reset();
    this.form.enable();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      category: this.categoryId,
      cost: this.form.value.cost
    }

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition).subscribe(
        (position: Position) => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions[idx] = position;
          MaterialService.toast(`Position ${position.name} updated`);
        },
        error => {
          MaterialService.toast(error.error.mrssage);
        },
        this.completed
      )
    } else {
      this.positionsService.create(newPosition).subscribe(
        (position: Position) => {
          MaterialService.toast(`Position ${position.name} created`);
          this.positions.push(position);
        },
        error => {
          MaterialService.toast(error.error.mrssage);
        },
        this.completed
      );
    }
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Delete ${position.name} ?`);
    if (decision) {
      this.positionsService.delete(position).subscribe(
        ({ message }: Message) => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions.splice(idx, 1);
          MaterialService.toast(message);
        },
        error => {
          MaterialService.toast(error.error.mrssage);
        }
      )
    }
  }
}
