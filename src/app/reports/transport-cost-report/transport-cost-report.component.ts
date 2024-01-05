import { Component, OnInit ,OnDestroy ,ViewChild, Inject} from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, FormGroupDirective, NgForm, Validators, UntypedFormArray,UntypedFormBuilder } from '@angular/forms';
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
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transport-cost-report',
  templateUrl: './transport-cost-report.component.html',
  styleUrls: ['./transport-cost-report.component.css']
})
export class TransportCostReportComponent implements OnInit {
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public form:UntypedFormGroup;
  dtInstance: Promise<DataTables.Api>;
  dtElement: DataTableDirective;

  filterDataForm:boolean=false;
  date_type:any="";
  date_flag:boolean=false;
  length:any="";
  public customer_name_list:any;

  fromdate: any = '';
  todate: any = '';

  transportationlist:any="";
  trucktypeslist:any="";
  DaIdList:any="";
  deliveryModeList:any="";
  resultList:any="";
  apiUrl = environment.apiUrl;
  public action = "Upload Invoice Scan Files";

  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    private http: HttpClient,
    public toast:ToastrService) { 
      this.form = this.fb.group({

        da_date: new UntypedFormControl(),
        da_no: new UntypedFormControl(),
        po_no: new UntypedFormControl(),
        so_no: new UntypedFormControl(),  
        customer_no: new UntypedFormControl(), 
        date_type:new UntypedFormControl(), 
         
        
        fromDate:new UntypedFormControl(),
        toDate:new UntypedFormControl(),

        project_id:new UntypedFormControl(),
        business_unit:new UntypedFormControl(),
        ship_to_city:new UntypedFormControl(),
        ship_to_party_name:new UntypedFormControl(),
        transporter_name:new UntypedFormControl(),
        reference_document:new UntypedFormControl(),
        delivery_mode:new UntypedFormControl(),
        customer_name:new UntypedFormControl(),
        delivery_challan_no:new UntypedFormControl(),
        tax_inv_no:new UntypedFormControl(),
        lr_no:new UntypedFormControl(),
        truck_type:new UntypedFormControl(),
        transporter_bill_number:new UntypedFormControl(),
      })
    }

    ngOnInit(): void {
      let data={
        "filter_fields": {
          id:1
        } }
       data.filter_fields["key3"]='san';
       console.log("sandeep",data); 
      this.getTransportationList();
      this.dispatchAdviceList();
      //this.CurrentDateTruckList();
      this.getDeliveryModeList();
      this.getCustomerNameList();
      this.getTruckTypeList();
  
      this.dtOptions = {
        dom: 'Bfrtip',
        ordering: false,
        paging:false,
        processing: true,
        scrollX: true,
        retrieve:true
      };
      this.rerender();
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

    CurrentDateTruckList(){
      let url = "transport_report/getCurrentDateFilteredList/";
      this.api.getData(url).then((res: any) => {
        this.tablelist=res.data;
        console.log("Transport report data=", this.tablelist)
        //console.log(this.tablelist);
        this.dtTrigger.next(void 0);   
      },(error)=>{
          console.log("error");
      })
    }


    getListOfDispatchValues(){
      this.api.getData("transport_report/").then((response:any)=>{
        this.tablelist=response.data;
       console.log("Transport Cost Report Data=",this.tablelist)
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

    getDeliveryModeList()
    {
      this.api.getData("logistics_delivery_mode/").then((response)=>{
        this.deliveryModeList=response;
        console.log("Delivery Mode List=", this.deliveryModeList)
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

    getRecordsBasedOnFilterData()
    {
      let data={
        "date_flag": this.date_flag,
        //"date_type":this.date_type,
        "date_type":this.form.value.date_type,
        "da_id": this.form.value.da_no == ''?null:this.form.value.da_no,
        "customer_name": this.form.value.customer_name == ''?null:this.form.value.customer_name,
        "delivery_mode": this.form.value.delivery_mode == ''?null:this.form.value.delivery_mode,
        "transporter_name": this.form.value.transporter_name == ''?null:this.form.value.transporter_name,
        "lr_no": this.form.value.lr_no == ''?null:this.form.value.lr_no,
        "truck_type": this.form.value.truck_type == ''?null:this.form.value.truck_type,
        "ygs_proj_defi":this.form.value.project_id == ''?null:this.form.value.project_id,
        "ship_to_city":this.form.value.ship_to_city == ''?null:this.form.value.ship_to_city,
        "start_date":this.fromdate,
        "end_date":this.todate,
        "transporter_bill_number":this.form.value.transporter_bill_number == ''?null:this.form.value.transporter_bill_number,
        "filter_data":  false,
        "filter_fields": {
        }
      }
      // if(this.form.value.project_id != null)
      //  {
      //   data.filter_fields["project_id"]=this.form.value.project_id
      //   data.filter_data=true
      //  }
       if(this.form.value.reference_document != null)
       {
        data.filter_fields["reference_document"]=this.form.value.reference_document
        data.filter_data=true
       }
      //  if(this.form.value.ship_to_city !=null)
      //  {
      //   data.filter_fields["ship_to_city"]=this.form.value.ship_to_city
      //   data.filter_data=true
      //  }
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
      //  if(this.form.value.ship_to_party_name != null)
      //  {
      //   data.filter_fields["ship_to_party_name"]=this.form.value.ship_to_party_name
      //   data.filter_data=true
      //  }
      // if(this.form.value.delivery_mode != null)
      //  {
      //   data.filter_fields["delivery_mode"]=this.form.value.delivery_mode
      //   data.filter_data=true
      //  }
      //  if(this.form.value.transporter_name != null)
      //  {
      //   data.filter_fields["transporter_name"]=this.form.value.transporter_name
      //   data.filter_data=true
      //  }
       
        this.api.postData("transport_report/transport_filter_reports/",data).then((response:any)=>{
          if(response.length != 0)
          {
            this.rerender();
            this.toast.success("Records Found!")
            this.tablelist=response;
            this.dtTrigger.next(void 0);  
            this.length = response.length
            console.log("Insurance Report Data based on filter values =", this.tablelist)
          }
         else
          {
            this.rerender();
            this.toast.error("No Records Found")
            this.tablelist=response;
          } 
        },(error)=>{
            console.log("error");
        })
    }


    updateStatusValue(challanNo)
    {
      console.log("passed challan number=", challanNo)
      let data={
        "challan_no": challanNo,
    }
    this.api.postData("vehicle_billing_details/update_approvers_status/",data).then((response:any)=>{
      console.log("updated status column value=", response)
    },(error)=>{
      console.log("error");
  })
}

    sendMail(challanNo)
    {
      //dispatch advice 1176 create method
      //let mail_data=response.mail_data;
      let data={
        "challan_no": challanNo,
    }
    this.api.postData("vehicle_billing_details/mail/",data).then((response:any)=>{
      console.log("mail details=", response)
      let mail_data=response.mail_data;
            this.api.postData('logistics_dispatch_advice/alert_mail/', mail_data).then((mailres: any) => {
            })
    },(error)=>{
      console.log("error");
  })
  }

  openDialogPanel(element: any){
    const dialogRef = this.dialog.open(OpenDialogGodownStorageData, {
      height: '300px',
      width: '650px',
      maxWidth:'100%',
      data: {
           truck_tack: element
            }
    });
  }

  openUploadBillReceipts(element){
    const dialogRef = this.dialog.open(OpenUploadBillReceipts, {
      height: '300px',
      width: '650px',
      maxWidth:'100%',
      data: {
        element: element,
            }
    });
  }

  viewAttachedDocuments(element, type)
  {
    const dialogRef = this.dialog.open(OpenViewAttachedFileDocuments, {
      height: '300px',
      width: '650px',
      maxWidth:'100%',
      data: {
        element: element,
        type: type
            }
    });
  }

  getTransportCostFiles(element)
  {
    let data={
      'da_id':element.delivery_challan[0].da_id_id,
      'challan_no':element.delivery_challan[0].challen_no,
      'inv_no':element.delivery_challan[0].inv_no,
      'filetype':4,
    }
    console.log(data)
    let url = "multi_files/getTransportCostReportFiles/";
    this.api.postData(url,data).then(res => {
      if(res != 0)
      {
        this.resultList=res;
       // debugger;
        this.download_documents("uploads/multi_files/2023/01/17/17_25_17");
      }
    })
  }

  download_documents(url){
    let bearer = this.storage.getBearerToken();
      let headers =  {
        responseType: 'blob' as 'json',
        headers: new HttpHeaders({ 
        // 'Content-Type': 'text/html, application/xhtml+xml, image/webp, image/apng, application/xml', 
          'Authorization': 'Bearer'+' '+bearer,
        })};
   
    let data_multi={
        //url:url
        url:url
        }    
        this.http.post<any>(this.apiUrl + "files/download_file/", data_multi,headers).subscribe(
          (res: any) => {    
            let blob = new Blob([res], {type: res.type})
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'da_files');
            link.click();
          });
  }


}

@Component({
  selector: 'open-dialog-panel',
  templateUrl: 'godown-storage-details.html'
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
export class OpenDialogGodownStorageData {

  truck_list_id:any="";
  truckList:any="";
  
  tableShow: boolean = false;
  displayedColumns = ['slno','Moved To Godown', 'Moved From Godown', 'Remarks'];
  dataSource = new MatTableDataSource<['']>();
  
  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogGodownStorageData>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
    {
      this.truck_list_id=data.truck_tack;
      console.log("truck list id=", this.truck_list_id);
      this.getTruckDeliveryDetails();
    }

  getTruckDeliveryDetails()
  {
    let url = "logistics_truck_delivery_details/get_truck_delivery_details/";
    let data = {
      truck_id : this.truck_list_id
    }
    this.apiService.postData(url, data).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.truckList=res;
      let length = res.length
      console.log("Truck list=", this.truckList)
      })
  }


    dialogClose(){
      this.dialogRef.close();
    }
  }


  @Component({
    selector: 'open-dialog-panel',
    templateUrl: 'upload_bill_receipts.html'
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
  export class OpenUploadBillReceipts {
  
    truck_list_id:any="";
    truckList:any="";
    public da_files:any;
    public form:UntypedFormGroup;
    public da_submit_button:boolean=true;
    
    
    tableShow: boolean = false;
    displayedColumns = ['slno','Moved To Godown', 'Moved From Godown', 'Remarks'];
    dataSource = new MatTableDataSource<['']>();
    allTypeFiles: any;
    public fileTypes:any;
    da_id :any;
    challan_no:any;
    inv_no:any;
    apiUrl = environment.apiUrl;
    fileType:any='';
    
    
    constructor(
      public toast:ToastrService, 
      public fb: UntypedFormBuilder,
      public dialog: MatDialog,
      public apiService: ApiserviceService,
      public storage:StorageServiceService ,
      private http: HttpClient,
      public dialogRef: MatDialogRef<OpenUploadBillReceipts>,
      @Inject(MAT_DIALOG_DATA) public data: any
    )
      {
        this.form = this.fb.group({
          da_files: this.fb.array([]),
          insurance_files: new UntypedFormArray([]),
        })
        this.getListOfDispatchValues();
        this.addDaFiles();
      }

        daFiles() : UntypedFormArray {  
          return this.form.get("da_files") as UntypedFormArray  
        } 

        newDaFiles(): UntypedFormGroup { 
          return this.fb.group({  
            file_type: '',  
            filelist:new UntypedFormArray([]),  
          })  
        } 

        addDaFiles() {  
          this.daFiles().push(this.newDaFiles());  
        } 
        
        removeDaFiles(i:number) {  
          this.daFiles().removeAt(i);  
        }  

        onSelectFiles(event: any,columnindex:any) {
          let file = event.target.files;
          this.allTypeFiles=file;
            for(let obj of this.allTypeFiles){
              this.form.value.da_files[columnindex].filelist.push(obj);
            }
        }

        getListOfDispatchValues(){
          this.apiService.getData("logistics_DA_File_types/").then((response)=>{
            this.fileTypes=response;        
          },(error)=>{
              console.log("error");
          })
        }

        onSubmitPost()
        {
          let bearer = this.storage.getBearerToken();
        let headers = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer'+' '+bearer
          })
        };

        let obj={...this.form.value};
        console.log("obj",obj)

          const formData_multi: FormData  = new FormData();
          if (this.form.invalid) {
            this.toast.error("Please enter valid details");
            return;
          } 
          for  (var i =  0; i <  this.form.value.da_files.length; i++)  { 
            for(var j = 0 ; j < this.form.value.da_files[i].filelist.length; j++ ) 
            {
              formData_multi.append("files",this.form.value.da_files[i].filelist[j]);
              this.fileType = this.form.value.da_files[i].file_type
              //formData_multi.append("filetype", this.form.value.da_files[i].file_type);
            }
          }
          formData_multi.append('da_id',this.data.element.delivery_challan[0].da_id_id);
          formData_multi.append("challan_no",this.data.element.delivery_challan[0].challen_no);
          formData_multi.append("inv_no",this.data.element.delivery_challan[0].inv_no);
          formData_multi.append("module_name", "Report");
          formData_multi.append("filetype", this.fileType);
          formData_multi.append("lrn_no",this.data.element.delivery_challan[0].lrn_no);

          this.http.post<any>(this.apiUrl + "logistics_dispatch_advice/multifile_attachement_reports/", formData_multi,  headers).subscribe(
          (res: any) => {   
          if (res == true)
          {
            this.toast.success("Files Saved Successfully!")
            this.dialogRef.close();
          }
          else
          {
            this.toast.error("File Save Failed!")
            this.dialogRef.close();
          }       
          });
        }

      dialogClose(){
        this.dialogRef.close();
      }
    }


    @Component({
      selector: 'open-dialog-panel',
      templateUrl: 'view-attached-documents.html'
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
    export class OpenViewAttachedFileDocuments {
      apiUrl = environment.apiUrl;
      public da_id:any;
      public single_files:any;
      public multi_files:any;

      
      tableShow: boolean = false;
      displayedColumns = ['slno','Moved To Godown', 'Moved From Godown', 'Remarks'];
      dataSource = new MatTableDataSource<['']>();
      allTypeFiles: any;
      public fileTypes:any;
     
      challan_no:any;
      inv_no:any;

      fileType:any='';
      resultList:any='';
      
      
      constructor(
        public toast:ToastrService, 
        public fb: UntypedFormBuilder,
        public dialog: MatDialog,
        public apiService: ApiserviceService,
        public storage:StorageServiceService ,
        private http: HttpClient,
        public dialogRef: MatDialogRef<OpenViewAttachedFileDocuments>,
        @Inject(MAT_DIALOG_DATA) public data: any
      )
        {
          this.getDaDocument();
        }

  getDaDocument(){
    if(this.data.type == "invoice")
    {
      this.fileType = 24;
    }
    if(this.data.type == "pod")
    {
      this.fileType = 25;
    }
      let data_multi={
          //da_id:this.da_id,
          'da_id':this.data.element.delivery_challan[0].da_id_id,
          'challan_no':this.data.element.delivery_challan[0].challen_no,
          'inv_no':this.data.element.delivery_challan[0].inv_no,
          'filetype':this.fileType,
          'lrn_no':this.data.element.delivery_challan[0].lrn_no,
          }    
      this.apiService.postData("multi_files/getTransportCostReportFiles/",data_multi).then((response:any)=>{
        if(response.length != 0)
        {
         this.multi_files=response
         for(let i=0;i<this.multi_files.length;i++){
          let panel_tablearray:any=[];
          this.multi_files[i].file_list.map((products,index) => {
              let productObject = {... products };
              const pieces = productObject.files.split(/[\s/]+/)
              const last = pieces[pieces.length - 1]
              let file_ty=last.split(/[\s.]+/)
               productObject.file_type = file_ty[1];
               productObject.file_name = file_ty[0];
               panel_tablearray.push(productObject)
              })
              this.multi_files[i].file_list=panel_tablearray;
         }
        }
        else if(Response.length == 0)
        {
            this.toast.error("No Files Found")
        }
      }
     ,(error)=>{
            console.log("error");
        })
  }


  download_documents(file:any){
    let bearer = this.storage.getBearerToken();
      let headers =  {
        responseType: 'blob' as 'json',
        headers: new HttpHeaders({ 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer'+' '+bearer,
        })};
    let data_multi={
        url:"/"+file.files
        }    

        this.http.post<any>(this.apiUrl + "files/download_file/", data_multi,headers).subscribe(
          (res: any) => {    
            var headers = res.headers;
            console.log(headers); //<--- Check log for content disposition
            
            let blob = new Blob([res], {type: res.type})
            const url = window.URL.createObjectURL(blob);
            console.log(res.content_type);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.file_name+'.'+ file.file_type);
            link.click(); 
          });
  }
        
        deletesinglefile(element:any)
        {
          let url='files/'
          console.log(element);
          this.apiService.deleteUser(element,url).subscribe((data:any) =>
           {
            this.toast.success("Deleted");
            this.getDaDocument()
           })
        }

        deletemultifile(element:any)
        {
          let url='multi_files/'
          console.log(element);
          this.apiService.deleteUser(element,url).subscribe((data:any) =>
           {
            this.toast.success("Deleted");
            this.getDaDocument();
           })
        }

        dialogClose(){
          this.dialogRef.close();
        }
      
      }





  




  //   onSubmitPost(){
  //     if (this.form.invalid) {
  //       alert("Please enter valid details");
  //       return;
  //     }
  //   this.approve_button=false;
  //   this.form.value.da_id=this.da_id;
  //           let obj={...this.form.value};
  //           this.api.postData("dispatch_auth_thread/",obj).then((response:any)=>{
  //           this.form.reset();
  //           this.getDaThreads();
  //           this.toast.success("DA Approved Successfully");
  //           this.route.navigate(['material/DaApproval']);
  //           this.approve_button=true;
  //           let mail_data=response.mail_data;
  //           this.api.postData('logistics_dispatch_advice/alert_mail/', mail_data).then((mailres: any) => {
          
  //           })
                      
  //          },(error)=>{
  //              console.log("error");
  //          })
  // }






// getRecordsBasedOnFilterData()
//     {
//       let data={
//         "date_flag": this.date_flag,
//         "date_type":this.date_type,
//         "start_date":this.fromdate,
//         "end_date":this.todate,
//         "filter_data":  true,
//         "filter_fields": {
//           //"project_id": this.form.value.project_id,
//           "reference_document": this.form.value.reference_document,
//           //"business_unit":this.form.value.business_unit,
//           "ship_to_city":this.form.value.ship_to_city,
//           "ship_to_party_name":this.form.value.ship_to_party_name,
//           "transporter_name":this.form.value.transporter_name,
//         }
//       }
//         this.api.postData("transport_report/transport_filter_reports/",data).then((response:any)=>{
//           this.tablelist=response;
//           console.log("Transport Cost Report Data based on filter values =", this.tablelist)
//           this.dtTrigger.next(void 0);   
//         },(error)=>{
//             console.log("error");
//         })
//     }
