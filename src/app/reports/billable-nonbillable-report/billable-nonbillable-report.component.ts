import { Component, OnInit ,OnDestroy ,ViewChild, Inject} from '@angular/core';
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
import { DatePipe } from '@angular/common';
import { StorageServiceService } from 'src/app/service-storage.service';
import {DataTableDirective} from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Component({
  selector: 'app-billable-nonbillable-report',
  templateUrl: './billable-nonbillable-report.component.html',
  styleUrls: ['./billable-nonbillable-report.component.css']
})
export class BillableNonbillableReportComponent implements OnInit {
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public form:UntypedFormGroup;

  dtInstance: Promise<DataTables.Api>;
  dtElement: DataTableDirective;
  //add
  filterDataForm:boolean=false;
  date_type:any="";
  date_flag:boolean=false;
  fromdate: any = '';
  todate: any = '';
  public length:any="";
  public business_unit_list:any;
  public errorList:any;
  public customer_name_list:any;

  public sapTotalValue:any=0;
  public portalTotalInvoiceAmount:any=0;
  public portalTotalTruckAmount:any=0;
  public dctype:any;

  //sap data related code lines.
  public uploader: FileUploader = new FileUploader({});
  url2 = environment.apiUrl;
  uploadForm: UntypedFormGroup;
  public onupload_button: boolean = true;

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
    private http: HttpClient,)
    { 
        //sap data upload
      this.uploadForm = this.fb.group({
        qtso_file: new UntypedFormControl("", Validators.required),});
      

    this.form = this.fb.group({
      //add
      date_type:new UntypedFormControl(),  
        fromDate:new UntypedFormControl(),
        toDate:new UntypedFormControl(),
        da_no:new UntypedFormControl(),
        so_no:new UntypedFormControl(),
        project_id:new UntypedFormControl(),  
        business_unit:new UntypedFormControl(),  
        billtype:new UntypedFormControl(),    
        customer_no: new UntypedFormControl(),  
        lr_no:new UntypedFormControl(),
        customer_name:new UntypedFormControl(),
        delivery_challan_no:new UntypedFormControl(),
        tax_inv_no:new UntypedFormControl(),    
    })
  }

  ngOnInit(): void {
    let data={
      "filter_fields": {
        id:1
      } }
     data.filter_fields["key3"]='san';
     console.log("sandeep",data);
    this.getBusinessUnitList();
    this.getCustomerNameList();

    this.dtOptions = {
      dom: 'Bfrtip',
      ordering: false,
      paging:false,
      processing: true,
      scrollX: true,
      retrieve: true,
    };
    this.rerender();
  }

  getListOfDispatchValues(){
    let data={
      "filter_fields": {
      } }
    this.api.postData("invoice_report/filter_reports/",data).then((response)=>{
      
      this.tablelist=response;
     
      this.dtTrigger.next(void 0);   
    },(error)=>{
        console.log("error");
    })
  }

  getCustomerNameList()
    {
      this.api.getData("logistics_dispatch_advice/dispatch_advice_reports_list").then((response)=>{
        this.customer_name_list=response;
        console.log("Customer Names list value=", this.customer_name_list)
      },(error)=>{
        console.log("error");
      })
    }

 updateDeliveryChallanDaID()
{
  let data={
    "type":1
  }
  //let url ="invoice_report_data/updateDeliveryChallanDAID/";
  this.api.postData("invoice_report/updateDeliveryChallanDAID/",data).then((response)=>{
    console.log("Delivery Challan Values",response)
  })
}

  // filter_table(){
  // }

  clearAllFilterDataFields()
  {
      this.form.reset();
      this.date_flag=false;
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(void 0);
    });
}

ngAfterViewInit(): void {
  this.dtTrigger.next(void 0);
  this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.columns().every(function () {
      const that = this;
      $('input', this.footer()).on('keyup change', function () {
        if (that.search() !== this['value']) {
          that.search(this['value']).draw();
        }
      });
    });
  });
}
//above 3 function need to be added
  //add

  CurrentDateTruckList(){
    let url = "invoice_report/getCurrentDateFilteredList/";
    this.api.getData(url).then((response: any) => {
      this.tablelist=response;
      this.dtTrigger.next(void 0);
      },(error)=>{
          console.log("error");
  })
}

getBusinessUnitList()
    {
      this.api.getData("user_sub_dept_list/business_unit_list_for_reports/").then((response)=>{
        this.business_unit_list=response;
        console.log("Business unit list value=", this.business_unit_list)
      },(error)=>{
        console.log("error");
      })
    }

    getinvoiceReportList() 
    {
      this.api.getData("invoice_report/filter_reports/").then((response)=>{
        this.tablelist=response;
        console.log("invoice report list values=", this.tablelist)
      },(error)=>{
        console.log("error");
      })
    }

    datePickerChange(){
      this.fromdate = this.datepipe.transform(this.form.value.fromDate, 'yyyy-MM-dd');
      this.todate = this.datepipe.transform(this.form.value.toDate, 'yyyy-MM-dd');
    }

    onDateTypeSelected(dateType)
    {
      this.date_type = dateType
      this.form.value.date_type = dateType
      console.log("Selected date type=", this.form.value.date_type)
      //console.log("Selected date type=", this.date_type)
      this.date_flag = true;
    }

    filter_table()
    {
      if(this.filterDataForm == false)
      {
        this.filterDataForm=true;
      }
      else if(this.filterDataForm == true)
      {
        this.filterDataForm=false;
      }
    }

    getTotalCost() {
      debugger
      if(this.tablelist.length != 0)
      return this.tablelist.map(t => t.cost).reduce((acc, value) => acc + value, 0);
    }

    updateShipToPartyAndSoldToPartyNames()
{
  let data={
    "type":1
  }
  this.api.postData("invoice_report/updateShipToAndSoldToNames/",data).then((response:any)=>{
   //alert(response.No_of_ship_to_party_name_updated)
    this.toast.success(response.No_of_ship_to_party_name_updated)
    this.toast.success(response.No_of_Sold_to_party_name_updated)
    console.log("Ship To and Sold To Party Names are updated successfully!",response)
  })
}

    getRecordsBasedOnFilterData()
    {
      this.portalTotalInvoiceAmount = 0
      this.portalTotalTruckAmount = 0
      let data={
        "date_flag": this.date_flag,
        "date_type":this.form.value.date_type,
        "start_date":this.fromdate,
        "end_date":this.todate,
        "business_unit": this.form.value.business_unit == ''?null:this.form.value.business_unit,
        "bill_type": this.form.value.billtype == ''?null:this.form.value.billtype,
        "lr_no": this.form.value.lr_no == ''?null:this.form.value.lr_no,
        "customer_name": this.form.value.customer_name == ''?null:this.form.value.customer_name,
        "ygs_proj_defi":this.form.value.project_id == ''?null:this.form.value.project_id,
        "filter_data":  false,
        "filter_fields": {
        }}
        if(this.form.value.so_no != null)
       {
        data.filter_fields["reference_document"]=this.form.value.so_no
        data.filter_data=true
       }
      //  if(this.form.value.project_id != null)
      //  {
      //   data.filter_fields["project_id"]=this.form.value.project_id
      //   data.filter_data=true
      //  }
       if(this.form.value.ship_to_city !=null)
       {
        data.filter_fields["ship_to_city"]=this.form.value.ship_to_city
        data.filter_data=true
       }
       if(this.form.value.ship_to_party_name != null)
       {
        data.filter_fields["ship_to_party_name"]=this.form.value.ship_to_party_name
        data.filter_data=true
       }
       if(this.form.value.delivery_challan_no != null)
        {
         data.filter_fields["challan_no"]=this.form.value.delivery_challan_no
         data.filter_data=true
        }

        if(this.form.value.tax_inv_no != null)
        {
         data.filter_fields["tax_invoice_number"]=this.form.value.tax_inv_no
         data.filter_data=true
        }
      this.api.postData("invoice_report/filterdata_reports/",data).then((response:any)=>{
        if(response.length != 0)
        {
          this.rerender();
          this.length=response.length;
          this.length = this.length - 1;
          this.sapTotalValue = response[this.length].SapTotalValue
          // this.portalTotalInvoiceAmount = response[this.length].TotalPortalInvoiceAmount
          // this.portalTotalTruckAmount = response[this.length].TotalPortalTruckAmount
          this.toast.success("Records Found")
          this.dtTrigger.next(void 0);
          this.tablelist=response;
          this.tablelist?.forEach((element: any) => {
            if(element.delivery_challan.length != 0)
            {
              this.portalTotalInvoiceAmount = this.portalTotalInvoiceAmount + element.delivery_challan[0].inv_amount
              this.portalTotalTruckAmount = this.portalTotalTruckAmount + element.delivery_challan[0].truck_amount
            }
          })
        }
          else
          {
            this.rerender();
            this.toast.error("No Records Found")
            this.tablelist=response;
          }
          console.log("Packing Cost Report Data based on filter values =", this.tablelist)
        this.dtTrigger.next(void 0);
        },(error)=>{
            console.log("error");
    })
  }

  //sap data related code below
  OnFileSelect(event, name) {
    let file = event.target.files[0];
    this.uploadForm.get(name).setValue(file);
  }


  onSubmit()
{
  const dialogRef = this.dialog.open(OpenSAPDATAFileUploadPage, {
    height: '200px',
    width: '600px',
    maxWidth:'100%',
  });
}

updateTruckListTransportationID()
{
  let data={
    "type":1
  }
  //let url ="invoice_report_data/updateDeliveryChallanDAID/";
  this.api.postData("logistics_truck_approval/updateTruckListTransportationID/",data).then((response)=>{
    console.log("TruckList Values are updated  Values",response)
  })
}

getErrorList()
{
    this.api.getData("logistics_truck_delivery_challan/getErrorList/").then((response)=>{
      this.errorList=response;
      console.log("Error list value=", this.errorList)
    },(error)=>{
      console.log("error");
    })
}

}

@Component({
  selector: 'open-dialog-panel',
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
export class OpenSAPDATAFileUploadPage {

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
    public dialogRef: MatDialogRef<OpenSAPDATAFileUploadPage>,
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
                this.http.post<any>(this.url + "invoice_report_data/", formData, headers).subscribe(
                  (res: any) => {
                    this.toaster.success("SAP Data Uploaded to Invoice Report successfully");
                    this.onupload_button = true;
                    this.hideloader();
                    //this.updateShipToPartyAndSoldToPartyNames();
                  })
              }
      }

updateShipToPartyAndSoldToPartyNames()
{
  let data={
    "type":1
  }
  this.apiService.postData("invoice_report/updateShipToAndSoldToNames/",data).then((response)=>{
    console.log("Ship To and Sold To Party Names are updated successfully!",response)
  })
}

    //9/02/2023 changed this function to above function
    fileUploadOld() {
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
        this.http.post<any>(this.url + "report_data_sap_dump/", formData, headers).subscribe(
          (res: any) => {
            this.toaster.success("SAP Data Uploaded successfully");
            if(res == true)
            {
              formData.append("sap_data_file", this.uploadForm.get("sap_data_file").value);
              this.http.post<any>(this.url + "invoice_report_data/", formData, headers).subscribe(
                (res: any) => {
                  this.toaster.success("SAP Data Uploaded to Invoice Report successfully");
                  this.onupload_button = true;
                  this.hideloader();
                })
            }
          });
      }
    }

    
    dialogClose(){
      this.dialogRef.close();
    }
  }

