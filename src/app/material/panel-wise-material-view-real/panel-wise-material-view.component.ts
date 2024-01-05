import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
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
import { Router } from '@angular/router';


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

  displayedColumns = ['slno.', 'qty', 'item_desc', 'make', 'model', 'remarks'];
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
      const state = navigation.extras.state as {dad_id: string};
      this.da_id = state.dad_id;
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
   
    this.api.viewuser("logistics_dispatch_advice/",element).subscribe((data:any) => { 

      this.viewRecords = data.records;
    });
  }
  daNavigation(id,nav_url){
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.router.navigate([nav_url], navigationExtras);
  }
  getList(){
    let url = "panel_wise/get_panel_wise/"

    let data = {
      da_id : this.da_id
    }
    this.api.postData(url, data).then((res: any) => {
    this.list = res.data;  
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
  templateUrl: 'open-dialog.html'
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
export class OpenDialogView {

  displayedColumns = ['slno', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();

  list: any;

  tableShow: boolean = false;

  constructor(
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<PanelWiseMaterialViewComponent>,
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
