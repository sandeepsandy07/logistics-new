import { Component, OnInit, OnDestroy ,ViewChild,Inject } from '@angular/core';
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
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-dispatch-advice-report',
  templateUrl: './dispatch-advice-report.component.html',
  styleUrls: ['./dispatch-advice-report.component.css']
})
export class DispatchAdviceReportComponent implements OnInit {
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

  dtInstance: Promise<DataTables.Api>;
  dtElement: DataTableDirective;

  fromdate: any = '';
  todate: any = '';
  DaIdList:any="";
  public business_unit_list:any;

  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    private router: Router,
    public toast:ToastrService) { 
      this.form = this.fb.group({

        date_type:new UntypedFormControl(),  
        fromDate:new UntypedFormControl(),
        toDate:new UntypedFormControl(),
        from:new UntypedFormControl(),
        to:new UntypedFormControl(),
        status:new UntypedFormControl(),

        da_no:new UntypedFormControl(),
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
       data.filter_fields["key3"]='san';
       console.log("sandeep",data);
      this.dispatchAdviceList();
      this.getBusinessUnitList();

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

    CurrentDateTruckList(){
      let url = "logistics_dispatch_advice/getCurrentDateFilteredList/";
      this.api.getData(url).then((res: any) => {
        this.tablelist=res.data;
        console.log("Dispatch advice report data=", this.tablelist)
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

    

    selectAll(ev) {
      if(ev._selected) {
        this.form.value.business_unit.setValue([3, 4, 5, 6, 7, 8, 10, 11, 12, 9]);
          ev._selected=true;
      }
      if(ev._selected==false) {
        this.form.value.business_unit.setValue([]);
      }
  }

    getListOfDispatchValues(){
      this.api.getData("logistics_dispatch_advice/").then((response:any)=>{
        this.tablelist=response;
       console.log("Dispatch Advice Report Data=",this.tablelist)
        this.dtTrigger.next(void 0);   
      },(error)=>{
          console.log("error");
      })
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
      this.form.value.date_type = "DADate"
      console.log("Selected date type=", this.form.value.date_type)
      this.date_flag = true;
      this.fromdate = this.datepipe.transform(this.form.value.fromDate, 'yyyy-MM-dd');
      this.todate = this.datepipe.transform(this.form.value.toDate, 'yyyy-MM-dd');
    }

    subDepartmentNameList(){
      let url = "user_sub_dept_list/";
      this.api.getData(url).then((res: any) => {
        this.SubDeptIdDataList = res;
        console.log("SubDepartment list=", this.SubDeptIdDataList)
      });
    }

    dispatchAdviceList(){
      let url = "logistics_dispatch_advice/dispatch_advice_reports_list/";
      this.api.getData(url).then((res: any) => {
        this.DaIdList = res;
        console.log("Dispatch Advice list=", this.DaIdList)
      });
    }
    daNavigation_tab(id,nav_url){
            
      this.storage.setda_id(id);
         const url = this.router.serializeUrl(
          this.router.createUrlTree(['material/DA-details'])
        );
    
        window.open(url, '_blank');
    } 

    onDateTypeSelected(dateType)
    {
      this.date_type = dateType
      this.form.value.date_type = dateType
      console.log("Selected date type=", this.form.value.date_type)
      //console.log("Selected date type=", this.date_type)
      this.date_flag = true;
    }

    getRecordsBasedOnFilterData()
    {
      let data={
        "date_flag": this.date_flag,
        "date_type":this.form.value.date_type,
        "da_from":this.form.value.business_unit,
        "start_date":this.fromdate,
        "end_date":this.todate,
        "filter_data":  false,
        //"business_unit":  false,
        "filter_fields": {
        }
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
       
      
        this.api.postData("logistics_dispatch_advice/dispatch_advice_reports/",data).then((response:any)=>{
          if(response.length != 0)
          {
            this.rerender();
            this.toast.success("Records Found")
          this.dtTrigger.next(void 0);
          this.tablelist=response;
          console.log("Dispatch Advice  Data based on filter values =", this.tablelist)
          }
          else
          {
            this.rerender();
            this.toast.error("No Records Found")
            this.tablelist=response;
          } 
          console.log("Dispatch Advice Report Data based on filter values =", this.tablelist)
        this.dtTrigger.next(void 0);
        },(error)=>{
            console.log("error");
        })
    }

    daNavigation(id,nav_url){
      const navigationExtras: NavigationExtras = {state: {dad_id: id}};
      this.router.navigate([nav_url], navigationExtras);
    }

    openDialogPanel(da_id: any){
      const dialogRef = this.dialog.open(OpenDialogDaHistory, {
        height: '500px',
        width: '850px',
        maxWidth:'100%',
        data: {
             da_id: da_id
              }
      });
    }
}

@Component({
  selector: 'open-dialog-panel',
  templateUrl: 'da-history.html'
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
export class OpenDialogDaHistory {
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;
  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  dtInstance: Promise<DataTables.Api>;
  dtElement: DataTableDirective;

  da_id:any="";
  //da_work_details:any="";
  
  // tableShow: boolean = false;
  // displayedColumns = ['Sl.no','Employee Name', 'Date', 'Remarks'];
  // dataSource = new MatTableDataSource<['']>();
  
  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogDaHistory>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
    {
      this.da_id=data.da_id;
      console.log("DA Id=", this.da_id);
      this.getDAWorkDetails();

      this.dtOptions = {
        dom: 'Bfrtip',
        ordering: false,
        paging:false,
        processing: true,
        //scrollX: true,
        retrieve: true,
      };
    }

    getDAWorkDetails()
    {
      let url = "logistics_da_remarks/getDaWorkDetailsBasedOnDaId/";
      let data = {
        da_id : this.da_id
      }
      this.apiService.postData(url, data).then((response: any) => {
        if(response.length != 0)
      {
        this.toast.success("Records Found!")
            this.tablelist=response;
              this.dtTrigger.next(void 0);
            console.log("DA Work values =", this.tablelist)
      }
      else
          {
            this.toast.error("No Records Found")
          } 

        // this.dataSource = new MatTableDataSource(res);
        // this.dataSource.data = res;
        console.log("DA Work Details=", this.tablelist)
        })
    }

    dialogClose(){
      this.dialogRef.close();
    }
  }

