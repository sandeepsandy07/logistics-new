import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackagingComponent } from './packaging/packaging.component';
import{ BoxSizeComponent } from './box-size/box-size.component';

import { PackingPanelComponent } from './packing-panel/packing-panel.component';
import {PackingPriceComponent} from './packing-price/packing-price.component';
import { PackingListComponent } from './packing-list/packing-list.component';
import { PackingApprovalComponent } from './packing-approval/packing-approval.component';
import { BoxTypeComponent } from './box-type/box-type.component';
import { PackingApproverListComponent } from './packing-approver-list/packing-approver-list.component';
import { DaRemarksComponent } from './da-remarks/da-remarks.component'

const routes: Routes = [
  {path:'packinglist',component:PackingListComponent},
  {path:'packingprice',component:PackingPriceComponent},
  {path:'dawise',component:PackingPanelComponent},
  {path:'PackingApproval',component:PackingApprovalComponent},
  {path:'PackingApprovallist',component:PackingApproverListComponent},
  {path:'packing-price',component:PackingPriceComponent},
  {path:'box-size',component:BoxSizeComponent},
  {path:'box-type',component:BoxTypeComponent},
  {path:'da-packing-work-details',component:DaRemarksComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagingRoutingModule { }
