import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market/market.component';
import { PlantingComponent } from './planting/planting.component';
import {MatButtonModule} from "@angular/material/button";
import { MatDividerModule } from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MarketComponent,
    PlantingComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class HiveTransactionsModule { }
