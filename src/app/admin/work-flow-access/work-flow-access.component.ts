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
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-work-flow-access',
  templateUrl: './work-flow-access.component.html',
  styleUrls: ['./work-flow-access.component.css']
})
export class WorkFlowAccessComponent implements OnInit {
  
  public form:UntypedFormGroup;
  public userList_loading:any;
  public tablelist:any;
  public edit:any;
  public userList_verifier:any;
  public access_id:any;
  public subdeptlist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public viewRecords:any;
  matcher = new MyErrorStateMatcher();
  list: any;
  level_count:any=0;
  success:boolean=false;
  userList:any;
  workflowList:any
  isListView: boolean = true;

  expandbtn: boolean = true;

  displayedColumns = ['slno.', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();

  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  uploadForm: UntypedFormGroup;ssssss

  

  constructor(
    public fb: UntypedFormBuilder,
    private http: HttpClient,
    public api: ApiserviceService,
    public toast:ToastrService, 
    public dialog: MatDialog,
    public storage: StorageServiceService,
    private toastr: ToastrService,
    private router: Router
    ) { 
      this.form = this.fb.group({
        wf_id: new UntypedFormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        wfa_id: new UntypedFormControl(null),
        dept_code: new UntypedFormControl(null, { validators: [Validators.required] }),
        bill_type: new UntypedFormControl(null, { validators: [Validators.required] }),
        data :this.fb.array([]),
        da_view_employee: new UntypedFormControl(null),
        loading_employee: new UntypedFormControl(null),
        packing_approver: new UntypedFormControl(null),
        panel_verifer: new UntypedFormControl(null),
        
        
      

      });


    }  

  ngOnInit(): void {

    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };
    
    this.getlist();
    this.getdept_list();
    
    
  }
  get f() { return this.form.controls; }
  getalldropdowns(){
    this.api.getData("work_flow_type/").then((response)=>{
      this.workflowList=response;      
    },(error)=>{
        console.log("error");
    })   
    this.api.getData("user_list/").then((response: any)=>{
      this.userList=response.data;
      this.userList_loading=response.data.filter(row => row.sub_dept_id == 5);
      this.userList_verifier=response.data.filter(row => row.sub_dept_id == 18);
      console.log(this.userList_loading);
  
      });
  }

  check_flow(){
    

  }
  
  getlist(){
    this.api.getData("work_flow_access/").then((response)=>{
      this.tablelist=response;
      this.dtTrigger.next(void 0); 
    },(error)=>{
        console.log("error");
    })   
  }
  createWorkFlow(){
    this.success=true;
    this.getalldropdowns();
  }
  accessories(): UntypedFormArray {
    return this.form.get("data") as UntypedFormArray
  }
  newaccessories(): UntypedFormGroup {
    return this.fb.group({
      type: '',
      emp_ids: new UntypedFormArray([]) ,
      
    })
  }
  addaccessories() {
    this.accessories().push(this.newaccessories());
  }
  onSubmitPost(){

    if(!this.edit){
      this.addaccessories();
      this.addaccessories();
      this.addaccessories();
      this.addaccessories();
      this.form.value.data[2].type='packing_approver';
      this.form.value.data[2].emp_ids=this.form.value.packing_approver;
      this.form.value.data[3].type='panel_verifer';
      this.form.value.data[3].emp_ids=this.form.value.panel_verifer;
      this.form.value.data[1].type='loading_employee';
      this.form.value.data[1].emp_ids=this.form.value.loading_employee;
      this.form.value.data[0].type='da_view_employee';
      this.form.value.data[0].emp_ids=this.form.value.da_view_employee;    
      
      
    let obj={...this.form.value};
    this.api.postData("work_flow_access/",obj).then((response:any)=>{
        this.form.reset();
        this.getlist();
        this.success=false;    
    },(error)=>{
        console.log("error");
    })

    }else{
      this.addaccessories();
      this.addaccessories();
      this.addaccessories();
      this.addaccessories();
      this.form.value.data[2].type='packing_approver';
      this.form.value.data[2].emp_ids=this.form.value.packing_approver;
      this.form.value.data[3].type='panel_verifer';
      this.form.value.data[3].emp_ids=this.form.value.panel_verifer;
      this.form.value.data[1].type='loading_employee';
      this.form.value.data[1].emp_ids=this.form.value.loading_employee;
      this.form.value.data[0].type='da_view_employee';
      this.form.value.data[0].emp_ids=this.form.value.da_view_employee;
      let obj={...this.form.value};
      this.api.updateData("work_flow_access/"+this.access_id+"/",obj).then((response:any)=>{
      this.form.reset();
      this.getlist();
      this.success=false;  
     
     },(error)=>{
         console.log("error");
     })


    }
    
    }
    getdept_list(){

      this.api.getData("user_sub_dept_list/").then((response)=>{
        this.subdeptlist=response;        
      },(error)=>{
          console.log("error");
      })
    }
    
    onEditMode(element:any)
  {
    this.getalldropdowns();
    this.success=true;
    this.access_id=element;
    if(element){     
      this.api.viewuser("work_flow_access/",element).then((data:any) => {
        this.edit=true;     
        this.viewRecords = data.records;
        console.log( this.viewRecords);
        let da_view_employee_s,loading_employee_s,packing_approver_s,panel_verifer_s;
        for(let i=0;i<this.viewRecords.dept_emp.length;i++){
            if(this.viewRecords.dept_emp[i].type == 'packing_approver'){
              packing_approver_s=this.viewRecords.dept_emp[i].emp_id?this.viewRecords.dept_emp[i].emp_id:null;

            }else if(this.viewRecords.dept_emp[i].type == 'loading_employee'){
              loading_employee_s=this.viewRecords.dept_emp[i].emp_id?this.viewRecords.dept_emp[i].emp_id:null;

            }else if(this.viewRecords.dept_emp[i].type == 'da_view_employee'){
              panel_verifer_s=this.viewRecords.dept_emp[i].emp_id?this.viewRecords.dept_emp[i].emp_id:null;

            }else if(this.viewRecords.dept_emp[i].type == 'panel_verifer'){
              da_view_employee_s=this.viewRecords.dept_emp[i].emp_id?this.viewRecords.dept_emp[i].emp_id:null;
            }

        }
        this.form.patchValue({
          wf_id: this.viewRecords['wf_id']?this.viewRecords['wf_id']:null,
          wfa_id: this.viewRecords['wfa_id']?this.viewRecords['wfa_id']:null,
          dept_code: Number(this.viewRecords['dept_code']?this.viewRecords['dept_code']:null),
          bill_type: this.viewRecords['bill_type']?this.viewRecords['bill_type']:null,

          da_view_employee:da_view_employee_s,
          
          loading_employee: loading_employee_s,
        
          packing_approver: packing_approver_s,
          panel_verifer: panel_verifer_s,
         
          
        });
      console.log( this.form.value);

      })  
    }
  }          
  
}
