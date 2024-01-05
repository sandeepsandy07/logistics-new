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
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-truck-request-report',
  templateUrl: './truck-request-report.component.html',
  styleUrls: ['./truck-request-report.component.css']
})

export class TruckRequestReportComponent  implements OnInit {
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public form:UntypedFormGroup;
  filterDataForm:boolean=false;
  date_type:any="";
  date_flag:boolean=false;
  length:any="";
  dtInstance: Promise<DataTables.Api>;
  dtElement: DataTableDirective;
  fromdate: any = '';
  todate: any = '';
  transportationlist:any="";
  DaIdList:any="";


  constructor(
    public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    public toast:ToastrService)
    { 

    this.form = this.fb.group({
      da_no: new UntypedFormControl(),
        date_type:new UntypedFormControl(),  
        fromDate:new UntypedFormControl(),
        toDate:new UntypedFormControl(),    
    })
  }

  ngOnInit(): void {
    let data={
      "filter_fields": {
        id:1
      } }
      this.CurrentDateTruckList();
      this.dispatchAdviceList();

    this.dtOptions = {
      dom: 'Bfrtip',
      ordering: false,
      paging:false,
      processing: true,
      retrieve: true,
    };
   this.rerender();
  }


  CurrentDateTruckList(){
    let url = "logistics_truck_request/getCurrentDateFilteredList/";
    this.api.getData(url).then((res: any) => {
      this.tablelist=res.data;
      console.log("Truck Request report data=", this.tablelist)
      //console.log(this.tablelist);
      this.dtTrigger.next(void 0);   
    },(error)=>{
        console.log("error");
    })
  }

  getListOfTruckRequestValues(){
    this.api.getData("logistics_truck_request/getTruckRequestData/").then((response:any)=>{
      this.tablelist=response;
     console.log("Truck Request Report Data=",this.tablelist)
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

  clearAllFilterDataFields()
  {
      this.form.reset();
      this.date_flag=false;
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

    datePickerChange(){
      this.form.value.date_type = "RequestDate"
      console.log("Selected date type=", this.form.value.date_type)
      this.date_flag = true;
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

openDialogPanel(truck_request_id: any){
  const dialogRef = this.dialog.open(OpenDialogTruckApprovalStatus, {
    height: '300px',
    width: '850px',
    maxWidth:'100%',
    data: {
         truck_tack: truck_request_id
          }
  });
}

    getRecordsBasedOnFilterData()
    {
      
      let data={
        "date_flag": this.date_flag,
        "date_type":this.form.value.date_type,
        "start_date":this.fromdate,
        "end_date":this.todate,
        "filter_data":  false,
        "filter_fields": {
        }
      }

      if(this.form.value.da_no !=null)
      {
       data.filter_fields["daID"]=this.form.value.da_no
       data.filter_data=true
      }
      this.api.postData("logistics_truck_request/getTruckRequestFilterData/",data).then((response:any)=>{
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
          console.log("Truck Request based on filter Vlaues =", this.tablelist)
        this.dtTrigger.next(void 0);
        },(error)=>{
            console.log("error");
    })
  }


}

@Component({
  selector: 'open-dialog-panel',
  templateUrl: 'show-truck-approval-status.html'
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
export class OpenDialogTruckApprovalStatus {

  truck_request_id:any="";
  truckApprovalList:any="";
  
  tableShow: boolean = false;
  displayedColumns = ['slno','DA no','Quantity','Amount','Transportation','Truck Type','Approved_By','Status'];
  dataSource = new MatTableDataSource<['']>();
  
  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogTruckApprovalStatus>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
    {
      this.truck_request_id=data.truck_tack;
      console.log("truck request id=", this.truck_request_id);
      this.getTruckApprovalDetails();
    }

  getTruckApprovalDetails()
  {
    let url = "logistics_truck_approval/getTruckApprovalList/";
    let data = {
      truck_request_id : this.truck_request_id
    }
    this.apiService.postData(url, data).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.truckApprovalList=res;
      let length = res.length
      console.log("Truck list=", this.truckApprovalList)
      })
  }


    dialogClose(){
      this.dialogRef.close();
    }
  }


