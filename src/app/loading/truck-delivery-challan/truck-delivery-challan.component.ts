import { Component, OnInit ,OnDestroy,Inject } from '@angular/core';
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
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-truck-delivery-challan',
  templateUrl: './truck-delivery-challan.component.html',
  styleUrls: ['./truck-delivery-challan.component.css']
})
export class TruckDeliveryChallanComponent implements OnInit {

  public form:UntypedFormGroup;
  matcher = new MyErrorStateMatcher();
  public edit:boolean=false;
  public truck_id:any;
  public action:any;
  public truck_details:any;
  public allTypeFiles:any;
  public fileTypes:any;
  public truck_channel:any;
  public isReadOnly:boolean=false;
  public bigbox_details_count:any;
  public screenvalue:boolean=false;

  public truck_channel_id:any;
  apiUrl = environment.apiUrl;
  DaIdList:any="";
  public da_Id:any;


  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private http: HttpClient,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    public toast:ToastrService,
    public dialog: MatDialog, 
    private fb:UntypedFormBuilder) { 
      if(this.storage.gettruck_id()== false){
        const navigation = this.route.getCurrentNavigation();
        const state = navigation.extras.state as {dad_id: string,action: string,readonly:boolean, screenvalue:boolean};
       
        this.truck_id = state.dad_id;
        this.action = state.action;
        this.isReadOnly=state.readonly; 
        this.screenvalue=state.screenvalue
       }else{
        this.truck_id =this.storage.gettruck_id()
        this.action = 'view';
        this.isReadOnly=true; 
        this.screenvalue=true
       }
      // const navigation = this.route.getCurrentNavigation();
      // const state = navigation.extras.state as {dad_id: string,action: string,readonly:boolean, screenvalue:boolean};
     
      // this.truck_id = state.dad_id;
      // this.action = state.action;
      // this.isReadOnly=state.readonly; 
      // this.screenvalue=state.screenvalue
      console.log("test",this.screenvalue)
      this.form=this.fb.group({

        trucklist_id:new UntypedFormControl(null),
        inv_no:new UntypedFormControl(null),
        inv_date:new UntypedFormControl(null),
        inv_amount:new UntypedFormControl(null),
        truck_amount:new UntypedFormControl(null),
        challen_no:new UntypedFormControl(null),
        challen_date:new UntypedFormControl(null),
        lrn_no:new UntypedFormControl(null,{validators:[Validators.required]}),
        lrn_date:new UntypedFormControl(null,{validators:[Validators.required]}),
        qty:new UntypedFormControl(null,{validators:[Validators.required]}),
        uom:new UntypedFormControl(null),
        transportation_type:new UntypedFormControl(null,{validators:[Validators.required]}),
        eway_bill_no:new UntypedFormControl(null),
        da_id:new UntypedFormControl(null),
        da_files: this.fb.array([]),
        inv_no2:new UntypedFormControl(null),
        inv_date2:new UntypedFormControl(null),
        inv_amount2:new UntypedFormControl(null),
      })

    }

  ngOnInit(): void {
    if(this.action !='Create'){
      this.onEditMode();
    }
    this.gettruckDetails(this.truck_id)
    this.addDaFiles();
    this.dispatchAdviceList();
  }
  get f() { return this.form.controls; }

  onEditMode()
  {
    
    let data={
      truck_id:this.truck_id 
    }
    this.api.postData("logistics_truck_delivery_challan/filter_based_on_da_and_truckid/",data).then((response)=>{
     
      this.truck_channel=response[0];
      this.truck_channel_id=this.truck_channel.id;
      this.form.patchValue({
        trucklist_id:this.truck_channel.trucklist_id?this.truck_channel.trucklist_id:null,
        inv_no:this.truck_channel.inv_no?this.truck_channel.inv_no:null,
        inv_date:this.truck_channel['inv_date']?this.truck_channel['inv_date']:null,
        inv_amount:this.truck_channel['inv_amount']?this.truck_channel['inv_amount']:null,
        truck_amount:this.truck_channel['truck_amount']?this.truck_channel['truck_amount']:null,
        challen_no:this.truck_channel['challen_no']?this.truck_channel['challen_no']:null,
        // challen_date:this.truck_channel['challen_date']?this.truck_channel['challen_datev']:null,
        challen_date:this.truck_channel['challen_date']?this.truck_channel['challen_date']:null,
        lrn_no:this.truck_channel['lrn_no']?this.truck_channel['lrn_no']:null,
        lrn_date:this.truck_channel['lrn_date']?this.truck_channel['lrn_date']:null,
        qty:this.truck_channel['qty']?this.truck_channel['qty']:null,
        //qty:this.truck_channel['qty']?this.truck_channel['qty']:null,
        uom:this.truck_channel['da_to']?this.truck_channel['da_to']:null,
        eway_bill_no:this.truck_channel['eway_bill_no']?this.truck_channel['eway_bill_no']:null,
        da_id:this.truck_channel['da_id']?this.truck_channel['da_id']:null,

        transportation_type:this.truck_channel.transportation_type?this.truck_channel.transportation_type:null,

})
  
    },(error)=>{
        console.log("error");
    })
  }

  moveTruckToGoDown()
    {
      const dialogRef = this.dialog.open(OpenConfirmPopupWindow, {
        height: '200px',
        width: '400px',
        maxWidth:'100%',
        data: {
          truckListId:this.form.value.trucklist_id
              }
      });
    }

  back()
  {
    var myString: string = String(this.screenvalue);
    if( myString == "true")
    {
      this.route.navigate(['/loading/trucklist']); 
    }
    
    else 
    {
      this.route.navigate(['/loading/godown-truck-details/']); 
    }
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
      if(this.action=='Create'){
        this.form.value.trucklist_id=this.truck_id;
        this.form.value.lrn_date=this.datepipe.transform(this.form.value.lrn_date,'dd-MM-yyyy')
        this.form.value.challen_date=this.datepipe.transform(this.form.value.challen_date,'dd-MM-yyyy')
        //this.form.value.challen_date=this.datepipe.transform(this.form.value.challen_date,'dd-MM-yyyy')
        this.form.value.inv_date=this.datepipe.transform(this.form.value.inv_date,'dd-MM-yyyy')
        this.form.value.da_id = this.da_Id[0]

        
        let obj={...this.form.value};
        console.log("obj",obj)


        const formData_multi: FormData  = new FormData();
        for  (var i =  0; i <  this.form.value.da_files.length; i++)  { 
          for(var j = 0 ; j < this.form.value.da_files[i].filelist.length; j++ ) 
          {
            formData_multi.append(this.form.value.da_files[i].file_type,this.form.value.da_files[i].filelist[j]);
          }
        }
        formData_multi.append('da_id', JSON.stringify(this.truck_details.da_id[0]));
        formData_multi.append("module_id",JSON.stringify(this.truck_id ));
        formData_multi.append("module_name","Truck");
        this.http.post<any>(this.apiUrl + "logistics_dispatch_advice/multifile_attachement/", formData_multi,  headers).subscribe(
          (res: any) => {                 
        }); 
        
        this.api.postData("logistics_truck_delivery_challan/",obj).then((response:any)=>{
              this.form.reset();
              console.log("responce",response)
              if(response.length != 0)
              {
                this.toast.success("Record Created Successfully!")
                this.route.navigate(['/loading/trucklist']); 
              }
              else
              {
                this.toast.error("Record Could Not be Created")
                this.route.navigate(['/loading/trucklist']); 
              }
           
        },(error)=>{
            console.log("error");
        })
      }else if(this.action=='edit'){
        this.form.value.lrn_date=this.datepipe.transform(this.form.value.lrn_date,'yyyy-MM-dd')
        // this.form.value.inv_date=this.datepipe.transform(this.form.value.lrn_date,'yyyy-MM-dd')
        this.form.value.inv_date=this.datepipe.transform(this.form.value.inv_date,'yyyy-MM-dd')
        this.form.value.challen_date=this.datepipe.transform(this.form.value.challen_date,'yyyy-MM-dd')
        let obj={...this.form.value};

        this.api.updateData("logistics_truck_delivery_challan/"+this.truck_channel_id+"/",obj).then((response:any)=>{
          
          if(response != false)
          {
            this.form.reset();
            this.toast.success("Record Updated Successfully!")
            this.route.navigate(['/loading/trucklist']); 
          }
          else
          {
            this.toast.error("Record Updated Failed!")
            this.route.navigate(['/loading/trucklist']); 
          }
        const formData_multi: FormData  = new FormData();
        for  (var i =  0; i <  this.form.value.da_files.length; i++)  { 
          for(var j = 0 ; j < this.form.value.da_files[i].filelist.length; j++ ) 
          {
            formData_multi.append(this.form.value.da_files[i].file_type,this.form.value.da_files[i].filelist[j]);
          }
        }
        formData_multi.append('da_id', JSON.stringify(this.truck_details.da_id[0]));
        formData_multi.append("module_id",JSON.stringify(this.truck_id ));
        formData_multi.append("module_name","Truck");
        this.http.post<any>(this.apiUrl + "logistics_dispatch_advice/multifile_attachement/", formData_multi,  headers).subscribe(
          (res: any) => {                 
        }); 
        
       },(error)=>{
           console.log("error");
       })
      //  this.toast.success("Updated Successfully");
    }else{

    }
  }
  
  gettruckDetails(truckid){  
    let data={
      truck_id:truckid
    }
    this.api.postData("logistics_truck_list/get_truck_details/",data).then((response)=>{
      this.truck_details=response;
      if(response)
      {
        this.da_Id = this.truck_details.da_id
      }
      console.log("Truck Details=", this.truck_details)
    },(error)=>{
        console.log("error");
    })
    
    let url = "logistics_loading_details/get_box_details/"
      let data_box_truck = {
        truck_list_id : truckid       
      }
      this.api.postData(url, data_box_truck).then((res: any) => {
      this.bigbox_details_count=res.length;
      this.form.patchValue({
        qty:this.bigbox_details_count?this.bigbox_details_count:null,
      })
      console.log("list",res);
      })

    this.api.getData("logistics_DA_File_types/").then((response)=>{
      this.fileTypes=response;        
    },(error)=>{
        console.log("error");
    })
  }
  daNavigation(id,nav_url){
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.route.navigate([nav_url], navigationExtras);
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

  dispatchAdviceList(){
    let url = "logistics_dispatch_advice/dispatch_advice_reports_list/";
    this.api.getData(url).then((res: any) => {
      this.DaIdList = res;
      console.log("Dispatch Advice list=", this.DaIdList)
    });
  }
}

@Component({
  selector: 'confirm-popup-window',
  templateUrl: 'confirm-popup-window.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 20%;
      max-width:20% !important;
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class OpenConfirmPopupWindow{
  tableShow= 1;

  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public api: ApiserviceService,
    public storage:StorageServiceService ,
    private http: HttpClient,
    public dialogRef: MatDialogRef<OpenConfirmPopupWindow>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    }

    moveTruckToGoDownStorage()
    {
      let record={
        truckListId:this.data.truckListId
      }   
      this.api.postData("logistics_truck_list/updateTrackingFlagAndDate/",record).then((response:any)=>{
        if(response == 1)
        {
          this.toast.success("Sucessfully updated.")
          this.dialogClose();
      }
      else
      {
        this.toast.error("Error")
      }
        }
        ,(error)=>{
          console.log("error");
      })

    }
   
    dialogClose(){
      this.dialogRef.close();
    }
    
  }
