import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { DaLoadThePackingComponent } from './da-load-the-packing/da-load-the-packing.component';
import { DaTruckListComponent } from './da-truck-list/da-truck-list.component';
import { GodownTruckDetailsComponent} from './godown-truck-details/godown-truck-details.component'
import { TruckDeliveryChallanComponent} from './truck-delivery-challan/truck-delivery-challan.component'
import { TransporterProviderCostVerificationComponent} from './transporter-provider-cost-verification/transporter-provider-cost-verification.component'
import { NotLogisticsComponent } from './not-logistics/not-logistics.component';
const routes: Routes = [
  {path:'',component:LoadingComponent},
  {path:'loadingpackedbox',component:DaLoadThePackingComponent},
  {path:'trucklist',component:DaTruckListComponent},
  {path:'truckdeliverychallan',component:TruckDeliveryChallanComponent},
  {path:'transport-cost-verification',component:TransporterProviderCostVerificationComponent},
  {path:'godown-truck-details',component:GodownTruckDetailsComponent},
  {path:'Not-logistics',component:NotLogisticsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoadingRoutingModule { }
