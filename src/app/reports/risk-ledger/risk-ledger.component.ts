import { Component, OnInit, OnDestroy ,ViewChild, Inject } from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, FormGroupDirective, NgForm, Validators, FormArray,UntypedFormBuilder, FormControlDirective } from '@angular/forms';
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
import { ToastrService } from 'ngx-toastr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-risk-ledger',
  templateUrl: './risk-ledger.component.html',
  styleUrls: ['./risk-ledger.component.css']
})
export class RiskLedgerComponent implements OnInit {

  public action='';
  url = "logistics_risk_ledger/";
  public daRemarksId:any="";
  editForm:boolean=false;
  mainForm:boolean=true;
  DaIdList:any='';
  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public form:UntypedFormGroup;

  public typeofriskList:any;
  public severityriskList:any;
  public probaleList:any;
  public riskStatusList:any;

  public riskLedgerList:any;
  MainForm:boolean=true;
  EditForm:boolean=false;
  risk_ledger_id:any="";

  constructor(
    public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    public dialog: MatDialog,
    //addd
    public toast:ToastrService,
    private http: HttpClient) {
    this.form = this.fb.group({
      job_code:new UntypedFormControl(),
      job_name:new UntypedFormControl(), 
      so_no:new UntypedFormControl(),
      remarks:new UntypedFormControl(),
      enroute_hold_up_issues_remarks:new UntypedFormControl(),
      no_supply_of_packing_material_remarks:new UntypedFormControl(),
      statutory_regulations_remarks:new UntypedFormControl(),
      probale_risk_Id:new UntypedFormControl(),
      type_of_risk_Id:new UntypedFormControl(),
      severity_of_risk_Id:new UntypedFormControl(),
      risk_status_Id:new UntypedFormControl(),
      detailed_description_risk:new UntypedFormControl(),
      impact:new UntypedFormControl(),
      countermeasure_mitigation_plan:new UntypedFormControl(),
      contigency_plan_value:new UntypedFormControl(),
      fromDate:new UntypedFormControl(),
        toDate:new UntypedFormControl(),
      da_id:new UntypedFormControl(),
  })
   }

  ngOnInit(): void {
    this.RiskLedgerList();
    this.dispatchAdviceList();
    this.RiskStatusList();
    this.SeverityOfRiskList();
    this.ProbaleRiskList();
    this.TypeOfRiskList();
  this.dtOptions = {
    ordering: false,
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      retrieve:true
  };
 
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getDARemarksList(){
    this.api.getData("logistics_da_remarks/").then((response:any)=>{
      this.tablelist=response;
      console.log("DA Remarks List=", this.tablelist)
      this.dtTrigger.next(void 0);
      },(error)=>{
          console.log("error");
  })
  }

  dispatchAdviceList(){
    let url = "logistics_dispatch_advice/dispatch_advice_reports_list/";
     this.api.getData(url).then((res: any) => {
       this.DaIdList = res;
       console.log("Dispatch Advice list=", this.DaIdList)
     });
   }

   RiskStatusList(){
    let url = "logistics_risk_status/";
     this.api.getData(url).then((res: any) => {
       this.riskStatusList = res;
       console.log("Risk Status list=", this.riskStatusList)
     });
   }

   SeverityOfRiskList(){
    let url = "logistics_severity_of_risk/";
     this.api.getData(url).then((res: any) => {
       this.severityriskList = res;
       console.log("Severity Of Risk list=", this.severityriskList)
     });
   }

   ProbaleRiskList(){
    let url = "logistics_probale_risk/";
     this.api.getData(url).then((res: any) => {
       this.probaleList = res;
       console.log("Probale Risk list=", this.probaleList)
     });
   }

   TypeOfRiskList(){
    let url = "logistics_type_of_risk/";
     this.api.getData(url).then((res: any) => {
       this.typeofriskList = res;
       console.log("Type Of Risk list=", this.typeofriskList)
     });
   }
   
   ClearDARange()
   {
    this.form.reset();
    this.dispatchAdviceList();
   }

   getDispatchAdviceListOnDate()
   {
    let url = "logistics_dispatch_advice/dispatch_advice_reports_list_between_given_da_date/";
    let data={
      "start_date":this.datepipe.transform(this.form.value.fromDate, 'yyyy-MM-dd'),
      "end_date":this.datepipe.transform(this.form.value.toDate, 'yyyy-MM-dd')
      }
    this.api.postData(url,data).then((res: any) => {
      if(res.length == 0)
      {
        this.toast.error("No DA Was Submitted With The Given Dates")
      }
      else
      {
        this.DaIdList = res;
        this.toast.success("DA Number Found!!")
        console.log("Dispatch Advice list=", this.DaIdList)
      }
      
    });
   }

   onSubmit()
{
  const dialogRef = this.dialog.open(OpenRiskLedgerAddPage, {
    height: '500px',
    width: '1000px',
    maxWidth:'100%',
  });
  dialogRef.afterClosed().subscribe(result => {
    this.RiskLedgerList();
  });
}

 RiskLedgerList(){
  let url = "logistics_risk_ledger/";
  this.api.getData(url).then((response: any) => {
    this.riskLedgerList=response;
    this.dtTrigger.next(void 0);
    },(error)=>{
        console.log("error");
})
}

 delete(id)
 {
  this.api.deleteUser(id,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      console.log(data);
      this.RiskLedgerList();
     })
 }

 back()
 {
  this.EditForm = false;
  this.MainForm=true;
 }

 update(val)
{
  console.log("edit value=", val)
    this.MainForm=false;
    this.EditForm=true;
    this.risk_ledger_id = val.risk_ledger_id
    this.form.patchValue({
    da_id:val.da_id,
    remarks:val.remarks,
    probale_risk_Id:val.probale_risk_id,
      type_of_risk_Id:val.type_of_risk_id,
      severity_of_risk_Id:val.severity_of_risk_id,
      risk_status_Id:val.risk_status_id,
      detailed_description_risk:val.detailed_description_risk,
      impact:val.impact,
      countermeasure_mitigation_plan:val.countermeasure_mitigation_plan,
      contigency_plan_value:val.contigency_plan_value,
      job_code:val.job_code,
      job_name:val.job_name
    })
}

   onSubmitPost(){
    if (this.form.invalid) {
        alert("Please enter valid details");
        return;
      }
      let bearer = this.storage.getBearerToken();
      let headers = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer'+' '+bearer
        })
      };
      // this.form.value.job_code=this.form.value.job_code
      // this.form.value.job_name=this.form.value.job_name
      // this.form.value.so_no=this.form.value.so_no
      this.form.value.da_id=this.form.value.da_id
      //this.form.value.enroute_hold_up_issues_remarks = this.form.value.enroute_hold_up_issues_remarks
      //this.form.value.no_supply_of_packing_material_remarks=this.form.value.no_supply_of_packing_material_remarks
      //this.form.value.statutory_regulations_remarks=this.form.value.statutory_regulations_remarks
      this.form.value.remarks=this.form.value.remarks

      this.form.value.probale_risk_id=this.form.value.probale_risk_Id
      this.form.value.type_of_risk_id=this.form.value.type_of_risk_Id
      this.form.value.severity_of_risk_id=this.form.value.severity_of_risk_Id
      this.form.value.risk_status_id=this.form.value.risk_status_Id
      this.form.value.detailed_description_risk=this.form.value.detailed_description_risk
      this.form.value.impact=this.form.value.impact
      this.form.value.countermeasure_mitigation_plan=this.form.value.countermeasure_mitigation_plan
      this.form.value.contigency_plan_value=this.form.value.contigency_plan_value
        let obj={...this.form.value};
        console.log("obj",obj)

        // this.api.postData("logistics_risk_ledger/",obj).then((response:any)=>{
      this.api.updateData(this.url+this.risk_ledger_id+"/",obj).then((response:any)=>{
            this.form.reset();
            this.toast.success("Record Updated Successfully")
            this.MainForm = true;
            this.EditForm=false
            this.RiskLedgerList();
              console.log("responce",response)
        },(error)=>{
            //console.log("error" ,error );
        })
      }
}


@Component({
  selector: 'open-dialog-panel',
  templateUrl: 'risk-ledger-add.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 89%;
      max-width:100% !important; 
    }

    mat-dialog-content {
      flex-grow: 1;
    }
    mat-dialog-container{
      background-color:#62b8f56e !important;
    }
  `]
})
export class OpenRiskLedgerAddPage {

  public action='';
  public daRemarksId:any="";
  editForm:boolean=false;
  mainForm:boolean=true;
  DaIdList:any='';
  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public form:UntypedFormGroup;

  public typeofriskList:any;
  public severityriskList:any;
  public probaleList:any;
  public riskStatusList:any;
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private toaster:ToastrService,
    public storage:StorageServiceService ,
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public api: ApiserviceService,
    private http: HttpClient,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<OpenRiskLedgerAddPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
    {
    }

    ngOnInit(): void {
      this.form = this.fb.group({
        job_code:new UntypedFormControl(),
        job_name:new UntypedFormControl(), 
        so_no:new UntypedFormControl(),
        remarks:new UntypedFormControl(),
        enroute_hold_up_issues_remarks:new UntypedFormControl(),
        no_supply_of_packing_material_remarks:new UntypedFormControl(),
        statutory_regulations_remarks:new UntypedFormControl(),
        probale_risk_Id:new UntypedFormControl(),
        type_of_risk_Id:new UntypedFormControl(),
        severity_of_risk_Id:new UntypedFormControl(),
        risk_status_Id:new UntypedFormControl(),
        detailed_description_risk:new UntypedFormControl(),
        impact:new UntypedFormControl(),
        countermeasure_mitigation_plan:new UntypedFormControl(),
        contigency_plan_value:new UntypedFormControl(),
        fromDate:new UntypedFormControl(),
          toDate:new UntypedFormControl(),
        da_id:new UntypedFormControl(),

    })
    this.dispatchAdviceList();
    this.RiskStatusList();
    this.SeverityOfRiskList();
    this.ProbaleRiskList();
    this.TypeOfRiskList();
  
    this.dtOptions = {
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
    }

    ClearDARange()
   {
    this.form.reset();
    this.dispatchAdviceList();
   }

   getDispatchAdviceListOnDate()
   {
    let url = "logistics_dispatch_advice/dispatch_advice_reports_list_between_given_da_date/";
    let data={
      "start_date":this.datepipe.transform(this.form.value.fromDate, 'yyyy-MM-dd'),
      "end_date":this.datepipe.transform(this.form.value.toDate, 'yyyy-MM-dd')
      }
    this.api.postData(url,data).then((res: any) => {
      if(res.length == 0)
      {
        this.toast.error("No DA Was Submitted With The Given Dates")
      }
      else
      {
        this.DaIdList = res;
        this.toast.success("DA Number Found!!")
        console.log("Dispatch Advice list=", this.DaIdList)
      }
    });
   }

  
  
dispatchAdviceList(){
    let url = "logistics_dispatch_advice/dispatch_advice_reports_list/";
     this.api.getData(url).then((res: any) => {
       this.DaIdList = res;
       console.log("Dispatch Advice list=", this.DaIdList)
     });
   }

   RiskStatusList(){
    let url = "logistics_risk_status/";
     this.api.getData(url).then((res: any) => {
       this.riskStatusList = res;
       console.log("Risk Status list=", this.riskStatusList)
     });
   }

   SeverityOfRiskList(){
    let url = "logistics_severity_of_risk/";
     this.api.getData(url).then((res: any) => {
       this.severityriskList = res;
       console.log("Severity Of Risk list=", this.severityriskList)
     });
   }

   ProbaleRiskList(){
    let url = "logistics_probale_risk/";
     this.api.getData(url).then((res: any) => {
       this.probaleList = res;
       console.log("Probale Risk list=", this.probaleList)
     });
   }

   TypeOfRiskList(){
    let url = "logistics_type_of_risk/";
     this.api.getData(url).then((res: any) => {
       this.typeofriskList = res;
       console.log("Type Of Risk list=", this.typeofriskList)
     });
   }

   onSubmitPost(){
    if (this.form.invalid) {
        alert("Please enter valid details");
        return;
      }
      let bearer = this.storage.getBearerToken();
      let headers = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer'+' '+bearer
        })
      };
      // this.form.value.job_code=this.form.value.job_code
      // this.form.value.job_name=this.form.value.job_name
      // this.form.value.so_no=this.form.value.so_no
      this.form.value.da_id=this.form.value.da_id
      //this.form.value.enroute_hold_up_issues_remarks = this.form.value.enroute_hold_up_issues_remarks
      //this.form.value.no_supply_of_packing_material_remarks=this.form.value.no_supply_of_packing_material_remarks
      //this.form.value.statutory_regulations_remarks=this.form.value.statutory_regulations_remarks
      this.form.value.remarks=this.form.value.remarks

      this.form.value.probale_risk_id=this.form.value.probale_risk_Id
      this.form.value.type_of_risk_id=this.form.value.type_of_risk_Id
      this.form.value.severity_of_risk_id=this.form.value.severity_of_risk_Id
      this.form.value.risk_status_id=this.form.value.risk_status_Id
      this.form.value.detailed_description_risk=this.form.value.detailed_description_risk
      this.form.value.impact=this.form.value.impact
      this.form.value.countermeasure_mitigation_plan=this.form.value.countermeasure_mitigation_plan
      this.form.value.contigency_plan_value=this.form.value.contigency_plan_value
        let obj={...this.form.value};
        console.log("obj",obj)

        this.api.postData("logistics_risk_ledger/",obj).then((response:any)=>{
              this.form.reset();
              this.dialogClose();
              console.log("responce",response)
        },(error)=>{
            console.log("error");
        })
      }

    dialogClose(){
      this.dialogRef.close();
    }
  }
