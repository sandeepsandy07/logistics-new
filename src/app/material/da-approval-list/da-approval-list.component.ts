
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Inject, ViewChild,ViewChildren ,QueryList } from '@angular/core';

import { UntypedFormGroup, UntypedFormControl, FormGroupDirective, NgForm, Validators, FormArray, UntypedFormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute, Params } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { isEmpty, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StorageServiceService } from 'src/app/service-storage.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { FileUploader } from "ng2-file-upload";
import { MatRadioChange } from '@angular/material/radio';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DataTableDirective} from 'angular-datatables';


@Component({
  selector: 'app-da-approval-list',
  templateUrl: './da-approval-list.component.html',
  styleUrls: ['./da-approval-list.component.css']
})

export class DaApprovalListComponent implements OnInit {

  // @ViewChild(DataTableDirective, {static: false})
  // datatableElement: any = DataTableDirective;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;

  public tablelist: any;
  public form: UntypedFormGroup;
  public tablelist_approved: any;
  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();
  public showfilter: boolean = false;
  min: any = 0;
  max: any = 0;

  constructor(public api: ApiserviceService,
    private activatedroute: ActivatedRoute,
    private route: Router,
    public datepipe: DatePipe,
    public storage: StorageServiceService,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
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

    this.getApprovalDa();
    this.getApprovalDa_approved();

    this.dtOptions = {
      retrieve: true,
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    this.dtOptions2 = {
      
      dom: 'Bfrtip',
      retrieve: true,
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 2000,
      processing: true
    };
   
  }
  getApprovalDa() {

    let data = {
      status: 'all',
      col_name: 'is_active',
      col_value: true,
      da_user_req_status: 'pending',
      approve_status: 'Approver',
      approver_flag: false
    }
    this.api.postData("dispatch_user_allocation/user_based_da_list_with_status/", data).then((response: any) => {

      this.tablelist = response;
      this.dtTrigger.next(void 0);
      this.hideloader();
    }, (error) => {
      console.log("error");
    })

  }


  getApprovalDa_approved() {

    let data = {
      status: 'all',
      col_name: 'is_active',
      col_value: true,
      da_user_req_status: 'approved',
      approve_status: 'Approver',
      approver_flag: true
    }
    this.api.postData("dispatch_user_allocation/user_based_da_list_with_status/", data).then((response: any) => {

      this.tablelist_approved = response;
      this.dtTrigger2.next(void 0);
      this.hideloader();
    }, (error) => {
      console.log("error");
    })

  }
  showloader() {
    document.getElementById('loading').style.display = 'block';
  }
  hideloader() {
    document.getElementById('loading').style.display = 'none';
  }
  daNavigation(id, nav_url) {
    const navigationExtras: NavigationExtras = { state: { dad_id: id } };
    this.route.navigate([nav_url], navigationExtras);
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
    this.api.postData("dispatch_user_allocation/user_based_da_list_with_status_with_filter/", data).then((response: any) => {
     
      this.tablelist_approved = response;
      
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger2.next(void 0);
          this.dtTrigger.next(void 0);       
        });
      });
      this.hideloader();
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
      status: 'all',
      col_name: 'is_active',
      col_value: true,
      da_user_req_status: 'approved',
      approve_status: 'Approver',
      approver_flag: true
    }
    this.api.postData("dispatch_user_allocation/user_based_da_list_with_status/", data).then((response: any) => {

      this.tablelist_approved = response;
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger2.next(void 0);
          this.dtTrigger.next(void 0);       
        });
      });
    
      this.hideloader();
    }, (error) => {
      console.log("error");
    })

  }

}
