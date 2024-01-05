import { Component, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { FormGroup, UntypedFormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { NonBillPopupComponent } from '../non-bill-popup/non-bill-popup.component';
import { EventEmitterService } from 'src/app/event-emitter.service';
import { Router } from '@angular/router';

//first component
@Component({
  selector: 'app-billableform',
  templateUrl: './billableform.component.html',
  styleUrls: ['./billableform.component.css']
})
export class BillableformComponent implements OnInit {

  bill_type: any="";

  passedDANo=7;
  ListBasedOnDANo:any;

  CreateForm:boolean=true;
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
  PODate:any="";
  DADate:any="";
  GM:any="";
  element:any;
  Remarks:any;
  GST:any="";

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','Description','TotalQty & UOM','Total & BalanceQty','UnitPrice','TotalAmount','SGST & CGST & IGST','GSTAmt','TotalPrice','Action'];

  public dataSource2 = new MatTableDataSource<['']>();
  public displayedColumns2: string[] = ['Sl.no.','Description','TotalQty & UOM','UnitPrice','TotalAmount','SGST & CGST & IGST','GSTAmt','TotalPrice','Action'];

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  resultsLength: any;
  resultList: any;
  ResList: any;
  ResList2: any;
  router: any;

  constructor(public api: ApiserviceService,public toast:ToastrService,
    private fb: UntypedFormBuilder, private dialog : MatDialog
    ,private eventEmitterService: EventEmitterService  ) { }

  ngOnInit(){
    this.getDAList();

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

  firstFunction() {    
    alert( 'Hello ' + '\nWelcome to C# Corner \nFunction in First Component');    
  } 

  openDialog() {
    if(this.BillableForm == true)
    {
      this.dialog.open(PopupComponent, {
        width:'60%'

      });
    }

    if(this.NonBillableForm == true)
    {
      this.dialog.open(NonBillPopupComponent, {
        width:'60%'
      });
    }
    
  }

  SelectBillType(val:any)
  {
    if(this.bill_type == "b")
    {
      this.HeaderForBillableForm=true;
      this.HeaderForNonBillableForm=false;
      this.BillableForm=true;
      this.NonBillableForm=false;
      this.getList();
    }
    if(this.bill_type == "nb")
    {
      this.HeaderForNonBillableForm=true;
      this.HeaderForBillableForm=false;
      this.BillableForm=false;
      this.NonBillableForm=true;
      this.getNonBillList();
    }
  }

  //allow you to select type of bill
  SelectBillType1(val: any){  
    this.typeOfBill = val;
    console.log(this.typeOfBill);
    if(this.typeOfBill == "Billable")
    {
      this.bill_type="b";
      this.HeaderForBillableForm=true;
      this.HeaderForNonBillableForm=false;
      this.BillableForm=true;
      this.NonBillableForm=false;
      this.getList();
    }
    if(this.typeOfBill == "NonBillable")
    {
      this.bill_type="nb";
      this.HeaderForNonBillableForm=true;
      this.HeaderForBillableForm=false;
      this.BillableForm=false;
      this.NonBillableForm=true;
      this.getNonBillList();
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

  getDAList() //this funtion is to fetch value for heading data.
  {
    let url = "logistics_dispatch_advice/";
    this.api.getData(url).then((res: any) => {
        this.ResList = res;
        console.log("resultlist",this.ResList);
        this.ResList?.forEach((element:any) =>
        {
          if(this.passedDANo == element.da_no)
        {
            console.log("dano=",element.da_no);
            this.JobName=element.job_name;
            this.JobCode = element.job_code;
            this.SONo = element.so_no;
            this.DANO = element.da_no;
            this.PONo = element.po_no;
            this.DADate = element.da_date;
            this.PODate = element.po_date;
            this.bill_type = element.bill_type;
            console.log("bill type=",this.bill_type);
            this.SelectBillType(this.bill_type);
        }
        });
        console.log("ResultLength =",this.resultsLength)           
    });

  }

  getList(){
    this.billableTotalAmt=0;
    this.billableTotalPrice = 0;
    this.dataArray = [];
      let url = "logistics_panel_wise_material/";
      this.api.getData(url).then((res: any) => {
          this.dataSource = new MatTableDataSource(res);
          console.log("panel wise list",res);
          this.ResList = res;
        this.ResList?.forEach((element:any) => {
          if(element.reasonForSuppliesNW == null)
            {
            this.billableTotalAmt = this.billableTotalAmt + element.total_amt;
            this.billableTotalPrice = this.billableTotalPrice + element.total_amt_gst;
            this.dataArray.push([{
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
              TotalPrice : element.total_amt_gst,
              Remark : element.billableRemark,
              GSTAmt : element.gst_amt,
            }]);
          }
            console.log("dataarray value=",this.dataArray);
        });
          this.dataSource.data = res;
          this.resultsLength=res.length;
          console.log("ResultLength =",this.resultsLength)           
      });
    }

    getNonBillList(){
      this.NonBillTotalAmt = 0;
      this.NonBillTotalPrice = 0;
      let url = "logistics_panel_wise_material/";
      this.api.getData(url).then((res: any) => {
          this.dataSource2 = new MatTableDataSource(res);
          this.ResList2 = res;

          this.ResList2?.forEach((element:any) => {
            if(element.reasonForSuppliesNW != null)
            {
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
            }
              console.log("dataarray2 value=",this.dataArray2);
          });

          this.ResList2?.forEach((element:any) => {
            console.log("element=",element.reasonForSuppliesNW); 
            if(element.reasonForSuppliesNW != null)
            {
              this.array2.push(element);
              console.log("array2 value=",this.array2);
            }
          });
          //this.dataSource2.paginator = this.paginator;
          this.dataSource2.data = this.array2;
          this.array2=[];
          console.log("after null=",this.array2)
          this.resultsLength=res.length;       
      });
    }
  
  deleteData(element:any)
  {
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      console.log(data);
      this.resultList=data.records;
      this.getList();
      this.getNonBillList();
     })
}

update(element:any)
{
  if(this.BillableForm == true)
    {
      this.dialog.open(PopupComponent, {
            width:'60%',
            data:element
          });
    }

    if(this.NonBillableForm == true)
    {
      this.dialog.open(NonBillPopupComponent, {
            width:'60%',
            data:element
          });
    }
} 

submitNonBillRemarks()
{
  let data={
    'remarks':this.Remarks
  }
  console.log("data=",data)
      let url = "logistics_dispatch_advice/"+this.passedDANo+"/";
      this.api.updateData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
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
 let url = 'logistics_panel_wise_material/logistics_data_list/';
 this.api.postData(url, record).then((result: any) => {
 this.toast.success('success')
 });
}
}

exportDataToExcel()
{debugger;
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
  });
}
}
}









//https://labpys.com/export-data-from-database-into-excel-using-django/
//https://assist-software.net/blog/how-export-excel-files-python-django-application
//https://xlsxwriter.readthedocs.io/working_with_pandas.html
//https://stackoverflow.com/questions/36694313/pandas-xlsxwriter-format-header
// getList(){
//   let url = "logistics_panel_wise_material/";
//   this.api.getData(url).then((res: any) => {
//       debugger;
//       this.dataSource = new MatTableDataSource(res);
//       console.log(res);
//       this.dataSource.data = res;
//       this.resultsLength=res.length;
//       console.log("ResultLength =",this.resultsLength)           
//   });
// }

// update(element: any){
//   this.dialog.open(PopupComponent, {
//     width:'60%',
//     data:element
//   });
// }

// getList(){
  //   let url = "logistics_panel_wise_material/";
  //   this.api.getData(url).then((res: any) => {
  //       this.dataSource = new MatTableDataSource(res);
  //       console.log("panel wise list",res);
  //       this.dataSource.data = res;
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.resultsLength=res.length;
  //       console.log("ResultLength =",this.resultsLength)           
  //   });
  // }

  // getNonBillList(){
  //   let url = "logistics_panel_wise_material/";
  //   this.api.getData(url).then((res: any) => {
  //       this.dataSource2 = new MatTableDataSource(res);
  //       this.dataSource2.paginator = this.paginator;
  //       this.dataSource2.data = res;
  //       this.resultsLength=res.length;       
  //   });
  // }

  // getNonBillList2(){
  //   let url = "logistics_panel_wise_material/";
  //   this.api.getData(url).then((res: any) => {
  //       this.dataSource2 = new MatTableDataSource(res);
  //       //this.dataSource2.paginator = this.paginator;
  //       //this.dataSource.paginator = this.paginator;
  //       //this.dataSource.sort = this.sort;
  //       this.dataSource2.data = res;
  //       console.log("Non bill wise list",res);
  //       this.resultsLength=res.length;       
  //   });
  // }

  // getList2(){
  //   let url = "logistics_panel_wise_material/";
  //   this.api.getData(url).then((res: any) => {
  //       this.dataSource = new MatTableDataSource(res);
  //       this.ResList = res;
  //       this.ResList?.forEach((element:any) => {
  //         debugger;
  //         console.log("element=",element.reasonForSuppliesNW); 
  //         if(element.reasonForSuppliesNW == null)
  //         {
  //           this.array.push(element);
  //           console.log("array value=",this.array);
  //         }
  //       });
  //           //this.dataSource.data = res.element;
  //           this.dataSource.data=this.array;
  //           this.dataSource.paginator = this.paginator;
  //           this.resultsLength=res.length;           
  //   });
  // }


  // refersh()
  // {
  //   this.getList()
  // }