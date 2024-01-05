import { Component, OnInit ,OnDestroy ,ViewChild} from '@angular/core';
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
import { NavigationExtras } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StorageServiceService } from 'src/app/service-storage.service';
import {DataTableDirective} from 'angular-datatables';


@Component({
  selector: 'app-billing-report',
  templateUrl: './billing-report.component.html',
  styleUrls: ['./billing-report.component.css']
})
export class BillingReportComponent implements OnInit {

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public form:UntypedFormGroup;


  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder) {

      this.form = this.fb.group({

        da_date: new UntypedFormControl(),
        da_no: new UntypedFormControl(),
        po_no: new UntypedFormControl(),
        so_no: new UntypedFormControl(),  
        customer_no: new UntypedFormControl(),         
      })


     }

  ngOnInit(): void {
    let data={
      "filter_fields": {
        id:1
      } }
     data.filter_fields["key3"]='san';
     console.log("sandeep",data);
    this.getListOfDispatchValues();

    this.dtOptions = {
      dom: 'Bfrtip',
      ordering: false,
      paging:false,
      processing: true,
      scrollX: true
    };
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
  filter_table(){
    
  }
  ngOnDestroy(): void {

    this.dtTrigger.unsubscribe();
  
  }

}
