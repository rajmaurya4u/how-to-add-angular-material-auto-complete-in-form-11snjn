import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit  {

  name = 'Angular';
  orderForm: FormGroup;
  orderItems = new FormArray([]);
  filteredOrderServices: Observable<string[]>;
  filteredOrderItems: Observable<string[]>;
  orderServices = ['One', 'two','three'];
  orderItemName = ['ABC', 'XYZ', 'PQR'];
  itemNameOp = new FormControl('', Validators.required);
  itemServiceOp = new FormControl('', Validators.required);
  ngOnInit() {
    this.initForm();
  }
  private initForm() {
    this.filteredOrderItems = this.itemNameOp.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value.toString(), 'I'))
      );
    this.filteredOrderServices = this.itemServiceOp.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, 'S'))
      );
    this.orderForm = new FormGroup({
      'orderItems': this.orderItems,
      'totalAmount': new FormControl(null, Validators.required)
    });
  }
  private _filter(value: string, key: string): string[] {
    const filterValue = value.toLowerCase();
    if (key === 'S') {
      return this.orderServices.filter(option => option.toLowerCase().includes(filterValue));
    } else {
      return this.orderItemName.filter(option => option.toLowerCase().includes(filterValue));
    }
  }
  onAddItem() {
    (<FormArray>this.orderForm.get('orderItems')).push(
      new FormGroup({
        'itemName': new FormControl(null, Validators.required),
        'itemService': new FormControl(null, Validators.required),
        'itemPrice': new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]*$/)])
      })
    );
  }
  onDeleteIngredient(index: number) {
    (<FormArray>this.orderForm.get('orderItems')).removeAt(index);
  }
  
  getControls() {
    return (<FormArray>this.orderForm.get('orderItems')).controls;
  }
}
