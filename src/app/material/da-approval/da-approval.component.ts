
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, FormGroupDirective, NgForm, Validators, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, throwError } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';



@Component({
  selector: 'app-da-approval',
  templateUrl: './da-approval.component.html',
  styleUrls: ['./da-approval.component.css']
})

export class DaApprovalComponent implements OnInit, OnDestroy {

  public success: boolean = true;
  public showdata: boolean = true;
  public tablelist: any;
  public da_id: any;
  public threadList: any;
  public viewRecords: any;
  public username: any;
  public daUpdatestatus: any;
  public daUpdateremarks: any;
  public approverslist: any;
  public approve_button: boolean = true;
  public form: UntypedFormGroup;
  public mqa_approver: boolean = false;
  public userList: any;
  dtOptions: DataTables.Settings = {};
  public user_deatils: any;
  dtTrigger: Subject<any> = new Subject<any>();

  // dtOptions: DataTables.Settings = {};
  // public dataSource = new MatTableDataSource<['']>();
  // public displayedColumns: string[] = ['Sl.no.','RoleName', 'CreatedBy', 'UpdatedBy','View','Edit','Delete'];

  constructor(public api: ApiserviceService,
    public storage: StorageServiceService,
    private activatedroute: ActivatedRoute,
    private route: Router,
    public toast: ToastrService,) {

    const navigation = this.route.getCurrentNavigation();
    const state = navigation.extras.state as { dad_id: string };
    this.da_id = state.dad_id;
    

      



    this.form = new UntypedFormGroup({

      status: new UntypedFormControl(null, { validators: [Validators.required] }),
      remarks: new UntypedFormControl(),
      da_id: new UntypedFormControl(),
      da_dispatch_approve: new UntypedFormControl(false),
      assign_to: new UntypedFormControl(null)

    })
  }

  ngOnInit(): void {

    this.showapprovepage(this.da_id);
    this.user_deatils = this.storage.getuser_data();
    console.log(this.user_deatils);

  }
  getApprovalDa() {
    this.api.getData("dispatch_user_allocation/user_based_da_list/").then((response: any) => {

      this.tablelist = response;
      this.dtTrigger.next(void 0);

    }, (error) => {

      console.log("error");

    })

  }
  showmore() {

    this.success = this.success ? false : true;

  }


  getDaThreads() {

    let threadData = {

      "da_id": this.da_id

    }
    
    this.api.postData("dispatch_auth_thread/get_da_threads_list/", threadData).then((threadresponce: any) => {
      
      this.threadList = threadresponce;
    
    })

    this.api.postData("work_flow_da_approval/get_da_approvers/", threadData).then((threadresponce: any) => {

      this.approverslist = threadresponce;
      let cur_lev = this.viewRecords.records.current_level - 1;
      let cur_approver = this.approverslist.find(e => e.level == cur_lev);
      let cur_approver_mqs = this.approverslist.find(e => e.level == this.viewRecords.records.current_level);
      if (cur_approver_mqs.approver == 'MQA') {
    
        this.mqa_approver = true

      }
     

      
    });
    
    this.api.getData("user_list/").then((response: any) => {

      this.userList = response.data;

    })



    // });

  }
  showapprovepage(id: any) {

    this.showdata = true;
    this.da_id = id;
    this.api.viewuser("logistics_dispatch_advice/", id).then((data: any) => {
      this.viewRecords = data;
      this.getDaThreads();
    }, (error) => {
      console.log("error");
    })
  }
  getDispatchParticular(da_id) {

    let url = "logistics_dispatch_advice/getDispatchAdvicePdf/"
    let data = {
      da_id: da_id,
    }

    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    })
  }
  onSubmitPost() {

    if (this.form.invalid) {
      alert("Please enter valid details");
      return;
    }

    this.approve_button = false;
    this.form.value.da_id = this.da_id;
    let obj = { ...this.form.value };
    this.api.postData("dispatch_auth_thread/", obj).then((response: any) => {

      if (this.form.value.assign_to != null) {
        let data_assign = {
          'da_id': this.da_id,
          'approve_status': 'Varify',
          'emp_id': this.form.value.assign_to,
        };
        
        this.api.postData("logistics_dispatch_advice/user_allocation_assigned/", data_assign).then((response: any) => {
          let assign_mail=
          {
            "da_id": this.viewRecords.records.da_id,
            "so_no": this.viewRecords.records.so_no,
            "job_code":this.viewRecords.records.job_code,
            "jobcode_da_no": this.viewRecords.records.jobcode_da_no,
            "po_no": this.viewRecords.records.po_no,
            "status": "MQA Approved",
            
            "email_to": response.mail_to,
            "module": "verify_assign",
            "cc": "YIL.Developer4@yokogawa.com,"
        }
        
        this.api.postData('logistics_dispatch_advice/alert_mail/', assign_mail).then((mailres: any) => {
  
        })
  
          this.toast.success("DA as be assigned successfully");
        }, (error) => {
          console.log("error");
        })
      }

      this.form.reset();
      this.getDaThreads();
      this.toast.success("DA Approved Successfully");
      this.route.navigate(['material/DaApproval']);
      this.approve_button = true;
      let mail_data = response.mail_data;
      this.api.postData('logistics_dispatch_advice/alert_mail/', mail_data).then((mailres: any) => {

      })

    }, (error) => {
      console.log("error");
    })
  }

  daNavigation(id, nav_url) {
    const navigationExtras: NavigationExtras = { state: { dad_id: id } };
    this.route.navigate([nav_url], navigationExtras);
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}
