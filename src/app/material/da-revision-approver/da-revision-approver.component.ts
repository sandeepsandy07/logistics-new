import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';
import { Subject } from 'rxjs';
import { Moveingitem } from '../interfacetypecreate';
import {SelectionModel} from '@angular/cdk/collections';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
  UntypedFormArray,
   
} from "@angular/forms";
import {FormGroupDirective, NgForm} from '@angular/forms';


import { HttpClient, HttpHeaders } from "@angular/common/http";
import {ErrorStateMatcher} from '@angular/material/core';


import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { I } from '@angular/cdk/keycodes';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-da-revision-approver',
  templateUrl: './da-revision-approver.component.html',
  styleUrls: ['./da-revision-approver.component.css']
})
export class DaRevisionApproverComponent implements OnInit {

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public viewRecords:any;
  list: any;
  success:boolean=false;
  isListView: boolean = true;
  panel_serial_no:any;
  shipping_clearance_no:any;
  matcher = new MyErrorStateMatcher();
  public tablearrayspe:any=[];
  public userList:any;

  expandbtn: boolean = true;
  public form:UntypedFormGroup;


  displayedColumns = ['checklist','slno','item_desc','make', 'model','qty'];
  dataSource:any= new MatTableDataSource<['']>();
  selection = new SelectionModel<['']>(true, []);

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
      const state = navigation.extras.state as {dad_id: string};
      this.da_id = state.dad_id;
      this.getList(this.da_id)

      this.form = new UntypedFormGroup({
      
        description:new UntypedFormControl(),
        status:new UntypedFormControl('Open'),
        revision_type:new UntypedFormControl(null,{validators:[Validators.required]}),
        da_list:new UntypedFormArray([]),
        panel_master_list:new UntypedFormArray([]),
        panel_wise_list:new UntypedFormArray([]),
        user_ids:new UntypedFormControl(null,{validators:[Validators.required]}),
        self_edit_flag:new UntypedFormControl(false) 
      })

    this.form.value.da_list.push(this.da_id)
    }

    @ViewChild('takeInput', {static: false})
    InputVar: ElementRef;

  ngOnInit(): void {

    // this.getListOfDispatchValues();
    this.dtOptions = {
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
      
    };
    
  }
  clickofallcheckbox(section_index,panel_name,panel_length,element,panel_index){

    let isChecked:boolean=element.checked;
    const cartoons = (this.form.controls.panel_wise_list as UntypedFormArray);
    if (isChecked) {

      for(let i=0;i<this.list[section_index].panel[panel_index].data.length;i++)
      {
        if(cartoons.controls.filter(x => x.value.id ===this.list[section_index].panel[panel_index].data[i].id).length){

        }else{
          cartoons.push(new UntypedFormControl(this.list[section_index].panel[panel_index].data[i]));
          this.list[section_index].panel[panel_index].data[i].checked_flag=true

        }
       
      }
      this.list[section_index].panel[panel_index].single_checked_flag=true


    }else{
        
      for(let i=0;i<this.list[section_index].panel[panel_index].data.length;i++){
        const index = cartoons.controls.findIndex(x => x.value.id === this.list[section_index].panel[panel_index].data[i].id);
        this.list[section_index].panel[panel_index].data[i].checked_flag=false
        cartoons.removeAt(index);

      }
      this.list[section_index].panel[panel_index].single_checked_flag=false
         


    }
  }
  
  isAllSelected(section_index,panel_name,panel_length) {
    const cartoons = this.form.controls.panel_wise_list as UntypedFormArray;
    
    let indexofpanel=this.list[section_index].panel.findIndex(x => x.name === panel_name);
    // const numSelected =this.list[section_index].panel[indexofpanel].data.length;
    const numSelected =cartoons.controls.filter(x => x.value.panel_name === panel_name).length
    if(numSelected > 0){
      this.list[section_index].panel[indexofpanel].single_checked_flag=true;

    }else{
      this.list[section_index].panel[indexofpanel].single_checked_flag=false;
    }
  
    if(numSelected === panel_length){
      this.list[section_index].panel[indexofpanel].checked_flag=true
    }else{
      this.list[section_index].panel[indexofpanel].checked_flag=false
    }
   
    // this.itemList_box=this.data.panels.filter(row => row.qty != row.packed_qty);

   
    return numSelected === panel_length;
  }
  clickofcheckbox(section_index,ele,element,panel_length,item_index,panel_index){
    
    let isChecked:boolean=element.checked;
    const cartoons = (this.form.controls.panel_wise_list as UntypedFormArray);
    if (isChecked) {
      cartoons.push(new UntypedFormControl(ele));
      this.list[section_index].panel[panel_index].data[item_index].checked_flag=true;
      
    } else {

      const index = cartoons.controls.findIndex(x => x.value.id=== ele.id);
      this.list[section_index].panel[panel_index].data[item_index].checked_flag=false
      cartoons.removeAt(index);
    }
    this.isAllSelected(section_index,ele.panel_name,panel_length);
    console.log(this.form.controls.panel_wise_list)
    
  }
  
  getListOfDispatchValues(){
    this.api.getData("panel_wise/get_da_list_for_user/").then((response)=>{
      this.tablelist=response;
      console.log(this.tablelist);
      this.dtTrigger.next(void 0);   
    },(error)=>{
        console.log("error");
    })

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
  getList(daid){
    this.da_id=daid;
    this.success=true;
   
    this.viewData(daid);
    this.api.getData("user_list/").then((response: any)=>{
      this.userList=response.data;
    })
    let url = "panel_wise/get_panel_wise/"
    let data = {
      da_id: this.da_id
    }
    let tablearray:any=[];
    this.api.postData(url, data).then((res: any) => {
    this.list = res.data;

    for(let i=0;i<this.list.length;i++){


      let panel_tablearray:any=[];
      this.list[i].panel.map((products,index) => {
                let productObject = {... products };
                 productObject.checked_flag = false;
                 productObject.single_checked_flag = false;
                 panel_tablearray.push(productObject)
      })
      this.list[i].panel=panel_tablearray;

        for(let j=0;j<this.list[i].panel.length;j++){
          let tablearray:any=[];
            this.list[i].panel[j].data.map((product,index) => {
                      let productObject = {... product };
                       productObject.checked_flag = false;
                       tablearray.push(productObject)
            })        
          this.list[i].panel[j].data=tablearray;
       }
    }
    
   
    
    
    });
  }

  onSubmitPost(){
    if (this.form.invalid) {
      alert("Please enter required details");
      return;
    }
    this.form.value.da_id=this.da_id;
            let obj={...this.form.value};            
            this.api.postData("logistics_revision_details/",obj).then((response:any)=>{
            this.form.reset();          
            this.toast.success("DA Revision Created Successfully");
            this.router.navigate(['material/revisionlist']);          
           },(error)=>{
               console.log("error");
           })
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
    const dialogRef = this.dialog.open(OpenDialogDaRevisionCreate, {
      height: '90%',
      width: '100%',
      maxWidth:'100%',
      
      data: {
            panels: list
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getList(this.da_id);

    })
  }
  onSubmit(arr){

  }
  

}

@Component({
  selector: 'da-revision-create',
  templateUrl: 'da-revision-create.html'
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
export class OpenDialogDaRevisionCreate {

  displayedColumns = ['checklist','slno','item_desc',   'make', 'model','qty'];
  displayedColumnsbox = ['slno','item_desc', 'qty', 'remarks'];
  dataSource = new MatTableDataSource<['']>();
  selection = new SelectionModel<['']>(true, []);
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
  checked_items=[];

  tableShow: boolean = false;

  constructor(
    public toast:ToastrService, 
    public fb:UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogDaRevisionCreate>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.getFilterList();
    this.form = this.fb.group({     
       
        data:new UntypedFormArray([]),
       
      });
     
      
      
     
   
    
  }

  

  getFilterList(){
    this.list = this.data.panels;
    this.sectionName=this.data.panels[0].section;
    this.panelName=this.data.panels[0].panel_name;
    this.dataSource = new MatTableDataSource(this.data.panels);
    this.selection = new SelectionModel(this.data.panels);
    // this.dataSourcebox = new MatTableDataSource(this.smallBox); 
    //this.form.value.item_list.push(this.data.panels);
    
    
    
  
  }

  dialogClose(){
    this.dialogRef.close();
  }
  
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(row): string {
    
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.slno + 1}`;
  }
  checkboxLabelAll(): string {
    
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    
  }
  
  onSubmitPost(panelname){

    console.log( "lenghth",this.selection.selected);
    // let data={
    //     da_id:this.data.panels[0].da_id,
    //     panel_name:panelname,
    //     remarks:"sdfds"
    // }
    // debugger;
    // this.apiService.postData("panel_wise/updateApprovedPanelItems/",data).then((response:any)=>{
    //   this.toast.success("Panel Approved Successfully");
    //   this.form.reset();
    
    // },(error)=>{
    //   console.log("error");
    // })  
   
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
  onChange() {
   
    console.log("hi",this.checked_items);
    
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



