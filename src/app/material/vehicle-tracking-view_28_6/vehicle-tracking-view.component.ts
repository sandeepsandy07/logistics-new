import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormControl,
  FormArray,
   
} from "@angular/forms";

import { HttpClient, HttpHeaders } from "@angular/common/http";


import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';





@Component({
  selector: 'app-vehicle-tracking-view',
  templateUrl: './vehicle-tracking-view.component.html',
  styleUrls: ['./vehicle-tracking-view.component.css']
})
export class VehicleTrackingViewComponent implements OnInit {

  public da_id:any;
  public loaded_truck_list:any;
  public truck_details:UntypedFormGroup;
  public truck_track:any;
  

  constructor(public api: ApiserviceService, 
    public dialog: MatDialog,
    private activatedroute: ApiserviceService,private router: Router,
    private formBuilder: UntypedFormBuilder) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {dad_id: string};
    this.da_id = state.dad_id;

    this.truck_details=this.formBuilder.group({
      boxLIst_panel:  '',
      boxLIst_loose:this.formBuilder.array([]) ,
    })
    

   }

  ngOnInit(): void {
    this.getcurrentTucklist();
  }

  getcurrentTucklist(){  
    let data={
      da_id: this.da_id,
      status:'all'
    }
      this.api.postData("logistics_truck_list/get_truck_list/",data).then((response:any) => {       
      this.loaded_truck_list=response.filter(row => row.loaded_flag == true);  
    },(error)=>{
        console.log("error");
    })
  }

  callvehicledetailsapi(truck_id){
    let data={     
      truck_id: 161
    }
      this.api.postData("logistics_truck_list/get_truck_tracking_details/",data).then((response:any) => {
      this.truck_track=response;     
    },(error)=>{
        console.log("error");
    })
  }


  daNavigation(id,nav_url){
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.router.navigate([nav_url], navigationExtras);
  }

   hideloader() {
    document.getElementById('loading') .style.display = 'none';       
    }

    openDialogPanel(list: any){
      const dialogRef = this.dialog.open(OpenDialogVehicleHistory, {
        height: '400px',
        width: '750px',
        maxWidth:'100%',
       
       
        
        data: {
             truck_tack: list
              }
      });
    }

    // trucklist(par4): FormArray {
     
      // console.log("hdgsfjds", (this.bigbox_details.value.boxLIst_panel.length));
     
      // if(par4){
       
      //   return this.bigbox_details.get("boxLIst_panel") as FormArray
        
      // }else{
       
      //   return this.bigbox_details.get("boxLIst_loose") as FormArray

      // }
     
    // }
    newtrucklist(par1,par2,par3): UntypedFormGroup {
     

      return this.formBuilder.group({
        truck_list: par1,
        item:par2,
        panel:par3 
      })
    }
    addtrucklist(par1,par2,par3) {
      // this.trucklist(par1.panel_flag).push(this.newtrucklist(par1,par2,par3));  
    }

}
@Component({
  selector: 'open-dialog-panel',
  templateUrl: 'show-vehicle-transit-history.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 89%;
      max-width:100% !important;
      
    }

    mat-dialog-content {
      flex-grow: 1;
      
    }
    mat-dialog-container{
      background-color:#62b8f56e !important;
    }
  `]
})
export class OpenDialogVehicleHistory {

  displayedColumns = ['slno','item_desc', 'qty', 'check_by'];
  
  list: any;
  resultbox:Array<any>=[];
  sectionName:any;
  panelName:any;
  box_types:any;
  truck_track_details = [];
  

  tableShow: boolean = false;

  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogVehicleHistory>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
    
      this.truck_track_details=data.truck_tack;
    
  
    }
    dialogClose(){
   
      this.dialogRef.close({data:"Close"});

    }
    
    
    
  }

  // openDialog(id){
  //   const dialogRef = this.dialog.open(OpenDialogPanelLoading, {
     
  //     width: '1255px',
  //     maxWidth:'100%',
  //     position: {
  //       top: '0px',
  //     },
      
  //     data: {
  //           id: id
  //           }
  //   });
  // }

  

