import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';

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


@Component({
  selector: 'app-panel-wise-material',
  templateUrl: './panel-wise-material.component.html',
  styleUrls: ['./panel-wise-material.component.css']
})
export class PanelWiseMaterialComponent implements OnInit {

  list: any;
  isListView: boolean = true;

  displayedColumns = ['slno.', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();

  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  uploadForm: UntypedFormGroup;

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
  }

  getList(){
    let url = "panel_wise/get_panel_wise/"
    this.api.getData(url).then((res: any) => {
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
      this.http.post<any>(this.url + "data/", formData, headers).subscribe(
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
        panel_name: panel,
        section: section
      }
    let url = "panel_wise/get_panel_filter/"
    this.api.postData(url, data).then((res: any) => {
      this.openDialog(res);      
    })
  }


  openDialog(list: any){
    const dialogRef = this.dialog.open(OpenDialog, {
      height: '500px',
      width: '1000px',
      data: {
            panel_name: list
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
    this.list = this.data.panel_name;
    this.dataSource = new MatTableDataSource(this.data.panel_name);
  }

  dialogClose(){
    this.dialogRef.close();
  }

}

