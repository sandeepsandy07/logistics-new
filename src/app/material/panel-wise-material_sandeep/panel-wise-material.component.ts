import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import {Pipe, PipeTransform, Injectable} from "@angular/core";


import { StorageServiceService } from '../../service-storage.service'

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl
} from "@angular/forms";

import { HttpClient, HttpHeaders } from "@angular/common/http";


import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';




@Pipe({
  name: 'filter12',
  pure: false
})  
@Injectable()
export class Ng2SearchPipe implements PipeTransform {

  transform(items: any, term: any): any {
    if (term === undefined) {
      return items;
    }

    return items.filter(function(item){
      return item.name.toLowerCase().includes(term.toLowerCase());
    });
  }
}




@Component({
  selector: 'app-panel-wise-material',
  templateUrl: './panel-wise-material.component.html',
  styleUrls: ['./panel-wise-material.component.css']
})
export class PanelWiseMaterialComponent implements OnInit {

  list: any;
  isListView: boolean = true;
  Panel_search_text:any;
  Panel_search:boolean=false;
  term: string;

  expandbtn: boolean = true;

  displayedColumns = ['slno.', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();

  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  uploadForm: UntypedFormGroup;

  @ViewChild('accordion') accordion: MatAccordion
  SAPDADetails: any;
  SAPDANo: any = 1;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient,
    public api: ApiserviceService,
    public toast:ToastrService, 
    public dialog: MatDialog,
    public storage: StorageServiceService,
    private toastr: ToastrService
    ) { }

    @ViewChild('takeInput', {static: false})
    InputVar: ElementRef;

  ngOnInit(): void {
    this.getList();
    this.uploadForm = this.formBuilder.group({
      panel_wise_material: new UntypedFormControl("", Validators.required),
    });
   

    this.getDAnoDetails();
  }

  getList(){
    let url = "panel_wise/get_panel_wise/"
    this.api.getData(url).then((res: any) => {
      this.list = res.data;  
      console.log(this.list);
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
      this.http.post<any>(this.url + "data/", formData, headers).subscribe(
        (res: any) => {
          this.toastr.success(res.message);
          this.getList();
      });
    }
  }
  functionkeypu(){
    this.Panel_search=true;
    console.log(this.list);
    

  }
 
 

  OnFileSelect(event, name) {
    let file = event.target.files[0];
    this.uploadForm.get(name).setValue(file);
  }


  getFilterList(panel: any, section: any){
    let data = {
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
    const dialogRef = this.dialog.open(OpenDialog, {
      height: '500px',
      width: '1000px',
      data: {
            panels: list
            }
    });
  }

}


@Component({
  selector: 'open-dialog',
  templateUrl: './open-dialog.html'
  , styles: [`
    :host {
      display:flex;
      flex-direction: column;
      height: 100%;
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class OpenDialog {

  displayedColumns = ['slno', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();

  list: any;

  tableShow: boolean = false;

  constructor(
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<PanelWiseMaterialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.getFilterList();
  }

  getFilterList(){

    this.list = this.data.panels;
    this.dataSource = new MatTableDataSource(this.data.panels);
  }

  dialogClose(){
    this.dialogRef.close();
  }

  
  

}

