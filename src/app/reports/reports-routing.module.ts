import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
import { BillingReportComponent} from './billing-report/billing-report.component'
import { VehicleReportComponent } from './vehicle-report/vehicle-report.component'
import { InsuranceReportComponent } from './insurance-report/insurance-report.component'
import { PackingCostReportComponent } from './packing-cost-report/packing-cost-report.component';
import {  TransportCostReportComponent} from './transport-cost-report/transport-cost-report.component';
import { TruckRequestReportComponent} from './truck-request-report/truck-request-report.component';
import { BillableNonbillableReportComponent } from './billable-nonbillable-report/billable-nonbillable-report.component';
import { RiskLedgerComponent} from './risk-ledger/risk-ledger.component'
import {RiskLedgerReportComponent } from './risk-ledger-report/risk-ledger-report.component';
import { OtherTransactionsComponent } from './other-transactions/other-transactions.component';
import { DeliveryChallanLeftOutRecordsComponent } from './delivery-challan-left-out-records/delivery-challan-left-out-records.component';

import { PackingReportComponent}  from './packing-report/packing-report.component';
import { CodReportComponent } from './cod-report/cod-report.component';

const routes: Routes = [
  {path:'',component:ReportsComponent},
  {path:'billing-report',component:BillableNonbillableReportComponent},
  {path:'vehicle-report',component:VehicleReportComponent},
  {path:'insurance-report',component:InsuranceReportComponent},
  {path:'packing-cost-report',component:PackingCostReportComponent},
  {path:'packing-report',component:PackingReportComponent},
  {path:'transport-cost-report',component:TransportCostReportComponent},
  {path:'truck-request-report',component:TruckRequestReportComponent},
  // {path:'risk-legder',component:RiskLedgerComponent},
  // {path:'risk-legder-report',component:RiskLedgerReportComponent}
  {path:'risk-ledger', component:RiskLedgerComponent},
  {path:'risk-ledger-report', component:RiskLedgerReportComponent},
  {path:'other-transactions', component:OtherTransactionsComponent},
  {path:'delivery-challan-left-out', component:DeliveryChallanLeftOutRecordsComponent},
  {path:'cod-Report', component:CodReportComponent},


  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
