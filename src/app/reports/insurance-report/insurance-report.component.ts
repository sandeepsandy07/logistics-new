import { Component, OnInit ,OnDestroy ,ViewChild, AfterViewInit} from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, FormGroupDirective, NgForm, Validators, FormArray,UntypedFormBuilder } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute ,Params} from '@angular/router';
import {COMMA, ENTER, T} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';;
import {Router} from '@angular/router'; 
import { NavigationExtras } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StorageServiceService } from 'src/app/service-storage.service';
import {DataTableDirective} from 'angular-datatables';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
declare var $ :any;


@Component({
  selector: 'app-insurance-report',
  templateUrl: './insurance-report.component.html',
  styleUrls: ['./insurance-report.component.css']
})
export class InsuranceReportComponent implements OnInit{
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  public tablelist:any="";
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  dtInstance: Promise<DataTables.Api>;
  dtElement: DataTableDirective;
  
  public form:UntypedFormGroup;
  
 
  filterDataForm:boolean=false;
  date_type:any="";
  date_flag:boolean=false;
  length:any="";
  public insurencescopelist:any;
  public transportationlist:any;
  public business_unit_list:any;
  public customer_name_list:any;
  trucktypeslist:any="";

  public sapTotalValue:any=0;
  public portalTotalInvoiceAmount:any=0;
  public portalTotalTruckAmount:any=0;
  
  fromdate: any = '';
  todate: any = '';

  public websiteCtrl: UntypedFormControl = new UntypedFormControl();
  public websiteFilterCtrl: UntypedFormControl = new UntypedFormControl();

  

  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    private datePipe: DatePipe,
    public toast:ToastrService) {
      this.form = this.fb.group({

        project_id:new UntypedFormControl(),
        delivery_challan_no:new UntypedFormControl(),
        tax_inv_no:new UntypedFormControl(),
        customer_name:new UntypedFormControl(),
        transporter:new UntypedFormControl(),
        lr_no:new UntypedFormControl(),
        from:new UntypedFormControl(),
        destination:new UntypedFormControl(),
        insurance_scope:new UntypedFormControl(),
        ref_doc_cat:new UntypedFormControl(),
        category:new UntypedFormControl(),
        business_unit:new UntypedFormControl(),
        date_type:new UntypedFormControl(),

        fromDate:new UntypedFormControl(),
        toDate:new UntypedFormControl(),
      

        da_date: new UntypedFormControl(),
        da_no: new UntypedFormControl(),
        po_no: new UntypedFormControl(),
        so_no: new UntypedFormControl(),  
        billtype:new UntypedFormControl(),  
        customer_no: new UntypedFormControl(),    
        truck_type:new UntypedFormControl(),     
      })
     }
 
     ngOnInit(): void {
      let data={
        "filter_fields": {
          id:1
        } }

       data.filter_fields["key3"]='san';
       console.log("sandeep",data);
      //this.getListOfDispatchValues(); list all values
      //this.CurrentDateTruckList();
      this.getInsuranceScopeList();
      this.getTransportationList();
      this.getBusinessUnitList();
      this.getCustomerNameList();
      this.getTruckTypeList();
      
      this.dtOptions = {
        dom: 'Bfrtip',
      ordering: false,
      paging:false,
      processing: true,
      scrollX: true,
      retrieve: true,
    };
    this.rerender();
    }

    CurrentDateTruckList(){
      let url = "insuarance_report/getCurrentDateFilteredList/";
      this.api.getData(url).then((response: any) => {
        this.tablelist=response.data;
        console.log("Vehicle report data=", this.tablelist)
        this.dtTrigger.next(void 0);   
      },(error)=>{
          console.log("error");
      })
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

    getCustomerNameList()
    {
      this.api.getData("logistics_dispatch_advice/dispatch_advice_reports_list").then((response)=>{
        this.customer_name_list=response;
        console.log("Customer Names list value=", this.customer_name_list)
      },(error)=>{
        console.log("error");
      })
    }

    getTruckTypeList()
    {
      this.api.getData("logistics_truck_type/").then((response)=>{
        this.trucktypeslist=response;
        console.log("logistics_truck_type value=", this.trucktypeslist)
      },(error)=>{
        console.log("error");
      })
    }


    getInsuranceScopeList()
    {
      this.api.getData("logistics_insurance_scope/").then((response)=>{
        this.insurencescopelist=response;
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

    getListOfDispatchValues(){
      let data={
        "date_flag": this.date_flag,
        "date_type":this.date_type,
        "start_date":this.fromdate,
        "end_date":this.todate,
        "filter_data":  true,
        "filter_fields": {
          "project_id":this.form.value.project_id ,
          "delivery_challan_no":this.form.value.delivery_challan_no,
          "tax_inv_no":this.form.value.tax_inv_no,
          "customer_name":this.form.value.customer_name,
          "transporter":this.form.value.transporter,
          "lr_no":this.form.value.lr_no,
          "from":this.form.value.from,
          "destination":this.form.value.destination,
          "insurance_scope":this.form.value.insurance_scope,
          "ref_doc_cat":this.form.value.ref_doc_cat,
          //"category":this.form.value.category,
          //"business_unit":this.form.value.business_unit,
        } }
      this.api.getData("insuarance_report/").then((response:any)=>{
        
        this.tablelist=response.data;
        console.log("Insurance Report Data=", this.tablelist)
       
        this.dtTrigger.next(void 0);   
      },(error)=>{
          console.log("error");
      })
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

    datePickerChange(){

      // this.fromdate = this.datePipe.transform(this.fromDate.value, 'yyyy-MM-dd');
      // this.todate = this.datePipe.transform(this.toDate.value, 'yyyy-MM-dd');

      this.fromdate = this.datePipe.transform(this.form.value.fromDate, 'yyyy-MM-dd');
      this.todate = this.datePipe.transform(this.form.value.toDate, 'yyyy-MM-dd');
    }

    startdatePickerChange()
    {
      this.fromdate = this.datePipe.transform(this.form.value.fromDate, 'yyyy-MM-dd');
      console.log(this.fromdate)
    }
    enddatePickerChange()
    {
      //this.ValidTo = this.datePipe.transform(this.validTo.value, 'dd-MM-yyyy');
      this.todate = this.datePipe.transform(this.form.value.toDate, 'yyyy-MM-dd');
      console.log(this.todate)
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

    getRecordsBasedOnFilterData()
    {
      this.portalTotalInvoiceAmount = 0
      this.portalTotalTruckAmount = 0
      let data={
        "date_flag": this.date_flag,
        "date_type":this.form.value.date_type,
        "business_unit": this.form.value.business_unit == ''?null:this.form.value.business_unit,
        "insurance_scope": this.form.value.insurance_scope == ''?null:this.form.value.insurance_scope,
        "customer_name": this.form.value.customer_name == ''?null:this.form.value.customer_name,
        "bill_type": this.form.value.billtype == ''?null:this.form.value.billtype,
        "lr_no": this.form.value.lr_no == ''?null:this.form.value.lr_no,
        "transporter_name": this.form.value.transporter == ''?null:this.form.value.transporter,
        "truck_type": this.form.value.truck_type == ''?null:this.form.value.truck_type,
        "start_date":this.fromdate,
        "end_date":this.todate,
        "filter_data": false,
        "filter_fields": {
        }}

        if(this.form.value.project_id != null)
        {
         data.filter_fields["project_id"]=this.form.value.project_id
         data.filter_data=true
        }

        if(this.form.value.so_no != null)
        {
         data.filter_fields["reference_document"]=this.form.value.so_no
         data.filter_data=true
        }

        if(this.form.value.delivery_challan_no != null)
        {
         data.filter_fields["challan_no"]=this.form.value.delivery_challan_no
         data.filter_data=true
        }

        if(this.form.value.tax_inv_no != null)
        {
         data.filter_fields["tax_invoice_number"]=this.form.value.tax_inv_no
         data.filter_data=true
        }

        this.api.postData("insuarance_report/insurance_filter_reports/",data).then((response:any)=>{
          if(response.length != 0)
          {
            this.length=response.length;
            this.length = this.length - 1;
            this.sapTotalValue = response[this.length].SapTotalValue
            this.rerender();
            this.toast.success("Records Found!")
            this.dtTrigger.next(void 0);
              this.tablelist=response;
              this.tablelist?.forEach((element: any) => {
                if(element.delivery_challan.length != 0)
                {
                  this.portalTotalInvoiceAmount = this.portalTotalInvoiceAmount + element.delivery_challan[0].inv_amount
                  this.portalTotalTruckAmount = this.portalTotalTruckAmount + element.delivery_challan[0].truck_amount
                }
              })
          }
          else
          {
            this.rerender();
            this.toast.error("No Records Found")
            this.tablelist=response;
          }
          console.log("Insurance Report Data based on filter values =", this.tablelist) 
          this.dtTrigger.next(void 0);
        },(error)=>{
            console.log("error");
        })
    }
}


// getRecordsBasedOnFilterData()
// {
//   let data={
//     "date_flag": this.date_flag,
//     "date_type":this.date_type,
//     "start_date":this.fromdate,
//     "end_date":this.todate,
//     "filter_data":  false,
//     "filter_fields": {
//       //"project_id":this.form.value.project_id ,
//       //"delivery_challan_no":this.form.value.delivery_challan_no,
//       //"tax_inv_no":this.form.value.tax_inv_no,
//       //"customer_name":this.form.value.customer_name,
//       //"transporter":this.form.value.transporter,
//       //"lr_no":this.form.value.lr_no,
//       //"from":this.form.value.from,
//       //"destination":this.form.value.destination,
//       "insurance_scope":this.form.value.insurance_scope,
//       //"ref_doc_cat":this.form.value.ref_doc_cat,
//       //"category":this.form.value.category,
//       //"business_unit":this.form.value.business_unit,
//     } }
//     this.api.postData("insuarance_report/insurance_filter_reports/",data).then((response:any)=>{
//       this.tablelist=response;
//       console.log("Insurance Report Data based on filter values =", this.tablelist)
//       this.dtTrigger.next(void 0);   
//     },(error)=>{
//         console.log("error");
//     })
// }
