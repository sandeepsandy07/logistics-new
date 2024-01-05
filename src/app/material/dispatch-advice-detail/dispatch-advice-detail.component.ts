import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';
import { Subject } from 'rxjs';
import { Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {
  FormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
  FormArray,

} from "@angular/forms";

import { HttpClient, HttpHeaders } from "@angular/common/http";


import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dispatch-advice-detail',
  templateUrl: './dispatch-advice-detail.component.html',
  styleUrls: ['./dispatch-advice-detail.component.css']
})
export class DispatchAdviceDetailComponent implements OnInit {

  public viewRecords: any;
  public showdata: any = 1;
  success: boolean = false;
  public da_id: any;
  public dispatch_mode: any;
  public mode_delivery: any;
  public bill_to: any;
  public bill_to_gst: any;
  public ship_to: any;
  public ship_to_gst: any;
  public threadList: any;
  public sold_to: any;
  public sold_to_gst: any;
  public type_of_insurance: any;
  public insurance_scope: any;
  public transportation_scope: any;
  public packing_instruction: any;
  public license_type: any;
  public gst_type: any;
  public unread_chat_count: any;
  public approverslist: any;
  public contact_details: any;
  public da_view: any;
  public billing: any;
  public bom: any;
  public status: any;
  public packing: any;
  public loading: any;
  public tracking: any;
  public document: any;
  dad_id: string;

  constructor(public api: ApiserviceService, private activatedroute: ActivatedRoute,
    public storage: StorageServiceService,

    public dialog: MatDialog, private router: Router,) {
      // console.log("link",this.router.getCurrentNavigation())
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as { dad_id: string };
      if(state != undefined){

        // const navigation = this.router.getCurrentNavigation();
        // const state = navigation.extras.state as { dad_id: string };
        this.da_id = state.dad_id;

       }else{

        this.da_id = this.storage.getda_id();
       

       }
   


  }

  ngOnInit(): void {

    this.da_view = this.storage.getroot_list_single(66);
    this.bom = this.storage.getroot_list_single(68);
    this.status = this.storage.getroot_list_single(69);
    this.packing = this.storage.getroot_list_single(70);
    this.loading = this.storage.getroot_list_single(71);
    this.tracking = this.storage.getroot_list_single(72);
    this.document = this.storage.getroot_list_single(73);



    this.getDaThreads();
    this.viewData(this.da_id);
    this.get_chat_unread_count();

  }
  getDaThreads() {
    let threadData = {
      "da_id": this.da_id
    }
    this.api.postData("dispatch_auth_thread/get_da_threads_list/", threadData).then((threadresponce: any) => {
      this.threadList = threadresponce;
    }, (error) => {
      console.log("error");
    });
    this.api.postData("work_flow_da_approval/get_da_approvers/", threadData).then((threadresponce: any) => {
      this.approverslist = threadresponce;

    });

  }
  viewData(element: any) {

    this.api.viewuser("logistics_dispatch_advice/", element).then((data: any) => {
      this.viewRecords = data;
      debugger
      console.log("data", this.viewRecords);
      this.success = true

    }, (error) => {
      console.log("error");
    })
    console.log("data2", this.viewRecords);
  }
  showother(id: any) {
    this.showdata = id;
  }

  da_chat_open() {
    const dialogRef = this.dialog.open(ChatAppComponent, {
      height: '100%',
      width: '800px',
      // panelClass: 'my-css-class-chat-box',

      maxWidth: '100%',

      data: {
        da_id: this.da_id,
        da_code: this.viewRecords.records.jobcode_da_no
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      this.get_chat_unread_count();
    });
  }

  get_chat_unread_count() {

    let chat_da_id = {
      "da_id": this.da_id
    }
    this.api.postData("logistics_da_communication/filterIdNotExistingInTheList/", chat_da_id).then((threadresponce: any) => {
      this.unread_chat_count = threadresponce.count;

    }, (error) => {

      console.log("error");

    });

  }
  getDispatchParticular(da_id) {

    let url = "logistics_dispatch_advice/getDispatchAdvicePdf/"
    let data = {
      da_id: da_id,
    }

    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    })
  }

}


@Component({
  selector: 'my-app',
  templateUrl: 'da-chat.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 80%;
      
     
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})

export class ChatAppComponent {


  public user_id: any = this.storage.getUserID();
  public threadList: any;
  public form: UntypedFormGroup;
  public da_job_code_id: any;


  constructor(public storage: StorageServiceService,
    public api: ApiserviceService,
    public dialogRef: MatDialogRef<ChatAppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.form = new UntypedFormGroup({
      description: new UntypedFormControl(null, { validators: [Validators.required] }),
      da_id: new UntypedFormControl()

    })

  }

  ngOnInit() {

    this.update_mgs_readed();
    this.user_id = this.storage.getUserID();
    this.get_da_coomunication();
    $('#action_menu_btn').click(function () {
      $('.action_menu').toggle();
    });

    this.da_job_code_id = this.data.da_code;
  }
  update_mgs_readed() {
    let threadData = {
      "da_id": this.data.da_id
    }
    this.api.postData("logistics_da_communication/updateUserViewList/", threadData).then((threadresponce: any) => {
      this.threadList = threadresponce;
    }, (error) => {
      console.log("error");
    });

  }
  get_da_coomunication() {
    let threadData = {
      "da_id": this.data.da_id
    }
    this.api.postData("logistics_da_communication/getFilterOnDaIdList/", threadData).then((threadresponce: any) => {
      this.threadList = threadresponce;
    }, (error) => {
      console.log("error");
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      alert("Please enter valid details");
      return;
    }

    this.form.value.da_id = this.data.da_id;
    let obj = { ...this.form.value };
    this.api.postData("logistics_da_communication/", obj).then((response: any) => {

      this.get_da_coomunication();
      this.form.reset();

    }, (error) => {
      console.log("error");
    })
  }
  dialogClose() {
    this.dialogRef.close({ data: "Close" });
  }
}
