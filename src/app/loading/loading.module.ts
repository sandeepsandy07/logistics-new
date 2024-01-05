import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MaterialExampleModule} from '../material.module';
import { HttpClientModule } from '@angular/common/http';



import { LoadingRoutingModule } from './loading-routing.module';
import { LoadingComponent } from './loading/loading.component';
import { DaLoadThePackingComponent } from './da-load-the-packing/da-load-the-packing.component';
import { OpenDialogLOadingToTruck } from './da-load-the-packing/da-load-the-packing.component';
import { DaTruckListComponent } from './da-truck-list/da-truck-list.component';
import { TruckDeliveryChallanComponent } from './truck-delivery-challan/truck-delivery-challan.component';
import {OpenDialogShowTruckBoxItem } from './da-load-the-packing/da-load-the-packing.component';
import {TruckFileUploadView} from './da-truck-list/da-truck-list.component';
import { BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { TruckDetailsPdf } from './da-truck-list/da-truck-list.component';
import { TransporterProviderCostVerificationComponent } from './transporter-provider-cost-verification/transporter-provider-cost-verification.component';
import { OpenTransporterProviderFreightUploadPage } from './transporter-provider-cost-verification/transporter-provider-cost-verification.component';
import { OpenFreightVerify } from './transporter-provider-cost-verification/transporter-provider-cost-verification.component';
import { GodownTruckDetailsComponent } from './godown-truck-details/godown-truck-details.component';

import { OpenConfirmPopupWindow } from './truck-delivery-challan/truck-delivery-challan.component';
import { NotLogisticsComponent } from './not-logistics/not-logistics.component';

import { OpenViewAttachedFileDocuments } from './not-logistics/not-logistics.component';
import { OpenUploadBillReceipts } from './not-logistics/not-logistics.component';




@NgModule({
  declarations: [
    LoadingComponent,
    DaLoadThePackingComponent,
    OpenDialogLOadingToTruck,
    DaTruckListComponent,
    TruckDeliveryChallanComponent,
    OpenDialogShowTruckBoxItem,
    TruckFileUploadView,
    TruckDetailsPdf,
    TransporterProviderCostVerificationComponent,
    OpenTransporterProviderFreightUploadPage,
    OpenFreightVerify,
    GodownTruckDetailsComponent,
    OpenConfirmPopupWindow,
    NotLogisticsComponent,
    OpenViewAttachedFileDocuments,
    OpenUploadBillReceipts
  ],
  imports: [
    CommonModule,
    LoadingRoutingModule,
    MaterialExampleModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    DataTablesModule,
    BarcodeScannerLivestreamModule
  ]
})
export class LoadingModule { }
