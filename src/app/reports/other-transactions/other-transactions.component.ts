import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';
import { Subject } from 'rxjs';
import { ActivatedRoute ,Params} from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
  FormArray,
   
} from "@angular/forms";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-other-transactions',
  templateUrl: './other-transactions.component.html',
  styleUrls: ['./other-transactions.component.css']
})
export class OtherTransactionsComponent implements OnInit {

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    public dialog: MatDialog,
    private fb:UntypedFormBuilder) { }

  ngOnInit(): void {

    this.dtOptions = {
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true,
      retrieve: true,
    };

    this.getOtherTransactionRecords();
  }

  getOtherTransactionRecords()
  {
    this.api.getData("logistics_other_transactions/").then((response)=>{
      this.tablelist=response;
      this.dtTrigger.next(void 0);
      console.log("Other Transaction list value=", this.tablelist)
    },(error)=>{
      console.log("error");
    })
  }

  UserInputWindow(id)
  {
    const dialogRef = this.dialog.open(OpenUserInputScreen, {
      height: '400px',
      width: '1000px',
      maxWidth:'100%',
      data: {
        id:id
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getOtherTransactionRecords();
    });
  }

  generateDispatchDetailsPdf(id)
  {
    let url = "logistics_other_transactions/dispatch_details_pdf/"
  let data = {
    id : id
  }
  this.api.downloadPDF(url, data).then((data) => {
    var downloadURL = window.URL.createObjectURL(data);
    let tab = window.open();
    tab.location.href = downloadURL;
  });

  }

  onSubmit()
{
  const dialogRef = this.dialog.open(OpenSAPDATAFileUploadWindow, {
    height: '200px',
    width: '600px',
    maxWidth:'100%',
  });
  dialogRef.afterClosed().subscribe(result => {
    this.getOtherTransactionRecords();
  });
}
  
}

@Component({
  selector: 'upload-sap-data',
  templateUrl: 'upload-sap-data.html'
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
export class OpenSAPDATAFileUploadWindow {

  truck_list_id:any="";
  truckList:any="";
  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  viewBtn: any = "upload";
  public onupload_button: boolean = true;


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
    public dialogRef: MatDialogRef<OpenSAPDATAFileUploadWindow>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
    {
      this.uploadForm = this.formBuilder.group({
        sap_data_file: new UntypedFormControl("", Validators.required),});
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
        const formData: FormData = new FormData();
        if (this.uploadForm.status == "INVALID") {
          this.toaster.error("Please upload file")
        }
        else {
          this.showloader();
          this.onupload_button = false;
                formData.append("sap_data_file", this.uploadForm.get("sap_data_file").value);
                this.http.post<any>(this.url + "logistics_other_transaction_data/", formData, headers).subscribe(
                  (res: any) => {
                    this.toaster.success("SAP Data Uploaded Successfully!");
                    this.onupload_button = true;
                    this.hideloader();
                    //this.updateShipToPartyAndSoldToPartyNames();
                  })
              }
      }

    dialogClose(){
      this.dialogRef.close();
    }
  }

  @Component({
    selector: 'user-input-screen',
    templateUrl: 'user-input-screen.html'
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
  export class OpenUserInputScreen{
  
    public action='';
    public daRemarksId:any="";
    editForm:boolean=false;
    mainForm:boolean=true;
    DaIdList:any='';
    public tablelist:any;
  
    public form:UntypedFormGroup;

    public freightList:any="";
    public deliveryModeList:any="";

    id:any="";
    url = "logistics_other_transactions/";
    transportationlist:any="";
    trucktypeslist:any="";
    
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
      public dialogRef: MatDialogRef<OpenUserInputScreen>,
      @Inject(MAT_DIALOG_DATA) public data: any
    )
      {
      }
  
      ngOnInit(): void {
        this.form = this.fb.group({
          kind_attn:new UntypedFormControl(),
          qty:new UntypedFormControl(),
          uom:new UntypedFormControl(),
          way_bill_no:new UntypedFormControl(),
          descriptionOfGoods:new UntypedFormControl(),
          transporter_value_id :new UntypedFormControl(),
          mode_of_delivery_id:new UntypedFormControl(),
          freight_type_value_id:new UntypedFormControl(),
          destination:new UntypedFormControl(),
          dispatch_remarks:new UntypedFormControl(),
          po_date:new UntypedFormControl(null),
          lr_date:new UntypedFormControl(null),
          truck_type_id:new UntypedFormControl(null),
          mode_of_transport:new UntypedFormControl(null),
      })
      this.getTransportationList();
      this.getTruckTypeList();
      this.DeliveryModeList();
      this.FreightTypeList();
      }

      getTransportationList()
      {
        this.api.getData("logistics_tracking_transportations/").then((response)=>{
          this.transportationlist=response;
          console.log("tracking transportation value=", this.transportationlist)
        },(error)=>{
          console.log("error");
        })
      }
  
      getTruckTypeList()
      {
        this.api.getData("logistics_truck_type/").then((response)=>{
          this.trucktypeslist=response;
          console.log("logistics_truck_type value=", this.trucktypeslist)
        },(error)=>{
          console.log("error");
        })
      }

      DeliveryModeList(){
        let url = "logistics_transportation_mode/";
        this.api.getData(url).then((res: any) => {
          this.deliveryModeList = res;
        });
      }
  
      FreightTypeList(){
        let url = "logistics_freight_type/";
        this.api.getData(url).then((res: any) => {
          this.freightList = res;
        });
      }
  
     onSubmitPost(){
      this.id = this.data.id
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
        debugger
        this.form.value.kind_attn=this.form.value.kind_attn
        this.form.value.qty=this.form.value.qty
        this.form.value.uom=this.form.value.uom
        this.form.value.way_bill_no=this.form.value.way_bill_no
        this.form.value.dispatch_remarks=this.form.value.dispatch_remarks
        //this.form.value.transporter_value=this.form.value.transporter_value
        this.form.value.destination=this.form.value.destination
        this.form.value.mode_of_delivery_id=this.form.value.mode_of_delivery_id
        this.form.value.freight_type_value_id=this.form.value.freight_type_value_id
        this.form.value.descriptionOfGoods=this.form.value.descriptionOfGoods
        this.form.value.po_date=this.datepipe.transform(this.form.value.po_date,'dd-MM-yyyy')
        this.form.value.lr_date=this.datepipe.transform(this.form.value.lr_date,'dd-MM-yyyy')
        this.form.value.transporter_value_id=this.form.value.transporter_value_id
        this.form.value.truck_type_id=this.form.value.truck_type_id
        this.form.value.mode_of_transport=this.form.value.mode_of_transport

          let obj={...this.form.value};
          console.log("obj",obj)
  debugger
          this.api.updateData(this.url+this.id+"/",obj).then((response:any)=>{
            this.form.reset();
            this.toast.success("Record Updated Successfully")
              console.log("responce",response)
              this.dialogClose();
        },(error)=>{
        })
      }
  
      dialogClose(){
        this.dialogRef.close();
      }
    }


