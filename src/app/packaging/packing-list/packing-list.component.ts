import { Component, OnInit, Inject, ViewChild, ElementRef,Output,EventEmitter } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { ViewChildren ,QueryList } from '@angular/core';


import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
  FormArray,
   
} from "@angular/forms";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ActivatedRoute ,Params} from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { data, isEmptyObject } from 'jquery';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { isEmpty } from 'rxjs';

import { Subject } from 'rxjs';
import {Router} from '@angular/router'; 
import { NavigationExtras } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StorageServiceService } from 'src/app/service-storage.service';
import {DataTableDirective} from 'angular-datatables';


@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.html',
  styleUrls: ['./packing-list.component.css']
})
export class PackingListComponent implements OnInit {
  
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public tablelist2:any;
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();

  public module_access:any;
  public user_level:any;

  public form: UntypedFormGroup;

  public showfilter:boolean=false;


  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    public dialog: MatDialog,
    private fb:UntypedFormBuilder,

    
    public toast: ToastrService,
    private http: HttpClient,) {

    this.form = this.fb.group({
      fromdate: new UntypedFormControl(null),
      todate: new UntypedFormControl(null),
      da_no: new UntypedFormControl(null),
      so_no: new UntypedFormControl(null),
      ygs_proj_defi: new UntypedFormControl(null),
      job_code: new UntypedFormControl(null)
    })
  }

  ngOnInit(): void {

    this.user_level=this.storage.getuser_level();
    // this.module_access=this.storage.getroot_list_single(18);

    this.getListOfDispatchValues();
    this.getpackedlist();

    this.dtOptions = {
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };
    this.dtOptions2 = {
      
      dom: 'Bfrtip',
      retrieve: true,
      ordering: false,
      pagingType: 'full_numbers',
      
      processing: true
    };
  }
  daNavigation(id,nav_url){
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.route.navigate([nav_url], navigationExtras);
  }
  getListOfDispatchValues(){
    let data={
      status:'all',
      col_name:'packing_approver_flag',
      col_value:true,
      da_user_req_status:'pending',
      approve_status:'Packing',
      approver_flag:false
    }
    this.api.postData("dispatch_user_allocation/user_based_da_list_with_status_for_packinglist/",data).then((response:any)=>{
 
      this.tablelist=response;
      this.dtTrigger.next(void 0);
     
      },(error)=>{
          console.log("error");
  })

  }
  getpackedlist(){
    let data = {
      type: 'packing_approver',  
      status: 'all',
      col_name: 'packing_approver_flag',
      col_value: true,
      da_user_req_status: 'pending',
      approve_status: 'Packing',
      approver_flag:false,
      from_date:this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
      to_date:this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
      filter_date:true,
      filter_data: false,
      filter_fields: {
      }
    }
    this.api.postData("dispatch_user_allocation/user_based_da_list_with_status_packed/",  data).then((response: any) => {
     
      this.tablelist2= response;
      
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger2.next(void 0);
          this.dtTrigger.next(void 0);       
        });
      });
     
    }, (error) => {
      console.log("error");
    })
  }
  getRecordsBasedOnFilterData() {

    let data = {
      type: 'packing_approver',  
      status: 'all',
      col_name: 'packing_approver_flag',
      col_value: true,
      da_user_req_status: 'pending',
      approve_status: 'Packing',
      approver_flag:false,
      from_date:'',
      to_date:'',
      filter_date:false,
      filter_data: false,
      filter_fields: {
      }
    }
   
    if (this.form.value.so_no != null && this.form.value.so_no ) {
      data.filter_fields["so_no"] = this.form.value.so_no
      data.filter_data = true
    }
   
    if (this.form.value.da_no != null && this.form.value.da_no) {
      data.filter_fields["jobcode_da_no"] = this.form.value.da_no
      data.filter_data = true
    }
    if (this.form.value.job_code != null && this.form.value.job_code ) {
      data.filter_fields["job_code"] = this.form.value.job_code
      data.filter_data = true
    }
    if (this.form.value.ygs_proj_defi != null && this.form.value.so_ygs_proj_defino ) {
      data.filter_fields["ygs_proj_defi"] = this.form.value.ygs_proj_defi
      data.filter_data = true
    }
    if (this.form.value.fromdate != null && this.form.value.todate != null && this.form.value.fromdate ) {
      data.from_date = this.datepipe.transform(this.form.value.fromdate, 'yyyy-MM-dd');
      data.to_date = this.datepipe.transform(this.form.value.todate, 'yyyy-MM-dd');
      data.filter_date = true
    }
    this.api.postData("dispatch_user_allocation/user_based_da_list_with_status_packed/",  data).then((response: any) => {
     
      this.tablelist2= response;
      
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger2.next(void 0);
          this.dtTrigger.next(void 0);       
        });
      });
     
    }, (error) => {
      console.log("error");
    })


  }
  ngOnDestroy(): void {
    this.dtTrigger2.unsubscribe();
  }
  rerender(): void {
   
  }
  clearAllFilterDataFields() {
    this.form.reset();
    let data = {
      type: 'packing_approver',    
      from_date:this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
      to_date:this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
      filter_date:true,
      filter_data: false,
      filter_fields: {
        approve_flag: true,
      }
    }

    this.api.postData("dispatch_user_allocation/user_based_da_list_with_status_packed/",  data).then((response: any) => {


      this.tablelist2 = response;
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger2.next(void 0);
          this.dtTrigger.next(void 0);       
        });
      });
    
     
    }, (error) => {
      console.log("error");
    })

  }
  assign_da(da_id){

    
    const dialogRef = this.dialog.open(AssignDaDetails, {
    
      width: '853px',
     
      
      data: {
        da_id: da_id,
       
            }
    });
  }

}


@Component({
  selector: 'assign-da-details',
  templateUrl: 'asign-da.html'
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

export class AssignDaDetails {

  public da_id:any;
  public form:UntypedFormGroup;
  public userList:any;
  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<AssignDaDetails>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
    this.da_id=data.da_id;
    this.form = new UntypedFormGroup({
      status: new UntypedFormControl(),
      remarks: new UntypedFormControl(),
      da_id: new UntypedFormControl(),
      merge_da_id: new UntypedFormControl(),
      assign_to:new UntypedFormControl(),
      da_status: new UntypedFormControl(),
      da_remarks: new UntypedFormControl()

      })
      this.showapprovepage();
    
  
    }

    update_da_status(){
      let data={ 
        'da_id':this.da_id,
        'da_status':this.form.value.da_status,
        'da_remarks':this.form.value.da_remarks
      }
        this.api.postData("logistics_dispatch_advice/da_filter_based_so/",data).then((response:any) => {
        

      },(error)=>{
          console.log("error");
          console.log(" eroor")
      })
  
    }
    showapprovepage(){
     
      this.api.getData("user_list/").then((response: any)=>{
        this.userList=response.data;
      })
    }

    
    
  }