import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FlightComponent } from './pages/flight/flight.component';
import { CarrierComponent } from './pages/carrier/carrier.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'flight',
    component: FlightComponent,
  },
  {
    path: 'carrier',
    component: CarrierComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
