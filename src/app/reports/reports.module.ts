import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MaterialExampleModule} from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { BillingReportComponent } from './billing-report/billing-report.component';
import { VehicleReportComponent } from './vehicle-report/vehicle-report.component';
import { OpenDialogVehicleHistory } from './vehicle-report/vehicle-report.component';
import { InsuranceReportComponent } from './insurance-report/insurance-report.component';
import { PackingCostReportComponent } from './packing-cost-report/packing-cost-report.component';
import { TransportCostReportComponent } from './transport-cost-report/transport-cost-report.component';
import { TruckRequestReportComponent } from './truck-request-report/truck-request-report.component';
import { OpenDialogTruckApprovalStatus } from './truck-request-report/truck-request-report.component';
import { PanelWiseReportsComponent } from './panel-wise-reports/panel-wise-reports.component';
import { BillableNonbillableReportComponent } from './billable-nonbillable-report/billable-nonbillable-report.component';
import { TruckDeliveryChallanComponent } from './truck-delivery-challan/truck-delivery-challan.component';
import { OpenSAPDATAFileUploadPage } from './billable-nonbillable-report/billable-nonbillable-report.component';
import { OpenUploadBillReceipts } from './transport-cost-report/transport-cost-report.component';
import { OpenViewAttachedFileDocuments } from './transport-cost-report/transport-cost-report.component';
import { OpenDialogGodownStorageData } from './transport-cost-report/transport-cost-report.component';
import { RiskLedgerReportComponent } from './risk-ledger-report/risk-ledger-report.component';
import { RiskLedgerComponent } from './risk-ledger/risk-ledger.component';
import { OpenRiskLedgerAddPage } from './risk-ledger/risk-ledger.component';

import { OtherTransactionsComponent } from './other-transactions/other-transactions.component';
import { OpenSAPDATAFileUploadWindow } from './other-transactions/other-transactions.component';

import { OpenUserInputScreen } from './other-transactions/other-transactions.component';

import { DeliveryChallanLeftOutRecordsComponent } from './delivery-challan-left-out-records/delivery-challan-left-out-records.component';
import { PackingReportComponent } from './packing-report/packing-report.component';
import {OpenDialogBoxDetails } from './packing-report/packing-report.component';
import {OpenExportDateFileUploadPage} from "./vehicle-report/vehicle-report.component";


import { manualTruckDeliveryDetailsAdd} from "./vehicle-report/vehicle-report.component";
import { CodReportsComponent } from './cod-reports/cod-reports.component';
import { CodReportComponent } from './cod-report/cod-report.component';
import { addRatings} from './vehicle-report/vehicle-report.component';
import {OpenViewAttachedFileDocument } from './cod-report/cod-report.component'
import {OpenUploadCODFiles} from './cod-report/cod-report.component'


@NgModule({
  declarations: [
    ReportsComponent,
    BillingReportComponent,
    VehicleReportComponent,
    InsuranceReportComponent,
    PackingCostReportComponent,
    TransportCostReportComponent,
    TruckRequestReportComponent,
    OpenDialogVehicleHistory,
    OpenDialogTruckApprovalStatus,
    PanelWiseReportsComponent,
    BillableNonbillableReportComponent,
    TruckDeliveryChallanComponent,
    OpenSAPDATAFileUploadPage,
    OpenUploadBillReceipts,
    OpenViewAttachedFileDocuments,
    OpenDialogGodownStorageData,
    RiskLedgerReportComponent,
    RiskLedgerComponent,
    OtherTransactionsComponent,
    DeliveryChallanLeftOutRecordsComponent,
    OpenRiskLedgerAddPage,
    OpenSAPDATAFileUploadWindow,
    OpenUserInputScreen,
    PackingReportComponent,
    OpenDialogBoxDetails,
    OpenExportDateFileUploadPage,
    manualTruckDeliveryDetailsAdd,
    CodReportsComponent,
    CodReportComponent,
    addRatings,
    OpenViewAttachedFileDocument,
    OpenUploadCODFiles
  ],
  imports: [
    CommonModule,   
    MaterialExampleModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    DataTablesModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
