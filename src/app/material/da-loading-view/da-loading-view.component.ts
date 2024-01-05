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
  selector: 'app-da-loading-view',
  templateUrl: './da-loading-view.component.html',
  styleUrls: ['./da-loading-view.component.css']
})
export class DaLoadingViewComponent implements OnInit {


  da_id: string;
  bigBox:any;
  item_list_boxWise:any;
  public bigbox_details:UntypedFormGroup;
  public loaded_truck_list:any;
  public loading:any;

  constructor(private formBuilder: UntypedFormBuilder,
    private http: HttpClient,
    public apiService: ApiserviceService,
    public toast:ToastrService, 
    public dialog: MatDialog,
    public storage: StorageServiceService,
    private toastr: ToastrService,
    private router: Router) { 
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as { dad_id: string };
      if(state != undefined){
        this.da_id = state.dad_id
       }else{
        this.da_id = this.storage.getda_id()
       }

      this.bigbox_details=this.formBuilder.group({
        boxLIst_panel:  this.formBuilder.array([]) ,
        boxLIst_loose:this.formBuilder.array([]) ,
      })
     

    }

  ngOnInit(): void {

    this.getDapackedbox();
    this.loading=this.storage.getroot_list_single(71);
    console.log("u",this.loading);
  }
  getDapackedbox(){
   
    
    let data={
      da_id: this.da_id,
      status:'all'

    }
      this.apiService.postData("logistics_truck_list/get_truck_list/",data).then((response:any) => {
      this.loaded_truck_list=response.filter(row => row.loaded_flag == true);  
    },(error)=>{
        console.log("error");
    })

  }
  showtruckdetails(truck_id: any){
    const dialogRef = this.dialog.open(OpenDialogShowTruckBoxItemDaView, {
      height: '500px',
      width: '1354px',
      maxWidth:'80%',
      
      data: {
            
        truckid:truck_id
            }
    });
  }


  
}

@Component({
  selector: 'show-box-and-item-in-truck',
  templateUrl: 'show-box-and-item-in-truck.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 80%;
      max-width:50% !important;
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class OpenDialogShowTruckBoxItemDaView{

  displayedColumns = ['slno','item_desc','front','rear', 'qty', 'check_by'];
  dataSource = new MatTableDataSource<['']>();
  form:UntypedFormGroup;
  bigBoxDetails:any;
  list: any;
  resultbox:Array<any>=[];
  sectionName:any;
  panelName:any;
  box_types:any;
  box_entered = [];
  bigbox_details:any;
  sub_bigbox_details:any;
  showdetailsof_box_items:boolean=false;
  

  tableShow= 1;

  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogShowTruckBoxItemDaView>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
    
    this.getboxdetails(data.truckid)

    
   
    
    
  
    }
    getboxdetails(truckid){

      let url = "logistics_loading_details/get_box_details/"
      let data = {
        truck_list_id : truckid       
      }
      this.api.postData(url, data).then((res: any) => {
      this.bigbox_details=res;
      console.log("list",res);
      })
    }

    getboxitemdetails(boxcode){

      let url = "logistics_box_details/box_code_filter/"
      let data = {
        box_code : boxcode       
      }
      this.api.postData(url, data).then((res: any) => {
      
      if(res.length <= 0){
        let data={
          box_code:boxcode
        }
        
        this.api.postData('logistics_item_packing/box_code_filter/', data).then((res: any) => {
          this.getMainBoxDetailsitem(res.items)
          
        })


      }else{

        console.log("xyz",res);
        this.sub_bigbox_details=res;
        this.tableShow=3;
        



      }
      
      })
    }


    getMainBoxDetails(box_item_detail){
      console.log("item",box_item_detail)
      this.dataSource = new MatTableDataSource(box_item_detail);  

    }

    getMainBoxDetailsitem(box_item_detail){
    
      this.tableShow=4;
   
     
      this.dataSource = new MatTableDataSource(box_item_detail);  

    }
    getMainBoxDetailsitem_close(){
      this.tableShow=3;
    }
    dialogClose(){
      this.dialogRef.close({data:"Close"});
    }
    getboxitemdetails_single(boxcode){
      let data = {
        box_code : boxcode       
      }
      this.api.postData("logistics_item_packing/box_code_filter/",data).then((response:any)=>{
        
        // getMainBoxDetailsitem()
        
    
      },(error)=>{      
        console.log("error");
    })

    }
    
    
  }

  

  





