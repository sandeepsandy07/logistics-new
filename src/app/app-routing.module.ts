import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './common-components/main/main.component';
import {USERLOGINComponent} from './userlogin/userlogin.component';
import { AppComponent } from './app.component'; 



const routes: Routes = [
  { path: 'material', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/DAcreate', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/DA-details', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  
  { path: 'material/da', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/billableform', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/itemverificationform', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/panelwisematerial', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/materialdispatchbill', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/dispatchmode', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/deliverymode', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/insurancescope', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/insurancetype', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/licensetype', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/packinginstruction', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/transportationscope', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/freightmode', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/gstby', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/bill', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/DaFinanceApproval', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/Dashboard', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/DAlistStatusWise', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },


  { path: 'material/revisionlist', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/revisioncreate', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/da-others', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  { path: 'material/da-pe', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  // { path: 'material/DA-details-report', loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
 

  { path: 'packaging', loadChildren: () => import('./packaging/packaging.module').then(m => m.PackagingModule) },
  { path: 'packaging/dawise', loadChildren: () => import('./packaging/packaging.module').then(m => m.PackagingModule) },


  { path: 'loading', loadChildren: () => import('./loading/loading.module').then(m => m.LoadingModule) },
  { path: 'loading/loadingpackedbox', loadChildren: () => import('./loading/loading.module').then(m => m.LoadingModule) },
  { path: 'loading/trucklist', loadChildren: () => import('./loading/loading.module').then(m => m.LoadingModule) },
  { path: 'loading/truckdeliverychallan', loadChildren: () => import('./loading/loading.module').then(m => m.LoadingModule) },
  { path: 'loading/transport-cost-verification', loadChildren: () => import('./loading/loading.module').then(m => m.LoadingModule) },
  
  
  
  { path: 'tracking', loadChildren: () => import('./tracking/tracking.module').then(m => m.TrackingModule) },
  { path: 'tracking/truck-checkIn-checkOut', loadChildren: () => import('./tracking/tracking.module').then(m => m.TrackingModule) },
  { path: 'tracking/truck-request', loadChildren: () => import('./tracking/tracking.module').then(m => m.TrackingModule) },

  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'admin/rolemaster', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'admin/modulemaster', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'admin/userrole', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'admin/useraccess', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'admin/userlist', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'admin/moduleworkflow', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'admin/workflowtype', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'admin/workflowaccess', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'admin/module-role-access', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },


  { path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  { path: 'reports/billing-report', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  { path: 'reports/insurance-report', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  { path: 'reports/packing-cost-report', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  { path: 'reports/transport-cost-report', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  { path: 'reports/truck-request-report', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  { path: 'reports/vehicle-report', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
 
  { path: 'reports/risk-ledger', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  { path: 'reports/risk-ledger-report', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },


  // {path:'',loadChildren: () => import('./material/material.module').then(m => m.MaterialModule) },
  {path:'login',component:AppComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload'
  })],
   exports: [RouterModule]
})
export class AppRoutingModule { }
