import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackingComponent } from './tracking/tracking.component';
import {TruckTypeComponent} from './truck-type/truck-type.component';
import {DestinationComponent} from './destination/destination.component';
import {TransportationComponent} from './transportation/transportation.component';
import {DestinationDetailsComponent} from './destination-details/destination-details.component';
import {TransporterDetailsComponent} from './transporter-details/transporter-details.component';
import {TruckRequestComponent} from './truck-request/truck-request.component';
import {TruckApprovalComponent} from './truck-approval/truck-approval.component';
import { TransportsComponent } from './transports/transports.component';
import { TruckCheckInCheckOutComponent } from './truck-check-in-check-out/truck-check-in-check-out.component';

const routes: Routes = [
  {path:'',component:TrackingComponent},
  {path:'trucktype',component:TruckTypeComponent},
  {path:'destination', component:DestinationComponent},
  {path:'transportation',component:TransportationComponent},
  {path:'destination-details',component:DestinationDetailsComponent},
  {path:'transporter-details',component:TransporterDetailsComponent},
  {path:'truck-request',component:TruckRequestComponent},
  {path:'truck-approval',component:TruckApprovalComponent},
  {path:'truck-approval/:id',component:TruckApprovalComponent},
  {path:'transports',component:TransportsComponent},
  {path:'truck-checkIn-checkOut',component:TruckCheckInCheckOutComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackingRoutingModule { }
