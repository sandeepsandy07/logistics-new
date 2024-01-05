import { Component, OnInit , OnDestroy ,ViewChild, Inject, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, FormGroupDirective, NgForm, Validators, FormArray,UntypedFormBuilder } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';
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
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-transporter-provider-cost-verification',
  templateUrl: './transporter-provider-cost-verification.component.html',
  styleUrls: ['./transporter-provider-cost-verification.component.css']
})
export class TransporterProviderCostVerificationComponent implements OnInit{
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;

  // dtInstance: Promise<DataTables.Api>;
  // dtElement: DataTableDirective;

  public verify_tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public showfilter: boolean = false;

  public approved_tablelist:any;
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();

  public hold_tablelist:any;
  dtOptions3: DataTables.Settings = {};
  dtTrigger3: Subject<any> = new Subject<any>();

  public unmatched_record_tablelist:any;
  dtOptions4: DataTables.Settings = {};
  dtTrigger4: Subject<any> = new Subject<any>();

  public form:UntypedFormGroup;

  public uploader: FileUploader = new FileUploader({});
  url2 = environment.apiUrl;
  uploadForm: UntypedFormGroup;
  public onupload_button: boolean = true;
  public mainForm:boolean=false;


  constructor(
    public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    public toast:ToastrService,
    private http: HttpClient)
     {
      this.form = this.fb.group({
        startDate: new UntypedFormControl(),
        endDate: new UntypedFormControl(),
      })
     }

  ngOnInit(): void {

    this.getTransporterProviderFreightDetails();

    this.dtOptions = {
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
    this.dtOptions3 = {
      retrieve: true,
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };
    this.dtOptions4 = {
      dom: 'Bfrtip',
      retrieve: true,
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger2.unsubscribe();
    this.dtTrigger.unsubscribe();
    this.dtTrigger3.unsubscribe();
    this.dtTrigger4.unsubscribe();
  }
  rerender(): void {
   
  }

  hideloader() {
    document.getElementById('loading') .style.display = 'none';       
    }

  download_vendor_freight_upload_format()
  {
    let url = "vehicle_billing_details/download_vendor_freight_upload_format/"
    this.api.download(url).subscribe((response)=>{
      let blob = new Blob([response], {type: response.type})
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vendor_freight_upload_format');
      link.click();
    })
  }

  onChange(event: MatTabChangeEvent) {
    const tab = event.tab.textLabel;
    console.log(tab);
    if(tab==="Transporter Provider Freight Amount List To Verify")
     {
      this.getTransporterProviderFreightDetails();
     }
     if(tab==="Approved List")
     {
      this.getTransporterProviderFreightApprovedStatusRecords();
     }
     if(tab==="List On Hold Status")
     {
      this.getTransporterProviderFreightHoldStatusRecords();
     }
     if(tab==="Unmatched Records")
     {
      this.getUnmatchedLRNNoList();
     }
  }

  getTransporterProviderFreightDetails(){
    this.api.getData("vehicle_billing_details/getVerifyStatusTransportationRecords/").then((response)=>{
      if (Response) {
        this.hideloader();
      }
      this.dtTrigger.next(void 0); 
      this.verify_tablelist=response;
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger2.next(void 0); 
          //location.reload(); 
          // this.getTransporterProviderFreightDetails()
          // this.getTransporterProviderFreightHoldStatusRecords();
          // this.getUnmatchedLRNNoList();
          this.dtTrigger.next(void 0);  
          this.dtTrigger3.next(void 0);  
          this.dtTrigger4.next(void 0);  
        });
      });
      console.log(this.verify_tablelist);
      console.log("table values =", this.verify_tablelist)
        
    },(error)=>{
        console.log("error");
    })
  }

  getTransporterProviderFreightHoldStatusRecords(){
    this.api.getData("vehicle_billing_details/getHoldStatusTransportationRecords/").then((response)=>{
      //this.dtTrigger3.next(void 0);
      this.hold_tablelist=response;
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger3.next(void 0); 
          //location.reload(); 
          // this.getTransporterProviderFreightDetails()
          // this.getTransporterProviderFreightHoldStatusRecords();
          // this.getUnmatchedLRNNoList();
          this.dtTrigger.next(void 0);  
          this.dtTrigger2.next(void 0);  
          this.dtTrigger4.next(void 0);  
        });
      });
      console.log("table values =", this.hold_tablelist)
    },(error)=>{
        console.log("error");
    })
  }

  getTransporterProviderFreightApprovedStatusRecords(){
    this.api.getData("vehicle_billing_details/getApprovedStatusTransportationRecords/").then((response)=>{  
      this.approved_tablelist = response;
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger2.next(void 0); 
          //location.reload(); 
          // this.getTransporterProviderFreightDetails()
          // this.getTransporterProviderFreightHoldStatusRecords();
          // this.getUnmatchedLRNNoList();
          this.dtTrigger.next(void 0);  
          this.dtTrigger3.next(void 0);  
          this.dtTrigger4.next(void 0);  
        });
      });
    }, (error) => {
      console.log("error");
    })
  }

  getUnmatchedLRNNoList(){
    this.api.getData("vehicle_billing_details/getErrorListofTransportCostReport/").then((response)=>{
      //this.dtTrigger4.next(void 0);  
      this.unmatched_record_tablelist=response;
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger2.next(void 0); 
          //location.reload(); 
          // this.getTransporterProviderFreightDetails()
          // this.getTransporterProviderFreightHoldStatusRecords();
          // this.getUnmatchedLRNNoList();
          this.dtTrigger.next(void 0);  
          this.dtTrigger3.next(void 0);  
          this.dtTrigger4.next(void 0);  
        });
      });
      
      console.log("table values =", this.unmatched_record_tablelist)
       
    },(error)=>{
        console.log("error");
    })
  }

  onSubmit()
{
  const dialogRef = this.dialog.open(OpenTransporterProviderFreightUploadPage, {
    height: '200px',
    width: '600px',
    maxWidth:'100%',
  });
  dialogRef.afterClosed().subscribe(result => {
    location.reload();
  });
}

  FilterDataOnDate()
  {
       let data={
        startDate:'',
        endDate:'',
       }
       if (this.form.value.startDate != null && this.form.value.endDate != null ) {
        data.startDate = this.datepipe.transform(this.form.value.startDate, 'yyyy-MM-dd');
        data.endDate = this.datepipe.transform(this.form.value.endDate, 'yyyy-MM-dd');
      }
       console.log("values of Dates",data)
       this.api.postData("vehicle_billing_details/getApprovedListBasedOnDateRange/",data).then((response:any)=>{
        this.approved_tablelist = response;
        this.datatableElement.forEach((dtElement: DataTableDirective) => {
          dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
            dtInstance.destroy();
            this.dtTrigger2.next(void 0);
            this.dtTrigger.next(void 0);  
            this.dtTrigger3.next(void 0);  
            this.dtTrigger4.next(void 0);  
          });
        });
      }, (error) => {
        console.log("error");
      })
  }

  clearDataOnDate()
  {
    this.form.reset();
   this.getTransporterProviderFreightApprovedStatusRecords();
  }

onSubmitTransporterFreight(element:any)
{
  const dialogRef = this.dialog.open(OpenFreightVerify, {
    height: '500px',
    width: '950px',
    maxWidth:'100%',
    data: {
      element:element
    }
  });
  dialogRef.afterClosed().subscribe(result => {
    location.reload();
  });
}

exportApprovedDataToExcelFormat()
{
  if(this.approved_tablelist.length == 0){
    this.toast.error("Sorry!!! No Data");
    }
    else
    {
  let data={
    'data': this.approved_tablelist
  }

  console.log("values of Dates",data)
 this.api.postData("vehicle_billing_details/exportFreightDataToExcelFile/",data).then((response:any)=>{
 this.toast.success('success')
 this.fileDownload();
 });
}
}

exportHoldDataToExcelFormat()
{
  if(this.hold_tablelist.length == 0){
    this.toast.error("Sorry!!! No Data");
    }
    else
    {
  let data={
    'data': this.hold_tablelist
  }

  console.log("values of Dates",data)
 this.api.postData("vehicle_billing_details/exportFreightDataToExcelFile/",data).then((response:any)=>{
 this.toast.success('success')
 this.fileDownload();
 });
}
}

exportVerifyDataToExcelFormat()
{
  if(this.verify_tablelist.length == 0){
    this.toast.error("Sorry!!! No Data");
    }
    else
    {
  let data={
    'data': this.verify_tablelist
  }

  console.log("values of Dates",data)
 this.api.postData("vehicle_billing_details/exportFreightDataToExcelFile/",data).then((response:any)=>{
 this.toast.success('success')
 this.fileDownload();
 });
}
}

fileDownload(){
  let url = "vehicle_billing_details/download_report/"
  this.api.download(url).subscribe((response)=>{
    let blob = new Blob([response], {type: response.type})
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'vendor_freight_template');
    link.click();
  })
}

delete(val:any)
{
  console.log(val);
  this.api.deleteUser(val,"vehicle_billing_details/").subscribe((response:any) =>
   {
    this.toast.success("Deleted");
    console.log(response);
    this.unmatched_record_tablelist=response;
    this.dtTrigger4.next(void 0);   
    location.reload();
    },(error)=>{
        console.log("error");
    })
}

moveToNotLogistics(val:any)
{
  console.log(val);
  let data={
    id:val
  }
    let url = "vehicle_billing_details/moveRecordToNotLogistics/";
    this.api.postData(url,data).then(res => {
      console.log(res)
    this.unmatched_record_tablelist=res;
      this.toast.success("Record Moved Successfully!");   
    this.dtTrigger4.next(void 0);   
    location.reload();
    },(error)=>{
        console.log("error");
    })
}

}


@Component({
  selector: 'open-dialog-panel',
  templateUrl: 'upload-transporter-provider-freight-values.html'
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
export class OpenTransporterProviderFreightUploadPage {

  truck_list_id:any="";
  truckList:any="";
  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  viewBtn: any = "upload";
  public onupload_button: boolean = true;
  returnVal:any="";

  uploadForm: UntypedFormGroup;
  
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private toaster:ToastrService,
    public storage:StorageServiceService ,
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<OpenTransporterProviderFreightUploadPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
    {
      this.uploadForm = this.formBuilder.group({
        transporter_freight_data_file: new UntypedFormControl("", Validators.required),});
    }

    OnFileSelect(event, name) {
      let file = event.target.files[0];
      this.uploadForm.get(name).setValue(file);
    }

    showloader() {
      document.getElementById('loadingform').style.display = 'block';       
      }

      hideloader() {
        document.getElementById('loadingform').style.display = 'none';       
        }

    fileUpload() {
      let bearer = this.storage.getBearerToken();
      let headers = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer' + ' ' + bearer
        })
      };
      debugger
      const formData: FormData = new FormData();
      if (this.uploadForm.status == "INVALID") {
        this.toaster.error("Please upload file")
      }
      else {
        this.showloader();
      this.onupload_button=false;
        formData.append("transporter_freight_data_file", this.uploadForm.get("transporter_freight_data_file").value);
        this.http.post<any>(this.url + "vehicle_billing_details_report/", formData, headers).subscribe(
          (res: any) => {
            if(res.length == 0)
            {
              this.toaster.success("Transporter Provider Freight Amount Data Uploaded successfully");
              this.onupload_button = true;
              this.hideloader();
            }
            else
            {
              debugger
              this.returnVal = res;
              this.toaster.error(this.returnVal);
              this.toaster.error("Some Error in the template please check and upload again")
              this.hideloader()
            }
          });
      }
    }

    dialogClose(){
      this.dialogRef.close();
    }
  }

@Component({
  selector: 'open-checked-out-dialog',
  templateUrl: 'verify-freight-value.html',
   styles: [`
    :host {
      width:'60%'
     
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class OpenFreightVerify {
  public uploadForm: UntypedFormGroup;

  constructor(
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<OpenFreightVerify>,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    public toast:ToastrService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any)
    {
      this.uploadForm = this.fb.group({
          remarks:new UntypedFormControl(),
          challan_number:new UntypedFormControl(),
          inv_no:new UntypedFormControl(),
          reductionAmount:new UntypedFormControl(),
          status:new UntypedFormControl(),  
          bill_type:new UntypedFormControl(),      
      })
    }
  
  closeCheckOutDialog(){
    this.dialogRef.close();
  }

  onStatusTypeSelected(statusval)
    {
      this.uploadForm.value.status = statusval
      console.log("Selected Status type=", this.uploadForm.value.status)
    }

    onBillTypeSelected(billtype)
    {
      this.uploadForm.value.bill_type = billtype
      console.log("Selected Bill type=",this.uploadForm.value.bill_type)
    }

    updateTransportationProviderFinalFreight()
    {
      let data={
        "status":this.uploadForm.value.status,
        "bill_type":this.uploadForm.value.bill_type,
        "reduction_amount": this.uploadForm.value.reductionAmount == ''?null:this.uploadForm.value.reductionAmount,
        "remarks": this.uploadForm.value.remarks == ''?null:this.uploadForm.value.remarks,
        "challan_number":this.data.element.challan_number==''?null:this.data.element.challan_number,
        "inv_no":this.data.element.inv_no==''?null:this.data.element.inv_no,
        "id":this.data.element.id==''?0:this.data.element.id
      }
      this.api.postData("vehicle_billing_details/update_transporter_freight_status_value/",data).then((response:any)=>{
        if (response == true)
        {
          this.toast.success("Record Updated successfully!")
          this.dialogRef.close();
        }
        else
        {
          this.toast.error("Update Failed!")
          this.dialogRef.close();
        }

      })
  }
}





