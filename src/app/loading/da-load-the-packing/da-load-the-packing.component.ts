import { Component, OnInit, Inject, ViewChild, ElementRef,ViewChildren,QueryList } from '@angular/core';
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
import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";


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

@Component({
  selector: 'app-da-load-the-packing',
  templateUrl: './da-load-the-packing.component.html',
  styleUrls: ['./da-load-the-packing.component.css']
})
export class DaLoadThePackingComponent implements OnInit {

  public tablelist:any;
  public da_id:any;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;

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
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder) { 

      this.form = this.fb.group({
        fromdate: new UntypedFormControl(null),
        todate: new UntypedFormControl(null),
        da_no: new UntypedFormControl(null),
        so_no: new UntypedFormControl(null),
        ygs_proj_defi: new UntypedFormControl(null),
        job_code: new UntypedFormControl(null)
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
  daNavigation(id,nav_url){
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.route.navigate([nav_url], navigationExtras);
  }
  // getListOfDispatchValues(){
  //   let data={
  //     status:'all',
  //     col_name:'packing_flag',
  //     col_value:true
  //   }
  //   this.api.postData("dispatch_user_allocation/user_based_da_list_with_status/",data).then((response:any)=>{
 
  //     this.tablelist=response;
  //     this.dtTrigger.next(void 0);
     
  //     },(error)=>{
  //         console.log("error");
  // })

  // }

  getListOfDispatchValues(){
    let data={
      type: 'loading_employee',
      data_approver:{
      approve_flag:true
      }
    }   
     this.api.postData("work_flow_access/approver_based_on_workflow_loading/",data).then((response:any) => {
      this.tablelist=response;
      this.dtTrigger.next(void 0);   
    },(error)=>{
        console.log("error");
    })

  }


  Loadthebox(daid){
    this.da_id=daid;
    let data = {

        da_id: daid,

        panel_name: 'HIS0261',

        section: 'UNIT-2'

      }

    let url = "panel_wise/get_panel_filter_merged/"

    this.api.postData(url, data).then((res: any) => {

      this.openDialogLoadthebox(res);      

    })

  }
  openDialogLoadthebox(list: any){
    const dialogRef = this.dialog.open(OpenDialogLOadingToTruck, {
      height: '500px',
      width: '1354px',
      maxWidth:'100%',
      
      data: {
            panels: list,
            da_id:this.da_id
            }
    });
  }
  getRecordsBasedOnFilterData() {
    var date = new Date();
    let data = {
      type: 'loading_employee',  
      status: 'all',
      col_name: 'is_active',
      col_value: true,
      da_user_req_status: 'approved',
      approve_status: 'Approver',
      from_date:'',
      to_date:'',
      filter_date:false,
      filter_data: false,
      filter_fields: {
      }
    }

    if (this.form.value.so_no != null && this.form.value.so_no ) {
      data.filter_fields["so_no"] = this.form.value.so_no
      data.filter_data = true
    }
   
    if (this.form.value.da_no != null && this.form.value.da_no) {
      data.filter_fields["jobcode_da_no"] = this.form.value.da_no
      data.filter_data = true
    }
    if (this.form.value.job_code != null && this.form.value.job_code ) {
      data.filter_fields["job_code"] = this.form.value.job_code
      data.filter_data = true
    }
    if (this.form.value.ygs_proj_defi != null && this.form.value.so_ygs_proj_defino ) {
      data.filter_fields["ygs_proj_defi"] = this.form.value.ygs_proj_defi
      data.filter_data = true
    }
    if (this.form.value.fromdate != null && this.form.value.todate != null && this.form.value.fromdate ) {
      data.from_date = this.datepipe.transform(this.form.value.fromdate, 'yyyy-MM-dd');
      data.to_date = this.datepipe.transform(this.form.value.todate, 'yyyy-MM-dd');
      data.filter_date = true
    }else{
      data.from_date = this.datepipe.transform(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd'); ;
      data.to_date = this.datepipe.transform(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy-MM-dd'); ;
    }
    this.api.postData("work_flow_access/approved_based_on_workflow_packing/",  data).then((response: any) => {
     
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
  ngOnDestroy(): void {
    this.dtTrigger2.unsubscribe();
  }
  rerender(): void {
   
  }
  clearAllFilterDataFields() {
    this.form.reset();
    let data = {
      type: 'loading_employee',    
      from_date:this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
      to_date:this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
      filter_date:true,
      filter_data: false,
      filter_fields: {
        approve_flag: true,
      }
    }

    this.api.postData("work_flow_access/approved_based_on_workflow_packing/",  data).then((response: any) => {


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


}
@Component({
  selector: 'open-dialog-loading-box',
  templateUrl: 'open-dialog-loading-to-truck.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 100%;
      max-width:100% !important;
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class  OpenDialogLOadingToTruck{
  
  displayedColumns = ['slno','item_desc', 'qty',  'make', 'model', 'remarks'];
  displayedColumnsbox = ['slno','box_size','box_no','box_code', 'boxTypeID', 'remarks' ,'price'];
  dataSource = new MatTableDataSource<['']>();
  dataSourcebox = new MatTableDataSource<['']>();
  da_id:any;
  list: any;
  resultbox:Array<any>=[];
  sectionName:any;
  panelName:any;
  inputValue:any;
  smallBox:any;
  da_list:any;
  box_entered = [];
  box_types:any;
  form:UntypedFormGroup;
  boxform:UntypedFormGroup;
  public scannedBarcode: string = '';
  trucktype_list:any;
  loaded_truck_list:any;
  // firstNameField:any;
  tableShow: boolean = false;
  public truckcompletebutton:boolean=true;

  constructor(
    public toast:ToastrService, 
    public fb:UntypedFormBuilder,
    private route:Router,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogLOadingToTruck>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
  
    this.form = this.fb.group({     
        box_type: new UntypedFormControl(null,{validators:[Validators.required]}),
        main_box: new UntypedFormControl(true),
        item_list:new UntypedFormArray([]),
        box_price:new UntypedFormControl(),
        box_length:new UntypedFormControl(),
        box_height: new UntypedFormControl(),
        box_breadth: new UntypedFormControl(),
        remarks: new UntypedFormControl(),
      });
      this.boxform = this.fb.group({   
        da_id:new UntypedFormControl(null),  
        truck_list_id: new UntypedFormControl(null,{validators:[Validators.required]}),
        vehicle_no: new UntypedFormControl(null,{validators:[Validators.required]}),
        driver_name: new UntypedFormControl(null,{validators:[Validators.required]}),
        driver_no: new UntypedFormControl(null),
        box_list:new UntypedFormArray([]),
        remarks: new UntypedFormControl(),
      });
      this.apiService.getData("logistics_truck_list/").then((response)=>{
        this.box_types=response;         
    },(error)=>{
        console.log("error");
    })
    this.da_id=this.data.da_id;
    console.log("da",this.da_id);
    this.boxform.patchValue({
      da_id:Number(this.da_id?this.da_id:null),
    })
    this.getTuckTypelist();
    console.log("data",this.data);
    let filterboxdata={
      "da_id":this.da_id,
      "main_box": true,
      "status": "packed"
    }
    this.apiService.postData("logistics_box_details/filter_packed_box/",filterboxdata).then((response:any)=>{
          this.smallBox=response.data;   
          console.log("box",this.smallBox);     
           this.getFilterList(); 
      },(error)=>{
          console.log("error");
      })
    this.getListOfDA();
    this.getcurrentTucklist();
    
   
    
  }
  

 
 

  getFilterList(){
    this.list = this.data.panels;
    // this.sectionName=this.data.panels[0].section;
    // this.panelName=this.data.panels[0].panel_name;
    // this.dataSource = new MatTableDataSource(this.data.panels);
    this.dataSourcebox = new MatTableDataSource(this.smallBox); 
    // console.log("tabke",this.dataSource);
    // console.log("tabksdsae",this.smallBox);


  
  }

  dialogClose(){
    this.dialogRef.close();
  }
  onKey_barcode(event: any) {

    console.log('Input value:', event);
    let test_val=event.target.value.split('-')

    if(test_val[2].length == 5){
      let box_index=this.smallBox.indexOf(this.smallBox.find(e => e.box_code === event.target.value));
      let box_details=this.smallBox.find(e => e.box_code === event.target.value);
      
      if(box_index >= 0){
        this.addBoxToMain(box_details,box_index);
        this.toast.success(" Box "+box_details.box_serial_no +" scanned")
       
      }else{ 
        this.toast.error("Wrong Box Scanned")
      }

    }
   
    // event.target.value='';

  }
  addBoxToMain(item:any,item_id:any){
    this.boxform.value.box_list.push(item);
    this.smallBox.splice(item_id,1);
    this.dataSourcebox = new MatTableDataSource(this.smallBox); 
    console.log(this.boxform.value.box_list);   
  }
  removeBoxToMain(item:any,item_id:any){  
    this.boxform.value.box_list.splice(item_id,1);
    this.smallBox.push(item);
    console.log(this.form.value.item_list);  
    this.dataSourcebox = new MatTableDataSource(this.smallBox); 
  }
  addItemToBox(item_id:any,item:any){
   
    let boxqty=0;
    if(!this.box_entered[item]){
      boxqty=item_id['qty']
    }else{
      boxqty=this.box_entered[item]
    }

    let sanarray={
      'boxDetailsId':item_id['id'],
      
    }
    this.box_entered[item]='';
    this.resultbox=item_id;
    console.log(this.resultbox);
    this.form.value.item_list.push(sanarray);
   
   if(item_id['qty'] != boxqty){    
    boxqty=item_id['qty'] - boxqty;
    this.data.panels[item].qty=boxqty;
   }else{
    this.data.panels.splice(item,1);
   }
   
    console.log(this.form.value.item_list);
    this.dataSource = new MatTableDataSource(this.data.panels); 
  
 
  }
  onSubmitPost(){
    
    if (this.form.invalid || (this.form.value.item_list.length <= 0)) {
      alert("Please enter required details / atleast one item as to push to box");
      return;
    }
  
    // this.form.value.box_length=Number(this.form.value.box_length);
    // this.form.value.box_height=Number(this.form.value.box_height);
    // this.form.value.box_breadth=Number(this.form.value.box_breadth);
    let obj={...this.form.value};
   
 
   

   
    this.apiService.postData("logistics_item_packing/",obj).then((response:any)=>{
      this.toast.success("Truck Loaded  Successfully");
      this.form.reset();
     

    
    },(error)=>{
      console.log("error");
    })  
}
onSubmitBoxToMain(){

  if (this.boxform.invalid || (this.boxform.value.box_list.length <= 0)) {
    alert("Please enter required details / atleast one item as to push to box");
    return;
  }
  this.truckcompletebutton=false;
  this.boxform.value.da_id=this.data.da_id;
  let obj={...this.boxform.value};
  this.apiService.postData("logistics_loading_details/",obj).then((response:any)=>{
    this.toast.success("Boxes Loaded Successfully");
    console.log(response);
    this.boxform.reset();
    this.truckcompletebutton=true;
    this.boxform.patchValue({
      da_id:Number(this.da_id?this.da_id:null),
    })
    this.getcurrentTucklist();
  
  },(error)=>{
    console.log("error");
  })  
  
  console.log(obj);
  this.boxform.reset();

}
  onChangeQty(i){
    
    if(this.box_entered[i] > this.data.panels[i].qty){
      debugger;
      this.box_entered[i]='';
      this.toast.error("Enter quantity is more than actual quantity");
    }    
  }
  removeItemFromBox(item_id:any,item:any){
   
    console.log(this.data.panels);   
    this.form.value.item_list.splice(item,1);
    console.log(this.data.panels.find(e => e.id === item_id['id']));
    let module_id_index=this.data.panels.indexOf(this.data.panels.find(e => e.id === item_id['id']))
    console.log("index",module_id_index);
    if(module_id_index >= 0){
      this.data.panels.splice(module_id_index,1);
    }
    
    this.data.panels.push(item_id);
    console.log(this.form.value.item_list);
    this.dataSource = new MatTableDataSource(this.data.panels);
  
 
  }
  
  getListOfDA(){
   
    let data={
      da_id:this.da_id
    }
      this.apiService.postData("logistics_dispatch_advice/da_filter_based_so/",data).then((response:any) => {
      this.da_list=response;  
    },(error)=>{
        console.log("error");
    })

  }
  getTuckTypelist(){
   
    
    let data={
      da_id: this.boxform.value.da_id,
      status:'all'

    }
      this.apiService.postData("logistics_truck_list/get_truck_list/",data).then((response:any) => {
      this.trucktype_list=response;  
    },(error)=>{
        console.log("error");
    })

  }
  getvehicleDetails(){
   
   let truckdetails=this.trucktype_list.find(e => e.truckListId == this.boxform.value.truck_list_id);
   console.log("len,",truckdetails.vehicle_no);
    this.boxform.patchValue({
      vehicle_no:truckdetails.vehicle_no,
      driver_name:truckdetails.driver_name,
      driver_no:truckdetails.driver_no
    })
   
   
  }
  getcurrentDAaTruck(){
    // let data={
    //   da_id:this.da_id
    // }
    // this.apiService.postData("logistics_dispatch_advice/da_filter_based_so/",data).then((response:any) => {
    //   this.loaded_truck_list=response; 

    let data={
      da_id: this.boxform.value.da_id,
      status:'loaded'

    }
      this.apiService.postData("logistics_truck_list/get_truck_list/",data).then((response:any) => {
      this.trucktype_list=response;  

    },(error)=>{
        console.log("error");
    })
  }
  daNavigation(id,nav_url){
    this.dialogClose();
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.route.navigate([nav_url], navigationExtras);
  }
  getcurrentTucklist(){
   
    
    let data={
      da_id: this.da_id,
      status:'all'

    }
      this.apiService.postData("logistics_truck_list/get_truck_list/",data).then((response:any) => {
      this.loaded_truck_list=response.filter(row => row.loaded_flag == true);  
    },(error)=>{
        console.log("error");
    })

  }
  showtruckdetails(truck_id: any){
    const dialogRef = this.dialog.open(OpenDialogShowTruckBoxItem, {
      height: '500px',
      width: '1354px',
      maxWidth:'80%',
      
      data: {
            
        truckid:truck_id
            }
    });
  }

}

// @Component({
//   selector: 'open-dialog-loading-box',
//   templateUrl: 'open-dialog-loading-to-truck.html'
//   , styles: [`
//     :host {
      
//       flex-direction: column;
//       height: 100%;
//       max-width:100% !important;
//     }

//     mat-dialog-content {
//       flex-grow: 1;
//     }
//   `]
// })
// export class  OpenDialogForTruckBox{

//   public bigbox_details:FormGroup;
//   public da_id:any;
//   public  bigBox:any;
//   constructor( private formBuilder: FormBuilder,
//     private http: HttpClient,
//     public api: ApiserviceService,
//     public toast:ToastrService, 
//     public dialog: MatDialog,
//     public storage: StorageServiceService,
//     private toastr: ToastrService,
//     private router: Router) { 

//       this.bigbox_details=this.formBuilder.group({
//         boxLIst_panel:  this.formBuilder.array([]) ,
//         boxLIst_loose:this.formBuilder.array([]) ,
//       })
//       this.getDapackedbox();


//     }

//     ngOnInit(): void {
//     }
//     getDapackedbox(){
//       let filterboxdata={
//         "da_id": this.da_id,
//         "main_box": true,
//         "status":"packed"
//       }
//       this.api.postData("logistics_box_details/filter_packed_box_merged/",filterboxdata).then((response:any)=>{
//             this.bigBox=response.data;
//             this.getBigboxItemdetails();
//             console.log("boxs",this.bigBox)
            
           
  
           
           
//         },(error)=>{
//             console.log("error");
//         })
    
//       }
//       itemtomainboxshow(par4): FormArray {
     
//         console.log("hdgsfjds", (this.bigbox_details.value.boxLIst_panel.length));
       
//         if(par4){
         
//           return this.bigbox_details.get("boxLIst_panel") as FormArray
          
//         }else{
         
//           return this.bigbox_details.get("boxLIst_loose") as FormArray
  
//         }
       
//       }
//       newitemtomainboxshow(par1,par2,par3): FormGroup {
       
  
//         return this.formBuilder.group({
//           box_list: par1,
//           item:par2,
//           panel:par3 
//         })
//       }
//       additemtomainboxshow(par1,par2,par3) {
//         this.itemtomainboxshow(par1.panel_flag).push(this.newitemtomainboxshow(par1,par2,par3));  
//       }
  
//       getBigboxItemdetails(){
    
//         for(let i=0;i<this.bigBox.length;i++){   
//           let data={
//            box_code:this.bigBox[i].box_code
//          }
         
//          this.api.postData("logistics_item_packing/box_code_filter/",data).then((response:any)=>{
//           this.additemtomainboxshow(this.bigBox[i],response,response.panel_comp)
          
      
//         },(error)=>{      
//           console.log("error");
//       })
//       }
        
    
//         }


//       }

@Component({
  selector: 'show-box-and-item-in-truck',
  templateUrl: 'show-box-and-item-in-truck.html'
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
export class OpenDialogShowTruckBoxItem{

  displayedColumns = ['slno','item_desc','front','rear', 'qty', 'check_by'];
  dataSource = new MatTableDataSource<['']>();
  form:UntypedFormGroup;
  bigBoxDetails:any;
  list: any;
  resultbox:Array<any>=[];
  sectionName:any;
  panelName:any;
  box_types:any;
  box_entered = [];
  bigbox_details:any;
  sub_bigbox_details:any;
  showdetailsof_box_items:boolean=false;
  

  tableShow= 1;

  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogShowTruckBoxItem>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
    
    this.getboxdetails(data.truckid)

    
   
    
    
  
    }
    getboxdetails(truckid){

      let url = "logistics_loading_details/get_box_details/"
      let data = {
        truck_list_id : truckid       
      }
      this.api.postData(url, data).then((res: any) => {
      this.bigbox_details=res;
      console.log("list",res);
      })
    }

    getboxitemdetails(boxcode){

      let url = "logistics_box_details/box_code_filter/"
      let data = {
        box_code : boxcode       
      }
      this.api.postData(url, data).then((res: any) => {
      
      if(res.length <= 0){
        let data={
          box_code:boxcode
        }
        
        this.api.postData('logistics_item_packing/box_code_filter/', data).then((res: any) => {
          this.getMainBoxDetailsitem(res.items)
          
        })


      }else{

        console.log("xyz",res);
        this.sub_bigbox_details=res;
        this.tableShow=3;
        



      }
      
      })
    }


    getMainBoxDetails(box_item_detail){
      console.log("item",box_item_detail)
      this.dataSource = new MatTableDataSource(box_item_detail);  

    }

    getMainBoxDetailsitem(box_item_detail){
    
      this.tableShow=4;
   
     
      this.dataSource = new MatTableDataSource(box_item_detail);  

    }
    getMainBoxDetailsitem_close(){
      this.tableShow=3;
    }
    dialogClose(){
      this.dialogRef.close({data:"Close"});
    }
    getboxitemdetails_single(boxcode){
      let data = {
        box_code : boxcode       
      }
      this.api.postData("logistics_item_packing/box_code_filter/",data).then((response:any)=>{
        
        // getMainBoxDetailsitem()
        
    
      },(error)=>{      
        console.log("error");
    })

    }
    
    
  }




