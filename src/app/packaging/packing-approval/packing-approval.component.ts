import { Component, OnInit, OnDestroy, Sanitizer } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, FormGroupDirective, NgForm, Validators, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-packing-approval',
  templateUrl: './packing-approval.component.html',
  styleUrls: ['./packing-approval.component.css']
})
export class PackingApprovalComponent implements OnInit {

  public success: boolean = false;
  public viewRecords: any;
  public showdata: boolean = false;
  public tablelist: any;
  public da_id: any;
  public threadList: any;
  public da_list: any;
  public dept_wise_da_list: any;
  public tablelist_approved: any;

  public username: any;
  public userList: any;
  public search_userList: any;
  searchTxt: any;
  public daUpdatestatus: any;
  public daUpdateremarks: any;
  public form: UntypedFormGroup;
  public form_status: UntypedFormGroup;
  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();

  // dtOptions: DataTables.Settings = {};
  // public dataSource = new MatTableDataSource<['']>();
  // public displayedColumns: string[] = ['Sl.no.','RoleName', 'CreatedBy', 'UpdatedBy','View','Edit','Delete'];

  constructor(public api: ApiserviceService,
    private activatedroute: ActivatedRoute,
    public toast: ToastrService,
    private route: Router) {

      const navigation = this.route.getCurrentNavigation();
      const state = navigation.extras.state as { dad_id: string };
      this.da_id = state.dad_id;

    this.form = new UntypedFormGroup({
      status: new UntypedFormControl(),
      remarks: new UntypedFormControl(),
      da_id: new UntypedFormControl(),
      merge_da_id: new UntypedFormControl(),
      assign_to: new UntypedFormControl(),
      da_status: new UntypedFormControl(),
      da_remarks: new UntypedFormControl()

    })



  }

  ngOnInit(): void {

    this.da_id = this.da_id ;
    this.api.getData("user_list/").then((response: any) => {
      this.userList = response.data;
      this.search_userList = response.data;
    })
    this.api.viewuser("logistics_dispatch_advice/", this.da_id ).then((data: any) => {
      this.viewRecords = data;
    }, (error) => {
      console.log("error");
    })
    this.getListOfDA(this.da_id );
    this.getDaThreads();
    this.viewData();

    
    


  }

  getApprovalDa_dept() {
    let data = {
      type: 'packing_approver',
      data_approver: {
        approve_flag: true
      }
    }
    this.api.postData("work_flow_access/approver_based_on_dept_name/", data).then((response: any) => {
      this.dept_wise_da_list = response.data;

    }, (error) => {
      console.log("error");
    })

  }
  


  getApprovalDa() {
    let data = {
      type: 'packing_approver',
      data_approver: {
        approve_flag: true
      }
    }
    this.api.postData("work_flow_access/approver_based_on_workflow/", data).then((response: any) => {
      debugger
      this.tablelist = response.filter(e => e.da_status_number < 4);
      this.tablelist_approved = response.filter(e => e.da_status_number >= 4);

      this.dtTrigger.next(void 0);
      this.dtTrigger2.next(void 0);
    }, (error) => {
      console.log("error");
    })

  }

  filter_dept_da(dept_id) {
    this.tablelist = this.tablelist.filter(e => e.da_from == dept_id);
    this.dtTrigger.next(void 0);

  }
  getApprovalDaEXample() {
    let data = {
      da_filter: {

      }
    }
    this.api.postData("logistics_dispatch_advice/da_filter_list/", data).then((response: any) => {
      this.tablelist = response;
      this.dtTrigger.next(void 0);
      this.dtTrigger2.next(void 0);
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

      console.log(this.threadList);
    })
  }
  showapprovepage(id: any) {

   

  }

  onSubmitPost_assign() {

    let data_assign = {
      'da_id': this.da_id,
      'approve_status': 'Packing',
      'emp_id': this.form.value.assign_to
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
     
     
      this.toast.success("Packing as be assigned successfully");
    }, (error) => {
      console.log("error");
    })
    if (this.form.value.merge_da_id != null) {
      let data_merge = {
        da_id: this.da_id,
        main_da_id: this.form.value.merge_da_id
      };
      this.api.postData("logistics_dispatch_advice/merge_da/", data_merge).then((response: any) => {
        this.form.reset();
        this.toast.success("DA merged successfully");
      }, (error) => {
        console.log("error");
      })
    }

    this.showdata = false;

  }



  


  onSubmitPost() {
    this.form.value.da_id = this.da_id;
    let obj = {
      'da_id': this.da_id,
      'remarks': this.form.value.remarks,
      'status': this.form.value.status
    };
    this.api.postData("dispatch_auth_thread/da_packing_approved/", obj).then((response: any) => {
      this.form.reset();
      this.toast.success("Approved for packing");
      
      this.api.postData('logistics_dispatch_advice/alert_mail/', response).then((mailres: any) => {
    
      })
    }, (error) => {
      console.log("error");
    })


    let data_assign = {
      'da_id': this.da_id,
      'approve_status': 'Packing',
      'emp_id': this.form.value.assign_to
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
      this.toast.success("Packing as be assigned successfully");
    }, (error) => {
      console.log("error");
    })
    if (this.form.value.merge_da_id != null) {
      let data_merge = {
        da_id: this.da_id,
        main_da_id: this.form.value.merge_da_id
      };
      this.api.postData("logistics_dispatch_advice/merge_da/", data_merge).then((response: any) => {
        this.form.reset();
        this.toast.success("DA merged successfully");
      }, (error) => {
        console.log("error");
      })
    }

    this.showdata = false;

  }
  getListOfDA(da_id) {
    let data = {
      'da_id': da_id
    }
    this.api.postData("logistics_dispatch_advice/da_filter_based_so/", data).then((response: any) => {
      this.da_list = response;

    }, (error) => {
      console.log("error");
     
    })

  }
  update_da_status() {

    let da_level;

    if (this.form.value.da_status == 'Packing Initiated') {
      da_level = 4;
    } else if (this.form.value.da_status == 'Packed') {
      da_level = 5;
    } else if (this.form.value.da_status == 'Loading Completed') {
      da_level = 6;
    } else if (this.form.value.da_status == 'Dispatched') {
      da_level = 7;
    } else if (this.form.value.da_status == 'Delivered') {
      da_level = 8;
    } else if (this.form.value.da_status == 'Close') {
      da_level = 9;
    }



    let data = {
      'da_id': this.da_id,
      'status': this.form.value.da_status,
      'da_level': da_level
    }
    this.api.postData("logistics_dispatch_advice/manual_status_change/", data).then((response: any) => {
      this.da_list = response;
    }, (error) => {
      console.log("error");
    })

  }

  onKey(items, event) {


    // console.log("con",event.target.value)
    this.search_userList = this.search(this.search_userList, event);

  }



  search(items, event) {

    this.searchTxt = event.target.value;
    return this.search_userList.employee_name.toString().toLowerCase().indexOf(this.searchTxt.toLowerCase()) > -1

  }

  viewData() {
    this.api.viewuser("logistics_dispatch_advice/", this.da_id).then((data: any) => {
      this.viewRecords = data;
      this.showdata = this.showdata ? false : true;
    }, (error) => {
      console.log("error");
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }
  daNavigation(id, nav_url) {
    const navigationExtras: NavigationExtras = { state: { dad_id: id } };
    this.route.navigate([nav_url], navigationExtras);
  }

}
