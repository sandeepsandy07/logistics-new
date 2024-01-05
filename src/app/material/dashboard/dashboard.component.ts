import { Component, OnInit, Inject, ViewChild, ElementRef,Output,EventEmitter } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
import {DataTableDirective} from 'angular-datatables';

import { StorageServiceService } from '../../service-storage.service';


import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
  FormArray,
   
} from "@angular/forms";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MainComponent }  from '../../common-components/main/main.component';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { data, isEmptyObject } from 'jquery';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { isEmpty } from 'rxjs';
import { Subject } from 'rxjs';;
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  CheckedOutList:any="";
  totalOpenCount:any="";
  totalDueCount:any="";
  totalInScheduleCount:any="";
  output_val:any="";
  total_open_count_list:any="";
  total_in_schedule_count_list:any="";
  total_due_count_list:any="";
  dispatch_advice_da_status_list:any="";
  dispatch_advice_dept_list:any="";
  dashboardone:boolean=false;
  dashboardtwo:boolean=true;
  dashboardtwoo:boolean=false;

  public tracking_billing:boolean=false;
  public show_da_details_with_count:boolean=false;
  public packing_loading_details:boolean=false;
  public logistic_summary_access:boolean=false;
  public logistic_summary:boolean=false;
  public summary_list:any;
  


  da_submitted_list:any=0;
  approval_in_progress_list:any=0;
  approved_list:any=0;
  aknowledge_list:any=0;
  packing_initiated_list:any=0;
  packed_list:any=0;
  loading_completed_list:any=0;
  dispatched_list:any=0;
  delivered_list:any=0;
  closed_list:any=0;
  pending_list:any=0;

  da_submitted_list_creater:any=0;
  approval_in_progress_list_creater:any=0;
  approved_list_creater:any=0;
  aknowledge_list_creater:any=0;
  packing_initiated_list_creater:any=0;
  packed_list_creater:any=0;
  loading_completed_list_creater:any=0;
  dispatched_list_creater:any=0;
  delivered_list_creater:any=0;
  closed_list_creater:any=0;
  pending_list_creater:any=0;

  tableloadinglist:any="";
  tablepackinglist:any="";

  da_count_loaded:boolean=false;
  da_count_loaded_creater:boolean=false;

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public monthly_billing_value:any;
  public yearly_billing_value:any;
  public monthly_billing_list:any;
  public yearly_billing_list:any;
  public user_access_data:any;
  public show_da_details_with_count_creater:boolean=false;

  public show_da_approver_list:boolean=false;
  public tabledaapproverlist:any;
  public summary_start:any;
  public summary_end:any;
  myDate = new Date();

 

  constructor(
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient,
    public api: ApiserviceService,
    public toast:ToastrService, 
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public storage: StorageServiceService,
    private toastr: ToastrService,
    private router: Router
  ) { 
    this.summary_start = this.datepipe.transform(this.myDate, 'yyyy-MM-dd');
    this.summary_end = this.datepipe.transform(this.myDate, 'yyyy-MM-dd');



  }

  ngOnInit(): void {
   
    let myCompOneObj = new MainComponent(this.storage,this.api,this.dialog,this.router);
    myCompOneObj.setmenu();
    this.user_access_data=this.storage.getuser_data();

    
    
    if([4,26,27,17].includes(this.user_access_data.role_id))
    {

      this.tracking_billing=true;
      this.show_da_details_with_count=false;
      this.packing_loading_details=false;
      this.logistic_summary_access=true;

      this.getLogisticSummary()

      this.getTrucksNotDispatchedList();
      this.getdispatchAdviceDaStatusList();
      // this.getdispatchAdviceBasedOnDepartment();
      // this.getPackingList();
      // this.getLoadingList();
      this.getBillingDetails();
    }
    if([17,1].includes(this.user_access_data.role_id))
    {
      this.show_da_approver_list=false;
      this.show_da_details_with_count_creater=false;
      // this.getdispatchAdviceDaStatusListCreater();
      // this.getDaApproverList();
    }

    


    this.dtOptions = {
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
  }

  getBillingDetails()
  {
    this.api.getData("logistics_panel_wise_material/get_total_cost_monthly_wise").then((response:any)=>{
      this.monthly_billing_value=response.total_cost;
      this.monthly_billing_list=response.data;
     
      },(error)=>{
          console.log("error");
    })
    this.api.getData("logistics_panel_wise_material/get_total_cost_year_wise").then((response:any)=>{
      this.yearly_billing_value=response.total_cost;
      this.yearly_billing_list=response.data;

     
      },(error)=>{
          console.log("error");
    })
  }
  getPackingList()
  {
    this.api.getData("logistics_dispatch_advice/get_packing_list/").then((response:any)=>{
      this.tablepackinglist=response;
      console.log("packing list=",this.tablepackinglist);
      this.dtTrigger.next(void 0);
      },(error)=>{
          console.log("error");
  })
  }
  getLogisticSummary(){
    let data={
      start_date:this.datepipe.transform(this.summary_start, 'yyyy-MM-dd'),
      end_date:this.datepipe.transform(this.summary_end, 'yyyy-MM-dd')
      
    }
    this.api.postData("logistics_dispatch_advice/get_logistics_summary/",data).then((response:any)=>{
 
      this.summary_list=response;
      
      
     
      },(error)=>{
          console.log("error");
  })
  }
  datePickerChange(){
   
    
    this.summary_start = this.datepipe.transform(this.summary_start, 'yyyy-MM-dd');
    this.summary_end = this.datepipe.transform(this.summary_end, 'yyyy-MM-dd');
  }
  getDaApproverList()
  {
    let data={
      status:'all',
      col_name:'is_active',
      col_value:true,
      da_user_req_status:'pending',
      approve_status:'Approver',
      approver_flag:false
    }
    this.api.postData("dispatch_user_allocation/user_based_da_list_with_status/",data).then((response:any)=>{
 
      this.tabledaapproverlist=response;
      
      
     
      },(error)=>{
          console.log("error");
  })
  }

  packingViewNavigation(nav_url){
    this.router.navigate([nav_url])
  }
  packingNavigation(id,nav_url){
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.router.navigate([nav_url], navigationExtras);
  }
  callvehicledetailsapiall() {

    let data = {
      truck_id: 1
    }

    this.api.postData("logistics_truck_list/get_truck_tracking_details_sandeep/", data).then((response: any) => {
      
    }, (error) => {

      console.log("error");

    })
  }

  getLoadingList()
  {
    this.api.getData("logistics_dispatch_advice/get_loading_list/").then((response:any)=>{
      this.tableloadinglist=response;
      console.log("loading list=",this.tableloadinglist);
      this.dtTrigger.next(void 0);
      },(error)=>{
          console.log("error");
  })
  }

  loadingNavigation(id,nav_url){
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.router.navigate([nav_url], navigationExtras);
  }
  show_billing_da_details(records) {
    
      const dialogRef = this.dialog.open(OpenbillingDaDetails, {
        height: '90%',
          width: '98%',
          maxWidth:'100%',
        data: {
          da_list_filter: records
              }
      });
    }
  
  show_truck_details(status){
    if(status == 'open')
    {
      this.output_val = this.total_open_count_list;
    }
    else if(status == 'due')
    {
      this.output_val = this.total_due_count_list;
    }
    else if(status == 'inschedule')
    {
      this.output_val = this.total_in_schedule_count_list;
    }
    const dialogRef = this.dialog.open(OpenDialogTruckDetails, {
      height: '70%',
        width: '98%',
        maxWidth:'100%',
      data: {
        element: this.output_val
            }
    });
  }

  show_truck_details_val(val){
    const dialogRef = this.dialog.open(OpenDialogTruckDetails, {
      height: '70%',
        width: '98%',
        maxWidth:'100%',
      data: {
       element: val
            }
    });
  }
  
  show_billing_details(month_year){
    let val;
    if(month_year == 'Department Wise Current Month Details'){
      val =this.monthly_billing_list
    }else{
      val=this.yearly_billing_list
    }
    const dialogRef = this.dialog.open(OpenDialogBillingDetails, {
      height: '60%',
        width: '80%',
        maxWidth:'100%',
      data: {
       element: val,
       month_year:month_year
      }
    });
  }

  reloadComponent() {
    let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }

  getTrucksNotDispatchedList()
  {
  let url = "logistics_truck_list/getCheckedOutTrucks/";
  this.api.getData(url).then((res:any) => {
    this.CheckedOutList = res.data;
    console.log("Not Dispatched Trucks",this.CheckedOutList)
    this.totalOpenCount = res.open;
    this.totalDueCount = res.due;
    this.totalInScheduleCount = res.in_schdule;

    this.total_open_count_list = res.total_open_count_list;
    this.total_due_count_list = res.total_due_count_list;
    this.total_in_schedule_count_list = res.total_in_schedule_count_list;
  })
}

getdispatchAdviceDaStatusList()
{
let url = "logistics_dispatch_advice/get_dispatch_advice_list_based_on_da_status_no/";
  this.api.getData(url).then((res:any) => {
    this.dispatch_advice_da_status_list = res.data;
    console.log("Dispatch Advice Da Status Wise List",res.data)

    this.da_submitted_list = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 1)
    this.approval_in_progress_list = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 2)
    this.approved_list = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 3)
    this.aknowledge_list = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 4)
    this.packing_initiated_list = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 5)
    this.packed_list = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 6)
    this.loading_completed_list = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 7)
    this.dispatched_list = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 8)
    this.delivered_list = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 9)
    this.closed_list = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 10)
    this.pending_list = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 11)
    
    console.log("da submitted list=", this.da_submitted_list)
    console.log("loading completed=", this.loading_completed_list)
    this.da_count_loaded = true;
  })
}
getdispatchAdviceDaStatusListCreater()
{
  this.api.getData("logistics_dispatch_advice/").then((res:any)=>{
      this.dispatch_advice_da_status_list = res;
      console.log("Dispatch Advice Da Status Wise List",res)

      this.da_submitted_list_creater = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 1)
      this.approval_in_progress_list_creater = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 2)
      this.approved_list_creater = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 3)
      this.aknowledge_list_creater = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 4)
      this.packing_initiated_list_creater = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 5)
      this.packed_list_creater = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 6)
      this.loading_completed_list_creater = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 7)
      this.dispatched_list_creater = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 8)
      this.delivered_list_creater = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 9)
      this.closed_list_creater = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 10)
      this.pending_list_creater = this.dispatch_advice_da_status_list.filter(e => e.da_status_number == 11)
      
      console.log("da submitted list=", this.da_submitted_list_creater)
      console.log("loading completed=", this.loading_completed_list)
      this.da_count_loaded_creater = true;
  })
}
getdispatchAdviceBasedOnDepartment()
{
let url = "logistics_dispatch_advice/get_dispatch_advice_list_grouped_by_department/";
  this.api.getData(url).then((res:any) => {
    this.dispatch_advice_dept_list = res.data;
    console.log("Dispatch Advice grouped by department list",this.dispatch_advice_dept_list)
  })
}

show_da_details(records)
{
  const dialogRef = this.dialog.open(OpenDialogDADetails, {
    height: '70%',
      width: '98%',
      maxWidth:'100%',
    data: {
     element: records
          }
  });
}
}

@Component({
  selector: 'truck-details',
  templateUrl: 'truck-details.html',
  styles: [`
      :host {
        width:'60%'
      }
  
      mat-dialog-content {
        flex-grow: 1;
      }
    `]
})
export class OpenDialogTruckDetails {
  passed_result_list:any="";
  
  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private router:Router,
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogTruckDetails>,
    @Inject(MAT_DIALOG_DATA) public data: any)
    {
      this.passed_result_list=data.element;
    }
    ngOnInit() 
    {
      
    }

    openDialogPanel(truckListId: any){
      const dialogRef = this.dialog.open(OpenVehicleTrackingDetails, {
        height: '500px',
        width: '850px',
        maxWidth:'100%',
        data: {
          truckListId: truckListId
              }
      });
    }
    
    dialogClose(){
      this.dialogRef.close({data:"Close"});
    }
    
  }

  @Component({
    selector: 'show-da-deatils',
    templateUrl: 'show-da-details.html',
    styles: [`
        :host {
          width:'60%'
        }
    
        mat-dialog-content {
          flex-grow: 1;
        }
      `]
  })
  export class OpenDialogDADetails {
    passed_da_result_list:any="";
    
    constructor(
      public toast:ToastrService, 
      public fb: UntypedFormBuilder,
      public dialog: MatDialog,
      private route:Router,
      public api: ApiserviceService,
      public dialogRef: MatDialogRef<OpenDialogDADetails>,
      @Inject(MAT_DIALOG_DATA) public data: any)
      {
        this.passed_da_result_list=data.element;
      }
      ngOnInit() 
      {
        this.passed_da_result_list;
      }
      
      dialogClose(){
        this.dialogRef.close({data:"Close"});
      }

      daNavigation(id,nav_url){
        this.dialog.closeAll();
        this.dialogRef.close({data:"Close"});
        const navigationExtras: NavigationExtras = {state: {dad_id: id}};
        this.route.navigate([nav_url], navigationExtras);
      }
      daNavigation_da_report(nav_url,dep_id){
        const navigationExtras: NavigationExtras = {state: {filter_data: false,business_unit_list: dep_id}};
        this.route.navigate([nav_url], navigationExtras);
      }
    }



    @Component({
      selector: 'billing-details-dept',
      templateUrl: 'billing-details-dept.html',
      styles: [`
          :host {
            width:'60%'
          }
      
          mat-dialog-content {
            flex-grow: 1;
          }
        `]
    })
    export class OpenDialogBillingDetails {
      passed_result_list:any="";
      public month_year:any;
      
      constructor(
        public toast:ToastrService, 
        public fb: UntypedFormBuilder,
        public dialog: MatDialog,
        private router:Router,
        public api: ApiserviceService,
        public dialogRef: MatDialogRef<OpenDialogTruckDetails>,
        @Inject(MAT_DIALOG_DATA) public data: any)
        {
          this.passed_result_list=data.element;
          this.month_year=data.month_year
        }
        ngOnInit() 
        {
          this.passed_result_list;
          this.month_year
        }
        
        dialogClose(){
          this.dialogRef.close({data:"Close"});
        }
          
        show_billing_da_details(records) {
          console.log("list",this.passed_result_list)
            const dialogRef = this.dialog.open(OpenbillingDaDetails, {
              height: '90%',
                width: '98%',
                maxWidth:'100%',
              data: {
                da_list_filter: records
                    }
            });
          }
          daNavigation_da_report(nav_url,dep_id){
            const navigationExtras: NavigationExtras = {state: {filter_data: true,business_unit_list: dep_id}};
            this.router.navigate([nav_url], navigationExtras);
          }
      }
    
      @Component({
        selector: 'show-tracking-details',
        templateUrl: 'show-tracking-details.html',
        styles: [`
            :host {
              width:'60%'
            }
        
            mat-dialog-content {
              flex-grow: 1;
            }
          `]
      })

      export class OpenVehicleTrackingDetails {
        public tablelist:any;
        dtOptions: DataTables.Settings = {};
        dtTrigger: Subject<any> = new Subject<any>();

        truckListId:any="";
        truckList:any="";
        
        constructor(
          public toast:ToastrService, 
          public fb: UntypedFormBuilder,
          public dialog: MatDialog,
          public apiService: ApiserviceService,
          public dialogRef: MatDialogRef<OpenVehicleTrackingDetails>,
          @Inject(MAT_DIALOG_DATA) public data: any)
          {
            this.truckListId=data.truckListId;
            console.log("truck list id=", this.truckListId);
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
        truck_id : this.truckListId
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
          
          dialogClose(){
            this.dialogRef.close({data:"Close"});
          }
          
        }
      
  

        @Component({
          selector: 'billing-da-details',
          templateUrl: 'billing-da-details.html',
          styles: [`
              :host {
                width:'60%'
              }
          
              mat-dialog-content {
                flex-grow: 1;
              }
            `]
        })
  
        export class OpenbillingDaDetails {
          @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

          public tablelist:any;
          dtOptions: DataTables.Settings = {};
          dtTrigger: Subject<any> = new Subject<any>();
          public form:UntypedFormGroup;
          filterDataForm:boolean=false;
          date_type:any="";
          date_flag:boolean=false;
          length:any="";
          SubDeptIdDataList:any="";
          public pm_list:any;
          public da_list_filter_all:any;
        
          dtInstance: Promise<DataTables.Api>;
          dtElement: DataTableDirective;
        
          fromdate: any = '';
          todate: any = '';
        
          public filter_data_value:boolean;
          public bu_data:any;
          DaIdList:any="";
          public business_unit_list:any;
          public da_list_filter:any;
          public total_sap_cost:any;
          public total_inv_cost:any;
          public total_transport_cost:any;
          public total_packing_cost:any;
          
          constructor(
            public toast:ToastrService, 
            public fb: UntypedFormBuilder,
            public dialog: MatDialog,
            public storage: StorageServiceService,
            private router: Router,
            public api: ApiserviceService,
            public dialogRef: MatDialogRef<OpenbillingDaDetails>,
            @Inject(MAT_DIALOG_DATA) public data: any)
            {
             
              this.da_list_filter_all=data.da_list_filter;
              console.log("ABC",this.da_list_filter_all)
              this.form = this.fb.group({

                date_type:new UntypedFormControl(),  
                fromDate:new UntypedFormControl(),
                toDate:new UntypedFormControl(),
                from:new UntypedFormControl(),
                to:new UntypedFormControl(),
                status:new UntypedFormControl(),
        
                da_no:new UntypedFormControl(),
                pm:new UntypedFormControl(),
                jobcode:new UntypedFormControl(),
                so_no:new UntypedFormControl(),
                po_no:new UntypedFormControl(),
                bill_to_code:new UntypedFormControl(),
                project_id:new UntypedFormControl(),
                business_unit:new UntypedFormControl(),
              })
  
             
            }
  
            ngOnInit(): void {
              let data={
                "filter_fields": {
                  id:1
                } }
           
             
            
              
              // if(this.filter_data_value){
              //   this.da_list_filter=[]
              //   for(let i of this.business_unit_list ){
                 
              //     this.da_list_filter.push(i['da_id'])
              //   }
               
              //   this.getRecordsBasedOnFilterData();
              // }
              this.da_list_filter=[]
              for(let i of this.da_list_filter_all ){
         
                    this.da_list_filter.push(i['da_id'])
                  }
              this.getRecordsBasedOnFilterData();
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
        
           
        
           
            
        
            
        
           
        
           
        
           
        
            
        
            
         
        
           
        
        
            
        
            getRecordsBasedOnFilterData()
            {
              let data={
                "date_flag": this.date_flag,
                "date_type":this.form.value.date_type,
                "da_from":this.form.value.business_unit,
                "pm":this.form.value.pm,
                "start_date":this.fromdate,
                "end_date":this.todate,
                "filter_data":  false,
                "dept_id":'',
                "dept_id_val":true,
                "da_list_filter":this.da_list_filter,
                //"business_unit":  false,
                "filter_fields": {
        
                }
              }
              if (this.form.value.pm != null && this.form.value.pm) {
                data.pm = this.form.value.pm.toString()
              }
        
               if(this.form.value.status != null)
               {
                data.filter_fields["da_status_number"]=this.form.value.status
                data.filter_data=true
               }
               if(this.form.value.da_no !=null)
               {
                data.filter_fields["da_id"]=this.form.value.da_no
                data.filter_data=true
               }
        
               if(this.form.value.jobcode !=null)
               {
                data.filter_fields["job_code"]=this.form.value.jobcode
                data.filter_data=true
               }
        
               if(this.form.value.so_no !=null)
               {
                data.filter_fields["so_no"]=this.form.value.so_no
                data.filter_data=true
               }
        
               if(this.form.value.po_no !=null)
               {
                data.filter_fields["po_no"]=this.form.value.po_no
                data.filter_data=true
               }
        
               if(this.form.value.project_id !=null)
               {
                data.filter_fields["project_id"]=this.form.value.project_id
                data.filter_data=true
               }
        
               if(this.form.value.bill_to_code !=null)
               {
                data.filter_fields["bill_to_code"]=this.form.value.bill_to_code
                data.filter_data=true
               }
               
               this.api.postData("dispatch_auth_thread/get_pm_list/",data).then((response:any)=>{
        
               })
               
                this.api.postData("logistics_dispatch_advice/dispatch_advice_reports_detail/",data).then((response:any)=>{
                  if(response.data.length != 0)
                  {
                    this.rerender();
                    this.toast.success("Records Found")
                  this.dtTrigger.next(void 0);
                  this.tablelist=response.data;
                  this.total_sap_cost=response.total_sap_cost
                  this.total_inv_cost=response.total_inv_cost
                  this.total_transport_cost=response.total_transport_cost
                  this.total_packing_cost=response.total_packing_cost
          
                  console.log("Dispatch Advice  Data based on filter values =", this.tablelist)
                  }
                  else
                  {
                    this.rerender();
                    this.toast.error("No Records Found")
                    this.tablelist=response;
                  } 
                  // this.rerender();
                  // this.tablelist=response;
                  console.log("Dispatch Advice Report Data based on filter values =", this.tablelist)
                this.dtTrigger.next(void 0);
                this.hideloader()
               
                },(error)=>{
                    console.log("error");
                    this.hideloader()
                })
            }
            hideloader() {
              document.getElementById('loading') .style.display = 'none';       
              }
              showloader() {
                document.getElementById('loading') .style.display = 'block';       
                }
        
            daNavigation(id,nav_url){
              const navigationExtras: NavigationExtras = {state: {dad_id: id}};
              this.router.navigate([nav_url], navigationExtras);
            }
            daNavigation_tab(id,nav_url){
            
              this.storage.setda_id(id);
                 const url = this.router.serializeUrl(
                  this.router.createUrlTree(['material/DA-details'])
                );
            
                window.open(url, '_blank');
            }
        
            openDialogPanel(da_id: any){
              // const dialogRef = this.dialog.open(OpenDialogDaHistory, {
              //   height: '500px',
              //   width: '850px',
              //   maxWidth:'100%',
              //   data: {
              //        da_id: da_id
              //         }
              // });
            }
            dialogClose(){
              this.dialogRef.close({data:"Close"});
            }
        }
        