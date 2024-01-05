import { Component,Inject, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { StorageServiceService } from '../../service-storage.service';
import { environment } from 'src/environments/environment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import { FileUploader } from "ng2-file-upload";



import {MatSort} from '@angular/material/sort';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, FormArray } from '@angular/forms';

import { PopupComponent } from '../popup/popup.component';
import { NonBillPopupComponent } from '../non-bill-popup/non-bill-popup.component';
import { EventEmitterService } from 'src/app/event-emitter.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

//first component
@Component({
  selector: 'app-billableform',
  templateUrl: './billableform.component.html',
  styleUrls: ['./billableform.component.css']
})
export class BillableformComponent implements OnInit {

  bill_type: any="";

  // passedDANo=3;
  passedDANo:any="";
  passedBillType:any="";
  ListBasedOnDANo:any;

  CreateForm:boolean=true;
  BillableEditForm:boolean=false;
  NonBillableEditForm:boolean=false;
  BillableReviewForm:boolean=false;
  NonBillableReviewForm:boolean=false;
  BillableForm:boolean=false;
  NonBillableForm:boolean=false;
  MainForm:boolean=true;
  ResultDataList:any;
  EditForm:boolean=false;
  HeaderForBillableForm:boolean=false;
  HeaderForNonBillableForm:boolean=false;
  ViewForm:boolean=false;
  val: any = [];
  DANO:any;
  array: any = [];
  array2:any=[];

  NonBillTotalAmt = 0;
  NonBillTotalPrice = 0;

  billableTotalAmt = 0;
  billableTotalPrice = 0;

  dataArray: any = [];
  dataArray2: any = [];

  url = "logistics_panel_wise_material/";
  typeOfBill: any="";
  

  dataItems: any;
  freightModeName:any="";
  JobName:any="";
  JobCode:any="";
  SONo:any="";
  DANo:any="";
  PM:any="";
  PONo:any="";
  da_from:any="";
  PODate:any="";
  DADate:any="";
  GM:any="";
  element:any;
  Remarks:any;
  GST:any="";

  panelId:any="";
  BSAPDANo:any="";
  BbillType:any="";
  Bda_id:any="";
  BCustomerPoRefNo:any="";
  BItemDescription:any="";
  BModelNo:any="";
  BTotalQuantity:any="";
  BTotalAmount:any="";
  BUOM:any="";
  BActualDispatchedQuantity:any="";
  BTotal:any="";
  BBalanceQuantity:any="";
  BUnitPrice:any="";
  SGST:any="";
  CGST:any="";
  IGST:any="";
  BTotalPrice:any="";
  BBillableRemarks:any="";
  // GST:any="";
  BGSTUpdate:any="";
  resultList: any="";
  GSTUpdate:any="";
  TotalPrice:any="";
  customer_name:any=""
  revision:any=""
  // url = "logistics_panel_wise_material/";

  
  SAPDANo:any="";
  CustomerPoRefNo:any="";
  ItemDescription:any="";
  ModelNo:any="";
  TotalQuantity:any="";
  UOM:any="";
  UnitPrice:any="";
  UnderWorNW:any="";
  NonBillableRemarks:any="";
  ReasonForSuppliesNW:any="";
  TotalAmount:any="";
  Total:any="";
  region_no:any;


  public user_data:any;
  public records:any;

  uploadForm: UntypedFormGroup;
  public onupload_button:boolean=true;
  public main_url = environment.apiUrl;

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','Description','TotalQty & UOM','Total & BalanceQty','UnitPrice','TotalAmount','SGST & CGST & IGST','GSTAmt','TotalPrice','Action'];

  public dataSource2 = new MatTableDataSource<['']>();
  public displayedColumns2: string[] = ['Sl.no.','Description','TotalQty & UOM','UnitPrice','TotalAmount','SGST & CGST & IGST','GSTAmt','TotalPrice','Action'];

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  resultsLength: any;
  ResList: any;
  ResList2: any;
  // router: any;

  constructor(public api: ApiserviceService,
      public toast:ToastrService,
      private fb: UntypedFormBuilder,
      private dialog : MatDialog,
      private eventEmitterService: EventEmitterService,
      private activatedroute: ActivatedRoute,
      public storage: StorageServiceService,
      private http: HttpClient,
      private toastr: ToastrService,
      private router: Router )
     { 
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as {dad_id: string};
      const state1 = navigation.extras.state as {bill_type: string};
      this.passedDANo = state.dad_id
      this.typeOfBill = state1.bill_type
      console.log("dano=",this.passedDANo)
      // this.passedBillType = state1.bill_type
      // console.log("BILL TYPE =",this.bill_type)  
     }

  ngOnInit(){
    this.getDAList();
    this.user_data=this.storage.getuser_data();
    console.log( this.user_data);
    this.uploadForm = this.fb.group({
      panel_wise_material: new UntypedFormControl("", Validators.required),
    });

    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeFirstComponentFunction.subscribe((name:string) => {    
        //this.firstFunction();  
        this.getList();
      });    
    }
    
    if (this.eventEmitterService.nonBillVar==undefined) {    
      this.eventEmitterService.nonBillVar = this.eventEmitterService.    
      invokeNonBillComponentFunction.subscribe((name:string) => {     
        this.getNonBillList();
      });    
    }  

  }

  OpenDialogAddSoDetails(){
    
    const dialogRef = this.dialog.open(OpenDialogAddSoDetails, {
      height: '500px',
      width: '1354px',
      maxWidth:'100%',
      
      data: {
           da_id:this.passedDANo,
           so_no:this.SONo,
           region_no:this.region_no,
           da_from:this.da_from
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getList();
     
    });
  }
  onSubmit() {
    let bearer = this.storage.getBearerToken();
    let headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer'+' '+bearer
      })
    };

    const formData: FormData  = new FormData();
    if (this.uploadForm.status == "INVALID"){
      this.toastr.error("Please upload file")
    }
    else{
      
      this.showloader();
      this.onupload_button=false;
      formData.append("BOM_format_csd", this.uploadForm.get("panel_wise_material").value);
      formData.append('da_id', JSON.stringify(this.passedDANo));
      this.http.post<any>(this.main_url + "datasandep/", formData,  headers).subscribe(
        (res: any) => {
          this.toastr.success("BOM Uploaded successfully and DA Prepared");
          this.daNavigation(this.passedDANo,'/material/panelwisematerial')
          this.getList();
          this.onupload_button=true;
          this.hideloader();
        }, (error) => {
          this.toastr.error("Unable to upload file");
          this.hideloader();
      });
    }
   }
  daNavigation(id,nav_url){
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.router.navigate([nav_url], navigationExtras);
  }
  daNavigation_bom(id,nav_url,user_action){
    const navigationExtras: NavigationExtras = {state: {dad_id: id,user_action: user_action}};
    this.router.navigate([nav_url], navigationExtras);
  }

  firstFunction() {    
    alert( 'Hello ' + '\nWelcome to C# Corner \nFunction in First Component');    
  } 
  showloader() {
    document.getElementById('loadingform').style.display = 'block';       
    }
  hideloader() {
    document.getElementById('loadingform').style.display = 'none';       
    }

  // openDialog(btn) {
  //   if(this.BillableForm == true)
  //   {
  //     this.dialog.open(PopupComponent, {
  //       width:'60%',
  //       data: {
  //         DA_ID:this.passedDANo,
  //         BILL_TYPE:this.passedBillType,
  //         btn:btn
  //         }
  //     });
  //   }
  //   if(this.NonBillableForm == true)
  //   {
  //     this.dialog.open(NonBillPopupComponent, {
  //       width:'60%',
  //       data: {
  //         DA_ID:this.passedDANo,
  //         BILL_TYPE:this.passedBillType,
  //         btn:btn
  //         }
  //     });
  //   }
  // }

  //allow you to select type of bill
 
  SelectBillType(val: any){  
    this.typeOfBill = val;
    console.log("Type of bill=",this.typeOfBill);
  
      this.bill_type="billable";
      this.HeaderForBillableForm=true;
      this.HeaderForNonBillableForm=false;
      this.BillableForm=true;
      this.NonBillableForm=false;
      this.getList();
    
    
  }
  daNavigation_da(id,nav_url,actions){
    const navigationExtras: NavigationExtras = {state: {dad_id: id,action: actions}};
    this.router.navigate([nav_url], navigationExtras);
  }
  OnFileSelect(event, name) {
    let file = event.target.files[0];
    this.uploadForm.get(name).setValue(file);
  }
  download_bom_temp_csd(){
    let url = "panel_wise/download_panel_file_csd/"
    this.api.download(url).subscribe((response)=>{
      let blob = new Blob([response], {type: response.type})
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'BOM_format_CSD');
      link.click();
    })
  }

  getDAList() //this funtion is to fetch value for heading data.
  {
    console.log("heljdsdhssg")
    let url = "logistics_dispatch_advice/";
    this.api.viewuser(url,this.passedDANo).then((res: any) => {
        this.ResList = res.records;
        this.records=res.records;
        console.log("resultlistsfasdfdsfd",this.ResList);
        this.JobName=this.ResList.job_name;
        this.JobCode=this.ResList.job_code;
        this.SONo=this.ResList.so_no;
        this.DANO=this.ResList.da_id;
        this.PONo=this.ResList.po_no;
        this.region_no=this.ResList.region_no;
        this.DADate=this.ResList.da_date;
        this.PODate=this.ResList.po_date;
        this.bill_type=this.ResList.bill_type;
        this.da_from=this.ResList.da_from;
        this.customer_name=this.ResList.customer_name;
        this.passedBillType=this.ResList.bill_type;
        this.Remarks = this.ResList.non_bill_remarks;
        this.revision=this.ResList.revision;
        this.SelectBillType(this.bill_type);
     });
  }

  getList(){
    this.billableTotalAmt=0;
    this.billableTotalPrice = 0;
    this.dataArray = [];
    let data: any = {
      'id':this.passedDANo
    }
    let url = 'logistics_panel_wise_material/getBillableLists/';
    this.api.postData(url,data).then((result: any) => {
          this.ResList=result;
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.data = result;
          console.log("panel wise list",result);
          
          this.ResList?.forEach((element:any) => {
            this.billableTotalAmt = this.billableTotalAmt + element.total_amt;
            this.billableTotalPrice = this.billableTotalPrice + element.total_amt_gst  ;
            this.dataArray.push([{
              DANo: element.da_id == null ? null: element.da_id,
              CustomerRefNo : element.customerPoRefNo,
              ItemDesc : element.item_desc,
              ModelNo : element.model,
              TotalQty : element.total_qty,
              UOM : element.uom,
              Total : element.total,
              BalanceQty : element.balance_qty,
              UnitPrice :element.unit_price,
              TotalAmt : element.total_amt,
              SGST : element.sgst_amt,
              CGST : element.cgst_amt,
              IGST : element.igst_amt,
              TotalPrice : element.total_amt_gst,
              Remark : element.billableRemark,
              GSTAmt : element.gst_amt,
            }]);
            console.log("dataarray value=",this.dataArray);
        });
          this.dataSource.data = result;     
      });
    }

    getNonBillList(){
      this.NonBillTotalAmt = 0;
      this.NonBillTotalPrice = 0;
      this.dataArray2 = [];
      let data: any = {
        'id':this.passedDANo
      }
      let url = 'logistics_panel_wise_material/getBillableLists/';
      this.api.postData(url,data).then((result: any) => {
          this.ResList2=result;
          this.dataSource2 = new MatTableDataSource(result);
          this.ResList2?.forEach((element:any) => {
              this.NonBillTotalAmt = this.NonBillTotalAmt + element.total_amt;
              this.NonBillTotalPrice = this.NonBillTotalPrice + element.total_amt_gst;
              this.dataArray2.push([{
                DANo: element.da_date == null ? null: element.da_no,
                CustomerRefNo : element.customerPoRefNo,
                ItemDesc : element.item_desc,
                ModelNo : element.model,
                TotalQty : element.total_qty,
                UOM : element.uom,
                Total : element.total,
                BalanceQty : element.balance_qty,
                UnitPrice :element.unit_price,
                TotalAmt : element.total_amt,
                SGST : element.sgst_amt,
                CGST : element.cgst_amt,
                IGST : element.igst_amt,
                nonBillGSTAmt : element.gst_amt,
                TotalPrice : element.total_amt_gst,
                ReasonForSuppliesNW : element.reasonForSuppliesNW,
                UnderWorNW : element.underWorNW,
                GSTAmt : element.gst_amt,
              }]);
              console.log("dataarray2 value=",this.dataArray2);
          });
          // this.dataSource2.data = result;

          //commented all below lines on 6/5/2022. 
          // this.ResList2?.forEach((element:any) => {
          //     this.array2.push(element);
          //     console.log("array2 value=",this.array2);
          // });
          // this.dataSource2.data = this.array2;
          // this.array2=[];
          // console.log("after null=",this.array2)     
      });
    }
  
    deleteBillData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      this.resultList=data.records;
      this.getList();
     })
  }

  deleteNonBillData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      this.resultList=data.records;
      this.getNonBillList();
     })
}

Update(element:any, btn)
{
  console.log(element,btn)
  if(this.BillableForm == true)
    {
      this.dialog.open(PopupComponent, {
            width:'60%',
            // data:element
            data: {
              data:element,
              btn:btn
              }
          });
    }

    if(this.NonBillableForm == true)
    {
      this.dialog.open(NonBillPopupComponent, {
            width:'60%',
            data: {
              data:element,
              btn:btn
              }
          });
    }
} 

submitNonBillRemarks()
{
  let data={
    'remarks':this.Remarks,
    // 'da_id':1
    'da_id':this.passedDANo
  }
  console.log("data=",data)
      let url = 'logistics_dispatch_advice/updateNonBillRemarks/';
      this.api.postData(url, data).then((result: any) => {
        this.toast.success("Record Updated Successfully!");
        console.log(result)
        this.resultList=result;
      })
}

fileDownload(){
  let url = "logistics_panel_wise_material/download_report/"
  this.api.download(url).subscribe((response)=>{
    let blob = new Blob([response], {type: response.type})
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'logistics_report');
    link.click();
  })
}

exportToExcel(){
 let data: any[] = [];
 if(this.dataArray.length == 0){
 this.toast.error("Sorry!!! No Data");
 }
 else{
   this.dataArray.forEach((element:any, index:any) => {
     data.push(element[0]);
   });
   console.log("excel billArray=",data)
 let record: any = {
   'jobCode' :this.JobCode,
   'jobName' :this.JobName,
   'Sono' : this.SONo,
   'Dono' : this.DANO,
   'pm' : this.PM,
   'gm' : this.GM,
   'Pono' : this.PONo,
   'Dadate' : this.DADate,
   'Podate' : this.PODate,
   'data': data
 }
 console.log("Record Data=",record);
 debugger;
 let url = 'logistics_panel_wise_material/logistics_data_list/';
 this.api.postData(url, record).then((result: any) => {
 this.toast.success('success')
 this.fileDownload();
 });
}
}

NonbillfileDownload(){
  let url = "logistics_panel_wise_material/download_nonbill_report/"
  this.api.download(url).subscribe((response)=>{
    let blob = new Blob([response], {type: response.type})
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'logistics_nonbill_report');
    link.click();
  })
}

exportDataToExcel()
{
  //debugger;
  let data: any[] = [];
  if(this.dataArray2.length == 0){
  this.toast.error("Sorry!!! No Data");
  }
  else{
    this.dataArray2.forEach((element:any, index:any) => {
      data.push(element[0]);
    });
    console.log("excel NonbillArray=",data)
    let record: any = {
      'jobCode' :this.JobCode,
      'jobName' :this.JobName,
      'Sono' : this.SONo,
      'Dono' : this.DANO,
      'pm' : this.PM,
      'gm' : this.GM,
      'Pono' : this.PONo,
      'Dadate' : this.DADate,
      'Podate' : this.PODate,
      'Remarks' : this.Remarks,
      'data': data
    }
    console.log("Record NonBill=",record)
  let url = 'logistics_panel_wise_material/logistics_nonbill_list/';
  this.api.postData(url, record).then((result: any) => {
    this.toast.success('success')
    this.NonbillfileDownload();
  });
}
}

applyFilter(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if(this.dataSource.paginator)
    {
      this.dataSource.paginator.firstPage();
    }
  }

  qtso_upload()
  {
    const dialogRef = this.dialog.open(OpenQTSOFileUploadPagebillable, {
      height: '200px',
      width: '600px', 
      maxWidth:'100%', 
    }); 
  }

openBillableDialog()
{
  const dialogRef = this.dialog.open(CreateBillableData, {
    height: '100%',
    width: '60%',
    maxWidth:'100%',
    data: {
          billType: this.typeOfBill,
          da_id:this.passedDANo
          }
  });
  dialogRef.afterClosed().subscribe(result => {
    this.getList();
  });
}

openNonBillDialog()
{
  const dialogRef = this.dialog.open(CreateNonBillableData, {
    height: '100%',
    width: '60%',
    maxWidth:'100%',
    data: {
          billType: this.typeOfBill,
          da_id:this.passedDANo
          }
  });
  dialogRef.afterClosed().subscribe(result => {
    this.getNonBillList();
  });
}

setBillableEditForm()
{
  this.EditForm = false;
this.BillableForm = true;
this.NonBillableEditForm=false;
this.NonBillableForm=false;
this.BillableEditForm = false;
}

updateBillable(element:any)
{
this.EditForm = false;
this.BillableForm = false;
this.NonBillableEditForm=false;
this.NonBillableForm=false;
this.BillableEditForm = true;
this.Bda_id=element.da_id;
this.BSAPDANo = element.sap_ref_item_no;
this.BCustomerPoRefNo = element.customerPoRefNo;
this.BItemDescription = element.item_desc;
this.BModelNo = element.model;
this.BTotalQuantity = element.total_qty;
this.BTotalAmount = element.total_amt;
this.BUOM = element.uom;
this.BTotal = element.total;
this.BBalanceQuantity =element.balance_qty;
this.BUnitPrice = element.unit_price;
this.SGST = element.sgst_amt;
this.CGST = element.cgst_amt;
this.IGST = element.igst_amt;
this.GST = element.gst_amt;
this.GSTUpdate = element.gst_amt;
this.TotalPrice = element.total_amt_gst
this.BBillableRemarks = element.billableRemark;
this.panelId = element.id;

}

updateListBillable()
{
  if(this.CGST == null)
  {
    this.CGST = ""
  }
  if(this.SGST == null)
  {
    this.SGST = ""
  }
  if(this.IGST == null)
  {
    this.IGST = ""
  }
  if((this.CGST != "") && (this.SGST != "") && (this.IGST != ""))
  {
    this.toast.error("Please Enter Either CGST and SGST Value or IGST Value")
    return
  }
  else if((this.CGST == "" || this.CGST == null || this.CGST == undefined) && (this.SGST == "" || this.SGST == null || this.SGST == undefined) && (this.IGST == "" || this.IGST == null || this.IGST == undefined))
  {
    this.toast.error("Value for CGST and SGST or IGST is required")
    return
  }
  else if ((this.CGST != "" || this.SGST != "") && (this.IGST != ""))
  {
    this.toast.error("Please Enter Either CGST and SGST Value or IGST Value")
    return
  }
  if(this.CGST == null || this.CGST == "" || this.CGST == undefined)
  {
    this.CGST=0;
  }
  if(this.SGST == null || this.SGST == "" || this.SGST == undefined)
  {
    this.SGST=0;
  }
  if(this.BTotalQuantity != "" || this.BUnitPrice != "")
  {
    this.BTotalAmount=this.BTotalQuantity*this.BUnitPrice
  }
  if(this.IGST != "" && this.IGST != undefined && this.IGST != null)
  {
    this.GST = parseFloat(this.IGST)/100*parseFloat(this.BTotalAmount);
    this.TotalPrice = (parseFloat(this.IGST)/100*parseFloat(this.BTotalAmount)) + parseFloat(this.BTotalAmount);
  }
  
  else if ((this.CGST != null && this.CGST !="" && this.CGST !=undefined) || (this.SGST != null && this.SGST != "" && this.SGST != undefined))
  {
    this.GST = (parseFloat(this.CGST)/100*parseFloat(this.BTotalAmount)) + (parseFloat(this.SGST)/100*parseFloat(this.BTotalAmount));
    this.TotalPrice = (parseFloat(this.CGST)/100*parseFloat(this.BTotalAmount)) + (parseFloat(this.SGST)/100*parseFloat(this.BTotalAmount)) + (parseFloat(this.BTotalAmount))
  }
  
    let data={
      'da_id':this.Bda_id,
      'item_desc':this.BItemDescription,
      'model':this.BModelNo,
      'total_qty':this.BTotalQuantity == "" ? null : parseInt(this.BTotalQuantity),
      'unit_price':this.BUnitPrice == "" ? null : parseInt(this.BUnitPrice),
      'total_amt':this.BTotalAmount == "" ? null : parseInt(this.BTotalAmount),
      'total':this.BTotal =="" ? null : parseInt(this.BTotal),
      'sgst_amt':this.SGST == "" ? null : this.SGST,
      'cgst_amt':this.CGST == "" ? null : this.CGST,
      'igst_amt':this.IGST == "" ? null : this.IGST,
      'total_amt_gst':this.TotalPrice == "" ? null : parseInt(this.TotalPrice),
      'billableRemark':this.BBillableRemarks,
      'uom':this.BUOM,
      'sap_ref_item_no':this.BSAPDANo,
      'customerPoRefNo':this.BCustomerPoRefNo,
      'bill_type':this.typeOfBill,
      'gst_amt' : this.GST == "" ? null : parseInt(this.GST),
      'balance_qty':this.BBalanceQuantity == "" ? null : parseInt(this.BBalanceQuantity),
      "da_status":"saveAll"
    }
    
      let url = "logistics_panel_wise_material/"+this.panelId+"/";
      this.api.updateData(url,data).then(res => {
     
        this.toast.success("Record Updated Successfully!");
        this.EditForm = false;
        this.BillableForm = true;
        this.NonBillableEditForm=false;
        this.NonBillableForm=false;
        this.BillableEditForm = false;
        this.resultList=res;
        this.getList();
    })
}

setNonBillableEditForm()
{
  this.EditForm = false;
this.BillableForm = false;
this.NonBillableEditForm=false;
this.NonBillableForm=true;
this.BillableEditForm = false;
}

updateNonBillable(element:any)
{
  this.EditForm = false;
  this.BillableForm = false;
  this.NonBillableEditForm=true;
  this.NonBillableForm=false;
  this.BillableEditForm = false;
  this.SAPDANo = element.da_id;
  this.CustomerPoRefNo = element.customerPoRefNo;
  this.ItemDescription = element.item_desc;
  this.ModelNo = element.model;
  this.TotalQuantity = element.total_qty;
  this.UOM = element.uom;
  this.UnitPrice = element.unit_price;
  this.UnderWorNW = element.underWorNW;
  this.SGST = element.sgst_amt;
  this.CGST = element.cgst_amt;
  this.IGST = element.igst_amt;
  this.ReasonForSuppliesNW = element.reasonForSuppliesNW;
  this.NonBillableRemarks = element.nonbillableRemark;
  this.GST = element.gst_amt;
  this.GSTUpdate = element.gst_amt;
  this.TotalPrice = element.total_amt_gst
  this.TotalAmount = element.total_amt;
  this.Total = element.total;
  this.panelId = element.id;
}

updateListNonBillable()
{
  if(this.CGST == null)
  {
    this.CGST = ""
  }
  if(this.SGST == null)
  {
    this.SGST = ""
  }
  if(this.IGST == null)
  {
    this.IGST = ""
  }
  if((this.CGST != "") && (this.SGST != "") && (this.IGST != ""))
  {
    this.toast.error("Please Enter Either CGST and SGST Value or IGST Value")
    return
  }
  else if((this.CGST == "" || this.CGST == null || this.CGST == undefined) && (this.SGST == "" || this.SGST == null || this.SGST == undefined) && (this.IGST == "" || this.IGST == null || this.IGST == undefined))
  {
    this.toast.error("Value for CGST and SGST or IGST is required")
    return
  }
  else if ((this.CGST != "" || this.SGST != "") && (this.IGST != ""))
  {
    this.toast.error("Please Enter Either CGST and SGST Value or IGST Value")
    return
  }
  if(this.CGST == null || this.CGST == "" || this.CGST == undefined)
  {
    this.CGST=0;
  }
  if(this.SGST == null || this.SGST == "" || this.SGST == undefined)
  {
    this.SGST=0;
  }
  if(this.TotalQuantity != "" || this.UnitPrice != "")
    {
      this.TotalAmount=this.TotalQuantity*this.UnitPrice
    }
    if(this.IGST != "" && this.IGST != undefined && this.IGST != null)
    {
      this.GST = parseFloat(this.IGST)/100*parseFloat(this.TotalAmount);
      this.TotalPrice = (parseFloat(this.IGST)/100*parseFloat(this.TotalAmount)) + parseFloat(this.TotalAmount)
    }
    else if((this.CGST != null && this.CGST !="" && this.CGST !=undefined) || (this.SGST != null && this.SGST != "" && this.SGST != undefined))
    {
      this.GST = (parseFloat(this.CGST)/100*parseFloat(this.TotalAmount)) + (parseFloat(this.SGST)/100*parseFloat(this.TotalAmount));
      this.TotalPrice = (parseFloat(this.CGST)/100*parseFloat(this.TotalAmount)) + (parseFloat(this.SGST)/100*parseFloat(this.TotalAmount)) + parseFloat(this.TotalAmount)
    }
    let data={
      'da_id':this.SAPDANo,
      'item_desc':this.ItemDescription,
      'model':this.ModelNo,
      'total_qty':this.TotalQuantity == "" ? null : parseInt(this.TotalQuantity),
      'unit_price':this.UnitPrice == "" ? null : parseInt(this.UnitPrice),
      'total_amt':this.TotalAmount == "" ? null : parseInt(this.TotalAmount),
      'sgst_amt':this.SGST == "" ? null : parseInt(this.SGST),
      'cgst_amt':this.CGST == "" ? null : parseInt(this.CGST),
      'igst_amt':this.IGST == "" ? null : parseInt(this.IGST),
      'total_amt_gst':this.TotalPrice == "" ? null : parseInt(this.TotalPrice),
      'underWorNW':this.UnderWorNW,
      'reasonForSuppliesNW':this.ReasonForSuppliesNW,
      'uom':this.UOM,
      'nonbillableRemark':this.NonBillableRemarks,
      'customerPoRefNo':this.CustomerPoRefNo,
      'bill_type':this.typeOfBill,
      'total':this.Total =="" ? null : parseInt(this.Total),
      'gst_amt' : this.GST == "" ? null : parseInt(this.GST),
      "da_status":"saveAll"
    }
    console.log("update data=",data)
      let url = "logistics_panel_wise_material/"+this.panelId+"/";
      this.api.updateData(url,data).then(res => {
      console.log(res)
      this.toast.success("Record Updated Successfully!");
      this.EditForm = false;
      this.BillableForm = false;
      this.NonBillableEditForm=false;
      this.NonBillableForm=true;
      this.BillableEditForm = false;
      this.resultList=res;
      this.getNonBillList();
    })
}

}





@Component({
  selector: 'createbillabledata',
  templateUrl: 'CreateBillableData.html',
   styles: [`
    :host {
      width:'60%'
     
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class CreateBillableData {

  CreateForm:boolean=true;
  SAPDANo:any="";
  
  billType:any="";
  da_id:any="";
  CustomerPoRefNo:any="";
  ItemDescription:any="";
  ModelNo:any="";
  TotalQuantity:any="";
  TotalAmount:any="";
  UOM:any="";
  ActualDispatchedQuantity:any="";
  Total:any="";
  BalanceQuantity:any="";
  UnitPrice:any="";
  SGST:any="";
  CGST:any="";
  IGST:any="";
  TotalPrice:any="";
  BillableRemarks:any="";
  GST:any="";
  GSTUpdate:any="";
  resultList: any="";
  url = "logistics_panel_wise_material/";

  constructor(
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<CreateBillableData>,
    public toast:ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any)
    {
     
      this.billType=data.billType;
      this.da_id = data.da_id
      console.log("da-id in popup=",this.da_id)
      console.log("bill Type in popup=",this.billType)
    }

 createList()
 {
   if(this.CGST == null)
   {
     this.CGST = ""
   }
   if(this.SGST == null)
   {
     this.SGST = ""
   }
   if(this.IGST == null)
   {
     this.IGST = ""
   }
   if((this.CGST != "") && (this.SGST != "") && (this.IGST != ""))
   {
     this.toast.error("Please Enter Either CGST and SGST Value or IGST Value")
     return
   }
   else if((this.CGST == "" || this.CGST == null || this.CGST == undefined) && (this.SGST == "" || this.SGST == null || this.SGST == undefined) && (this.IGST == "" || this.IGST == null || this.IGST == undefined))
   {
     this.toast.error("Value for CGST and SGST or IGST is required")
     return
   }
   else if ((this.CGST != "" || this.SGST != "") && (this.IGST != ""))
   {
     this.toast.error("Please Enter Either CGST and SGST Value or IGST Value")
     return
   }
   if(this.CGST == null || this.CGST == "" || this.CGST == undefined)
   {
     this.CGST=0;
   }
   if(this.SGST == null || this.SGST == "" || this.SGST == undefined)
   {
     this.SGST=0;
   }
   if(this.TotalQuantity != "" || this.UnitPrice != "")
   {
     this.TotalAmount=this.TotalQuantity*this.UnitPrice
   }
   if(this.IGST != "" && this.IGST != undefined && this.IGST != null)
   {//debugger;
     this.GST = this.IGST/100*this.TotalAmount;
     this.TotalPrice = (this.IGST/100*this.TotalAmount) + (this.TotalAmount);
   }
   else if((this.CGST != "" && this.CGST != undefined && this.CGST != null) || (this.SGST != null && this.SGST != "" && this.SGST != undefined))
   {
     //debugger;
     this.GST = parseFloat(this.CGST)/100*parseFloat(this.TotalAmount) + parseFloat(this.SGST)/100*parseFloat(this.TotalAmount);
     this.TotalPrice = parseFloat(this.CGST)/100*parseFloat(this.TotalAmount) + parseFloat(this.SGST)/100*parseFloat(this.TotalAmount) + parseFloat(this.TotalAmount)
   }
   let data={
    //  'da_id':this.editData.DA_ID,
    'da_id':this.da_id,
     'item_desc':this.ItemDescription,
     'model':this.ModelNo,
     'total_qty':this.TotalQuantity == "" ? null : parseInt(this.TotalQuantity),
     'unit_price':this.UnitPrice == "" ? null : parseInt(this.UnitPrice),
     'total_amt':this.TotalAmount == "" ? null : parseInt(this.TotalAmount),
     'total':this.Total =="" ? null : parseInt(this.Total),
     'sgst_amt':this.SGST == "" ? null : parseInt(this.SGST),
     'cgst_amt':this.CGST == "" ? null : parseInt(this.CGST),
     'igst_amt':this.IGST == "" ? null : parseInt(this.IGST),
     'total_amt_gst':this.TotalPrice == "" ? null : parseInt(this.TotalPrice),
     'billableRemark':this.BillableRemarks,
     'uom':this.UOM,
     'sap_ref_item_no':this.SAPDANo,
     'customerPoRefNo':this.CustomerPoRefNo,
    //  'bill_type':this.editData.BILL_TYPE,
    'bill_type':this.billType,
     'gst_amt' : this.GST == "" ? null : parseInt(this.GST),
     'balance_qty':this.BalanceQuantity == "" ? null : parseInt(this.BalanceQuantity),
     "da_status":"saveAll"
   }
   console.log("inserted data=",data)
     let url = "logistics_panel_wise_material/";
     this.apiService.postData(url,data).then(res => {
     console.log(res)
     this.toast.success("Record Successfully Inserted!");
     this.dialogRef.close();
     this.resultList=res;
   })
 this.dialogRef.close();
}

  dialogClose(){
    this.dialogRef.close();
  }

}


@Component({
  selector: 'createnonbillabledata',
  templateUrl: 'CreateNonBillableData.html',
   styles: [`
    :host {
      width:'60%'
     
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class CreateNonBillableData {
  billType:any="";
  da_id:any="";
  CreateForm:boolean=true;
  SAPDANo:any="";
  CustomerPoRefNo:any="";
  ItemDescription:any="";
  ModelNo:any="";
  TotalQuantity:any="";
  TotalAmount:any="";
  UOM:any="";
  ActualDispatchedQuantity:any="";
  Total:any="";
  BalanceQuantity:any="";
  UnitPrice:any="";
  SGST:any="";
  CGST:any="";
  IGST:any="";
  GST:any="";
  TotalPrice:any="";
  NonBillableRemarks:any="";
  resultList: any="";
  url = "logistics_panel_wise_material/";
  UnderWorNW: any="";
  ReasonForSuppliesNW: any="";
 
  constructor(
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<CreateNonBillableData>,
    public toast:ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any)
    {
      this.SAPDANo=data.da_id
      this.billType=data.billType;
      this.da_id = data.da_id
      console.log("da-id in popup=",this.da_id)
      console.log("bill Type in popup=",this.billType)

    }

    createList()
    {
      debugger
      if(this.CGST == null)
      {
        this.CGST = ""
      }
      if(this.SGST == null)
      {
        this.SGST = ""
      }
      if(this.IGST == null)
      {
        this.IGST = ""
      }
      if((this.CGST != "") && (this.SGST != "") && (this.IGST != ""))
      {
        this.toast.error("Please Enter Either CGST and SGST Value or IGST Value")
        return
      }
      else if((this.CGST == "" || this.CGST == null || this.CGST == undefined) && (this.SGST == "" || this.SGST == null || this.SGST == undefined) && (this.IGST == "" || this.IGST == null || this.IGST == undefined))
      {
        this.toast.error("Value for CGST and SGST or IGST is required")
        return
      }
      else if ((this.CGST != "" || this.SGST != "") && (this.IGST != ""))
      {
        this.toast.error("Please Enter Either CGST and SGST Value or IGST Value")
        return
      }
      if(this.CGST == null || this.CGST == "" || this.CGST == undefined)
      {
        this.CGST=0;
      }
      if(this.SGST == null || this.SGST == "" || this.SGST == undefined)
      {
        this.SGST=0;
      }
      if(this.TotalQuantity != "" || this.UnitPrice != "")
      {
        this.TotalAmount=this.TotalQuantity*this.UnitPrice
      }
      if(this.IGST != "" && this.IGST != undefined && this.IGST != null)
      {
        this.GST = this.IGST/100*this.TotalAmount;
        this.TotalPrice = (this.IGST/100*this.TotalAmount) + (this.TotalAmount)
      }
      else if((this.CGST != "" && this.CGST != undefined && this.CGST != null) || (this.SGST != null && this.SGST != "" && this.SGST != undefined))
      {
        this.GST = (this.CGST/100*this.TotalAmount) + (this.SGST/100*this.TotalAmount);
        this.TotalPrice = (this.CGST/100*this.TotalAmount) + (this.SGST/100*this.TotalAmount) + (this.TotalAmount)
      }
      let data={
        'da_id':this.da_id,
        'item_desc':this.ItemDescription,
        'model':this.ModelNo,
        'total_qty':this.TotalQuantity == "" ? null : parseInt(this.TotalQuantity),
        'unit_price':this.UnitPrice == "" ? null : parseInt(this.UnitPrice),
        'total_amt':this.TotalAmount == "" ? null : parseInt(this.TotalAmount),
        'sgst_amt':this.SGST == "" ? null : parseInt(this.SGST),
        'cgst_amt':this.CGST == "" ? null : parseInt(this.CGST),
        'igst_amt':this.IGST == "" ? null : parseInt(this.IGST),
        'total_amt_gst':this.TotalPrice == "" ? null : parseInt(this.TotalPrice),
        'nonbillableRemark':this.NonBillableRemarks,
        'underWorNW':this.UnderWorNW,
        'reasonForSuppliesNW':this.ReasonForSuppliesNW,
        'uom':this.UOM,
        'customerPoRefNo':this.CustomerPoRefNo,
        'bill_type':this.billType,
        'total':this.Total =="" ? null : parseInt(this.Total),
        'gst_amt' : this.GST == "" ? null : parseInt(this.GST),
        "da_status":"saveAll"
      }
      console.log("data=",data)
        let url = "logistics_panel_wise_material/";
        this.apiService.postData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Successfully Inserted!");
        this.dialogRef.close();
        this.resultList=res;
      })
      this.dialogRef.close();
  }

  dialogClose(){
    this.dialogRef.close();
  }

}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'open-dialog-add-so-details',
  templateUrl: 'so-item-create.html'
  , styles: [`
    :host {    
      flex-direction: column;
      height: 100%;
      max-width:100% !important;
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})



export class OpenDialogAddSoDetails {

  displayedColumns: string[] = ['select', 'position', 'sap_no', 'item_name', 'model', 'uom', 'total_qty', 'unit_price', 'total_amt'];
  public so_item_list:any;
  dataSource = new MatTableDataSource<PeriodicElement>();

  selection = new SelectionModel<PeriodicElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
 
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
   
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }


  constructor(
    private fb:UntypedFormBuilder,
    public toast:ToastrService,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogAddSoDetails>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
    this.getsoitemdetails(this.data.so_no)
   
    }
  submit_soitemdetails(type){
  

    let data={
    
      "da_id":this.data.da_id,
      "so_item":this.selection.selected,
      "save_type":type,
      "region_no":this.data.region_no,
      "da_from":this.data.da_from
    // "region_no":'29'
      }
      console.log(data);
      this.apiService.postData("logistics_dispatch_advice/invoice_bom_create_based_on_save_type/",data).then((threadresponce:any) => {
          this.dialogClose();
          this.toast.success("Added successfully");
    
      }, (error) => {
       
          this.toast.error(error);
       
          console.log("error");
      });
  }
  getsoitemdetails(so_no){  
      let data={
        'so_no':so_no
      }     
      this.apiService.postData("qtso_master/get_so_data/",data).then((response:any) => {
              this.so_item_list=response.item_wise;
              this.dataSource = new MatTableDataSource<PeriodicElement>(this.so_item_list);
      })

  }
  dialogClose(){
   
    this.dialogRef.close({data:"Close"});
    
  }

}
@Component({
  selector: 'qtso-file-upload',
  templateUrl: 'qtso-file-upload.html'
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
export class OpenQTSOFileUploadPagebillable {

  truck_list_id: any = "";
  truckList: any = "";
  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  viewBtn: any = "upload";
  public onupload_button: boolean = true;

  uploadForm: UntypedFormGroup;

  tableShow: boolean = false;
  displayedColumns = ['slno', 'DateTime', 'Status', 'Location'];


  constructor(
    private formBuilder: UntypedFormBuilder,
    private toaster: ToastrService,
    public storage: StorageServiceService,
    public toast: ToastrService,
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<OpenQTSOFileUploadPagebillable>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.uploadForm = this.formBuilder.group({
      qtso_file: new UntypedFormControl("", Validators.required),
    });
  }

  OnFileSelect(event, name) {
    let file = event.target.files[0];
    this.uploadForm.get(name).setValue(file);
  }

  fileUpload() {
    let bearer = this.storage.getBearerToken();
    let headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer' + ' ' + bearer
      })
    };
    const formData: FormData = new FormData();
    if (this.uploadForm.status == "INVALID") {
      this.toaster.error("Please upload file")
    }
    else {
      this.onupload_button = false;
      formData.append("qtso_file", this.uploadForm.get("qtso_file").value);
      this.http.post<any>(this.url + "qtsofile/", formData, headers).subscribe(
        (res: any) => {
          this.toaster.success("QTSO Data Uploaded successfully");
          if (res == true) {
            let data = {
            }
            this.http.post<any>(this.url + "qtso/", data).subscribe(
              (res: any) => {
                this.toaster.success("QTSO file called successfully");
              });
          }
          this.onupload_button = true;
        });
    }
  }

  dialogClose() {
    this.dialogRef.close();
  }
}










































































