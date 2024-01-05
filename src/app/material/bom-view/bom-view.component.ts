import { Component, OnInit } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { Router,ActivatedRoute } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';

@Component({
  selector: 'app-bom-view',
  templateUrl: './bom-view.component.html',
  styleUrls: ['./bom-view.component.css']
})
export class BomViewComponent implements OnInit {

   // passedDANo:any="";
  // passedDANo=13;
  passedDANo:any="";
  BillableForm:boolean=false;
  NonBillableForm:boolean=false;

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','Description','TotalQty & UOM','Total & BalanceQty','UnitPrice','TotalAmount','SGST & CGST & IGST','GSTAmt','TotalPrice'];

  public dataSource2 = new MatTableDataSource<['']>();
  public displayedColumns2: string[] = ['Sl.no.','Description','TotalQty & UOM','UnitPrice','TotalAmount','SGST & CGST & IGST','GSTAmt','TotalPrice'];
  billableTotalAmt: number;
  billableTotalPrice: number;
  ResList: any;
  NonBillTotalAmt: number;
  NonBillTotalPrice: number;
  ResList2: any;
  array22:any=[];
  arraybillable:any=[];
  array2:any=[];
  passeddDANo: string;
  bill_type: any;
  public billing:any;

  JobCode:any;
  JobName:any;
  SONo:any;
  DANO:any;
  PM:any;
  GM:any;
  PONo:any;
  DADate:any;
  PODate:any;
  Remarks:any;


  constructor(public api: ApiserviceService,public toast:ToastrService,
    public storage:StorageServiceService ,
    private activatedroute: ActivatedRoute,
    private router: Router) {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as { dad_id: string };
      if(state != undefined){
      this.passedDANo = state.dad_id

     }else{

      this.passedDANo = this.storage.getda_id()

     }
     

      this.billing=this.storage.getroot_list_single(67);
    
     
     }

  ngOnInit(){
    this.getDAList();
    //this.SelectBillType();
    // this.getList();
    // this.getNonBillList();
  }

  
  getDAList()
  {
    let url = "logistics_dispatch_advice/";
    this.api.viewuser(url,this.passedDANo).then((res: any) => {
        this.ResList = res.records;
        console.log("resultlistsfasdfdsfd",this.ResList);
        this.bill_type=this.ResList.bill_type;
        this.JobCode=this.ResList.job_code;
        this.JobName=this.ResList.job_name;
        this.SONo=this.ResList.so_no;
        this.DANO=this.ResList.da_id;
        this.PM="-";
        this.GM="-";
        this.PONo=this.ResList.po_no;
        this.DADate=this.ResList.da_date;
        this.PODate=this.ResList.po_date;
        this.Remarks=this.ResList.remarks;
        this.SelectBillType()
     });
  }
  

  SelectBillType()
  {
    if(this.bill_type == "billable")
    {
      this.BillableForm=true;
      this.NonBillableForm=false;
      this.getList();
    }
    else if(this.bill_type == "nonbillable")
    {
      this.BillableForm=false;
      this.NonBillableForm=true;
      this.getNonBillList();
    }
  }
  
  getList(){
    this.billableTotalAmt=0;
    this.billableTotalPrice = 0;
    let data: any = {
      'id':this.passedDANo
    }
    let url = 'logistics_panel_wise_material/getBillableLists/';
    this.api.postData(url,data).then((result: any) => {
          this.ResList=result;
          console.log("element=",this.ResList)
          this.dataSource = new MatTableDataSource(result);
          console.log("panel wise list",result);
          
          this.ResList?.forEach((element:any) => {
            this.billableTotalAmt = this.billableTotalAmt + element.total_amt;
            this.billableTotalPrice = this.billableTotalPrice + element.total_amt_gst;
        });
        this.ResList?.forEach((element:any) => {
          this.arraybillable.push(element);
      });
          this.dataSource.data = result;      
      });
    }

    getNonBillList(){
      this.NonBillTotalAmt = 0;
      this.NonBillTotalPrice = 0;
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
          });
          this.ResList2?.forEach((element:any) => {
              this.array2.push(element);
              this.array22.push(element);
              
          });
          this.dataSource2.data = this.array2;
          this.array2=[];
            
      });
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

    exportBillableDataToExcel(){
      let data: any[] = [];
      if(this.arraybillable.length == 0){
      this.toast.error("Sorry!!! No Data");
      }
      else{
        this.arraybillable.forEach((element:any, index:any) => {
        //  debugger
          data.push(element);
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
        'viewPage':true,
        'data': data
      }
      console.log("Record Data=",record);
      //debugger;
      let url = 'logistics_panel_wise_material/logistics_data_list/';
      this.api.postData(url, record).then((result: any) => {
      this.toast.success('success')
      this.fileDownload();
      });
     }
     }

     

exportDataToExcel()
{
  //debugger
  let data: any[] = [];
  if( this.array22.length == 0){
  this.toast.error("Sorry!!! No Data");
  }
  else{
    this.array22.forEach((element:any, index:any) => {
      //debugger
      data.push(element);
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
      'viewPage':true,
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


}




    

