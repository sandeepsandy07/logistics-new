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



@Component({
  selector: 'app-da-revision',
  templateUrl: './da-revision.component.html',
  styleUrls: ['./da-revision.component.css']
})
export class DaRevisionComponent implements OnInit {

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public viewRecords:any;
  list: any;
  statusbutton:boolean=true
  public form:UntypedFormGroup;
  public panel_master_list:any;
  public rev_id:any;
  public revision_type:any;
  public formcurrentpanel:UntypedFormGroup;
  success:boolean=false;
  isListView: boolean = true;
  public threadList:any;
  public revision_details:any;

  expandbtn: boolean = true;

  displayedColumns = ['slno.', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();

  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  uploadForm: UntypedFormGroup;

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
      this.form = new UntypedFormGroup({
      
        description:new UntypedFormControl(),
        status:new UntypedFormControl(null,{validators:[Validators.required]}),

        rev_id:new UntypedFormControl(),
        da_id:new UntypedFormControl(),
        // revision_type:new FormControl(),
        // da_list:new FormArray([]),
        // panel_master_list:new FormArray([]),
        panel_wise_list:new UntypedFormArray([]),
        // user_ids:new FormControl(),
        
      })
      this.formcurrentpanel = new UntypedFormGroup({

        panel_wise_list:new UntypedFormArray([]),
        rev_id:new UntypedFormControl(),

      })
    
    }

    @ViewChild('takeInput', {static: false})
    InputVar: ElementRef;

  ngOnInit(): void {
    
    this.getListOfDispatchValues();
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
    const numSelected =cartoons.controls.filter(x => x.value.old_panel_name === panel_name).length
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
    console.log(section_index,ele,element,panel_length,item_index,panel_index)
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
    this.isAllSelected(section_index,ele.old_panel_name,panel_length);
    console.log(this.form.controls.panel_wise_list)
    
  }
  

  getListOfDispatchValues(){
    // this.api.getData("logistics_dispatch_advice").then((response)=>{ 
    this.api.getData("logistics_revision_details/revision_list_filter_based_on_user/").then((response:any)=>{
    this.tablelist=response.data;
      console.log(this.tablelist);
      this.dtTrigger.next(void 0);   
      this.success=false; 
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
  update_revision_details(rev_id,daid,revision_type){
   
    this.da_id=daid;
    this.rev_id=rev_id;
    this.revision_type=revision_type;
    this.success=true;
    this.viewData(daid);


    let threadData={
      "revision_id":rev_id
      }
      this.api.postData("logistics_revision_threads/revision_thread_list/",threadData).then((threadresponce:any) => {
        this.threadList=threadresponce;      
      },(error)=>{  
          console.log("error");
      });

      
      let url2 = "panel_wise_master/get_master_panel_list/"
      let data2 = {
        da_id : this.da_id,
        status :'all'
      }
      this.api.postData(url2, data2).then((res: any) => {
      this.panel_master_list = res;  
      
      })
      
    // let url = "panel_wise/get_panel_items/"

    // let data = {
    //   da_id : 181
    // }
    // this.api.postData(url, data).then((res: any) => {
    // this.list = res.data;  

    let url ="logistics_revision_details/revision_list/";

    let data = {
      revision_id : rev_id
    }
    this.api.postData('logistics_revision_details/revision_list/',data).then((res: any) => {
    this.list = res.data;  
    this.revision_details=res.revision_list;
    this.form.patchValue({
      status:this.revision_details[0].status 
    })

   


    if(revision_type == 'panel_wise'){
        
  

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
                       productObject.updated_qty =productObject.qty;
                       productObject.old_panel_name =productObject.panel_name;
                       tablearray.push(productObject)
            })        
          this.list[i].panel[j].data=tablearray;
       }
    }
  } 
    console.log("approve list", this.list);
    })
  }
  Updateitemqty(section_index,panel_index,item_index,actionevent,inputname){
    console.log(section_index,panel_index,item_index,actionevent,inputname)
      switch (inputname) {

        case 'qty':
          this.list[section_index].panel[panel_index].data[item_index].qty=actionevent.target.value;
          break;
        case 'updated_qty':
          this.list[section_index].panel[panel_index].data[item_index].updated_qty=actionevent.target.value;
          break;
        case 'item_desc':
          this.list[section_index].panel[panel_index].data[item_index].item_desc=actionevent.target.value;
          break;
        case 'model':
          this.list[section_index].panel[panel_index].data[item_index].model=actionevent.target.value;
          break;
        case 'make':
            this.list[section_index].panel[panel_index].data[item_index].make=actionevent.target.value;
            break;
        case 'panel':
            this.list[section_index].panel[panel_index].data[item_index].panel_name=actionevent.value;
            break;
      }
      

  }
  onPanelItemSubmit(panel_name){
   
    

    const cartoons = this.form.controls.panel_wise_list as UntypedFormArray;
    this.formcurrentpanel.value.panel_wise_list=this.form.value.panel_wise_list.filter(x => x.old_panel_name === panel_name);
    if (this.formcurrentpanel.value.panel_wise_list.length <= 0) {
      alert("Please select item to update");
      return;
    }
    this.formcurrentpanel.value.rev_id=this.rev_id;
    let obj={...this.formcurrentpanel.value};
   
   
    this.api.postData('logistics_revision_details/revision_update/',obj).then((res: any) => {
       
        this.form.reset(); 
        this.formcurrentpanel.reset();         
        this.toast.success("Updated Successfully");
        this.update_revision_details(this.rev_id,this.da_id,this.revision_type);
    });

  }
  onSubmitupdatestatus(){
    if (this.form.invalid) {
      alert("Please enter required details");
      return;
    }
    this.statusbutton=false;
    this.form.value.rev_id=this.rev_id;
    this.form.value.da_id=this.da_id;
    let obj={...this.form.value};

    console.log(obj);
    this.api.postData('logistics_revision_details/revision_status_update/',obj).then((res: any) => {
        console.log(res);
        this.success=false;
        this.getListOfDispatchValues();
        
    });

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
    }else{
      formData.append("panel_wise_material", this.uploadForm.get("panel_wise_material").value);
      formData.append('da_id', JSON.stringify(this.da_id));
      this.http.post<any>(this.url + "data/", formData,  headers).subscribe(
        (res: any) => {
          this.toastr.success(res.message);
      });
    }
    
  }

  OnFileSelect(event, name) {
    let file = event.target.files[0];
    this.uploadForm.get(name).setValue(file);
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

 
  

}





