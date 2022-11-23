import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent } from './market/market.component';
import { PlantingComponent } from './planting/planting.component';
import {MatButtonModule} from "@angular/material/button";
import { MatDividerModule } from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'

@NgModule({
  declarations: [
    MarketComponent,
    PlantingComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ]
})
export class HiveTransactionsModule { }
