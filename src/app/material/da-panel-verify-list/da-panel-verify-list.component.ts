import { Component, OnInit, Inject, ViewChild, ElementRef ,ViewChildren ,QueryList} from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';
import { Subject } from 'rxjs';
import { Moveingitem } from '../interfacetypecreate';



import { DatePipe } from '@angular/common';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
  FormArray,
   
} from "@angular/forms";

import { HttpClient, HttpHeaders } from "@angular/common/http";


import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import {DataTableDirective} from 'angular-datatables';



@Component({
  selector: 'app-da-panel-verify-list',
  templateUrl: './da-panel-verify-list.component.html',
  styleUrls: ['./da-panel-verify-list.component.css']
})
export class DaPanelVerifyListComponent implements OnInit {

  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>; 
  public form: UntypedFormGroup;
  public showfilter:any=false;


  public tablelist:any;
  public tablelist_approved:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  displayedColumns = ['slno.', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();

  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();
  displayedColumns2 = ['slno.', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource2 = new MatTableDataSource<['']>();

  constructor(private formBuilder: UntypedFormBuilder,
    private http: HttpClient,
    public api: ApiserviceService,
    public toast:ToastrService, 
    public dialog: MatDialog,
    public storage: StorageServiceService,
    private toastr: ToastrService,
    private router: Router,
    public datepipe: DatePipe,
    private fb:UntypedFormBuilder
    ) { 

      

      this.form = this.fb.group({
           
            fromdate: new UntypedFormControl(),
            todate: new UntypedFormControl(),
            da_no: new UntypedFormControl(),
            so_no: new UntypedFormControl(),
            ygs_proj_defi: new UntypedFormControl(),
            job_code: new UntypedFormControl()
          })

    }
  ngOnInit(): void {
    this.getListOfDispatchValues();
    this.dtOptions = {
      ordering: false,
      retrieve: true,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };
    this.dtOptions2 = {
      ordering: false,
      retrieve: true,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };
  }
  getListOfDispatchValues(){
    let data={ 
      type: 'panel_verifer',
      data_approver:{
        approve_flag:true

      }
      
    }   
    this.api.postData("work_flow_access/approver_based_on_workflow_verifier/",data).then((response:any) => {
      this.tablelist=response;
      this.dtTrigger.next(void 0);   
    },(error)=>{
        console.log("error");
    })

     this.api.postData("work_flow_access/approver_based_on_workflow_verifier_approved/",data).then((response:any) => {
      this.tablelist_approved=response;
      this.dtTrigger2.next(void 0);   
    },(error)=>{
        console.log("error");
    })

  }
  daNavigation(id,nav_url){
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.router.navigate([nav_url], navigationExtras);
  }
  
  getRecordsBasedOnFilterData() {

    let data = {
      status: 'all',
      col_name: 'is_active',
      col_value: true,
      da_user_req_status: 'approved',
      approve_status: 'Approver',
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
    this.api.postData("work_flow_access/approver_based_on_workflow_verifier_approved_filter/", data).then((response: any) => {
     
      this.tablelist_approved = response;
      
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

  clearAllFilterDataFields() {
    this.form.reset();
    let data={ 
      type: 'panel_verifer',
      data_approver:{
        approve_flag:true

      }
    }
    this.api.postData("work_flow_access/approver_based_on_workflow_verifier_approved/",data).then((response:any) => {
      this.tablelist_approved=response;
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


}
