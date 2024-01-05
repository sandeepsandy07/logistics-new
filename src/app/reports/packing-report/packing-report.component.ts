import { Component, OnInit ,OnDestroy ,ViewChild, Inject} from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, FormGroupDirective, NgForm, Validators, FormArray,UntypedFormBuilder } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute ,Params} from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import {Router} from '@angular/router'; 
import { NavigationExtras } from '@angular/router';;
import { DatePipe } from '@angular/common';
import { StorageServiceService } from 'src/app/service-storage.service';
import {DataTableDirective} from 'angular-datatables';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-packing-report',
  templateUrl: './packing-report.component.html',
  styleUrls: ['./packing-report.component.css']
})
export class PackingReportComponent implements OnInit {
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public form:UntypedFormGroup;
  filterDataForm:boolean=false;
  date_type:any="";
  date_flag:boolean=false;
  length:any="";

  dtInstance: Promise<DataTables.Api>;
  dtElement: DataTableDirective;

  fromdate: any = '';
  todate: any = '';

  transportationlist:any="";
  public business_unit_list:any;


  constructor(
    public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    public dialog: MatDialog,
    public toast:ToastrService
  ) {
    this.form = this.fb.group({

      da_date: new UntypedFormControl(),
      da_no: new UntypedFormControl(),
      po_no: new UntypedFormControl(),
      so_no: new UntypedFormControl(),  
      customer_no: new UntypedFormControl(),  
      date_type:new UntypedFormControl(),
      
      fromDate:new UntypedFormControl(),
      toDate:new UntypedFormControl(),

      project_id:new UntypedFormControl(),
      business_unit:new UntypedFormControl(),
      ship_to_city:new UntypedFormControl(),
      ship_to_party_name:new UntypedFormControl(),
      transporter_name:new UntypedFormControl(),
      reference_document:new UntypedFormControl(),
      daId:new UntypedFormControl(),
    })
   }

   ngOnInit(): void {
    let data={
      "filter_fields": {
        id:1
      } }
     data.filter_fields["key3"]='san';
     console.log("sandeep",data);
    //this.getListOfDispatchValues();list all data from table
    this.getTransportationList();
    this.getBusinessUnitList();
    //this.CurrentDateTruckList();

    this.dtOptions = {
      dom: 'Bfrtip',
      ordering: false,
      paging:false,
      processing: true,
      scrollX: true,
      retrieve:true
    };
    this.rerender();
  }

  

  CurrentDateTruckList(){
    let url = "packing_report/getCurrentDateFilteredList/";
    this.api.getData(url).then((res: any) => {
      this.tablelist=res.data;
      console.log("Packing Cost report data=", this.tablelist)
      //console.log(this.tablelist);
      this.dtTrigger.next(void 0);   
    },(error)=>{
        console.log("error");
    })
  }

  getListOfDispatchValues(){
      this.api.getData("packing_report/").then((response:any)=>{
      this.tablelist=response.data;
      console.log("Packing cost report Data=", this.tablelist)
      this.dtTrigger.next(void 0);   
    },(error)=>{
        console.log("error");
    })
  }

  getTransportationList()
  {
    this.api.getData("logistics_tracking_transportations/").then((response)=>{
      this.transportationlist=response;
      console.log("tracking transportation value=", this.transportationlist)
    },(error)=>{
      console.log("error");
    })
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

  // datePickerChange(){
  //   this.fromdate = this.datepipe.transform(this.form.value.fromDate, 'yyyy-MM-dd');
  //   this.todate = this.datepipe.transform(this.form.value.toDate, 'yyyy-MM-dd');
  // }

  datePickerChange(){
    this.form.value.date_type = "DADate"
    console.log("Selected date type=", this.form.value.date_type)
    this.date_flag = true;
    this.fromdate = this.datepipe.transform(this.form.value.fromDate, 'yyyy-MM-dd');
    this.todate = this.datepipe.transform(this.form.value.toDate, 'yyyy-MM-dd');
  }

  onDateTypeSelected(dateType)
  {
    this.date_type = dateType
    this.form.value.date_type = dateType
    console.log("Selected date type=", this.form.value.date_type)
    //console.log("Selected date type=", this.date_type)
    this.date_flag = true;
  }

  clearAllFilterDataFields()
  {
      this.form.reset();
      this.date_flag=false;
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


  getRecordsBasedOnFilterData()
  {
    let data={
      "date_flag": this.date_flag,
      "date_type":this.form.value.date_type,
      "start_date":this.fromdate,
      "end_date":this.todate,
      "business_unit":this.form.value.business_unit == ''?null:this.form.value.business_unit,
      "customer_name":this.form.value.ship_to_party_name == ''?null:this.form.value.ship_to_party_name,
      "filter_data":  false,
      "filter_fields": {
      }}

      if(this.form.value.daId != null)
      {
       data.filter_fields["jobcode_da_no"]=this.form.value.daId
       data.filter_data=true
      }

      if(this.form.value.reference_document != null)
     {
      data.filter_fields["so_no"]=this.form.value.reference_document
      data.filter_data=true
     }

      //this.api.postData("packing_report/packing_filter_reports/",data).then((response:any)=>{18/03/2023
      this.api.postData("packing_report/packing_reports_values/",data).then((response:any)=>{
        if(response.length != 0)
          {
            this.rerender();
            this.toast.success("Records Found!")
            this.tablelist=response;
            this.dtTrigger.next(void 0);  
            this.length = response.length
            console.log("Packing Cost Report Data based on filter values =", this.tablelist)
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

  openDialogPanel(da_id: any){
    const dialogRef = this.dialog.open(OpenDialogBoxDetails, {
      height: '500px',
      width: '980px',
      maxWidth:'100%',
      data: {
           da_id: da_id
            }
    });
  }


  // openDialogPanel(challan_no: any){
  //   const dialogRef = this.dialog.open(OpenDialogBoxDetails, {
  //     height: '500px',
  //     width: '850px',
  //     maxWidth:'100%',
  //     data: {
  //          challan_no: challan_no
  //           }
  //   });
  // }
}

@Component({
  selector: 'open-dialog-panel',
  templateUrl: 'box-details.html'
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
export class OpenDialogBoxDetails {

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  //challan_no:any="";
  da_id:any="";
 totalSum:number=0;

  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogBoxDetails>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
    {
      this.dtOptions = {
        dom: 'Bfrtip',
        ordering: false,
        paging:false,
        processing: true,
        scrollX: true
      };
      //this.challan_no=data.challan_no;
      //console.log("challan number=", this.challan_no);
      this.da_id = data.da_id
      console.log("Da Id=", this.da_id);
      this.getBoxDetails()
    }

  getBoxDetails()
  {
    let url = "packing_report/get_box_details_list/";
    let data = {
      //challan_no : this.challan_no
      da_id : this.da_id
    }
    this.apiService.postData(url, data).then((res: any) => {
      this.tablelist=res;
      this.tablelist?.forEach((element: any) => {
        if(element.priceDetails != 0)
        {
          this.totalSum = this.totalSum + element.priceDetails
        }
      })
      let length = res.length
      console.log("Box Details List =", this.tablelist)
      })
  }

  
    dialogClose(){
      this.dialogRef.close();
    }
  }



//  if(this.form.value.transporter_name != null)
    //  {
    //   data.filter_fields["transporter_name"]=this.form.value.transporter_name
    //   data.filter_data=true
    //  }

    //  if(this.form.value.ship_to_city !=null)
    //  {
    //   data.filter_fields["destination"]=this.form.value.ship_to_city
    //   data.filter_data=true
    //  }

     // if(this.form.value.business_unit != null)
      // {
      //  data.filter_fields["business_unit"]=this.form.value.business_unit
      //  data.filter_data=true
      // }

      // if(this.form.value.ship_to_party_name != null)
      // {
      //  data.filter_fields["customer_name"]=this.form.value.ship_to_party_name
      //  data.filter_data=true
      // }