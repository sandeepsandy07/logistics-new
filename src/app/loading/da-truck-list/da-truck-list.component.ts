import { Component, OnInit, Inject, ViewChild, ElementRef,ViewChildren ,QueryList} from '@angular/core';
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
  UntypedFormArray,
   
} from "@angular/forms";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import {DataTableDirective} from 'angular-datatables';

// import {Router} from '@angular/router'; 
// import { NavigationExtras } from '@angular/router';
// import { DatePipe } from '@angular/common';
// import { StorageServiceService } from 'src/app/service-storage.service';

@Component({
  selector: 'app-da-truck-list',
  templateUrl: './da-truck-list.component.html',
  styleUrls: ['./da-truck-list.component.css']
})
export class DaTruckListComponent implements OnInit {

  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public tablelist2:any;
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();
  public form: UntypedFormGroup;

  public showfilter:boolean=false;
  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    public dialog: MatDialog,
    private fb:UntypedFormBuilder) { 

      this.form = this.fb.group({
        fromdate: new UntypedFormControl(null),
        todate: new UntypedFormControl(null),
        da_no: new UntypedFormControl(null),
        so_no: new UntypedFormControl(null),
        lrn_no: new UntypedFormControl(null),
        vehicle_no: new UntypedFormControl(null)
      })
    }

  ngOnInit(): void {

    this.getListOfDispatchValues();

    this.dtOptions = {
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };
    this.dtOptions2 = {
      
      dom: 'Bfrtip',
      retrieve: true,
      ordering: false,
      pagingType: 'full_numbers',
      
      processing: true
    };
  }
  daNavigation(id,nav_url,actions,readonly,screenvalue){
    const navigationExtras: NavigationExtras = {state: {dad_id: id,action: actions,readonly:readonly,screenvalue:screenvalue}};
    this.route.navigate([nav_url], navigationExtras);
  }
  daNavigation_tab(id,nav_url){
            
    this.storage.settruck_id(id);
       const url = this.route.serializeUrl(
        this.route.createUrlTree(['/loading/truckdeliverychallan'])
      );
  
      window.open(url, '_blank');
  } 

  // dalistNavigation(id,nav_url,actions,readonly,screenvalue)
  // {
  //   const navigationExtras: NavigationExtras = {state: {dad_id: id,action: actions,readonly:readonly,screenvalue:screenvalue}};
  //   this.route.navigate([nav_url], navigationExtras);
  // }
  getListOfDispatchValues(){  
    let data={
     
      filter_da:false,
      filter_dc:false,
      
      truck_filter:{
        loaded_flag:true,
        tracking_status:0
        },
      da_filter:{

        },
      DC_filter:{

      }
    }   
    this.api.postData("logistics_truck_list/get_truck_list_based_on_status/",data).then((response)=>{
      this.tablelist=response;
      this.dtTrigger.next(void 0);
      if (Response) {
        this.hideloader();
      }
    },(error)=>{
        console.log("error");
    })

  }

  getRecordsBasedOnFilterData() {

    let data = {
     
      filter_da:false,
      filter_dc:false,
      
      truck_filter:{
        loaded_flag:true
        },
      da_filter:{

        },
      DC_filter:{

      }

    }
   
    if (this.form.value.so_no != null && this.form.value.so_no ) {
      data.da_filter["so_no"] = this.form.value.so_no
      data.filter_da = true
    }
   
    if (this.form.value.da_no != null && this.form.value.da_no) {
      data.da_filter["jobcode_da_no"] = this.form.value.da_no
      data.filter_da = true
    }
    if (this.form.value.lrn_no != null && this.form.value.lrn_no ) {
      data.DC_filter["lrn_no"] = this.form.value.lrn_no
      data.filter_dc = true
    }
    if (this.form.value.vehicle_no != null && this.form.value.vehicle_no ) {
      data.truck_filter["vehicle_no"] = this.form.value.vehicle_no
     
    }
   
    
    this.api.postData("logistics_truck_list/get_truck_list_based_on_status/",data).then((response)=>{
      this.tablelist2=response;
      
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger2.next(void 0);
          this.dtTrigger.next(void 0);       
        });
      });
     
    }, (error) => {
      console.log("error");
    })


  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }
  rerender(): void {
   
  }
  clearAllFilterDataFields() {
    this.form.reset();
    let data = {
      type: 'packing_approver',    
      from_date:this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
      to_date:this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
      filter_date:true,
      filter_data: false,
      filter_fields: {
        approve_flag: true,
      }
    }

    this.api.postData("dispatch_user_allocation/user_based_da_list_with_status_packed/",  data).then((response: any) => {


      this.tablelist2 = response;
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger2.next(void 0);
          this.dtTrigger.next(void 0);       
        });
      });
    
     
    }, (error) => {
      console.log("error");
    })

  }
  

    hideloader() {
document.getElementById('loading') .style.display = 'none';       
}

generateDispatchDetailsPdf(trucklist_id,da_id)
{
  let url = "logistics_truck_list/dispatch_details_form/"
  let data = {
    da_id : da_id,
    trucklist_id : trucklist_id
  }
  this.api.downloadPDF(url, data).then((data) => {
    var downloadURL = window.URL.createObjectURL(data);
    let tab = window.open();
    tab.location.href = downloadURL;
  });
}

generateAnnexurePdf(truck_id)
{
  let url = "logistics_truck_list/generateAnnexureToDeliveryChallan/"
  let data = {
    trucklist_id : truck_id
  }
  this.api.downloadPDF(url, data).then((data) => {
       var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
  });

}
openTruckFileUploadView(truck_id: any){
  const dialogRef = this.dialog.open(TruckFileUploadView, {
    height: '500px',
    width: '1354px',
    maxWidth:'100%',
    
    data: {
          truck_id:truck_id
          
          }
  });
}

getTruckDetails()
{
  const dialogRef = this.dialog.open(TruckDetailsPdf, {
    height: '70%',
    width: '90%',
    maxWidth:'100%',
  });
  dialogRef.afterClosed().subscribe(result => {
  });
}



}
@Component({
  selector: 'truck-file-upload-view',
  templateUrl: 'truck-file-upload-view.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 80%;
      max-width:50% !important;
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class TruckFileUploadView{

 
  form:UntypedFormGroup;
  bigBoxDetails:any;
  list: any;
  resultbox:Array<any>=[];
  sectionName:any;
  panelName:any;
  box_types:any;
  public allTypeFiles:any;
  box_entered = [];
  bigbox_details:any;
  sub_bigbox_details:any;
  showdetailsof_box_items:boolean=false;
  public truck_details:any;
  public fileTypes:any;
  apiUrl = environment.apiUrl;
  public multi_files:any;
  

  tableShow= 1;

  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public api: ApiserviceService,
    public storage:StorageServiceService ,
    private http: HttpClient,
    public dialogRef: MatDialogRef<TruckFileUploadView>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
    
   this.gettruckDetails(data.truck_id);
   this.form=this.fb.group({
      da_files: this.fb.array([]),
    });
    this.getruckDocument();
    this.addDaFiles();
    }

    gettruckDetails(truckid){  
      let data={
        truck_id:truckid
      }
      this.api.postData("logistics_truck_list/get_truck_details/",data).then((response)=>{
        this.truck_details=response;
    
       
      },(error)=>{
          console.log("error");
      })
      this.api.getData("logistics_DA_File_types/").then((response)=>{
        this.fileTypes=response;        
      },(error)=>{
          console.log("error");
      })
  
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
    dialogClose(){
      this.dialogRef.close();
    }
    addBoxTo
    onfileUpload(){
      let bearer = this.storage.getBearerToken();
      let headers = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer'+' '+bearer
        })
      };
      const formData_multi: FormData  = new FormData();
      for  (var i =  0; i <  this.form.value.da_files.length; i++)  { 
        for(var j = 0 ; j < this.form.value.da_files[i].filelist.length; j++ ) 
        {
          formData_multi.append(this.form.value.da_files[i].file_type,this.form.value.da_files[i].filelist[j]);
        }
      }
      formData_multi.append('da_id', JSON.stringify(this.truck_details.da_id[0]));
      formData_multi.append("module_id",JSON.stringify(this.data.truck_id ));
      formData_multi.append("module_name","Truck");
      this.http.post<any>(this.apiUrl + "logistics_dispatch_advice/multifile_attachement/", formData_multi,  headers).subscribe(
        (res: any) => {                 
      }); 
      
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
  getruckDocument(){
    let data_multi={
      da_multi_files_filter:{
        module_id:this.data.truck_id,
        module_name:'Truck',
        }    
    }
    this.api.postData("multi_files/da_multifileattachment_filter/",data_multi).then((response:any)=>{
      this.multi_files=response;
      
       
         
      },(error)=>{
          console.log("error");
      })
    }

    
  }

  @Component({
    selector: 'truckdetailspdf',
    templateUrl: 'TruckDetailsPdf.html',
     styles: [`
      :host {
        width:'60%'
      }
  
      mat-dialog-content {
        flex-grow: 1;
      }
    `]
  })
  export class TruckDetailsPdf {
  
    CreateForm:boolean=true;
    DaIdList:any="";
    daId:any="";
    mainForm:boolean=true;
    listForm:boolean=false;
    itemsArr: any = [];
    DaTruckList:any="";
    len:any="";
    dispatchParticularList:any="";
  
    constructor(
      public api: ApiserviceService,
      public dialogRef: MatDialogRef<TruckDetailsPdf>,
      public toast:ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any)
      {
        //this.departmentName();
        this.dispatchAdviceList();
      }

      dispatchAdviceList(){
        let url = "logistics_dispatch_advice/dispatch_advice_reports_list/";
        this.api.getData(url).then((res: any) => {
          this.DaIdList = res;
          console.log("Dispatch Advice list=", this.DaIdList)
        });
      }
  
      // dispatchAdviceList(){
      //   let url = "logistics_dispatch_advice/";
      //   this.api.getData(url).then((res: any) => {
      //     this.DaIdList = res;
      //     console.log("Dispatch Advice list=", this.DaIdList)
      //   });
      // }
  
      getDaTruckList()
      {
        this.listForm=true
        let data={
          'da_id':this.daId
        }
        console.log(data)
        let url = "logistics_da_truck_list/getDaTruckListData/";
        this.api.postData(url,data).then((res:any) => {
          //this.DaTruckList = res;
          //this.len = res.length
         if(res == false)
         {
          this.DaTruckList = null;
          this.toast.error("There are no truck for selected DA_ID")
         }
         else
         {
          this.DaTruckList = res;
          console.log(" Da truck Result List based on DAID",res)
         }
        })
      }

  
      onOptionsSelected(value)
      {
        this.listForm=true
        console.log("Selected DaNo=", value)
        let data={
          'da_id':value
        }
        console.log(data)
        let url = "logistics_da_truck_list/getDaTruckListData/";
        this.api.postData(url,data).then((res:any) => {
          //this.DaTruckList = res;
          //debugger;
          this.len = res.length
         if(this.len == 0)
         {
          this.DaTruckList = null;
          this.toast.error("There are no truck for selected DA_ID")
         }
         else
         {
          debugger
          this.DaTruckList = res;
          console.log(" Da truck Result List based on DAID",res)
         }
        })
      }
  
  setCheckbox(data:any, i:any, check:any)
  {
  console.log("data=",data)
  console.log("i",i)
  console.log("check=",check)
  if(check == true)
  {
      // let val = {
      //   'trucklist_id':data.truckListID,
      //   'da_id':this.daId
      // }
      // let val = {
      //   'trucklist_id':data.truckListID,
      // }
      //this.itemsArr.push(val);
      this.itemsArr.push(data.truckListID);
    }
    console.log("truck list id array before=", this.itemsArr)
    if(check == false)
    {
      let truckListID = data.truckListID
        let index = this.itemsArr.indexOf(truckListID);
        this.itemsArr.splice(index, 1);
       // this.itemsArr.filter(truckListID)
        console.log("truck list id array after=", this.itemsArr)
    }
  }

  generateDispatchDetailsPdf(trucklist_id,da_id)
{
  let url = "logistics_truck_list/dispatch_details_form/"
  let data = {
    da_id : da_id,
    trucklist_id : trucklist_id
    // trucklist_id : trucklist_id
  }
  this.api.downloadPDF(url, data).then((data) => {
    var downloadURL = window.URL.createObjectURL(data);
    let tab = window.open();
    tab.location.href = downloadURL;
  });
}

  getTruckListPdf()
  {
    let url = "logistics_truck_list/dispatch_details_form_new/"
    let data = {
      "da_id":this.daId,
      trucklist_id:this.itemsArr
    }
        this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    });
  }
  
  
  // getTruckListPdf()
  // {
  //   let url = "logistics_dispatch_particulars/createDispatchParticulars/"
  //   let data = {
  //                 "da_id":this.daId,
  //                 //record:this.itemsArr
  //                 "trucklist_id":this.itemsArr
  //               }
  //   this.api.postData(url,data).then((res:any) => {
  //     this.dispatchParticularList = res;
  //     console.log("Result List based on DAID",res)
  //     if(this.dispatchParticularList != null)
  //     {
  //        //let url = "logistics_truck_list/dispatch_details_form_new/"
  //        let url = "logistics_truck_list/dispatch_particular_on_dp_id/"
  //   let data = {
  //     "da_id": this.daId,
  //     'dp_id':this.dispatchParticularList,
  //   }
  //   this.api.downloadPDF(url, data).then((data) => {
  //     var downloadURL = window.URL.createObjectURL(data);
  //     let tab = window.open();
  //     tab.location.href = downloadURL;
  
  //   //      let blob = new Blob([data], {type: data.type})
  //   //   const url = window.URL.createObjectURL(blob);
  //   //   const link = document.createElement('a');
  //   //   link.href = url;
  //   //  link.setAttribute('download', 'dispatchDetails_report');
  //   //   link.click();
  //   //   this.dialogRef.close();
  //   });
  //     }
  //   })
  
  //   // let url = "logistics_truck_list/dispatch_details_form_new/"
  //   // let data = {
  //   //   record:this.itemsArr
  //   // }
  //   // this.api.downloadPDF(url, data).then((data) => {
  //   //   var downloadURL = window.URL.createObjectURL(data);
  //   //   let tab = window.open();
  //   //   tab.location.href = downloadURL;
  
  //   //      let blob = new Blob([data], {type: data.type})
  //   //   const url = window.URL.createObjectURL(blob);
  //   //   const link = document.createElement('a');
  //   //   link.href = url;
  //   //   link.setAttribute('download', 'dispatchDetails_report');
  //   //   link.click();
  //   // });
  // }
  
  
  fileDownload(){
    let url = "logistics_panel_wise_material/download_report/"
    this.api.download(url).subscribe((response)=>{
      let blob = new Blob([response], {type: response.type})
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'logistics_report');
      link.click();
    })
  }
  
    dialogClose(){
      this.dialogRef.close();
    }
  
    generateMultipleAnnexurePdf()
  {
    let url = "logistics_truck_list/multiplegenerateAnnexureToDeliveryChallan/"
    let data = {
     "trucklist_id":this.itemsArr
    }
    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    });
  }
  
  }



