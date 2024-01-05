import { Component, OnInit , OnDestroy  } from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, FormGroupDirective, NgForm, Validators, FormArray} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';
import {Observable} from 'rxjs';
import { ReplaySubject } from 'rxjs';
import {Subject} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router'; 
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-da-finance-approval',
  templateUrl: './da-finance-approval.component.html',
  styleUrls: ['./da-finance-approval.component.css']
})
export class DaFinanceApprovalComponent implements OnInit {

  public tablelist:any;
  public da_id:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public success:boolean=true;
  public viewRecords:any;
  public approverslist:any;
  public threadList:any;
  public form:UntypedFormGroup;

  constructor(public api: ApiserviceService,
    public toast:ToastrService, 
    private activatedroute:ActivatedRoute,private route:Router) {

     
    this.form = new UntypedFormGroup({
      status: new UntypedFormControl(),
      remarks: new UntypedFormControl(),
      da_id: new UntypedFormControl()

      })
   }

  ngOnInit(): void {

    this.getApprovalDa();

    this.dtOptions = {
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
  }
  getApprovalDa(){

    let data={
      status:'all',
      col_name:'finance_flag',
      col_value:false,
      da_user_req_status:'approved',
      approve_status:'Approver',
      approver_flag:true
        }
    this.api.postData("dispatch_user_allocation/user_based_da_list_with_status/",data).then((response:any)=>{
 
      this.tablelist=response;
      this.dtTrigger.next(void 0);
     
      },(error)=>{
          console.log("error");
  })

  }
  daNavigation(id,nav_url){
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.route.navigate([nav_url], navigationExtras);
  }
  showapprove_form(id){
    this.success=false;
    this.da_id=id;
    this.getDaThreads();
    this.api.viewuser("logistics_dispatch_advice/",id).then((data:any) => {
      this.viewRecords = data;        
    },(error)=>{
      console.log("error");
  })


  }
  getDaThreads(){
    let threadData={
      "da_id":this.da_id
     }
    this.api.postData("dispatch_auth_thread/get_da_threads_list/",threadData).then((threadresponce:any) => {
      this.threadList=threadresponce;
      })
      this.api.postData("work_flow_da_approval/get_da_approvers/",threadData).then((threadresponce:any) => {
        this.approverslist=threadresponce;      
        
      });

    }
    onSubmitPost(){
      this.form.value.da_id=this.da_id;
              let obj={...this.form.value};
              this.api.postData("logistics_dispatch_advice/da_update_finance/",obj).then((response:any)=>{
              this.form.reset();
              this.getDaThreads();
              this.toast.success("DA Approved Successfully");
              this.route.navigate(['material/DaApproval']);

              
             
             },(error)=>{
                 console.log("error");
             })
    }

}
