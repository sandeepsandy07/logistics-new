import { Component, OnInit ,OnDestroy ,ViewChild} from '@angular/core';
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
import { NavigationExtras } from '@angular/router';;
import { DatePipe } from '@angular/common';
import { StorageServiceService } from 'src/app/service-storage.service';
import {DataTableDirective} from 'angular-datatables';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-packing-cost-report',
  templateUrl: './packing-cost-report.component.html',
  styleUrls: ['./packing-cost-report.component.css']
})
export class PackingCostReportComponent implements OnInit {

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public form:UntypedFormGroup;
  filterDataForm:boolean=false;
  date_type:any="";
  date_flag:boolean=false;
  length:any="";

  fromdate: any = '';
  todate: any = '';

  transportationlist:any="";

  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    public toast:ToastrService) {
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
      this.CurrentDateTruckList();
  
      this.dtOptions = {
        dom: 'Bfrtip',
        ordering: false,
        paging:false,
        processing: true,
        scrollX: true
      };
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

    datePickerChange(){
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

    getRecordsBasedOnFilterData()
    {
      let data={
        "date_flag": this.date_flag,
        //"date_type":this.date_type,
        "date_type":this.form.value.date_type,
        "start_date":this.fromdate,
        "end_date":this.todate,
        "filter_data":  false,
        "filter_fields": {
        }}
        if(this.form.value.reference_document != null)
       {
        data.filter_fields["reference_document"]=this.form.value.reference_document
        data.filter_data=true
       }
       if(this.form.value.ship_to_city !=null)
       {
        data.filter_fields["ship_to_city"]=this.form.value.ship_to_city
        data.filter_data=true
       }
       if(this.form.value.ship_to_party_name != null)
       {
        data.filter_fields["ship_to_party_name"]=this.form.value.ship_to_party_name
        data.filter_data=true
       }
       if(this.form.value.transporter_name != null)
       {
        data.filter_fields["transporter_name"]=this.form.value.transporter_name
        data.filter_data=true
       }
        this.api.postData("packing_report/packing_filter_reports/",data).then((response:any)=>{
          this.tablelist=response;
          this.length=response.length;
          if(this.length == 0)
          {
            this.toast.error("No Records Found")
          }
          console.log("Packing Cost Report Data based on filter values =", this.tablelist)
          this.dtTrigger.next(void 0);   
        },(error)=>{
            console.log("error");
        })
    }
}



// getRecordsBasedOnFilterData()
//     {
//       let data={
//         "date_flag": this.date_flag,
//         "date_type":this.date_type,
//         "start_date":this.fromdate,
//         "end_date":this.todate,
//         "filter_data":  true,
//         "filter_fields": {
//           //"project_id": this.form.value.project_id,
//           "reference_document": this.form.value.reference_document,
//           //"business_unit":this.form.value.business_unit,
//           "ship_to_city":this.form.value.ship_to_city,
//           "ship_to_party_name":this.form.value.ship_to_party_name,
//           "transporter_name":this.form.value.transporter_name,
//         }}
//         this.api.postData("packing_report/packing_filter_reports/",data).then((response:any)=>{
//           this.tablelist=response;
//           console.log("Packing Cost Report Data based on filter values =", this.tablelist)
//           this.dtTrigger.next(void 0);   
//         },(error)=>{
//             console.log("error");
//         })
//     }
