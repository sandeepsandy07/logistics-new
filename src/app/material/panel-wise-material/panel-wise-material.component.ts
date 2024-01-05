import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ApiserviceService } from 'src/app/apiservice.service';
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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-panel-wise-material',
  templateUrl: './panel-wise-material.component.html',
  styleUrls: ['./panel-wise-material.component.css']
})
export class PanelWiseMaterialComponent implements OnInit {

  public viewRecords: any;
  public onupload_button: boolean = true;
  list: any;

  isListView: boolean = true;

  expandbtn: boolean = true;

  displayedColumns = ['slno.', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();

  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  viewBtn: any = "upload";


  uploadForm: UntypedFormGroup;

  @ViewChild('accordion') accordion: MatAccordion
  SAPDADetails: any;
  SAPDANo: any = 1;
  da_id: string;
  user_action:any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient,
    public api: ApiserviceService,
    public toast: ToastrService,
    public dialog: MatDialog,
    public storage: StorageServiceService,
    private toastr: ToastrService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as { dad_id: string,user_action:any };
    this.da_id = state.dad_id;
    this.user_action = state.user_action;
  }

  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;

  ngOnInit(): void {
    this.getList();
    this.uploadForm = this.formBuilder.group({
      panel_wise_material: new UntypedFormControl("", Validators.required),
    });


    this.viewData(this.da_id);
    this.getDAnoDetails();
    
  }

  viewData(element: any) {

    this.api.viewuser("logistics_dispatch_advice/", element).then((data: any) => {

      this.viewRecords = data.records;
      this.hideloader();
    });
  }
  download_bom() {

    let data = {

      'da_id': this.da_id

    }

    console.log("data=", data)

    let url = 'logistics_panel_wise_material/UploadDataToBomSheet/';

    this.api.postData(url, data).then((result: any) => {

      this.toast.success('success')

      this.fileDownload();

    });

  }
  fileDownload() {

    let url = "logistics_panel_wise_material/download_bom_report/"

    this.api.download(url).subscribe((response) => {

      let blob = new Blob([response], { type: response.type })

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;

      link.setAttribute('download', 'logistics_bom');

      link.click();

    })

  }
  daNavigation(id, nav_url) {
    const navigationExtras: NavigationExtras = { state: { dad_id: id } };
    this.router.navigate([nav_url], navigationExtras);
  }
  getList() {
    let url = "panel_wise/get_panel_wise/"

    let data = {
      da_id: this.da_id
    }
    this.api.postData(url, data).then((res: any) => {
      this.list = res.data;
      let data = this.list;
      if (data != undefined) {
        if (data.length != 0) {
          this.viewBtn = "viewpage";
        }
      }

      let s_panel_tablearray:any=[];
      this.list.map((products,index) => {
                let productObject = {... products };
                 productObject.delete_flag = true;
                
                 
                 s_panel_tablearray.push(productObject)
      })
      this.list=s_panel_tablearray;

      for(let i=0;i<this.list.length;i++){

        console.log("bbbbbbbbbb",this.list)

       
        let tablearray:any=[];
        this.list[i].panel.map((product,index) => {
                  let productObject = {... product };
                  productObject.delete_flag = true;
                  tablearray.push(productObject)
        })        
      this.list[i].panel=tablearray;
  
          for(let j=0;j<this.list[i].panel.length;j++){

            // for(let k=0;k<this.list[i].panel[j].data.length;k++){

             
            
                let ltablearray:any=[];
               
                  this.list[i].panel[j].data.map((product,index) => {
                            let productObject = {... product };
                            if(productObject.packing_flag >=2){
                              productObject.delete_flag = false;
                              this.list[i].panel[j].delete_flag=false;
                              this.list[i].delete_flag=false;
                            }else{
                              productObject.delete_flag = true;

                             
                            }
                            
                            ltablearray.push(productObject)
                  })        
                this.list[i].panel[j].data=ltablearray;
            
         }
      }
      console.log("aaaaaaaaa",this.list)






      
    })
  }
  showloader() {
    document.getElementById('loadingform').style.display = 'block';
  }
  hideloader() {
    document.getElementById('loadingform').style.display = 'none';
  }

  onSubmit() {
    let bearer = this.storage.getBearerToken();
    let headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer' + ' ' + bearer
      })
    };

    const formData: FormData = new FormData();
    if (this.uploadForm.status == "INVALID") {
      this.toastr.error("Please upload file")
    }
    else {

      this.showloader();
      this.onupload_button = false;
      formData.append("panel_wise_material", this.uploadForm.get("panel_wise_material").value);
      formData.append('da_id', JSON.stringify(this.da_id));
      this.http.post<any>(this.url + "data/", formData, headers).subscribe(
        (res: any) => {
          this.toastr.success("BOM Uploaded successfully");
          this.getList();
          this.onupload_button = true;
          this.hideloader();

          let mail_data = {
            "da_id": res.da_id,
            "so_no": res.so_no,
            "job_code": res.job_code,
            "po_no": res.po_no,
            "status": res.status,
            "current_level": res.current_level,
            "requested_person": res.requested_person,
            "email_to": res.email_to,
            "jobcode_da_no": res.jobcode_da_no,
            "module ": 'Dispatch'
          }

          this.api.postData('logistics_dispatch_advice/alert_mail/', res).then((mailres: any) => {

          })
       
      }, (error) => {
        this.hideloader();
        this.onupload_button = true;
        this.toastr.error("please check the format");
      })
    }
  }
  download_bom_temp() {
    let url = "panel_wise/download_panel_file/"
    this.api.download(url).subscribe((response) => {
      let blob = new Blob([response], { type: response.type })
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'BOM_format');
      link.click();
    })
  }

  OnFileSelect(event, name) {
    let file = event.target.files[0];
    this.uploadForm.get(name).setValue(file);
  }
  sendforapproval() {
    let data = {
      da_id: this.da_id,
    }

    let url = "panel_wise/da_modification/"
    this.api.postData(url, data).then((res: any) => {
      this.toast.success("Sent to approvers successfully");
      this.router.navigate(['/material/da']);
     

    })
  }





  submitda_direct() {

   
       
    let data = {
      da_id: this.da_id,
    }
    console.log(this.list)
    if(!this.list){
      this.toast.error("Please Add items to sumbit DA")
      return ;
    }
    
    let url = "logistics_dispatch_advice/complete_da_with_job_code/"
    this.api.postData(url, data).then((res: any) => {
      this.toast.success("DA Submitted successfully");
      this.api.postData('logistics_dispatch_advice/alert_mail/', res).then((mailres: any) => {


      })
      this.router.navigate(['/material/da']);



    })
  }


  getFilterList(panel: any, section: any,list:any) {

    let data = {
      da_id: this.da_id,
      panel_name: panel,
      section: section
    }

    // let url = "panel_wise/get_panel_filter/"
    this.openDialog(list);

    // this.api.postData(url, data).then((res: any) => {

    //   this.openDialog(res);

    // })

  }



  delete_panelwise(id, type) {

    let data: any;

    if (type == "section_wise") {
      data = {
        da_id: this.da_id,
        section: id,
        type: type
      }
    } else if (type == "panel_wise") {
      data = {
        da_id: this.da_id,
        panel: id,
        type: type
      }
    }

    let url = "panel_wise/deletePanelWise_List/"
    this.api.postData(url, data).then((res: any) => {
      this.toast.success("deleted");
      this.getList();
    })
  }
  daNavigation_da(id,nav_url,actions){
    const navigationExtras: NavigationExtras = {state: {dad_id: id,action: actions}};
    this.router.navigate([nav_url], navigationExtras);
  }

  viewPage() {
    let viewUrl: any = 'material/DA-details/';
    const navigationExtras: NavigationExtras = { state: { dad_id: this.da_id } };
    this.router.navigate([viewUrl], navigationExtras);
    // this.submitda_direct();
  }


  openAllPanels() {
    this.expandbtn = false;
    this.accordion.openAll();
  }
  closeAllPanels() {
    this.expandbtn = true;
    this.accordion.closeAll();
  }


  getDAnoDetails() {
    let url = "logistics_dispatch_advice/" + 1
    this.api.getData(url).then((res: any) => {
      this.SAPDADetails = res;
    
      
    })
  }

  generatePDF(panel: any, section: any) {
    let url = "panel_wise/getPanelWise_List/";
    console.log("sapdetails", this.SAPDADetails);
    let data = {
      panel_name: panel,
      section: section,
      records: this.SAPDADetails
    }
    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    });
  }

  openDialog(list: any) {
    const dialogRef = this.dialog.open(OpenDialog, {
      height: '500px',
      width: '1000px',
      data: {
        panels: list,
        da_id: this.da_id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getList();
     
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

  displayedColumns = ['slno', 'qty', 'item_desc', 'make', 'model', 'remarks', 'Delete'];
  dataSource = new MatTableDataSource<['']>();

  list: any;
  panel_name:any;
  delete_flag:any;
  

  

  tableShow: boolean = false;

  constructor(
    public apiService: ApiserviceService,
    public toast: ToastrService,
    public dialogRef: MatDialogRef<PanelWiseMaterialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getFilterList();
  }

  getFilterList() {
    console.log("san", this.data.panels);
    this.list = this.data.panels.data;
    this.delete_flag= this.data.panels.delete_flag
    this.dataSource = new MatTableDataSource(this.data.panels.data);
  }

  delete_panelwise(panel) {
    let data = {
      da_id: this.data.da_id,
      panel: panel,
      type: "panel_wise"
    }
    let url = "panel_wise/deletePanelWise_List/"
    this.apiService.postData(url, data).then((res: any) => {
      this.toast.error("deleted successfully")
      this.dialogRef.close('close');
    })
  }
  delete_item(element: any) {
    console.log("dee", element)

    this.apiService.deleteUser(element, 'panel_wise/').subscribe((data: any) => {
      this.toast.error("deleted successfully")
      this.dialogClose()

    })
  }

  dialogClose() {
    this.dialogRef.close();
  }

}

