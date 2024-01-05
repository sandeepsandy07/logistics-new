import { Component, OnInit ,OnDestroy ,ViewChild,ViewChildren ,QueryList} from '@angular/core';
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
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { DatePipe } from '@angular/common';
import { StorageServiceService } from 'src/app/service-storage.service';
import {  Inject, ElementRef,Output,EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';

@Component({
  selector: 'app-dispatch-advice-list',
  templateUrl: './dispatch-advice-list.component.html',
  styleUrls: ['./dispatch-advice-list.component.css']
})
export class DispatchAdviceListComponent implements OnInit {

  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>; 

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public showfilter: boolean = false;

  public tablelist_completed:any;
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();

  public form: UntypedFormGroup;


  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder) { 

      this.form = this.fb.group({
        //add
  
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
    this.getListOfDispatchValues_completed();

    this.dtOptions = {
      // dom: 'Bfrtip',
      retrieve: true,
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };
    this.dtOptions2 = {
      dom: 'Bfrtip',
      ordering: false,
      retrieve: true,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };
  }
  daNavigation(id, nav_url) {
    const navigationExtras: NavigationExtras = { state: { dad_id: id } };
    this.route.navigate([nav_url], navigationExtras);
  }
 
  daNavigation_da(id,nav_url,actions){
    const navigationExtras: NavigationExtras = {state: {dad_id: id,action: actions}};
    this.route.navigate([nav_url], navigationExtras);
  }
  getListOfDispatchValues(){
    this.api.getData("logistics_dispatch_advice/").then((response)=>{
      if (Response) {
        this.hideloader();
      }
      this.tablelist=response;
      console.log(this.tablelist);
      this.dtTrigger.next(void 0);   
    },(error)=>{
        console.log("error");
    })

  }
  getListOfDispatchValues_completed(){

    let data={

    }
    this.api.postData("logistics_dispatch_advice/get_completed_da_createrwise/",data).then((response)=>{
      
      this.tablelist_completed=response;
      console.log(this.tablelist);
      this.dtTrigger2.next(void 0);   
    },(error)=>{
        console.log("error");
    })

  }
  assign_da(da_id,current_level,details:any){

    
    const dialogRef = this.dialog.open(AssignDa, {
    
      width: '853px',
     
      
      data: {
        da_id: da_id,
        da_level:current_level,
        details:details
       
            }
    });
  }
  
  hideloader() {
    document.getElementById('loading') .style.display = 'none';       
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
      this.api.postData("logistics_dispatch_advice/get_completed_da_createrwise_with_filter/", data).then((response: any) => {
       
        this.tablelist_completed = response;
        
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
    clearAllFilterDataFields() {
      this.tablelist_completed =[];
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger2.next(void 0);
          this.dtTrigger.next(void 0);       
        });
      });

    }
    ngOnDestroy(): void {
      this.dtTrigger2.unsubscribe();
    }
  

}
@Component({
  selector: 'assign-da',
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

export class AssignDa {

  public da_id:any;
  public form:UntypedFormGroup;
  public userList:any;
  public approverslist:any;
  public details:any;
  public da_level:any;
  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<AssignDa>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
    this.da_id=data.da_id;
    this.da_level=data.da_level;
    this.details=data.details;
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
    update_approver(index,actionevent){
      this.approverslist[index].emp_id=actionevent.target.value;
    }
    update_da_status(id){
      let data={ 
        'wfd_id':this.approverslist[id].wfd_id,
        'emp_id':this.approverslist[id].emp_id,
        
      }
      let url = "work_flow_da_approval/"+this.approverslist[id].wfd_id+"/";
      this.api.updateData(url,data).then(res => {
        let data1={
          da_id:this.da_id,
          emp_id:this.approverslist[id].emp_id
        }
        if(this.da_level == this.approverslist[id].level){
          let data_assign = {
            'da_id': this.da_id,
            'approve_status': 'Approver',
            'emp_id': [this.approverslist[id].emp_id],
          };
          
          this.api.postData("logistics_dispatch_advice/user_allocation_assigned/", data_assign).then((response: any) => {
            let assign_mail=
            {
              "da_id": this.details.da_id,
              "so_no": this.details.so_no,
              "job_code":this.details.job_code,
              "jobcode_da_no": this.details.jobcode_da_no,
              "po_no": this.details.po_no,
              "status": "DA Reassign",             
              "email_to": response.mail_to,
              "module": "DA_assign",
              "cc": "YIL.Developer4@yokogawa.com,"
          }
          
          this.api.postData('logistics_dispatch_advice/alert_mail/', assign_mail).then((mailres: any) => {

          })
    
            this.toast.success("DA as be assigned successfully");

          })
        }
          this.toast.success("success")

      },(error)=>{
          console.log("error");
         
      })
    
    
  
    }
   
    showapprovepage(){
     
      this.api.getData("user_list/").then((response: any)=>{
        this.userList=response.data;
      })
      let threadData = {

        "da_id": this.data.da_id
  
      }
      this.api.postData("work_flow_da_approval/get_da_approvers/", threadData).then((threadresponce: any) => {
  
        this.approverslist = threadresponce;
       
      });
    }

    
    
  }
