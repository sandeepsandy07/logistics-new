import { Component, OnInit ,OnDestroy ,ViewChild, Inject} from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, FormGroupDirective, NgForm, Validators, FormArray,UntypedFormBuilder } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute ,Params} from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';;
import {Router} from '@angular/router'; 
import { NavigationExtras } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StorageServiceService } from 'src/app/service-storage.service';
import {DataTableDirective} from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-risk-ledger-report',
  templateUrl: './risk-ledger-report.component.html',
  styleUrls: ['./risk-ledger-report.component.css']
})
export class RiskLedgerReportComponent implements OnInit {
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  
  //public tablelist:any;
  public tablelist:any=[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public form:UntypedFormGroup;

  dtInstance: Promise<DataTables.Api>;
  dtElement: DataTableDirective;

  //add
  filterDataForm:boolean=false;
  date_type:any="";
  date_flag:boolean=false;
  dc_date_flag:boolean=false;
  fromdate: any = '';
  todate: any = '';
  dcfromdate: any = '';
  dctodate: any = '';
  
  length:any="";
  public business_unit_list:any;

  //sap data related code lines.
  public uploader: FileUploader = new FileUploader({});
  url2 = environment.apiUrl;
  uploadForm: UntypedFormGroup;
  public onupload_button: boolean = true;

  constructor(
    public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    public dialog: MatDialog,
    //addd
    public toast:ToastrService,
    private http: HttpClient,
  ) {
    this.uploadForm = this.fb.group({
      qtso_file: new UntypedFormControl("", Validators.required),});

  this.form = this.fb.group({
    //add
    date_type:new UntypedFormControl(),  
      fromDate:new UntypedFormControl(),
      toDate:new UntypedFormControl(),
      da_no:new UntypedFormControl(),
      so_no:new UntypedFormControl(),
      project_id:new UntypedFormControl(),  
      business_unit:new UntypedFormControl(),  
      billtype:new UntypedFormControl(),  
      
      dcfromDate:new UntypedFormControl(),
      dctoDate:new UntypedFormControl(),
  })
   }

   ngOnInit(): void {
    let data={
      "filter_fields": {
        id:1
      } }

     data.filter_fields["key3"]='san';
     console.log("sandeep",data);
   this.CurrentDateTruckList();
    this.getBusinessUnitList();

    this.dtOptions = {
      dom: 'Bfrtip',
      ordering: false,
      processing: true,
      retrieve:true,
      paging:false,
      scrollX: true,
    };
    this.rerender();
  }

  datePickerChange(){
    this.form.value.date_type = "RiskLedger"
    console.log("Selected date type=", this.form.value.date_type)
    this.date_flag = true;
    this.fromdate = this.datepipe.transform(this.form.value.fromDate, 'yyyy-MM-dd');
    this.todate = this.datepipe.transform(this.form.value.toDate, 'yyyy-MM-dd');
  }

  dcdatePickerChange()
  {
    this.form.value.date_type = "deliveryChallanDate"
    console.log("Selected date type=", this.form.value.date_type)
    this.dc_date_flag = true;
    this.dcfromdate = this.datepipe.transform(this.form.value.dcfromDate, 'yyyy-MM-dd');
    this.dctodate = this.datepipe.transform(this.form.value.dctoDate, 'yyyy-MM-dd');
  }

  getListOfDispatchValues(){
    let data={
      "filter_fields": {
      } }
    this.api.postData("invoice_report/filter_reports/",data).then((response)=>{
      
      this.tablelist=response;
      this.dtTrigger.next(void 0);   
    },(error)=>{
        console.log("error");
    })
  }

  clearAllFilterDataFields()
  {
      this.form.reset();
      this.date_flag=false;
      this.dc_date_flag = false;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(void 0);
    });
}

ngAfterViewInit(): void {
  this.dtTrigger.next(void 0);
  this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.columns().every(function () {
      const that = this;
      $('input', this.footer()).on('keyup change', function () {
        if (that.search() !== this['value']) {
          that.search(this['value']).draw();
        }
      });
    });
  });
}

getBusinessUnitList()
    {
      this.api.getData("user_sub_dept_list/business_unit_list_for_reports/").then((response)=>{
        this.business_unit_list=response;
        console.log("Business unit list value=", this.business_unit_list)
      },(error)=>{
        console.log("error");
      })
    }

    // datePickerChange(){
    //   this.fromdate = this.datepipe.transform(this.form.value.fromDate, 'yyyy-MM-dd');
    //   this.todate = this.datepipe.transform(this.form.value.toDate, 'yyyy-MM-dd');
    // }

    onDateTypeSelected(dateType)
    {
      this.date_type = dateType
      this.form.value.date_type = dateType
      console.log("Selected date type=", this.form.value.date_type)
      //console.log("Selected date type=", this.date_type)
      this.date_flag = true;
    }

    filter_table()
    {
      if(this.filterDataForm == false)
      {
        this.filterDataForm=true;
      }
      else if(this.filterDataForm == true)
      {
        this.filterDataForm=false;
      }
    }

    // getRiskLedgerList()
    // {
    //   this.api.getData("logistics_risk_ledger/getRiskLedgerReport/").then((response)=>{
    //     this.tablelist=response;
    //     console.log("Risk Ledger list value=", this.tablelist)
    //     this.dtTrigger.next(void 0);
    //     },(error)=>{
    //         console.log("error");
    // })
    // }

    CurrentDateTruckList(){
      let url = "logistics_risk_ledger/getCurrentDateFilteredList/";
      this.api.getData(url).then((response: any) => {
        this.tablelist=response;
        this.dtTrigger.next(void 0);
        },(error)=>{
            console.log("error");
    })
  }

    getRecordsBasedOnFilterData()
    {
      let data={
        "date_flag": this.date_flag,
        "date_type":this.form.value.date_type,
        "start_date":this.fromdate,
        "end_date":this.todate,
        "business_unit": this.form.value.business_unit == ''?null:this.form.value.business_unit,
        "bill_type": this.form.value.billtype == ''?null:this.form.value.billtype,
        "project_id":this.form.value.project_id == ''?null:this.form.value.project_id,
        "so_no":this.form.value.so_no == ''?null:this.form.value.so_no,
        "filter_data":  false,
        "filter_fields": {
        }}
      this.api.postData("logistics_risk_ledger/filter_risk_reports_data/",data).then((response:any)=>{
        if(response.length != 0)
        {
          this.rerender();
          this.toast.success("Records Found!")
          this.tablelist=response;
            this.dtTrigger.next(void 0);
            console.log("Risk Ledger Report Data based on filter values =", this.tablelist)
        }
          else
          {
            this.rerender();
            this.toast.error("No Records Found")
            this.tablelist=response;
          }
        },(error)=>{
            console.log("error");
    })
  }

  fileDownload(){
    let url = "logistics_risk_ledger/download_risk_ledger_file/"
    this.api.download(url).subscribe((response)=>{
      let blob = new Blob([response], {type: response.type})
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'risk_ledger_report');
      link.click();
    })
  }

  exportToExcel()
  {
    let data: any[] = [];
    if(this.tablelist.length == 0){
      this.toast.error("Sorry!!! No Data");
      }
      else
      {
        this.tablelist.forEach((element:any, index:any) => {
            data.push(element);
          });
          console.log("risk ledger array=",data)
          let record: any = {
            'data': data
          }
          console.log("Record NonBill=",record)
        let url = 'logistics_risk_ledger/risk_ledger_excel_file_create/';
        this.api.postData(url, record).then((result: any) => {
          this.toast.success('success')
          this.fileDownload();
        });
  }
}

exportToExcelAll()
  {
          let record: any = {
            "dc_date_flag": this.dc_date_flag,
            "dc_date_type":this.form.value.date_type,
            "dc_start_date":this.dcfromdate,
            "dc_end_date":this.dctodate,
            'data': 1
          }
          console.log("Record NonBill=",record)
        let url = 'logistics_risk_ledger/risk_ledger_excel_file_create_dawise/';
        this.api.postData(url, record).then((result: any) => {
          debugger
          if (result.value == true)
          {
            debugger
            this.toast.success('success')
            this.fileDownload();
          }
          else
          {
            this.toast.error('No Records Found')
          }
          
        });
  }

}
