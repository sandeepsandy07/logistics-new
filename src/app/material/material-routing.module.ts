import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { MaterialComponent } from './material/material.component';
import {DeliveryModeComponent} from './delivery-mode/delivery-mode.component';
import {DispatchModeComponent} from './dispatch-mode/dispatch-mode.component';
import {InsuranceScopeComponent} from './insurance-scope/insurance-scope.component';
import {InsuranceTypeComponent} from './insurance-type/insurance-type.component';
import {LicenseTypeComponent} from './license-type/license-type.component';
import {PackingInstructionComponent} from './packing-instruction/packing-instruction.component';
import {TransportationScopeComponent} from './transportation-scope/transportation-scope.component';
import {FreightModeComponent} from './freight-mode/freight-mode.component';
import {GstByComponent} from './gst-by/gst-by.component';
import { MaterialDispatchBillComponent } from './material-dispatch-bill/material-dispatch-bill.component';
import { BillComponent } from './bill/bill.component';
import { BillableformComponent } from './billableform/billableform.component';
import {LooseItemVerificationComponent } from './loose-item-verification/loose-item-verification.component';
import { PanelWiseMaterialComponent } from './panel-wise-material/panel-wise-material.component';
import { DispatchAdviceComponent } from './dispatch-advice/dispatch-advice.component';
import {DaApprovalComponent } from './da-approval/da-approval.component';
import { DispatchAdviceDetailComponent } from './dispatch-advice-detail/dispatch-advice-detail.component';
import {DispatchAdviceListComponent } from './dispatch-advice-list/dispatch-advice-list.component';
import {DaPanelWiseApprovalComponent} from './da-panel-wise-approval/da-panel-wise-approval.component';
import {PanelItemVerificationComponent} from './panel-item-verification/panel-item-verification.component';
import { DaApprovalListComponent} from './da-approval-list/da-approval-list.component';
import { DaPanelVerifyListComponent} from './da-panel-verify-list/da-panel-verify-list.component';
import { DaFinanceApprovalComponent}  from './da-finance-approval/da-finance-approval.component';
import { DaRevisionComponent} from './da-revision/da-revision.component'
import { DaRevisionApproverComponent} from './da-revision-approver/da-revision-approver.component'
import { DashboardComponent } from './dashboard/dashboard.component';
import { DispatchAdviceReportComponent}  from './dispatch-advice-report/dispatch-advice-report.component'
import { DaListOthersComponent } from './da-list-others/da-list-others.component';
import { DaListPeComponent } from './da-list-pe/da-list-pe.component';
import { DaDatailReportComponent } from './da-datail-report/da-datail-report.component';
import { DaDetailViewTabComponent } from './da-detail-view-tab/da-detail-view-tab.component';



const routes: Routes = [
  //{path:'',component:MaterialComponent},
  {path:'billableform',component:BillableformComponent},
  {path:'itemverificationform', component:LooseItemVerificationComponent},
  {path:'materialdispatchbill',component:MaterialDispatchBillComponent},
  {path:'panelwisematerial',component:PanelWiseMaterialComponent},
  {path:'dispatchmode',component:DispatchModeComponent},
  {path:'deliverymode',component:DeliveryModeComponent},
  {path:'insurancescope',component:InsuranceScopeComponent},
  {path:'insurancetype',component:InsuranceTypeComponent},
  {path:'licensetype',component:LicenseTypeComponent},
  {path:'packinginstruction',component:PackingInstructionComponent},
  {path:'transportationscope',component:TransportationScopeComponent},
  {path:'freightmode',component:FreightModeComponent},
  {path:'gstby',component:GstByComponent},
  {path:'panelApproval',component:DaPanelWiseApprovalComponent},
 {path:'panelwiseitemverificationform', component:PanelItemVerificationComponent},
 {path:'panelverificationlist', component:DaPanelVerifyListComponent},
 {path:'DaFinanceApproval', component:DaFinanceApprovalComponent},

 {path:'Dashboard', component:DashboardComponent},


 {path:'revisionlist', component:DaRevisionComponent},
 {path:'revisioncreate', component:DaRevisionApproverComponent},


  
  // DA
  {path:'DAcreate',component:DispatchAdviceComponent,data:{showcreate:true}},
  {path:'da',component:DispatchAdviceListComponent},
  {path:'da/:da_id',component:DispatchAdviceComponent,data:{showcreate:true}},
  {path:'DaApproval',component:DaApprovalListComponent},
  {path:'DaApprovalPage',component:DaApprovalComponent},
  {path:'DA-details',component:DispatchAdviceDetailComponent,data:{id:null}},
  {path:'DA-details-report',component:DaDatailReportComponent},

  

  {path:'bill',component:BillComponent},
  {path:'DAlistStatusWise',component:DispatchAdviceReportComponent},
  {path:'da-others',component:DaListOthersComponent},
  {path:'da-pe',component:DaListPeComponent},
  {path:'da-details-new',component:DaDetailViewTabComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRoutingModule { }
