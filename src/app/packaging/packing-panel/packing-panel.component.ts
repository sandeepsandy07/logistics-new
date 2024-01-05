import { Component, OnInit, Inject, ViewChild, ElementRef,Output,EventEmitter } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';

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
import { data, isEmptyObject } from 'jquery';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { isEmpty } from 'rxjs';

@Component({
  selector: 'app-packing-panel',
  templateUrl: './packing-panel.component.html',
  styleUrls: ['./packing-panel.component.css']
})
export class PackingPanelComponent implements OnInit {

  public viewRecords:any;
  list: any;
  showbigbox_in_complete=false;
  bigBox:any;
  bigBoxDetails:any;
  isListView: boolean = true;

  expandbtn: boolean = true;

  displayedColumns = ['slno.', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();

  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;
  public form:UntypedFormGroup;
  public bigbox_details:UntypedFormGroup;
  public bigbox_details_loose:UntypedFormGroup;
  public delete_flag;


  uploadForm: UntypedFormGroup;
  
  @ViewChild('accordion') accordion: MatAccordion
  SAPDADetails: any;
  SAPDANo: any = 1;
  da_id: string;
  print_url = environment.print_url;

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
      const state = navigation.extras.state as {dad_id: string};
      
      this.da_id = state.dad_id;

      this.viewData(this.da_id);
   
    

      this.form = new UntypedFormGroup({
        status: new UntypedFormControl(),
        remarks: new UntypedFormControl(),
        da_id: new UntypedFormControl()
  
        })

        this.bigbox_details=this.formBuilder.group({
            boxLIst_panel:  this.formBuilder.array([]) ,
            boxLIst_loose:this.formBuilder.array([]) ,
          })
          this.getList();
          this.getDapackedbox();
          // this.barcodeprint();
         
    }

    @ViewChild('takeInput', {static: false})
    InputVar: ElementRef;

  ngOnInit(): void {
    // this.viewData(this.da_id);
    // this.getDAnoDetails();
    // this.getList();
    // this.getDapackedbox();
    this.delete_flag=this.storage.getuser_data();
  }


 
  viewData(element:any)
  {
    this.api.viewuser("logistics_dispatch_advice/",element).then((data:any) => {
      this.viewRecords = data.records;
      console.log("view",data)
    });
  }
  daNavigation(id,nav_url){
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.router.navigate([nav_url], navigationExtras);
  }
  getList(){
    let url = "panel_wise_master/get_status_wise_panels_merged/"
    let data = {
      da_id : this.da_id,
      status :'all'
    }
    this.api.postData(url, data).then((res: any) => {
    this.list = res.data;  
    console.log("list",this.list);
    })
  }

  // onSubmit() {

  //   let bearer = this.storage.getBearerToken();
  //   let headers = {
  //     headers: new HttpHeaders({
  //       'Authorization': 'Bearer'+' '+bearer
  //     })
  //   };

  //   const formData: FormData  = new FormData();
  //   if (this.uploadForm.status == "INVALID"){
  //     this.toastr.error("Please upload file")
  //   }else{
  //     formData.append("panel_wise_material", this.uploadForm.get("panel_wise_material").value);
  //     formData.append('da_id', JSON.stringify(this.da_id));
  //     this.http.post<any>(this.url + "data/", formData,  headers).subscribe(
  //       (res: any) => {
  //         this.toastr.success(res.message);
  //         this.getList();
  //     });
  //   }
  // }

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

    let url = "panel_wise/get_panel_filter_merged/"

    this.api.postData(url, data).then((res: any) => {

      this.openDialog(res,panel,section);      

    })

  }
  getFilterListPanel(panel: any, section: any){

    let data = {
        da_id: this.da_id,
        panel_name: panel,
        section: section
      }

    let url = "panel_wise/get_panel_filter_merged/"

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
  barcodeprint(boxcode,caseno,printtype){
    console.log("saaa",this.viewRecords);
    let url = this.print_url;

    let printer_ip=''
    if(this.viewRecords.location_unit == 'Unit-2'){
          printer_ip="10.29.22.77"
    }else{
      printer_ip="10.29.11.250"
    }
    console.log(printer_ip);

    let data = {
      boxno:boxcode,
      dano: this.viewRecords.jobcode_da_no,  
      sono: this.viewRecords.so_no,
      customername: this.viewRecords.customer_name, 
      projectname: this.viewRecords.ygs_proj_defi,  
      caseno: caseno.toString(),   
      bigbox: printtype,    
      printsize: "big",    
       printerip: printer_ip
      // printerip: "10.29.22.77"
      
    }
  
    this.api.getData_barcode(url,data).then((res: any) => {
  
    console.log("barcode",res);
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
  getDapackedbox(){
    let filterboxdata={
      "da_id": this.da_id,
      "main_box": true,
      "status":'all'
    }

    this.bigbox_details.setControl('boxLIst_loose',this.formBuilder.array([])); 
    this.bigbox_details.setControl('boxLIst_panel',this.formBuilder.array([])); 

    this.api.postData("logistics_box_details/filter_packed_box_merged/",filterboxdata).then((response:any)=>{
          this.bigBox=response.data;
          this.getBigboxItemdetails();
    },(error)=>{

          console.log("error");
    })

  }     
         

         
         
      
   
    itemtomainboxshow(par4): UntypedFormArray {
     
      console.log("hdgsfjds", (this.bigbox_details.value.boxLIst_panel.length));
     
      if(par4){
       
        return this.bigbox_details.get("boxLIst_panel") as UntypedFormArray
        
      }else{
       
        return this.bigbox_details.get("boxLIst_loose") as UntypedFormArray

      }
     
    }
    deleteMainBox(name){
      if(confirm("Are you sure want to delete this Box " +name)) {
        if(confirm("Once Deleted Data Can not be Retrived " +name)) {
            let data={
            "main_box":true,
            "box_code":name
            }
            
            this.api.postData("logistics_box_details/delete_box_details/",data).then((response:any)=>{
            this.toastr.error("Box Deleted Successfully");
            this.getDapackedbox();
            
        
          },(error)=>{      
            console.log("error");
            this.toastr.error("Box Not  Deleted")
        })
          }
        }
    }
    change_series_box(box){
      if(confirm("Are you sure want to change the series")) {
        if(confirm("Once changed Data Can not be Retrived ")) {
        let data={
         "big_box":box,
         "da_no":this.da_id,
        }
        
        this.api.postData("logistics_box_details/change_box_serial/",data).then((response:any)=>{
         this.toastr.error("Updated Successfully");
         this.getDapackedbox();
         
     
       },(error)=>{      
         console.log("error");
         this.toastr.error("Box Not  Deleted")
     })
      }
    }
    }
    newitemtomainboxshow(par1,par2,par3): UntypedFormGroup {
     

      return this.formBuilder.group({
        box_list: par1,
        item:par2,
        panel:par3 
      })
    }
    additemtomainboxshow(par1,par2,par3) {
      this.itemtomainboxshow(par1.panel_flag).push(this.newitemtomainboxshow(par1,par2,par3));  
    }

  getBigboxItemdetails(){
    
    for(let i=0;i<this.bigBox.length;i++){   
      let data={
       box_code:this.bigBox[i].box_code
     }
     
     this.api.postData("logistics_item_packing/box_code_filter/",data).then((response:any)=>{
      this.additemtomainboxshow(this.bigBox[i],response,response.panel_comp)
      
  
    },(error)=>{      
      console.log("error");
  })
  }
    

    }

  openDialog(list: any,panel_name,section_name){
    const dialogRef = this.dialog.open(PackingOpenDialogView, {
      height: '90%',
      width: '100%',
      maxWidth:'100%',
      
      data: {
            panels: list,
            da_id:this.da_id,
            panel_name:panel_name,
            section_name:section_name,
            da_details:this.viewRecords
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      
      this.getDapackedbox();
    });
  }
  openDialogPanel(list: any){
    const dialogRef = this.dialog.open(PackingOpenDialogPanel, {
      height: '500px',
      width: '1354px',
      maxWidth:'100%',
      
      data: {
            panels: list,
            da_id:this.da_id,
            da_details:this.viewRecords
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getList();
      this.getDapackedbox();
    });
  }
  getMainBoxDetails_dailog(box_item_detail,box_code){

    
    const dialogRef = this.dialog.open(OpenDialogBigboxDetails, {
    
      width: '853px',
     
      
      data: {
        box_item_details: box_item_detail,
        box_codes:box_code
            }
    });
  }
  onSubmitPost(){
    this.form.value.da_id=this.da_id;
            let obj={...this.form.value};
            this.api.postData("dispatch_auth_thread/da_packing_done/",obj).then((response:any)=>{
            this.form.reset();
            
            this.toast.success("packed Box moved to load Successfully");
            
           
           },(error)=>{
               console.log("error");
           })
  }

  generatePackedPanelPdf(box_code)
  {
    let url = "logistics_item_packing/box_code_filter_panel/"
    let data = {
      box_code:box_code,
      da_id : this.da_id
    }
    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    });

  }
  generatePackedConsolidatePanelPdf()
  {

    let url = "logistics_item_packing/box_code_filter_on_daID/"
    let data = {
      da_id : this.da_id,
      status : "packed"
    }
    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    });

  }
  generateConsigneeForm_single(boxcode,component_no,type)
{
  let url = "logistics_item_packing/consigneeDetailsPage/";
  let data = {
    box_code : boxcode,
    da_id : this.da_id,
    component_no: component_no,
    type : type
  }

  this.api.downloadPDF(url, data).then((data) => {
    var downloadURL = window.URL.createObjectURL(data);
    let tab = window.open();
    tab.location.href = downloadURL;
  });

}
generateConsigneeForm_multiple(type)
{
  let url = "logistics_item_packing/consolidateConsigneePages/";
  let data = {
    da_id : this.da_id,
    type : type
  }

  this.api.downloadPDF(url, data).then((data) => {
    var downloadURL = window.URL.createObjectURL(data);
    let tab = window.open();
    tab.location.href = downloadURL;
  });

}
  generateLooseItemPdf(box_code)
  {
    let url = "logistics_item_packing/box_code_filter_loose_supply/"
    let data = {
      box_code:box_code,
      da_id : this.da_id
    }
    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;

    });

  }
  generateConsolidateLooseItemPdf()
  {

    let url = "logistics_item_packing/box_code_filter_loose_supply_on_DaId/"
    let data = {
      da_id : this.da_id,
      mainBox : true
    }
    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    });

  }
  generateDispatchCheckListPDF()
  {
    let url = "panel_wise/get_panel_wise_dispatch_List/";
    let data = {
      da_id : this.da_id,
    }
    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    });
  }
  generateSinglePanelWisePdf(panel_name)
  {
    let url = "panel_wise/getPanel_List/";
    let data = {
      da_id : this.da_id,
      panel_name: panel_name
    }
    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    });

  }
  




}


@Component({
  selector: 'open-dialog-packing',
  templateUrl: 'open-dialog.html'
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
export class  PackingOpenDialogView{

  displayedColumns = ['slno','item_desc', 'model','qty', 'make', 'uom', 'remarks'];
  displayedColumnsbox = ['slno','c_box','box_size','box_code', 'boxTypeID', 'remarks' ,'price'];
  dataSource = new MatTableDataSource<['']>();
  dataSourcebox = new MatTableDataSource<['']>();
  da_id:any;
  list: any;
  resultbox:Array<any>=[];
  sectionName:any;
  panelName:any;
  smallBox:any;
  itemList_box:any;
  box_entered = [];
  box_types:any;
  form:UntypedFormGroup;
  formAccessories:Array<any>=[];
  boxform:UntypedFormGroup;
  box_id_itemlist:any;
  public userList:any;
  public subboxcreatebutton:boolean=true;
  public mainboxcreatebutton:boolean=true;
  public margetosmall:boolean=true;
  public margetobig:boolean=true;
  public draft_save:boolean=false;
  public delete_flag;

  print_url = environment.print_url;


 

  tableShow: boolean = false;

  constructor(
    public toast:ToastrService, 
    public fb:UntypedFormBuilder,
    public dialog: MatDialog,
    public storage: StorageServiceService,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<PackingOpenDialogView>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.delete_flag=this.storage.getuser_data();
    this.form = this.fb.group({     
        box_type: new UntypedFormControl(6,{validators:[Validators.required]}),
        main_box: new UntypedFormControl(false),
        item_list:new UntypedFormArray([]),
        box_price:new UntypedFormControl(),
        box_length:new UntypedFormControl(),
        box_height: new UntypedFormControl(),
        gross_weight:new UntypedFormControl(null),
        net_weight:new UntypedFormControl(null),
        qa_wetness: new UntypedFormControl(null,{validators:[Validators.required]}),
        project_wetness: new UntypedFormControl(null,{validators:[Validators.required]}),
        box_breadth: new UntypedFormControl(),
        flag_name: new UntypedFormControl('loose'),
        da_id: new UntypedFormControl(),
        remarks: new UntypedFormControl(),
        panel_flag: new UntypedFormControl(false),
        

      });
      this.boxform = this.fb.group({     
        box_type: new UntypedFormControl(null,{validators:[Validators.required]}),
        main_box: new UntypedFormControl(true),
        box_list:new UntypedFormArray([]),
        box_length:new UntypedFormControl(),
        box_price:new UntypedFormControl(),
        gross_weight:new UntypedFormControl(null),
        net_weight:new UntypedFormControl(null),
        qa_wetness: new UntypedFormControl(null,{validators:[Validators.required]}),
        project_wetness: new UntypedFormControl(null,{validators:[Validators.required]}),
        box_height: new UntypedFormControl(),
        box_breadth: new UntypedFormControl(),
        remarks: new UntypedFormControl(),
        da_no: new UntypedFormControl(),
        panel_flag: new UntypedFormControl(false),
      });
      
      
      this.apiService.getData("logistics_box_size/").then((response)=>{
        this.box_types=response;         
    },(error)=>{
        console.log("error");
    })
    this.apiService.getData("user_list/").then((response: any)=>{
      this.userList=response.data;
    })
    console.log(this.data)
    this.da_id=this.data.da_id;
    this.getsmallbox();
    this.getFilterList();
    
     
   
    
  }

  getBoxPrice_form() {
    let data = {
      'service_type': 'Domestic',
      'boxSizeId': this.form.value.box_type
    }
    let url = "logistics_packing_price/get_box_price_value/";
    this.apiService.postData(url, data).then(res => {
    
      this.form.value.box_price = res
      
    })

  }
  barcodeprint(boxcode,caseno,printtype){

    let url =  this.print_url;
    let printer_ip=''
    if(this.data.da_details.location_unit == 'Unit-2'){
          printer_ip="10.29.22.77"
    }else{
      printer_ip="10.29.11.250"
    }

console.log()
    let data = {
      boxno:boxcode,
      dano: this.data.da_details.jobcode_da_no,  
      sono: this.data.da_details.so_no,
      customername: this.data.da_details.customer_name,  
      projectname: this.data.da_details.ygs_proj_defi,  
      caseno: caseno.toString(),    
      printsize: "big", 
      bigbox: printtype,   
      // printerip: "10.29.22.77"
      printerip: printer_ip
    }
  
    this.apiService.getData_barcode(url,data).then((res: any) => {
  
    console.log("barcode",res);
    })

  }
  getMainBoxDetails_dailog_from_small(box_id){

    let data={
      box_code:box_id
     }
     
    this.apiService.postData("logistics_item_packing/box_code_filter/",data).then((response:any)=>{   
      this.call_dialog_for_small_box_item(response.items)     
    },(error)=>{
        console.log("error");
    })
  
 
  }
  get f() { return this.form.controls; }
  getcurrentpanel_refresh(){
    let data = {
      da_id: this.da_id,
      panel_name: this.data.panel_name,
      section: this.data.section_name
    }

    let url = "panel_wise/get_panel_filter_merged/"

     this.apiService.postData(url, data).then((res: any) => {

      this.itemList_box=res.filter(row => row.qty != row.packed_qty);
      for(let i=0;i<this.itemList_box.length;i++){  
          
        this.itemList_box[i].qty=this.itemList_box[i].qty-this.itemList_box[i].packed_qty
      }
      this.dataSource = new MatTableDataSource(this.itemList_box);

    })
  }
  call_dialog_for_small_box_item(box_id_itemlist){

    const dialogRef = this.dialog.open(OpenDialogBigboxDetails, {
    
      width: '853px',
     
      
      data: {
        box_item_details: box_id_itemlist
            }
    });

  }
  onKey_barcode(event: any) {
    console.log("sandy",event.target.value);
   
    let box_index=this.smallBox.indexOf(this.smallBox.find(e => e.box_code === event.target.value));
    let box_details=this.smallBox.find(e => e.box_code === event.target.value);
    
    if(box_index >= 0){
      this.addBoxToMain(box_details,box_index)
      this.toast.success(" Box "+box_details.box_serial_no +" scanned")
    }else{

      this.toast.error("Wrong Box Scanned")
     
    }
    event.target.value='';
    
}
deletesmallBox(name){
  if(confirm("Are you sure to delete "+name)) {
    let data={
     "main_box":false,
     "box_code":name
    }
    
    this.apiService.postData("logistics_box_details/delete_box_details/",data).then((response:any)=>{
     this.toast.error("Box Deleted Successfully");
     this.getsmallbox(); 
     this.getcurrentpanel_refresh();
     
 
   },(error)=>{      
     console.log("error");
     this.toast.error("Box Not  Deleted")
 })
  }
}
  getsmallbox(){
    let filterboxdata={
      "da_id":this.da_id,
      "main_box": false,
      "status" :"not_packed"
    }
    this.apiService.postData("logistics_box_details/filter_packed_box/",filterboxdata).then((response:any)=>{
          this.smallBox=response.data;   
       
          this.dataSourcebox = new MatTableDataSource(this.smallBox); 
      },(error)=>{
          console.log("error");
      })

  }
  show_draftsave(){
    this.draft_save = !this.draft_save
  }

  openDialog(id,item){

    let acc_filer={
      "flag_name":'loose',
      "item_id":item.id
    }
    let backend_item=true;
    let accessories_ofitem;
    
    if(item.accessories.length <= 0){
      
      this.apiService.postData("panel_accessories/get_panel_accessories/",acc_filer).then((response:any)=>{ 
        accessories_ofitem=response;
       
        // if(accessories_ofitem == null ||  accessories_ofitem.isEmpty || response.length <= 0 ){
        //   backend_item=false
        //   accessories_ofitem=item.accessories
        // }
        this.call_accessories_function(id,item,accessories_ofitem,backend_item);
  
  
        },(error)=>{
            console.log("error");
        })

    }else{
      
      backend_item=false
      accessories_ofitem=item.accessories
      this.call_accessories_function(id,item,accessories_ofitem,backend_item);
      
    }
    
    

    }
    call_accessories_function(id,item,accessories_ofitem,backend_item){ 

    const dialogRef = this.dialog.open(PackingOpenDialogAddAccessories, {
     
      width: '1255px',
      maxWidth:'100%',
      position: {
        top: '0px',
      },
      
      data: {
            id: id,
            item_id:item.id,
            accessories:accessories_ofitem,
            backend_item:backend_item
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.data != "Close"){
      this.form.value.item_list[id].accessories=result.data;
      console.log(result.itemaccesspriess);
        if(result.itemaccesspriess){
          let pushdata={
            item_id:item.id,
            accessories:result.data,  
          }
          this.formAccessories.push(pushdata);
          console.log("boxitemlistwithacc",this.formAccessories);
          
          
        }
      }
     
    });
  }
  

  getFilterList(){
    this.list = this.data.panels;
    this.sectionName=this.data.panels[0].section;
    this.panelName=this.data.panels[0].panel_name;
    this.itemList_box=this.data.panels.filter(row => row.qty != row.packed_qty);
      for(let i=0;i<this.itemList_box.length;i++){  
          
        this.itemList_box[i].qty=this.itemList_box[i].qty-this.itemList_box[i].packed_qty
      }
      // this.data.panels.map((product,index) => {
        // let productObject = {... product };
        // this.data.panels.qty = product.qty - product.packed_qty;
        //  tablearray.push(productObject)
// })        
        // this.data.panels=tablearray;
  


    // this.itemList_box=this.data.panels.filter(row => row.qty != row.packed_qty);
    this.dataSource = new MatTableDataSource(this.itemList_box);
   
    this.dataSourcebox = new MatTableDataSource(this.smallBox); 
      
  }

  dialogClose(){
    this.dialogRef.close();
  }
  addBoxToMain(item:any,item_id:any){
   
    this.boxform.value.box_list.push(item);
    this.smallBox.splice(item_id,1);
    this.dataSourcebox = new MatTableDataSource(this.smallBox);
    console.log(this.smallBox);
  }
  removeBoxToMain(item:any,item_id:any){  
    this.boxform.value.box_list.splice(item_id,1);
    this.smallBox.push(item);
    this.dataSourcebox = new MatTableDataSource(this.smallBox); 
  }
  addItemToBox(item_id:any,item:any){
   
    let boxqty=0;
    if(!this.box_entered[item]){
      boxqty=item_id['qty']
    }else{
      boxqty=parseInt(this.box_entered[item]);
    }
    let oldaccessories='';
    if(this.formAccessories.find(e =>e.item_id  == item_id['id'])){
      let oldacc=this.formAccessories.find(e =>e.item_id  == item_id['id'])
      oldaccessories=oldacc.accessories;
    }
    // if(this.formAccessories.find(e =>e.item_id  == item_id['id'])){
    //   let oldacc=this.formAccessories.find(e =>e.item_id  == item_id['id'])
    //   oldaccessories=oldacc.accessories;
    // }
    let sanarray={
      'id':item_id['id'],
      'da_id':item_id['da_id'],
      'item_desc':item_id['item_desc'],
      'panel_name':item_id['panel_name'],
      'pending_qty':item_id['pending_qty'],
      'packed_qty':item_id['packed_qty'],
      'qty':item_id['qty'],
      'section':item_id['section'],
      'remarks':'',
      'accessories':oldaccessories,
      'entered_qty':boxqty
    }
   
    console.log("sandeoejk",sanarray);
    this.box_entered[item]='';
    this.resultbox=item_id;
    
   
   
    let itemindex=this.form.value.item_list.indexOf(this.form.value.item_list.find( e => e.id == sanarray['id']))
    let item_count=this.form.value.item_list.find( e => e.id == sanarray['id']);
    if(this.form.value.item_list.find( e => e.id == sanarray['id'])){
      let itemindex=this.form.value.item_list.indexOf(this.form.value.item_list.find( e => e.id == sanarray['id']))
      let totalentry=this.form.value.item_list[itemindex].entered_qty + sanarray.entered_qty;
      this.form.value.item_list[itemindex].entered_qty=totalentry;

    }else{

      this.form.value.item_list.push(sanarray);

    }
   
   if((item_id['qty']) != boxqty){    
    // boxqty=item_id['qty'] - boxqty;
   
    if(boxqty == item_id['qty'] ){
     
      this.itemList_box[item].qty=item_id['qty'] - boxqty;
      this.itemList_box.splice(item,1);
    }else{
      this.itemList_box[item].qty=item_id['qty'] - boxqty;
    }

   }else{
    this.itemList_box.splice(item,1);
   }
    this.itemList_box=this.itemList_box.filter(row => row.qty > 0);
    this.dataSource = new MatTableDataSource(this.itemList_box);
  }
  insertremarkstoitempack(index,event){

    this.form.value.item_list[index].remarks=event.target.value;

  }
  
  onSubmitPost(){
    
    
    if (this.form.invalid || (this.form.value.item_list.length <= 0)) {
      this.toast.error("Please enter required details / atleast one item as to push to box")
      
      return;
    }
    this.subboxcreatebutton=false;
    // this.form.value.box_length=Number(this.form.value.box_length);
    // this.form.value.box_height=Number(this.form.value.box_height);
    // this.form.value.box_breadth=Number(this.form.value.box_breadth);
    this.form.value.da_id=this.da_id;
    let obj={...this.form.value};
    console.log("final",obj);
   
 
   

   
    this.apiService.postData("logistics_item_packing/",obj).then((response:any)=>{
      this.toast.success("Box Created Successfully");
      this.barcodeprint(response.item_packing.box_code,response.box_serial_no,this.form.value.main_box)
      let qa_wetness=this.form.value.qa_wetness;
      let project_wetness=this.form.value.qa_wetness;
      this.form.reset();
      this.subboxcreatebutton=true;

      this.form.patchValue({
        main_box:false,
        box_type:6,
        panel_flag:false,
        qa_wetness:qa_wetness,
        project_wetness:project_wetness
      })
      this.getsmallbox(); 
      this.getcurrentpanel_refresh();
        },(error)=>{
          this.subboxcreatebutton=true;
          this.toast.error("Box Not Created");
      console.log("error");
    })  
  }
    
onSubmitBoxToMain(){

 
  if (this.boxform.invalid || (this.boxform.value.box_list.length <= 0)) {
    this.toast.error("Please enter required details / atleast one item as to push to box");
    return;
  }
  this.mainboxcreatebutton=false;
  console.log("sanda_id",this.da_id)
 
  this.boxform.value.da_no=this.da_id;
  let obj={...this.boxform.value};
  this.apiService.postData("logistics_box_details/",obj).then((response:any)=>{
    this.toast.success("Box Created Successfully");
    this.barcodeprint(response.box_code,response.box_serial_no,true)

  this.mainboxcreatebutton=true;

    let qa_wetness=this.boxform.value.qa_wetness;
    let project_wetness=this.boxform.value.qa_wetness;
    this.boxform.reset();
    this.boxform.patchValue({
      main_box:true,
      panel_flag:false,
      qa_wetness:qa_wetness,
      project_wetness:project_wetness
    })
  },(error)=>{
    this.mainboxcreatebutton=true;
    this.toast.error("Box Not Created");
    console.log("error");
    return
  })  
  
  console.log(obj);
  this.boxform.reset();

}

onSubmitBoxToMain_mainbox(){

 
  if (this.boxform.invalid || (this.boxform.value.box_list.length <= 0)) {
    alert("Please enter required details / atleast one item as to push to box");
    return;
  }
  this.margetobig=false;
  console.log("sanda_id",this.da_id)
 
  this.boxform.value.da_no=this.da_id;
  this.boxform.value.main_box=true;
  let obj={...this.boxform.value};
  this.apiService.postData("logistics_box_details/Draft_save_merge/",obj).then((response:any)=>{
    this.toast.success("Box Created Successfully");
    this.barcodeprint(response.box_code,response.box_serial_no,true)

  this.margetobig=true;

    let qa_wetness=this.boxform.value.qa_wetness;
    let project_wetness=this.boxform.value.qa_wetness;
    this.boxform.reset();
    this.boxform.patchValue({
      main_box:true,
      panel_flag:false,
      qa_wetness:qa_wetness,
      project_wetness:project_wetness
    })
  },(error)=>{
    this.margetobig=true;
    this.toast.error("Box Not Created");
    console.log("error");
    return
  })  
  
  console.log(obj);
  this.boxform.reset();

}
onSubmitBoxToMain_subbox(){

 
  if (this.boxform.invalid || (this.boxform.value.box_list.length <= 0)) {
    alert("Please enter required details / atleast one item as to push to box");
    return;
  }
  this.margetosmall=false;
  console.log("sanda_id",this.da_id)
 
  this.boxform.value.da_no=this.da_id;
  this.boxform.value.main_box=false;
  let obj={...this.boxform.value};
  this.apiService.postData("logistics_box_details/Draft_save_merge/",obj).then((response:any)=>{
    this.getsmallbox()
    this.toast.success("Box Created Successfully");
    this.barcodeprint(response.box_code,response.box_serial_no,true)

  this.margetosmall=true;

    let qa_wetness=this.boxform.value.qa_wetness;
    let project_wetness=this.boxform.value.qa_wetness;
    this.boxform.reset();
    this.boxform.patchValue({
      main_box:true,
      panel_flag:false,
      qa_wetness:qa_wetness,
      project_wetness:project_wetness
    })
  },(error)=>{
    this.margetosmall=true;
    this.toast.error("Box Not Created");
    console.log("error");
    return
  })  
  
  console.log(obj);
  this.boxform.reset();

}
  onChangeQty(i){
    
    if(this.box_entered[i] > (this.itemList_box[i].qty)){    
      this.box_entered[i]='';
      this.toast.error("Enter quantity is more than actual quantity");
    }    
  }
  removeItemFromBox(item_id:any,item:any){
    this.form.value.item_list.splice(item,1);
    let module_id_index=this.itemList_box.indexOf(this.itemList_box.find(e => e.id === item_id['id']))
    if(module_id_index >= 0){
      this.itemList_box.splice(module_id_index,1);
    }    
    this.itemList_box.push(item_id);
    this.dataSource = new MatTableDataSource(this.itemList_box);
  }
  getMainBoxDetails(box_id){
    let data={
      "box_code": "box-da_114-1277"
      
    }
    this.apiService.postData("logistics_item_packing/box_code_filter/",data).then((response:any)=>{
          console.log("box",response);
      },(error)=>{
          console.log("error");
      }) 
  }

}






@Component({
  selector: 'open-dialog-panel-packing',
  templateUrl: 'open-dialog-view.html'
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
export class PackingOpenDialogPanel {

  displayedColumns = ['slno','item_desc', 'qty','front','rear',  'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();
  form:UntypedFormGroup;
  list: any;
  resultbox:Array<any>=[];
  sectionName:any;
  panelName:any;
  box_types:any;
  box_entered = [];
  public panel_completed_pack:any;
  public under_revision:any;
  public panelboxcreatebutton:boolean=true;

  public userList:any;
  print_url = environment.print_url;
  

  tableShow: boolean = false;

  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<PackingOpenDialogPanel>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.getFilterList();
    this.form = this.fb.group({     
      box_type: new UntypedFormControl(null,{validators:[Validators.required]}),
      main_box: new UntypedFormControl(true),
      item_list:new UntypedFormArray([]),
      box_length:new UntypedFormControl(),
      box_price:new UntypedFormControl(),
      gross_weight:new UntypedFormControl(null),
      net_weight:new UntypedFormControl(null),
      qa_wetness: new UntypedFormControl(null,{validators:[Validators.required]}),
      project_wetness: new UntypedFormControl(null,{validators:[Validators.required]}),
      box_height: new UntypedFormControl(),
      box_breadth: new UntypedFormControl(),
      remarks: new UntypedFormControl(),
      da_id: new UntypedFormControl(),
      panel_flag: new UntypedFormControl(true),
    
    });
    this.apiService.getData("logistics_box_size/").then((response)=>{
      this.box_types=response;         
  },(error)=>{
      console.log("error");
  })
  this.apiService.getData("user_list/").then((response: any)=>{
    this.userList=response.data;
  })
    
  }
  openDialog(id){
    const dialogRef = this.dialog.open(PackingOpenDialogPanel, {
     
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
  get f() { return this.form.controls; }


  getFilterList(){
    this.list = this.data.panels;
    this.sectionName=this.data.panels[0].section;
    this.panelName=this.data.panels[0].panel_name;
    // for()
    // let sanarray={
    //   'id':item_id['id'],
    //   'da_id':item_id['da_id'],
    //   'item_desc':item_id['item_desc'],
    //   'panel_name':item_id['panel_name'],
    //   'pending_qty':item_id['pending_qty'],
    //   'packed_qty':item_id['packed_qty'],
    //   'qty':item_id['qty'],
    //   'section':item_id['section'],
    //   'remarks':'',
    //   'accessories':oldaccessories,
    //   'entered_qty':boxqty
    // }
    
    this.panel_completed_pack=this.data.panels.filter(row => row.qty != row.packed_qty);
    this.under_revision=this.data.panels.filter(row => row.under_r_flag == true);
    console.log("hsgs",this.panel_completed_pack.length);
    // this.dataSource = new MatTableDataSource(this.data.panels.filter(row => row.qty != row.packed_qty)); 
    this.dataSource = new MatTableDataSource(this.data.panels)
  }

  dialogClose(){  
    this.dialogRef.close();
  }
  addItemToBox(item_id:any,item:any){
   
    console.log(this.data.panels);
   console.log("item",item_id);
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
  barcodeprint(boxcode,caseno,printtype){


    let url =  this.print_url;
    let printer_ip=''
    if(this.data.da_details.location_unit == 'Unit-2'){
          printer_ip="10.29.22.77"
    }else{
      printer_ip="10.29.11.250"
    }
    let data = {
      boxno:boxcode,
      dano: this.data.da_details.jobcode_da_no,  
      sono: this.data.da_details.so_no,
      customername: this.data.da_details.customer_name,  
      projectname: this.data.da_details.ygs_proj_defi,  
      caseno: caseno.toString(), 
      bigbox: printtype,      
      printsize:"big",    
      printerip:printer_ip
    }
  
    this.apiService.getData_barcode(url,data).then((res: any) => {
  
    console.log("barcode",res);

    })

  }
  onSubmitPanel(){
    
    if (this.form.invalid) {
      alert("Please enter required details ");
      return;
    }
    this.panelboxcreatebutton=false
    for(let i=0;i< this.data.panels.length;i++){
      
      let sanarray={
        'id':this.data.panels[i].id,
        'da_id':this.data.panels[i].da_id,
        'item_desc':this.data.panels[i]['item_desc'],
        'panel_name':this.data.panels[i]['panel_name'],
        'pending_qty':this.data.panels[i]['pending_qty'],
        'packed_qty':this.data.panels[i]['packed_qty'],
        'qty':this.data.panels[i]['qty'],
        'section':this.data.panels[i]['section'],
        'remarks':'',
        'accessories':[],
        'entered_qty':this.data.panels[i]['qty'],
      }
      this.form.value.item_list.push(sanarray);

    }
    
    // this.form.value.item_list=this.data.panels;
    this.form.value.da_id=this.data.da_id;
    let obj={...this.form.value};
    console.log("sjdyopanel",obj);
   
    this.apiService.postData("logistics_item_packing/",obj).then((response:any)=>{
      this.toast.success("Box Created Successfully");
      this.barcodeprint(response.item_packing.box_code,response.box_serial_no,true)
     
      this.form.reset();
      this.form.value.main_box=true;

      this.dialogClose();
      this.panelboxcreatebutton=true;
    
    },(error)=>{
      this.panelboxcreatebutton=true;
      this.toast.error("Box Not Created");
      console.log("error");
    })  
   
}

}






















@Component({
  selector: 'open-dialog-add-accessories-packing',
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
export class PackingOpenDialogAddAccessories {

  values = [];  
  form: UntypedFormGroup; 
  empForm:UntypedFormGroup;
  itemDescription: any = '';
  itemQty: any = 0;
  sanaccessories:Array<any>=[];
  repeatAccessories:boolean=true;

  displayedColumns = ['sl_no', 'item_name', 'qty','uom','remarks'];
  dataSource = new MatTableDataSource<['']>();

  constructor(
    private fb:UntypedFormBuilder,
    public toast:ToastrService,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<PackingOpenDialogAddAccessories>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
    this.form=this.fb.group({
      accessories: this.fb.array([])
    })
    this.displaytabledata();
    
  }
  @Output() nameEmitter = new EventEmitter < Array<any> > ();  
  
    PostData() {  
        this.nameEmitter.emit(this.form.value);  
    } 
  displaytabledata(){
    
    
    if(this.data.accessories.length > 0){
      if(this.data.backend_item){
        for (let i = 0; i < this.data.accessories.length; i++) {
          if(i == 0) {
            this.addstartaccessories(this.data.accessories[i].item_description,this.data.accessories[i].item_qty,this.data.accessories[i].remarks,this.data.accessories[i].uom)
          } else if(this.form.value.accessories.find(e => e.item_name != this.data.accessories[i].item_description)){
            this.addstartaccessories(this.data.accessories[i].item_description,this.data.accessories[i].item_qty,this.data.accessories[i].remarks,this.data.accessories[i].uom)
          }else{
            
          }
        }

      }else{
        for (let i = 0; i < this.data.accessories.length; i++) {
          if(i == 0) {
            this.addstartaccessories(this.data.accessories[i].item_name,this.data.accessories[i].qty,this.data.accessories[i].remarks,this.data.accessories[i].uom)
          } else if(this.form.value.accessories.find(e => e.item_name != this.data.accessories[i].item_name)){
            this.addstartaccessories(this.data.accessories[i].item_name,this.data.accessories[i].qty,this.data.accessories[i].remarks,this.data.accessories[i].uom)
          }else{
            
          }
        }

      }
        
    }else{
      this.form=this.fb.group({
        accessories: this.fb.array([this.fb.group({
          item_name:'',
          qty: null,
          uom: null,
          remarks:'' 
        })]) ,
      })
    }
    
   
    // this.dataSource = new MatTableDataSource(this.sanaccessories);
  }
  accessories(): UntypedFormArray {
    return this.form.get("accessories") as UntypedFormArray
  }
  newaccessories(): UntypedFormGroup {
    return this.fb.group({
      item_name: '',
      qty: null,
      uom: null,
      remarks:'' 
    })
  }
  newstartaccessories(item_name,qty,remarks,uom): UntypedFormGroup {
    return this.fb.group({
      item_name: item_name,
      qty: qty,
      uom: uom,
      remarks:remarks 
    })
  }
  addstartaccessories(item_name,qty,remarks,uom) {
    this.accessories().push(this.newstartaccessories(item_name,qty,remarks,uom));
  }
  addaccessories() {
    this.accessories().push(this.newaccessories());
  }
  removeaccessories(empIndex:number) {
    this.accessories().removeAt(empIndex);
  }

  
  onSubmit(){

   
   let acces_length=this.form.value.accessories.length;
    if(this.form.value.accessories.length <= 0 || this.form.value.accessories[acces_length - 1].item_name == ''|| this.form.value.accessories[acces_length - 1].item_name == null){
      this.toast.error("Enter correct data");
      return;
    }
    for (let i = 0; i < this.form.value.accessories.length; i++) {
      this.sanaccessories.push(this.form.value.accessories[i]);
    }
    
    console.log("accessories",this.form.value.accessories);
    this.form.reset();
    this.form.value.accessories=this.fb.array([this.fb.group({
      item_name: '',
      qty: '',
      remarks:'' 
    })])
    this.dataSource = new MatTableDataSource(this.sanaccessories);
    this.dialogRef.close({data:this.sanaccessories,itemaccesspriess:this.repeatAccessories});
   
    // this.apiService.postData("panel_accessories/",obj).then((response:any)=>{
    //   this.toast.success("Box Created Successfully");
    //   this.dataSource = new MatTableDataSource(this.form.value.accessories);
     
    
    // },(error)=>{
    //   console.log("error");
    // })  

    
  }

  

  dialogClose(){
   
    this.dialogRef.close({data:"Close"});
  }

}



@Component({
  selector: 'open-dialog-bigbox-details',
  templateUrl: 'dailog-bigbox-details.html'
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
export class OpenDialogBigboxDetails {

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
  showdetailsof_box_items:boolean=false;
  

  tableShow= 1;

  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogBigboxDetails>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    
   
    
    if(isEmptyObject(data.box_item_details)){
    
      this.tableShow=2;
      this.getboxitemdetails(data.box_codes)

    }else{
    
    this.getMainBoxDetails(data.box_item_details)
    this.tableShow=1;

    }
    
    
  
    }
    getboxitemdetails(boxcode){

      let url = "logistics_box_details/box_code_filter/"
      let data = {
        box_code : boxcode       
      }
      this.api.postData(url, data).then((res: any) => {
      this.bigbox_details=res;
      
      })
    }


    getMainBoxDetails(box_item_detail){
      console.log("item",box_item_detail)
      this.dataSource = new MatTableDataSource(box_item_detail);  

    }
    getMainBoxDetailsitem(box_item_detail){
    
      this.tableShow=3;
     
      this.dataSource = new MatTableDataSource(box_item_detail);  

    }
    getMainBoxDetailsitem_close(){
      this.tableShow=2;
    }
    dialogClose(){
      this.dialogRef.close({data:"Close"});
    }
    
  }

