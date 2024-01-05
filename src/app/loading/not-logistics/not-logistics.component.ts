import { Component, OnInit , OnDestroy ,ViewChild, Inject, AfterViewInit, ViewChildren, QueryList} from '@angular/core';
import {UntypedFormGroup,FormControl, FormGroupDirective, NgForm, Validators, UntypedFormArray,UntypedFormBuilder } from '@angular/forms';
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
  selector: 'app-not-logistics',
  templateUrl: './not-logistics.component.html',
  styleUrls: ['./not-logistics.component.css']
})
export class NotLogisticsComponent implements OnInit {

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  dtInstance: Promise<DataTables.Api>;
  dtElement: DataTableDirective;
 public unmatched_record_tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    public toast:ToastrService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getUnmatchedLRNNoList();
    this.dtOptions = {
      dom: 'Bfrtip',
      ordering: false,
      retrieve: true,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };
  }

  getUnmatchedLRNNoList(){
    this.api.getData("vehicle_billing_details/getNotLogisticsTransportCostReport/").then((response)=>{
      this.unmatched_record_tablelist=response;
      console.log(this.unmatched_record_tablelist);
      console.log("table values =", this.unmatched_record_tablelist)
      this.dtTrigger.next(void 0);   
    },(error)=>{
        console.log("error");
    })
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

  viewAttachedDocuments(element)
  {
    const dialogRef = this.dialog.open(OpenViewAttachedFileDocuments, {
      height: '300px',
      width: '650px',
      maxWidth:'100%',
      data: {
        element: element,
            }
    });
  }


}


@Component({
  selector: 'open-dialog-panel',
  templateUrl: 'upload-bills.html'
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
        // formData_multi.append('da_id',this.data.element.delivery_challan[0].da_id_id);
        // formData_multi.append("challan_no",this.data.element.delivery_challan[0].challen_no);
        // formData_multi.append("inv_no",this.data.element.delivery_challan[0].inv_no);
       // debugger
        formData_multi.append('da_id','1');
        formData_multi.append("challan_no", null);
        formData_multi.append("inv_no", null);
        formData_multi.append("module_name", "not-logistics");
        formData_multi.append("filetype", this.fileType);
       formData_multi.append("lrn_no",this.data.element.lrn_no);

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
    templateUrl: 'view-uploaded-files.html'
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
    let data_multi={
        //da_id:this.da_id,
        // 'da_id':this.data.element.da_id,
        // 'challan_no':this.data.element.challen_no,
        // 'inv_no':this.data.element.inv_no,
        'filetype':27,
        'lrn_no':this.data.element.lrn_no,
        }    
        console.log("multi file data=", data_multi)
    this.apiService.postData("multi_files/getNotLogisticsFiles/",data_multi).then((response:any)=>{
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


