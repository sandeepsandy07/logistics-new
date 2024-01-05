import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';
import { Moveingitem } from '../interfacetypecreate';
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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-panel-wise-material-view',
  templateUrl: './panel-wise-material-view.component.html',
  styleUrls: ['./panel-wise-material-view.component.css']
})
export class PanelWiseMaterialViewComponent implements OnInit {

  public viewRecords:any;
  list: any;
  isListView: boolean = true;

  expandbtn: boolean = true;

  displayedColumns = ['slno.', 'qty', 'item_desc','uom', 'make', 'model','panel_serial_no','zdl_qty','panel_remarks', 'remarks'];
  dataSource = new MatTableDataSource<['']>();

  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  uploadForm: UntypedFormGroup;ssssss

  @ViewChild('accordion') accordion: MatAccordion
  SAPDADetails: any;
  SAPDANo: any = 1;
  da_id: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient,
    public api: ApiserviceService,
    public toast:ToastrService, 
    public dialog: MatDialog,
    public storage: StorageServiceService,
    private toastr: ToastrService,
    private router: Router
    ) { 
     

      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as { dad_id: string };
      if(state != undefined){
        
        this.da_id = state.dad_id
       }else{
        this.da_id = this.storage.getda_id()
       }
    }

    @ViewChild('takeInput', {static: false})
    InputVar: ElementRef;

  ngOnInit(): void {
    this.getList();
    this.uploadForm = this.formBuilder.group({
      panel_wise_material: new UntypedFormControl("", Validators.required),
    });


    this.viewData(this.da_id);
    this.getDAnoDetails();
  }

  viewData(element:any)
  {
   
    this.api.viewuser("logistics_dispatch_advice/",element).then((data:any) => { 

      this.viewRecords = data.records;
    });
  }
  daNavigation(id,nav_url){
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.router.navigate([nav_url], navigationExtras);
  }
  getList(){
    let url = "panel_wise_master/get_status_wise_panels/"
    let data = {
      da_id : this.da_id,
      // da_id : 103,
      status :'all'
    }
    this.api.postData(url, data).then((res: any) => {
    this.list = res.data;  
    })
  }
  download_bom()

  {

    let data={

      'da_id':this.da_id

    }

    console.log("data=",data)

    let url = 'logistics_panel_wise_material/UploadDataToBomSheet/';

    this.api.postData(url, data).then((result: any) => {

    this.toast.success('success')

    this.fileDownload();

    });

  }
  fileDownload(){

    let url = "logistics_panel_wise_material/download_bom_report/"

    this.api.download(url).subscribe((response)=>{

      let blob = new Blob([response], {type: response.type})

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;

      link.setAttribute('download', 'logistics_bom');

      link.click();

    })

  }

  onSubmit() {

    let bearer = this.storage.getBearerToken();
    let headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer'+' '+bearer
      })
    };

    const formData: FormData  = new FormData();
    if (this.uploadForm.status == "INVALID"){
      this.toastr.error("Please upload file")
    }
    else{
      formData.append("panel_wise_material", this.uploadForm.get("panel_wise_material").value);
      formData.append('da_id', JSON.stringify(this.da_id));
      this.http.post<any>(this.url + "data/", formData,  headers).subscribe(
        (res: any) => {
          this.toastr.success(res.message);
          this.getList();
      });
    }
  }

  OnFileSelect(event, name) {
    let file = event.target.files[0];
    this.uploadForm.get(name).setValue(file);
  }


  getFilterList(panel: any, section: any){

    let data = {

        da_id: this.da_id,

        panel_name: panel,

        section: section

      }

    let url = "panel_wise/get_panel_filter/"

    this.api.postData(url, data).then((res: any) => {

      this.openDialog(res);      

    })

  }
  getFilterListPanel(panel: any, section: any){

    let data = {

        da_id: this.da_id,

        panel_name: panel,

        section: section

      }

    let url = "panel_wise/get_panel_filter/"

    this.api.postData(url, data).then((res: any) => {

      this.openDialogPanel(res);      

    })

  }

  openAllPanels(){
    this.expandbtn = false;
    this.accordion.openAll();
  }
  closeAllPanels(){
    this.expandbtn = true;
    this.accordion.closeAll();
  }


  getDAnoDetails(){
    let url = "logistics_dispatch_advice/"+1
    this.api.getData(url).then((res:any) => {
      this.SAPDADetails = res;
    })
  }

  generatePDF(panel:any, section: any){
    let url = "panel_wise/getPanelWise_List/";
    console.log("sapdetails",this.SAPDADetails);
    let data = {
      panel_name: panel,
      section: section,
      records:this.SAPDADetails
    }
    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    });
  }

  openDialog(list: any){
    const dialogRef = this.dialog.open(OpenDialogView, {
      height: '90%',
      width: '100%',
      maxWidth:'70%',
      
      data: {
            panels: list
            }
    });
  }
  openDialogPanel(list: any){
    const dialogRef = this.dialog.open(OpenDialogPanel, {
      height: '500px',
      width: '1354px',
      maxWidth:'90%',
      
      data: {
            panels: list
            }
    });
  }

}


@Component({
  selector: 'open-dialog',
  templateUrl: 'open-dialog.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 70%;
      max-width:100% !important;
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class OpenDialogView {

  displayedColumns = ['slno', 'qty', 'item_desc','uom', 'make', 'model','panel_serial_no','zdl_qty','panel_remarks', 'remarks'];

  displayedColumnsbox = ['slno','item_desc', 'qty', 'remarks'];
  dataSource = new MatTableDataSource<['']>();
  dataSourcebox = new MatTableDataSource<['']>();
  
  list: any;
  smallBox:any;
  sectionName:any;
  panelName:any;
  box_entered = [];
  box_types:any;
  form:UntypedFormGroup;
  boxform:UntypedFormGroup;
  showinvalidqty=[];

  tableShow: boolean = false;

  constructor(
    public toast:ToastrService, 
    public fb:UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogView>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.getFilterList();
    this.form = this.fb.group({     
        box_type: new UntypedFormControl(null,{validators:[Validators.required]}),
        main_box: new UntypedFormControl(true),
        item_list:new UntypedFormArray([]),
        box_length:new UntypedFormControl(),
        box_price:new UntypedFormControl(),
        box_height: new UntypedFormControl(),
        box_breadth: new UntypedFormControl(),
        remarks: new UntypedFormControl(),
      });
      this.boxform = this.fb.group({     
        box_type: new UntypedFormControl(null,{validators:[Validators.required]}),
        main_box: new UntypedFormControl(true),
        box_list:new UntypedFormArray([]),
        box_length:new UntypedFormControl(),
        box_price:new UntypedFormControl(),
        box_height: new UntypedFormControl(),
        box_breadth: new UntypedFormControl(),
        remarks: new UntypedFormControl(),
      });
      
      this.apiService.getData("logistics_box_size/").then((response)=>{
        this.box_types=response;         
      },(error)=>{
          console.log("error");
      })
      let filterboxdata={
        "da_id": 30,
        "main_box": "True"
      }
      this.apiService.postData("logistics_box_details/filter_packed_box/",filterboxdata).then((response)=>{
          this.smallBox=response;   
          console.log("box",response);      
      },(error)=>{
          console.log("error");
      })
   
    
  }

  openDialog(id){
    const dialogRef = this.dialog.open(OpenDialogAddAccessories, {
     
      width: '1255px',
      maxWidth:'70%',
      position: {
        top: '0px',
      },
      
      data: {
            id: id
            }
    });
  }

  getFilterList(){
    this.list = this.data.panels;
    this.sectionName=this.data.panels[0].section;
    this.panelName=this.data.panels[0].panel_name;
    this.dataSource = new MatTableDataSource(this.data.panels);
    this.dataSourcebox = new MatTableDataSource(this.smallBox); 
  
  }

  dialogClose(){
    this.dialogRef.close();
  }
  addBoxToMain(item:any,item_id:any){
    debugger;

    this.boxform.value.box_list.push(item);
    this.dataSourcebox = new MatTableDataSource(this.data.panels); 
    console.log(this.boxform.value.box_list);
    this.data.panels.splice(item,1);
  }
  removeBoxToMain(item:any,item_id:any){  
    this.boxform.value.box_list.splice(item_id,1);
    this.data.panels.push(item);
    console.log(this.form.value.item_list);
    // this.dataSource = new MatTableDataSource(this.data.panels);
    this.dataSourcebox = new MatTableDataSource(this.data.panels); 
  }
  addItemToBox(item_id:any,item:any){
    
    let boxqty=0;
    if(!this.box_entered[item]){
      boxqty=item_id['qty']
    }else{
      boxqty=this.box_entered[item]
    }
    let sanarray={
      'id':item_id['id'],
      'da_id':item_id['da_id'],
      'item_desc':item_id['item_desc'],
      'panel_name':item_id['panel_name'],
      'pending_qty':item_id['pending_qty'],
      'qty':item_id['qty'],
      'section':item_id['section'],
      'remarks':'',
      'entered_qty':boxqty
    }
    this.box_entered[item]='';
   
   
    this.form.value.item_list.push(sanarray);
    console.log(this.form.value.item_list);
  
   if(item_id['qty'] != boxqty){    
    boxqty=item_id['qty'] - boxqty;
    this.data.panels[item].qty=boxqty;
   }else{
    this.data.panels.splice(item,1);
   }
   
    console.log(this.form.value.item_list);
    this.dataSource = new MatTableDataSource(this.data.panels); 
    this.dataSourcebox = new MatTableDataSource(this.data.panels); 
 
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
   
    console.log(obj);
  

  
    this.apiService.postData("logistics_item_packing/",obj).then((response:any)=>{
      this.toast.success("Box Created Successfully");
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

  let obj={...this.boxform.value};
  this.toast.success("Box Created Successfully");
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
    this.dataSourcebox = new MatTableDataSource(this.data.panels); 
 
  }

}





@Component({
  selector: 'open-dialog-panel',
  templateUrl: 'open-dialog-view.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 100%;
      max-width:70% !important;
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class OpenDialogPanel {

  displayedColumns = ['slno','item_desc', 'qty','front','rear',  'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();
  form:UntypedFormGroup;
  list: any;
  resultbox:Array<any>=[];
  sectionName:any;
  panelName:any;
  box_types:any;
  box_entered = [];
  

  tableShow: boolean = false;

  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogPanel>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.getFilterList();
    this.form = this.fb.group({     
      box_type: new UntypedFormControl(null,{validators:[Validators.required]}),
      main_box: new UntypedFormControl(true),
      item_list:new UntypedFormArray([]),
      box_length:new UntypedFormControl(),
      box_price:new UntypedFormControl(),
      box_height: new UntypedFormControl(),
      box_breadth: new UntypedFormControl(),
      remarks: new UntypedFormControl(),
    
    });
    this.apiService.getData("logistics_box_size/").then((response)=>{
      this.box_types=response;         
  },(error)=>{
      console.log("error");
  })
    
  }

  openDialog(id){
    const dialogRef = this.dialog.open(OpenDialogPanel, {
     
      width: '1255px',
      maxWidth:'100%',
      position: {
        top: '0px',
      },
      
      data: {
            id: id
            }
    });
  }

  getFilterList(){
    this.list = this.data.panels;
    this.sectionName=this.data.panels[0].section;
    this.panelName=this.data.panels[0].panel_name;
    this.dataSource = new MatTableDataSource(this.data.panels); 
  
  }

  dialogClose(){
    this.dialogRef.close();
  }
  addItemToBox(item_id:any,item:any){
   
    console.log(this.data.panels);
    this.resultbox.push(item_id);
    this.data.panels.splice(item,1);
    console.log(this.resultbox);
    this.dataSource = new MatTableDataSource(this.data.panels); 
 
  }
  removeItemFromBox(item_id:any,item:any){
   
    console.log(this.data.panels);
    this.data.panels.push(item_id);
    this.resultbox.splice(item,1);
    console.log(this.resultbox);
    this.dataSource = new MatTableDataSource(this.data.panels); 
 
  }
  onSubmitPanel(){
    
    if (this.form.invalid) {
      alert("Please enter required details ");
      return;
    }
    this.form.value.item_list.push(this.data.panels);
 
    let obj={...this.form.value};
   
    console.log(obj);
    this.toast.success("Box Created Successfully");

    this.form.reset();
   
}

}






















@Component({
  selector: 'open-dialog-add-accessories',
  templateUrl: 'open-dialog-add-accessories.html'
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
export class OpenDialogAddAccessories {

  values = [];  
  form: UntypedFormGroup; 
  empForm:UntypedFormGroup;
  itemDescription: any = '';
  itemQty: any = 0;

  displayedColumns = ['sl_no', 'item_name', 'qty','remarks'];
  dataSource = new MatTableDataSource<['']>();

  constructor(
    private fb:UntypedFormBuilder,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogAddAccessories>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
    this.empForm=this.fb.group({
      employees: this.fb.array([this.fb.group({
        item_name: '',
        qty: '',
        remarks:'' 
      })]) ,
    })
    this.displaytabledata();
    
    // this.addvalue();
    
    // this.form = this.fb.group({
    //   panel_id: new FormControl(),
    //   contact_details: this.fb.array([]),
    // });
     
    // this.getPanelAccessories(this.data.id);
  }
  displaytabledata(){
    this.dataSource = new MatTableDataSource(this.empForm.value.employees);
  }
  employees(): UntypedFormArray {
    return this.empForm.get("employees") as UntypedFormArray
  }
  newEmployee(): UntypedFormGroup {
    return this.fb.group({
      item_name: '',
      qty: '',
      remarks:'' 
    })
  }
  addEmployee() {
    this.employees().push(this.newEmployee());
  }
  removeEmployee(empIndex:number) {
    this.employees().removeAt(empIndex);
  }

  // contactDetails() : FormArray {  
  //   return this.form.get("contact_details") as FormArray  
  // }
  // newContactdetails(): FormGroup {  
  //   return this.fb.group({  
  //     name: '',  
  //     email: '',  
  //     mobile: '',  
  //     fax_no: '', 
     
  //   })  
  // }  
  // addContactdetails() {  
  //   this.contactDetails().push(this.newContactdetails());  
  // }
  // removeContactdetails(i:number) {  
  //   this.contactDetails().removeAt(i);  
  // } 
  // quantities() : FormArray {  
  //   return this.form.get("contact_details") as FormArray  
  // }  
  // newQuantity(): FormGroup {  
  //   return this.fb.group({  
  //     item_name:'',
  //     item_qty:'',
  //     remarks:'',
  //   })  
  // }  
  // addQuantity() {  
  //   this.quantities().push(this.newQuantity());  
  // }  
  // removeQuantity(i:number) {  
  //   this.quantities().removeAt(i);  
  // }  
  

  // removevalue(i){
  //   this.values.splice(i,1);
  //   if(this.values.length == 0){
  //     this.dialogRef.close();
  //   }
  // }

  // addvalue(){
  //   this.values.push({item_id: this.data.id, item_description: "", item_qty: ""});
  // }
  

  onSubmit(){
    // if (this.itemDescription != "" && this.itemQty != 0){

    //   let url = 'panel_accessories/'

    //   let data ={
    //     item_id : this.data.id,
    //     item_description : this.itemDescription,
    //     item_qty : parseInt(this.itemQty)
    //   }

    //   this.apiService.postData(url, data).then(res => {
    //     this.getPanelAccessories(this.data.id);
    //   })
    // } else {
    //   alert('please enter some values in the inputs');
    // }
  }

  // getPanelAccessories(id){

  //   let url = "panel_accessories/get_panel_accessories/";
    
  //   let data = {
  //     item_id: id
  //   }

  //   this.apiService.postData(url, data).then((res: any) => {
  //     this.dataSource = new MatTableDataSource(res);
  //     this.dataSource.data = res;

  //     this.itemDescription = '';
  //     this.itemQty = 0;
  //   })

  // }

  dialogClose(){
    this.dialogRef.close();
  }

}
