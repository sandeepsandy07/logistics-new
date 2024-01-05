import { Component, OnInit ,OnDestroy ,ViewChild, Inject} from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, FormGroupDirective, NgForm, Validators, FormArray,UntypedFormBuilder } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute ,Params} from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';;
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
  selector: 'app-da-remarks',
  templateUrl: './da-remarks.component.html',
  styleUrls: ['./da-remarks.component.css']
})
export class DaRemarksComponent implements OnInit {
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  public action='';
  public daRemarksId:any="";
  editForm:boolean=false;
  mainForm:boolean=true;
  DaIdList:any='';
  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public form:UntypedFormGroup;

  dtInstance: Promise<DataTables.Api>;
  dtElement: DataTableDirective;
  
  constructor(public api: ApiserviceService,
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
        da_id:new UntypedFormControl(),
        remarks:new UntypedFormControl(), 
        date:new UntypedFormControl(),
    })
    }

    ngOnInit(): void {
      
      this.getDARemarksList();
      this.dispatchAdviceList();
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

   deleteDaRemarksRecord(id)
   {
     console.log(id);
     this.api.deleteUser(id,"logistics_da_remarks/").subscribe((data:any) =>
      {
       this.toast.success("Deleted");
       console.log(data);
       this.getDARemarksList();
      })
   }

   back()
  {
    this.editForm = false;
    this.mainForm = true;
  }

  editDaRemarksRecord(record)
  {
    this.mainForm = false;
    this.editForm = true;
    this.daRemarksId = record.da_remarks_id
    console.log("Edit Record=", record)
    this.form.patchValue({
    da_id:record.da_id,
    date:record.date,
    remarks:record.remarks
})
}
  
  UpdateEditDaRemarksRecord()
  {
    if (this.form.invalid) {
      alert("Please Enter Valid Details");
      return;
    }
    let bearer = this.storage.getBearerToken();
    let headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer'+' '+bearer
      })
    };
      this.form.value.da_id=this.form.value.da_id;
      // this.form.value.da_no=1;
      this.form.value.date=this.datepipe.transform(this.form.value.date, 'dd-MM-yyyy')
      this.form.value.remarks=this.form.value.remarks

      let obj={...this.form.value};
      console.log("obj",obj)

      let url = "logistics_da_remarks/"+this.daRemarksId+"/";
      this.api.updateData(url,obj).then(res => {
        this.getDARemarksList();
        this.editForm = false;
        this.mainForm = true;
            this.form.reset();
            console.log("responce",res)
      },(error)=>{
          console.log("error");
      })
}
 
  onSubmit()
{
  const dialogRef = this.dialog.open(OpenCreateDaRemarks, {
    height: '300px',
    width: '80%',
    maxWidth:'100%',
  });
  dialogRef.afterClosed().subscribe(result => {
    this.getDARemarksList();
  });
}



}

@Component({
  selector: 'open-dialog-panel',
  templateUrl: 'create-da-remarks.html'
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
export class OpenCreateDaRemarks {


  uploadForm: UntypedFormGroup;
  public form:UntypedFormGroup;
  date: any = '';
  DaIdList:any='';
  public action='Create';
  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
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
    public dialogRef: MatDialogRef<OpenCreateDaRemarks>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
    {
      this.dispatchAdviceList()
      this.form = this.fb.group({
        da_id:new UntypedFormControl(),
          remarks:new UntypedFormControl(), 
          date:new UntypedFormControl(),
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
        if(this.action=='Create'){
          this.form.value.da_id=this.form.value.da_id;
          this.form.value.date=this.datepipe.transform(this.form.value.date, 'dd-MM-yyyy')
          this.form.value.remarks=this.form.value.remarks

          let obj={...this.form.value};
          console.log("obj",obj)

          this.api.postData("logistics_da_remarks/",obj).then((response:any)=>{
                this.form.reset();
                console.log("responce",response)
                this.dialogClose();
          },(error)=>{
              console.log("error");
          })
        }
    }

    dispatchAdviceList(){
     let url = "logistics_dispatch_advice/dispatch_advice_reports_list/";
      this.api.getData(url).then((res: any) => {
        this.DaIdList = res;
        console.log("Dispatch Advice list=", this.DaIdList)
      });
    }

    dialogClose(){
      this.dialogRef.close();
    }
  }

