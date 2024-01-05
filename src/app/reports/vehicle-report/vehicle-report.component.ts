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
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';


import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-vehicle-report',
  templateUrl: './vehicle-report.component.html',
  styleUrls: ['./vehicle-report.component.css']
})
export class VehicleReportComponent implements OnInit {
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  dtInstance: Promise<DataTables.Api>;
  dtElement: DataTableDirective;

  public form:UntypedFormGroup;
  filterDataForm:boolean=false;
  date_type:any="";
  date_flag:boolean=false;
  length:any="";

  fromdate: any = '';
  todate: any = '';
  DaIdList:any='';

  transportationlist:any="";
  trucktypeslist:any="";


  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    public toast:ToastrService,
    private fb:UntypedFormBuilder,
    private http: HttpClient,) {

      this.form = this.fb.group({ 
        vehicle_no:new UntypedFormControl(),
        da_no:new UntypedFormControl(),
        fromDate:new UntypedFormControl(),
        toDate:new UntypedFormControl(),
        date_type:new UntypedFormControl(),
        lrn_no:new UntypedFormControl(),

        delivery_challan_no:new UntypedFormControl(),
        transporter_name:new UntypedFormControl(),
        truck_type:new UntypedFormControl(),
        status:new UntypedFormControl(),
        delayed_trucks: new UntypedFormControl(),
      })
     }

  ngOnInit(): void {
    this.CurrentDateTruckList();
    this.dispatchAdviceList();
    this.getTransportationList();
    this.getTruckTypeList();

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

  download_expected_days_upload_format()
  {
    let url = "truck_report/download_expected_days_upload_format/"
    this.api.download(url).subscribe((response)=>{
      let blob = new Blob([response], {type: response.type})
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expected_days_upload_format');
      link.click();
    })
  }

  getListOfDispatchValues(){
    this.api.getData("truck_report/").then((response:any)=>{
      this.tablelist=response.data;
      console.log("Vehicle report data=", this.tablelist)
      this.dtTrigger.next(void 0);   
    },(error)=>{
        console.log("error");
    })
  }

  dispatchAdviceList(){
    let url = "logistics_dispatch_advice/";
    this.api.getData(url).then((res: any) => {
      this.DaIdList = res;
      console.log("Dispatch Advice list=", this.DaIdList)
    });
  }

  CurrentDateTruckList(){
    let url = "truck_report/getCurrentDateFilteredList/";
    this.api.getData(url).then((res: any) => {
      this.tablelist=res.data;
      console.log("Vehicle report data=", this.tablelist)
      this.dtTrigger.next(void 0);   
    },(error)=>{
        console.log("error");
    })
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(void 0);
    });
}
callvehicledetailsapi(truck_id) {

  let data = {
    truck_id: truck_id
  }

  this.api.postData("logistics_truck_list/get_truck_tracking_details/", data).then((response: any) => {
        this.toast.success("Updated")
  }, (error) => {

    console.log("error");

  })
}
daNavigation(id,nav_url){
  const navigationExtras: NavigationExtras = {state: {dad_id: id}};
  this.route.navigate([nav_url], navigationExtras);
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

    clearAllFilterDataFields()
    {
        this.form.reset();
        this.date_flag=false;
    }

    getRecordsBasedOnFilterData()
    {
      let data={
        "date_flag": this.date_flag,
        "date_type":this.form.value.date_type,
        "start_date":this.fromdate,
        "end_date":this.todate,
        "jobcode_da_no": this.form.value.da_no == ''?null:this.form.value.da_no,
        "lrn_no": this.form.value.lrn_no == ''?null:this.form.value.lrn_no,
        "challen_no": this.form.value.delivery_challan_no == ''?null:this.form.value.delivery_challan_no,
        "transportationID": this.form.value.transporter_name == ''?null:this.form.value.transporter_name,
        "truckID": this.form.value.truck_type == ''?null:this.form.value.truck_type,
        "delayed_trucks":this.form.value.delayed_trucks == ''?null:this.form.value.delayed_trucks,
        "status":this.form.value.status == ''?null:this.form.value.status,
        "filter_data":  false,
        "filter_fields": {
        }}

        if(this.form.value.vehicle_no != null)
       {
        data.filter_fields["vehicle_no"]=this.form.value.vehicle_no
        data.filter_data=true
       }

      //  else if(this.form.value.vehicle_no == null || this.form.value.vehicle_no == '')
      //  {
      //   data.filter_fields["vehicle_no"]=null
      //   data.filter_data=true
      //  }

      //  if(this.form.value.status != null)
      //  {
      //   data.filter_fields["status"]=this.form.value.status
      //   data.filter_data=true
      //  }

      //  else if(this.form.value.status == null || this.form.value.status == '')
      //  {
      //   data.filter_fields["status"]=null
      //   data.filter_data=true
      //  }

      //  if(this.form.value.transporter_name != null)
      //  {
      //   data.filter_fields["transportationID"]=this.form.value.transporter_name
      //   data.filter_data=true
      //  }
      //  else if(this.form.value.transporter_name == null || this.form.value.transporter_name == '')
      //  {
      //   data.filter_fields["transportationID"]=null
      //   data.filter_data=true
      //  }


      //  if(this.form.value.truck_type != null)
      //  {
      //   data.filter_fields["truckID"]=this.form.value.truck_type
      //   data.filter_data=true
      //  }

      //  else if(this.form.value.truck_type == null || this.form.value.truck_type == '')
      //  {
      //   data.filter_fields["truckID"]=null
      //   data.filter_data=true
      //  }
       
        // this.api.postData("truck_report/filter_truck_reports/",data).then((response:any)=>{18_03_2023
        this.api.postData("truck_report/filter_truck_reports_data/",data).then((response:any)=>{
        if(response.length != 0)
        {
          this.rerender();
          this.length=response.length;
          this.length = this.length - 1;
          this.toast.success("Records Found")
          this.dtTrigger.next(void 0);
          this.tablelist=response;
        }
          else
          {
            this.rerender();
            this.toast.error("No Records Found")
            this.tablelist=response;
          }
          console.log("Vehicle Report Data based on filter values =", this.tablelist)
        this.dtTrigger.next(void 0);
        },(error)=>{
            console.log("error");
    })
    }

    openDialogPanel(truck_list_id: any){
      const dialogRef = this.dialog.open(OpenDialogVehicleHistory, {
        height: '500px',
        width: '850px',
        maxWidth:'100%',
        data: {
             truck_tack: truck_list_id
              }
      });
    }

    UploadExpectedDateTemplate()
    {
      const dialogRef = this.dialog.open(OpenExportDateFileUploadPage, {
        height: '200px',
        width: '600px',
        maxWidth:'100%',
      });
    }

    openTruckDeliveryDetailsAdd(truck_list_Id: any)
    {
      const dialogRef = this.dialog.open(manualTruckDeliveryDetailsAdd, {
        height: '50%',
        width: '80%',
        maxWidth:'100%',
        data: {
             trucklist_id: truck_list_Id
              }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }

    openAddRatings(truck_list_id: any){
      const dialogRef = this.dialog.open(addRatings, {
        height: '300px',
        width: '900px',
        maxWidth:'100%',
        data: {
             truck_tack: truck_list_id
              }
      });
    }
}

@Component({
  selector: 'open-dialog-panel',
  templateUrl: 'show-vehilce-transit-details.html'
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
export class OpenDialogVehicleHistory {
  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  truck_list_id:any="";
  truckList:any="";
  
  // tableShow: boolean = false;
  
  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogVehicleHistory>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
    {
      this.truck_list_id=data.truck_tack;
      console.log("truck list id=", this.truck_list_id);
      this.getTruckDeliveryDetails();

      this.dtOptions = {
        ordering: false,
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
        paging:false,
        retrieve: true,
      };
    }

    getTruckDeliveryDetails()
    {
      let url = "logistics_truck_delivery_details/get_truck_delivery_details/";
      let data = {
        truck_id : this.truck_list_id
      }
      this.apiService.postData(url, data).then((response: any) => {
        if(response.length != 0)
      {
        this.toast.success("Records Found!")
            this.tablelist=response;
              this.dtTrigger.next(void 0);
            console.log("Truck list =", this.tablelist)
      }
      else
          {
            this.toast.error("No Records Found")
          } 
        console.log("Truck list =", this.tablelist)
        })
    }

  getTruckDeliveryDetailsold()
  {
    let url = "logistics_truck_delivery_details/get_truck_delivery_details/";
    let data = {
      truck_id : this.truck_list_id
    }
    this.apiService.postData(url, data).then((response: any) => {

      this.tablelist=response
      this.truckList=response;
      let length = response.length
      console.log("Truck list=", this.truckList)
      })
  }


    dialogClose(){
      this.dialogRef.close();
    }
  }

  @Component({
    selector: 'open-dialog-panel',
    templateUrl: 'upload-export-date-template.html'
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

  export class OpenExportDateFileUploadPage {
  
    public uploader: FileUploader = new FileUploader({});
    url = environment.apiUrl;
  
    viewBtn: any = "upload";
    public onupload_button: boolean = true;
    uploadForm: UntypedFormGroup;
    result:any="";
    
    constructor(
      private formBuilder: UntypedFormBuilder,
      private toaster:ToastrService,
      public storage:StorageServiceService ,
      public toast:ToastrService, 
      public fb: UntypedFormBuilder,
      public dialog: MatDialog,
      public apiService: ApiserviceService,
      private http: HttpClient,
      public dialogRef: MatDialogRef<OpenExportDateFileUploadPage>,
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
                  this.http.post<any>(this.url + "expected_days_data/", formData, headers).subscribe(
                    (res: any) => {
                      if (res == true)
                      {
                        this.toaster.success("Data Uploaded Successfully!");
                        this.onupload_button = true;
                        this.hideloader();
                      }
                      else
                      {
                        this.result = res;
                        this.toaster.error(this.result);
                        //this.toaster.error("Valid From/Valid is not given please check and upload file again");
                      }
                    })
                    // (response:any) => {
                    //   this.result = response
                    //   if (response == true)
                    //   {
                    //     this.toaster.success("Data Uploaded successfully!");
                    //     this.onupload_button = true;
                    //     this.hideloader();
                    //   }
                    //   else
                    //   {
                    //     this.toaster.error(this.result);
                    //   }
                      
                    // })
                }
        }
  
      dialogClose(){
        this.dialogRef.close();
      }
    }

    @Component({
      selector: 'truckdeliverydetailsadd',
      templateUrl: 'manual-truck-details-add.html',
       styles: [`
        :host {
          width:'60%'
        }
    
        mat-dialog-content {
          flex-grow: 1;
        }
      `]
    })
    export class manualTruckDeliveryDetailsAdd {
      //create variables
      trucklist_id:any="";
      currentLocation:any="";
      currentDateTime:any="";
      currentLatitude:any="";
      currentLongitude:any="";
      currentStatus:any="";
      cdatetime:any="";
      date:any="";
      time:any="";
      currentTimeValue:any="";
      myDate = new Date();
      MyDate:any="";
    
      constructor(
        public apiService: ApiserviceService,
        private datePipe: DatePipe,
        public dialogRef: MatDialogRef<manualTruckDeliveryDetailsAdd>,
        public toast:ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any)
        {
          this.trucklist_id=data.trucklist_id;
          console.log("truck list id=", this.trucklist_id);
          this.MyDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd')
        }
  
        datePickerChange()
       {
        this.date = this.datePipe.transform(this.currentDateTime, 'yyyy-MM-dd');
        console.log('date=',this.date)
        const _ = moment();
        const date = moment(this.currentDateTime).add({hours: _.hour(), minutes:_.minute() , seconds:_.second()})
        this.currentDateTime.value = date.toDate();
        console.log({hours: _.hour(), minutes:_.minute() , seconds:_.second()})
        this.time = _.hour()+":"+_.minute()+":"+_.second()
        console.log("time value=",this.time)
        // this.cdatetime = this.date +" "+ this.time; //binding date with current time value
        // this.cdatetime = this.date +" "+ this.currentTimeValue;
        this.cdatetime = this.date;
        console.log("Current Date time=",this.cdatetime);
       }
    
        onDataChange(newdate) {
          const _ = moment();
          const date = moment(newdate).add({hours: _.hour(), minutes:_.minute() , seconds:_.second()})
          this.currentDateTime.value = date.toDate();
          console.log({hours: _.hour(), minutes:_.minute() , seconds:_.second()})
          this.time = _.hour()+":"+_.minute()+":"+_.second()
          console.log("time value=",this.time)
          this.currentDateTime = this.datePipe.transform(this.currentDateTime, 'yyyy-MM-dd');
          this.currentDateTime = this.date +" "+ this.time;
          console.log("Current Date time=",this.currentDateTime);
        }
  
      createList()
      {
        if(this.cdatetime != "" && this.currentTimeValue != "")
        {
          this.cdatetime = this.date +" "+ this.currentTimeValue;
        }
        if(this.trucklist_id == "")
        {
          this.trucklist_id = null
        }
        if(this.currentLocation == "")
        {
          this.currentLocation = null;
        }
        // if(this.cdatetime == "")
        // {
        //   //this.cdatetime = null;
        //   this.cdatetime = this.MyDate + " " + this.currentTimeValue;
        // }
        if(this.currentLatitude == "")
        {
          this.currentLatitude = null;
        }
        if(this.currentLongitude == "")
        {
          this.currentLongitude = null;
        }
        if(this.currentStatus == "")
        {
          this.currentStatus = null;
        }
        {
          let data={ 
          'trucklist_id':this.trucklist_id,
          'current_location':this.currentLocation,
          'current_datetime':this.cdatetime,
          'current_latitude':this.currentLatitude,
          'current_longitude':this.currentLongitude,
          'current_status':this.currentStatus,
          'manual_flag':true
        }
        let url = "logistics_truck_delivery_details/";
        this.apiService.postData(url,data).then(res => {
        console.log(res)
      this.toast.success("Record Successfully Inserted!");
    })
  }
  this.dialogRef.close();
  }   
    dialogClose()
    {
      this.dialogRef.close();
    }
  }


  @Component({
    selector: 'addratings',
    templateUrl: 'add-ratings.html',
     styles: [`
      :host {
        width:'60%'
      }
  
      mat-dialog-content {
        flex-grow: 1;
      }
    `]
  })
  export class addRatings {
    //create variables
    trucklist_id:any="";
    public form:UntypedFormGroup;
    truckListId:any="";
    url = "logistics_truck_list/";
   
 
    constructor(
      private formBuilder: UntypedFormBuilder,
      private toaster:ToastrService,
      public storage:StorageServiceService ,
      public fb: UntypedFormBuilder,
      public dialog: MatDialog,
      public api: ApiserviceService,
      private http: HttpClient,
      public datepipe: DatePipe,
      public dialogRef: MatDialogRef<addRatings>,
      public toast:ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any)
      {
        this.trucklist_id=data.truck_tack;
        console.log("truck list id=", this.trucklist_id);
      }

      ngOnInit(): void {
        this.form = this.fb.group({
          rating: new UntypedFormControl(null, { validators: [Validators.required] }),
          ratingRemarks:new UntypedFormControl(),
          truckListId:new UntypedFormControl(),
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
          this.form.value.rating=this.form.value.rating
          this.form.value.ratingRemarks=this.form.value.ratingRemarks
          this.form.value.truckListId=this.trucklist_id
          
            let obj={...this.form.value};
            debugger
            console.log("obj",obj)
            let url = "logistics_truck_list/updateRatingAndRatingRemarks/";
            this.api.postData(url,obj).then(res => {
            console.log(res)
            this.toast.success("Remarks Saved Successfully")
        })
        }
    
        dialogClose(){
          this.dialogRef.close();
        }
      }

  


    
  
  
  
    