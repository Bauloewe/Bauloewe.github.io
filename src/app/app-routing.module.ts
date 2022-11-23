import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { MarketComponent } from './hive-transactions/market/market.component';
import { PlantingComponent } from './hive-transactions/planting/planting.component';

const appRoutes: Routes = [
  { path: 'hive',
    children: [
      {
        path: 'market_buy',
        component: MarketComponent
      },
      {
        path: 'plant',
        component: PlantingComponent
      }
    ]
  },
  {
    path: 'about',
    component: AboutComponent
    
  },
  { 
    path: '',   
    redirectTo: '/about', 
    pathMatch: 'full' 
  }
]
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
