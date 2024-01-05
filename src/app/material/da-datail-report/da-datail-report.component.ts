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
  selector: 'app-da-datail-report',
  templateUrl: './da-datail-report.component.html',
  styleUrls: ['./da-datail-report.component.css']
})
export class DaDatailReportComponent implements OnInit {

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
  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    private router: Router,
    public toast:ToastrService) { 

      // const navigation = this.router.getCurrentNavigation();
      // const state = navigation.extras.state as { filter_data: boolean ,business_unit_list:any};
      // this.filter_data_value = state.filter_data;
      // if(this.filter_data_value){
      //   this.business_unit_list=state.business_unit_list;
      //   console.log("aaa",this.business_unit_list)
      // }

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
        this.hideloader()
   
     
      // this.dispatchAdviceList();
      this.getBusinessUnitList();
      // if(this.filter_data_value){
      //   this.da_list_filter=[]
      //   for(let i of this.business_unit_list ){
         
      //     this.da_list_filter.push(i['da_id'])
      //   }
       
      //   this.getRecordsBasedOnFilterData();
      // }

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
  hideloader() {
    document.getElementById('loading') .style.display = 'none';       
    }
    showloader() {
      document.getElementById('loading') .style.display = 'block';       
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
      let data={}
      this.api.postData("dispatch_auth_thread/get_pm_list/",data).then((response:any)=>{

        this.pm_list=response;
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


    onDateTypeSelected(dateType)
    {
      this.date_type = dateType
      this.form.value.date_type = dateType
   
      this.date_flag = true;
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
        "dept_id":this.business_unit_list,
        "dept_id_val":false,
        "da_list_filter":this.da_list_filter,
        //"business_unit":  false,
        "filter_fields": {

        }
      }
      
      if (this.form.value.pm != null && this.form.value.pm) {
        data.pm = this.form.value.pm.toString()
      }
      if (this.date_flag == true && (!this.fromdate  || !this.todate  )) {
        this.toast.error("Select date Range")
        return;

      }
      if (this.date_flag == false && (this.fromdate  || this.todate  )) {
        this.toast.error("Select date Type")
        return;

      }
      console.log(data)
      
       if(this.form.value.status != null)
       {
        data.filter_fields["da_status_number"]=this.form.value.status
        data.filter_data=true
       }
       if(this.form.value.da_no !=null)
       {
        data.filter_fields["jobcode_da_no"]=this.form.value.da_no
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
       this.showloader();
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
        
        this.dtTrigger.next(void 0);
        this.hideloader()
        document.getElementById("myBtn").style.height = "50px";
        },(error)=>{
            console.log("error");
            this.hideloader()
        })
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
}
