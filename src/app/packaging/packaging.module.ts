import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackagingRoutingModule } from './packaging-routing.module';
import { PackagingComponent } from './packaging/packaging.component';
import { DragDropModule} from '@angular/cdk/drag-drop';

import { DataTablesModule } from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import {MaterialExampleModule} from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { PackingPanelComponent } from './packing-panel/packing-panel.component';
import { PackingOpenDialogPanel } from './packing-panel/packing-panel.component';
import { OpenDialogBigboxDetails} from './packing-panel/packing-panel.component';
import { PackingOpenDialogView } from './packing-panel/packing-panel.component';
import { PackingOpenDialogAddAccessories } from './packing-panel/packing-panel.component';
import { PackingListComponent } from './packing-list/packing-list.component';
import { PackingPriceComponent } from './packing-price/packing-price.component';
import { NgxBarcode6Module } from 'ngx-barcode6';
import {NgxPrintModule} from 'ngx-print';
import { PackingApprovalComponent } from './packing-approval/packing-approval.component';
import { BoxSizeComponent } from './box-size/box-size.component';
import { BoxTypeComponent } from './box-type/box-type.component'

import { AssignDaDetails } from './packing-list/packing-list.component';
import { SearchPipe } from './search.pipe';
import { PackingApproverListComponent } from './packing-approver-list/packing-approver-list.component';
import { DaRemarksComponent } from './da-remarks/da-remarks.component';
import { OpenCreateDaRemarks } from './da-remarks/da-remarks.component';

import { OpenPackingPriceFileUploadPage } from './packing-price/packing-price.component';

@NgModule({
  declarations: [
    PackagingComponent,
    PackingPanelComponent,
    PackingOpenDialogPanel,
    PackingOpenDialogView,
    PackingOpenDialogAddAccessories,
    PackingListComponent,
    PackingPriceComponent,
    PackingApprovalComponent,
    OpenDialogBigboxDetails,
    BoxSizeComponent,
    BoxTypeComponent,
    AssignDaDetails,
    SearchPipe,
    PackingApproverListComponent,
    DaRemarksComponent,
    OpenCreateDaRemarks,
    OpenPackingPriceFileUploadPage
  ],
  imports: [
    CommonModule,
    PackagingRoutingModule,
    DragDropModule,
    CommonModule,
    MaterialExampleModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    DataTablesModule,
    NgxBarcode6Module,
    NgxPrintModule
  ],
  exports:[
    
  ]
})
export class PackagingModule { }
