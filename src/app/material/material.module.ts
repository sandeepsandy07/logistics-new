import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import {MaterialExampleModule} from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialRoutingModule } from './material-routing.module';
//import { MaterialComponent } from './material/material.component';
import { DispatchModeComponent } from './dispatch-mode/dispatch-mode.component';
import { DeliveryModeComponent } from './delivery-mode/delivery-mode.component';
import { InsuranceScopeComponent } from './insurance-scope/insurance-scope.component';
import { InsuranceTypeComponent } from './insurance-type/insurance-type.component';
import { TransportationScopeComponent } from './transportation-scope/transportation-scope.component';
import { FreightModeComponent } from './freight-mode/freight-mode.component';
import { PackingInstructionComponent } from './packing-instruction/packing-instruction.component';
import { LicenseTypeComponent } from './license-type/license-type.component';
import { GstByComponent } from './gst-by/gst-by.component';
import { MaterialDispatchBillComponent } from './material-dispatch-bill/material-dispatch-bill.component';
// import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import { BillComponent } from './bill/bill.component';
import {CreateNonBillableData } from  './billableform/billableform.component';
import { BillableformComponent } from  './billableform/billableform.component';


import { PopupComponent } from './popup/popup.component';
import { NonBillPopupComponent } from './non-bill-popup/non-bill-popup.component';
import { LooseItemVerificationComponent } from './loose-item-verification/loose-item-verification.component';
import {PanelWiseMaterialComponent} from './panel-wise-material/panel-wise-material.component';
import { DispatchAdviceComponent } from './dispatch-advice/dispatch-advice.component';

import { DataTablesModule } from 'angular-datatables';


import { DaApprovalComponent } from './da-approval/da-approval.component';
import { DispatchAdviceDetailComponent } from './dispatch-advice-detail/dispatch-advice-detail.component';
import { BomViewComponent } from './bom-view/bom-view.component';
import { PanelWiseMaterialViewComponent } from './panel-wise-material-view/panel-wise-material-view.component';
import { PanelItemVerificationComponent } from './panel-item-verification/panel-item-verification.component';
import {OpenDialogBox} from './panel-item-verification/panel-item-verification.component';
import {OpenDialogAddAccessories} from './panel-wise-material-view/panel-wise-material-view.component';
import {OpenDialogPanel} from './panel-wise-material-view/panel-wise-material-view.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { DispatchAdviceListComponent } from './dispatch-advice-list/dispatch-advice-list.component';
import { PackagingModule } from '../packaging/packaging.module';
import { DaPackingViewComponent } from './da-packing-view/da-packing-view.component';
import { OpenDialogBigboxDetailsDaView } from './da-packing-view/da-packing-view.component';

import { DaFileUpload } from './document-details/document-details.component';

import { DaLoadingViewComponent } from './da-loading-view/da-loading-view.component';
import { DaTrackingViewComponent } from './da-tracking-view/da-tracking-view.component';
import { DaPanelWiseApprovalComponent } from './da-panel-wise-approval/da-panel-wise-approval.component';
import {OpenDialogPanelApproval} from './da-panel-wise-approval/da-panel-wise-approval.component';

import {OpenDialogShowTruckBoxItemDaView} from './da-loading-view/da-loading-view.component';


import { DaApprovalListComponent } from './da-approval-list/da-approval-list.component';
import { DaPanelVerifyListComponent } from './da-panel-verify-list/da-panel-verify-list.component';

import { CreateBillableData} from'./billableform/billableform.component';
import { OpenDialogVehicleHistory } from './vehicle-tracking-view/vehicle-tracking-view.component';
import { truckDeliveryDetailsAdd } from './vehicle-tracking-view/vehicle-tracking-view.component';

import {VehicleTrackingViewComponent} from './vehicle-tracking-view/vehicle-tracking-view.component';
import { ChatAppComponent } from './dispatch-advice-detail/dispatch-advice-detail.component';


import { DaFinanceApprovalComponent } from './da-finance-approval/da-finance-approval.component';
import { DaRevisionComponent } from './da-revision/da-revision.component';
import { DaRevisionApproverComponent } from './da-revision-approver/da-revision-approver.component';
import { OpenDialogDaRevisionCreate } from './da-revision-approver/da-revision-approver.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { OpenDialogTruckDetails } from './dashboard/dashboard.component';
import { OpenDialogDADetails } from './dashboard/dashboard.component';
import { OpenDialogAddSoDetails } from './billableform/billableform.component';
import { DispatchAdviceReportComponent } from './dispatch-advice-report/dispatch-advice-report.component';
import{ OpenDialogDaHistory} from './dispatch-advice-report/dispatch-advice-report.component';
// import { OpenDialogDaRevisionApproval } from './da-revision/da-revision.component';
import {OpenQTSOFileUploadPage } from './dispatch-advice/dispatch-advice.component'

import {VerifyOpenDialogPanel } from './panel-item-verification/panel-item-verification.component'
import {OpenQTSOFileUploadPagebillable } from './billableform/billableform.component';
import { DaListOthersComponent } from './da-list-others/da-list-others.component';
import { DaListPeComponent } from './da-list-pe/da-list-pe.component';

import { AssignDa } from './dispatch-advice-list/dispatch-advice-list.component';
import { OpenDialogBillingDetails } from './dashboard/dashboard.component';

import { OpenVehicleTrackingDetails} from './dashboard/dashboard.component';

import {OpenSynccCustomer }  from './dispatch-advice/dispatch-advice.component';
import { DaDatailReportComponent } from './da-datail-report/da-datail-report.component'
import {OpenbillingDaDetails } from './dashboard/dashboard.component';
import { DaDetailViewTabComponent } from './da-detail-view-tab/da-detail-view-tab.component';
@NgModule({
  declarations: [
   // MaterialComponent,
   OpenbillingDaDetails,
    DispatchModeComponent,
 
    DeliveryModeComponent,
    InsuranceScopeComponent,
    InsuranceTypeComponent,
    TransportationScopeComponent,
    FreightModeComponent,
    PackingInstructionComponent,
    LicenseTypeComponent,
    GstByComponent,
    MaterialDispatchBillComponent,
    BillComponent,
    BillableformComponent,
    PopupComponent,
    NonBillPopupComponent,
    LooseItemVerificationComponent,
    PanelWiseMaterialComponent,
    DispatchAdviceComponent,
    DaApprovalComponent,
    DispatchAdviceDetailComponent,
    BomViewComponent,
    PanelWiseMaterialViewComponent,
    PanelItemVerificationComponent,
    OpenDialogBox,
    OpenDialogPanel,
    OpenDialogAddAccessories,
    DocumentDetailsComponent,
    DispatchAdviceListComponent,
    DaPackingViewComponent,
    DaLoadingViewComponent,
    DaTrackingViewComponent,
    DaPanelWiseApprovalComponent,
    OpenDialogPanelApproval,
    DaApprovalListComponent,
    DaPanelVerifyListComponent,
    VehicleTrackingViewComponent,
    DaFinanceApprovalComponent,
    OpenDialogVehicleHistory,
    DaRevisionComponent,
    DaRevisionApproverComponent,
    truckDeliveryDetailsAdd,
    CreateNonBillableData,
    CreateBillableData,
    OpenDialogBigboxDetailsDaView,
    OpenDialogShowTruckBoxItemDaView,
    ChatAppComponent,
    OpenDialogTruckDetails,
    OpenDialogAddSoDetails,
    OpenDialogBillingDetails,
    // OpenDialogDaRevisionApproval,
    OpenDialogDaRevisionCreate,
    DaFileUpload,
    DashboardComponent,
    OpenDialogDADetails,
    DispatchAdviceReportComponent,
    OpenDialogDaHistory,
    OpenQTSOFileUploadPage,
    VerifyOpenDialogPanel,
    OpenQTSOFileUploadPagebillable,
    DaListOthersComponent,
    AssignDa,
    DaListPeComponent,
    OpenVehicleTrackingDetails,
    OpenSynccCustomer,
    DaDatailReportComponent,
    DaDetailViewTabComponent


  ],
  imports: [
    CommonModule,
 
    MaterialRoutingModule,
    MaterialExampleModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    DataTablesModule,
    PackagingModule,
    
  ],
  
})
export class MaterialModule { }
