import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import {ErrorStateMatcher} from '@angular/material/core';
import { FormGroupDirective, NgForm} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';
import { Subject } from 'rxjs';
import {Params} from '@angular/router';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
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

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.css']
})
export class DocumentDetailsComponent implements OnInit {

  apiUrl = environment.apiUrl;

  public da_id:any;
  public single_files:any;
  public multi_files:any;
 
  constructor(public api: ApiserviceService,
    private http: HttpClient,
     private activatedroute: ActivatedRoute,
     private router: Router,
     public toast:ToastrService, 
     public storage:StorageServiceService,
     public dialog: MatDialog,) {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as { dad_id: string };
      if(state != undefined){
        
        this.da_id = state.dad_id
       }else{
        this.da_id = this.storage.getda_id()
       }

    

   }  

  ngOnInit(): void {
    this.getDaDocument();

   


   
  }
  
  getDaDocument(){
    let data_single={
      da_files_filter:{
        da_id_id:this.da_id,
        }   
    }
    this.api.postData("files/da_fileattachment_filter/",data_single).then((response:any)=>{
         this.single_files=response;
         console.log("files",this.single_files);

         let single_tablearray:any=[];
         this.single_files.map((products,index) => {
          let productObject = {... products };
          const pieces = productObject.files.split(/[\s/]+/)
          const last = pieces[pieces.length - 1]
          let file_ty=last.split(/[\s.]+/)
          
           productObject.file_type = file_ty[1];
           productObject.file_name = file_ty[0];

           single_tablearray.push(productObject)
   
          })

          this.single_files=single_tablearray;
       
         
      },(error)=>{
          console.log("error");
      })
      let data_multi={
       
          da_id:this.da_id,
          }    
      
      this.api.postData("multi_files/da_multifileattachment_filter_groupby/",data_multi).then((response:any)=>{
       

        
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
         


         
        
         
           
        },(error)=>{
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
    this.api.deleteUser(element,url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      this.getDaDocument()
     
     })
  }
  deletemultifile(element:any)
  {
    let url='multi_files/'
    console.log(element);
    this.api.deleteUser(element,url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      this.getDaDocument()
     
     })
  }

  dafile_upload(da_id: any){
    const dialogRef = this.dialog.open(DaFileUpload, {
      height: '500px',
      width: '1354px',
      maxWidth:'100%',
      
      data: {
            da_id:da_id
            
            }
    });
    dialogRef.afterClosed().subscribe(result => {
        this.getDaDocument();
    
    });
  }
}
@Component({
  selector: 'da-file-upload',
  templateUrl: 'da-file-upload.html'
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
export class DaFileUpload{

  matcher = new MyErrorStateMatcher();
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
    public dialogRef: MatDialogRef<DaFileUpload>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
    
   
   this.form=this.fb.group({
      da_files: this.fb.array([]),
    });
    this.getfiletype();
    this.addDaFiles();

    
   
    
    
  
    }
    get f() { return this.form.controls; }
    getfiletype(){  
      
      
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
    
    onfileUpload(){


      let bearer = this.storage.getBearerToken();
      let headers = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer'+' '+bearer
        })
      };
      const formData_multi: FormData  = new FormData();

      for  (var i =  0; i <  this.form.value.da_files.length; i++) {     
        for(var j = 0 ; j < this.form.value.da_files[i].filelist.length; j++ ) 
        {
          formData_multi.append(this.form.value.da_files[i].file_type,this.form.value.da_files[i].filelist[j]);
        }
      }
            
      formData_multi.append('da_id', JSON.stringify(this.data.da_id));
      formData_multi.append("module_id",JSON.stringify(this.data.da_id ));
      formData_multi.append("module_name","DA");
      this.http.post<any>(this.apiUrl + "logistics_dispatch_advice/multifile_attachement/", formData_multi,  headers).subscribe(
        (res: any) => {          
          this.toast.success("file uploaded successfully ")
      }); 
             
    }
   
  
    
    
    
  }