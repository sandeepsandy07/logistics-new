import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, FormGroupDirective, NgForm, Validators, UntypedFormArray,UntypedFormBuilder } from '@angular/forms';

import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';
import { Subject } from 'rxjs';
import {ErrorStateMatcher} from '@angular/material/core';



import { HttpClient, HttpHeaders } from "@angular/common/http";


import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { I } from '@angular/cdk/keycodes';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-work-flow-type',
  templateUrl: './work-flow-type.component.html',
  styleUrls: ['./work-flow-type.component.css']
})

export class WorkFlowTypeComponent implements OnInit {

  public form:UntypedFormGroup;
  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public viewRecords:any;
  matcher = new MyErrorStateMatcher();
  list: any;
  level_count:any=1;
  success:boolean=false;
  userList:any;
  isListView: boolean = true;

  expandbtn: boolean = true;

  displayedColumns = ['slno.', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();

  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  uploadForm: UntypedFormGroup;ssssss

  

  constructor(
    private fb: UntypedFormBuilder,
    private http: HttpClient,
    public api: ApiserviceService,
    public toast:ToastrService, 
    public dialog: MatDialog,
    public storage: StorageServiceService,
    private toastr: ToastrService,
    private router: Router
    ) { 
      this.form = this.fb.group({
        wf_id: new UntypedFormControl(null),
        wf_name: new UntypedFormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        slug_name: new UntypedFormControl(null, { validators: [Validators.required] }),
        flow_details: this.fb.array([]),

      });


    }

    contactDetails() : UntypedFormArray {  
      return this.form.get("flow_details") as UntypedFormArray  
    }
    newContactdetails(parallelvalue): UntypedFormGroup {  
      return this.fb.group({  
        approver:'',  
        level:this.level_count,  
        parallel: parallelvalue, 
        stage: 0,  
        emp_id: '', 
        notify_emp_id: '', 
       
      })  
    }  
    addContactdetails(i:number) {  
     
     if(this.form.value.flow_details[i].stage >= 2 && this.form.value.flow_details[i].parallel == true ){
      let a=this.form.value.flow_details[i].stage ; 
      for(let i=2;i<=a;i++){
        this.contactDetails().push(this.newContactdetails(true));
       }
     }else{
      this.level_count+=1;
      this.contactDetails().push(this.newContactdetails(false));  
     }   
    } 
    addContactdetailsfirst() {        
      this.contactDetails().push(this.newContactdetails(false));  
    } 
    removeContactdetails(i:number) {  
      this.level_count-=1;
      this.contactDetails().removeAt(i);  
    } 

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    }; 
    this.getlist();    
  }
  get f() { return this.form.controls; }
  getalldropdowns(){
    this.api.getData("user_list/").then((response: any)=>{
      this.userList=response.data;
  
      });
    
  }
  check_for_name(event: any) {

    let enter_text = event.target.value;
    if(this.tablelist.find(e => e.wf_name == enter_text)){
        this.toastr.error("this name already given");
        event.target.value='';
    }
  }
  editworkflowdetails(approver,level,parallelvalue,emp_id,notify_emp_id): UntypedFormGroup { 
    return this.fb.group({  
      approver:approver,
      level:level,  
      parallel: parallelvalue, 
      stage: 0,  
      emp_id: [emp_id], 
      notify_emp_id: [notify_emp_id], 
     
    })  
  }  
  onEditMode(id){
    let data={
      wf_id:id
    }

    this.api.postData("work_flow_type/workflow_retrieve/",data).then((response:any)=>{

      this.form.patchValue({
        wf_id:response[0].wf_id,
        wf_name:response[0].wf_name,
        slug_name:response[0].slug_name
      }) 
      for(let i=0;i < response[0].wfc.length;i++){
       
        this.contactDetails().push(this.editworkflowdetails(response[0].wfc[i].approver,response[0].wfc[i].level,
                                                           response[0].wfc[i].parallel,response[0].wfc[i].wfe[0].emp_id,
                                                           response[0].wfc[i].wfe[0].notify_emp_id));

      }
      this.getalldropdowns();
      
      this.success=true;    
    },(error)=>{
        console.log("error");
    })
  

  }
  getlist(){
    this.api.getData("work_flow_type/").then((response)=>{
      this.tablelist=response;
      this.dtTrigger.next(void 0); 
    },(error)=>{
        console.log("error");
    })   
  }
  createWorkFlow(){
    this.success=true;
    this.addContactdetailsfirst();
    this.getalldropdowns();
  }
  onSubmitPost(){
    console.log("form",this.form.value);
    let obj={...this.form.value};
    this.api.postData("work_flow_type/",obj).then((response:any)=>{
        this.form.reset();
        this.getlist();
        this.success=false;    
    },(error)=>{
        console.log("error");
    })
    }
  
}

