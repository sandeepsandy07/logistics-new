
import { Component, OnInit, Inject, ViewChild, ElementRef,Output,EventEmitter } from '@angular/core';

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
  UntypedFormArray,
   
} from "@angular/forms";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { data, isEmptyObject } from 'jquery';

import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-da-packing-view',
  templateUrl: './da-packing-view.component.html',
  styleUrls: ['./da-packing-view.component.css']
})
export class DaPackingViewComponent implements OnInit {

  public bigbox_details:UntypedFormGroup;
  public da_id:any;
  public  bigBox:any;
  public packing:any;

  constructor( private formBuilder: UntypedFormBuilder,
    private http: HttpClient,
    public api: ApiserviceService,
    public toast:ToastrService, 
    public dialog: MatDialog,
    public storage: StorageServiceService,
    private toastr: ToastrService,
    private router: Router) { 
      let da_details=this.storage.getroot_list_single(70);
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as { dad_id: string };
      if(state != undefined){
        this.da_id = state.dad_id
       }else{
        this.da_id = this.storage.getda_id()
       }

      this.bigbox_details=this.formBuilder.group({
        boxLIst_panel:  this.formBuilder.array([]),
        boxLIst_loose:this.formBuilder.array([]),
      })

    this.getDapackedbox();
    this.packing=this.storage.getroot_list_single(70);
  }

  ngOnInit(): void {
    
  }
  getDapackedbox(){
    let filterboxdata={
      "da_id": this.da_id,
      "main_box": true,
      "status":'all'
    }

    this.bigbox_details.setControl('boxLIst_loose',this.formBuilder.array([])); 
    this.bigbox_details.setControl('boxLIst_panel',this.formBuilder.array([])); 

    this.api.postData("logistics_box_details/filter_packed_box_merged/",filterboxdata).then((response:any)=>{
          this.bigBox=response.data;
          this.getBigboxItemdetails();
         

    },(error)=>{
          console.log("error");
    })

  }     
    itemtomainboxshow(par4): UntypedFormArray {
     
      console.log("hdgsfjds", (this.bigbox_details.value.boxLIst_panel.length));
     
      if(par4){
       
        return this.bigbox_details.get("boxLIst_panel") as UntypedFormArray
        
      }else{
       
        return this.bigbox_details.get("boxLIst_loose") as UntypedFormArray

      }
     
    }
    newitemtomainboxshow(par1,par2,par3): UntypedFormGroup {
     

      return this.formBuilder.group({
        box_list: par1,
        item:par2,
        panel:par3 
      })
    }
    additemtomainboxshow(par1,par2,par3) {
      this.itemtomainboxshow(par1.panel_flag).push(this.newitemtomainboxshow(par1,par2,par3));  
    }

  getBigboxItemdetails(){
    
    for(let i=0;i<this.bigBox.length;i++){   
      let data={
       box_code:this.bigBox[i].box_code
     }
     
     this.api.postData("logistics_item_packing/box_code_filter/",data).then((response:any)=>{
      this.additemtomainboxshow(this.bigBox[i],response,response.panel_comp)
      
  
    },(error)=>{      
      console.log("error");
  })
  }
    

    }
    generatePackedPanelPdf(box_code)
    {
      let url = "logistics_item_packing/box_code_filter_panel/"
      let data = {
        box_code:box_code,
        da_id : this.da_id
      }
      this.api.downloadPDF(url, data).then((data) => {
        var downloadURL = window.URL.createObjectURL(data);
        let tab = window.open();
        tab.location.href = downloadURL;
      });
  
    }
    generatePackedConsolidatePanelPdf()
    {
  
      let url = "logistics_item_packing/box_code_filter_on_daID/"
      let data = {
        da_id : this.da_id,
        status : "packed"
      }
      this.api.downloadPDF(url, data).then((data) => {
        var downloadURL = window.URL.createObjectURL(data);
        let tab = window.open();
        tab.location.href = downloadURL;
      });
  
    }
    generateConsigneeForm_single(boxcode,component_no)
  {
    let url = "logistics_item_packing/consigneeDetailsPage/";
    let data = {
      box_code : boxcode,
      da_id : this.da_id,
      component_no: component_no
    }
  
    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    });
  
  }
    generateLooseItemPdf(box_code)
    {
      let url = "logistics_item_packing/box_code_filter_loose_supply/"
      let data = {
        box_code:box_code,
        da_id : this.da_id
      }
      this.api.downloadPDF(url, data).then((data) => {
        var downloadURL = window.URL.createObjectURL(data);
        let tab = window.open();
        tab.location.href = downloadURL;
  
      });
  
    }
    generateConsolidateLooseItemPdf()
    {
  
      let url = "logistics_item_packing/box_code_filter_loose_supply_on_DaId/"
      let data = {
        da_id : this.da_id,
        mainBox : true
      }
      this.api.downloadPDF(url, data).then((data) => {
        var downloadURL = window.URL.createObjectURL(data);
        let tab = window.open();
        tab.location.href = downloadURL;
      });
  
    }
    generateDispatchCheckListPDF()
    {
      let url = "panel_wise/get_panel_wise_dispatch_List/";
      let data = {
        da_id : this.da_id,
      }
      this.api.downloadPDF(url, data).then((data) => {
        var downloadURL = window.URL.createObjectURL(data);
        let tab = window.open();
        tab.location.href = downloadURL;
      });
    }
    generateSinglePanelWisePdf(panel_name)
    {
      let url = "panel_wise/getPanel_List/";
      let data = {
        da_id : this.da_id,
        panel_name: panel_name
      }
      this.api.downloadPDF(url, data).then((data) => {
        var downloadURL = window.URL.createObjectURL(data);
        let tab = window.open();
        tab.location.href = downloadURL;
      });
  
    }
    getMainBoxDetails_dailog(box_item_detail,box_code){

    
      const dialogRef = this.dialog.open(OpenDialogBigboxDetailsDaView, {
      
        width: '853px',
       
        
        data: {
          box_item_details: box_item_detail,
          box_codes:box_code
              }
      });
    }
  // barcodeprint(boxcode,caseno,printtype){

  //   let url = "http://10.29.15.212:75/api/LogisticsPrint/printBarcode/"
  //   let data = {
  //     boxno:boxcode,
  //     dano: this.data.da_details.jobcode_da_no,  
  //     sono: this.data.da_details.jobcode_da_no,
  //     customername: "customer",  
  //     projectname: this.data.da_details.ygs_proj_defi,  
  //     caseno: caseno.toString(),    
  //     printsize: "big", 
  //     bigbox: printtype,   
  //     printerip: "10.29.11.250"
  //   }
  
  //   this.apiService.getData_barcode(url,data).then((res: any) => {
  
  //   console.log("barcode",res);
  //   })

  // }


}
@Component({
  selector: 'open-dialog-bigbox-details',
  templateUrl: 'dailog-bigbox-details.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 100%;
     
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class OpenDialogBigboxDetailsDaView {

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
  showdetailsof_box_items:boolean=false;
  

  tableShow= 1;

  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogBigboxDetailsDaView>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
   
    
    if(isEmptyObject(data.box_item_details)){
    
      this.tableShow=2;
      this.getboxitemdetails(data.box_codes)

    }else{
    
    this.getMainBoxDetails(data.box_item_details)
    this.tableShow=1;

    }
    
    
  
    }
    getboxitemdetails(boxcode){

      let url = "logistics_box_details/box_code_filter/"
      let data = {
        box_code : boxcode       
      }
      this.api.postData(url, data).then((res: any) => {
      this.bigbox_details=res;
      
      })
    }


    getMainBoxDetails(box_item_detail){
      console.log("item",box_item_detail)
      this.dataSource = new MatTableDataSource(box_item_detail);  

    }
    getMainBoxDetailsitem(box_item_detail){
    
      this.tableShow=3;
     
      this.dataSource = new MatTableDataSource(box_item_detail);  

    }
    getMainBoxDetailsitem_close(){
      this.tableShow=2;
    }
    dialogClose(){
      this.dialogRef.close({data:"Close"});
    }
    
  }


