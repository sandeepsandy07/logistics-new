import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

import {MaterialExampleModule} from '../material.module';
import { HttpClientModule } from '@angular/common/http';
// import { MaterialRoutingModule } from './material-routing.module';
import { TrackingRoutingModule } from './tracking-routing.module';
import { TrackingComponent } from './tracking/tracking.component';
import { TruckTypeComponent } from './truck-type/truck-type.component';
import { DestinationComponent } from './destination/destination.component';
import { TransportationComponent } from './transportation/transportation.component';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { DestinationDetailsComponent } from './destination-details/destination-details.component';
import { TransporterDetailsComponent } from './transporter-details/transporter-details.component';
import { TruckApprovalComponent } from './truck-approval/truck-approval.component';
import { fileUpload } from './truck-approval/truck-approval.component';

import { TruckRequestComponent } from './truck-request/truck-request.component';
import { TransportsComponent } from './transports/transports.component';
import { TruckCheckInCheckOutComponent } from './truck-check-in-check-out/truck-check-in-check-out.component';
import { OpenCheckOutDialogBox } from './truck-check-in-check-out/truck-check-in-check-out.component';
import { OpenCheckInDialogBox } from './truck-check-in-check-out/truck-check-in-check-out.component';




@NgModule({
  declarations: [
    TrackingComponent,
    TruckTypeComponent,
    DestinationComponent,
    TransportationComponent,
    DestinationDetailsComponent,
    TransporterDetailsComponent,
    TruckApprovalComponent,
    TruckRequestComponent,
    TransportsComponent,
    TruckCheckInCheckOutComponent,
    OpenCheckOutDialogBox,
    OpenCheckInDialogBox,
    fileUpload

  ],
  imports: [
    CommonModule,
    TrackingRoutingModule,
    CommonModule,
    MaterialExampleModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class TrackingModule { }
