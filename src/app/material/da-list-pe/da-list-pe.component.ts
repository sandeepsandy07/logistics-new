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
  FormGroup,
  Validators,
  FormControl,
  FormArray,
   
} from "@angular/forms";

import { HttpClient, HttpHeaders } from "@angular/common/http";


import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-da-list-pe',
  templateUrl: './da-list-pe.component.html',
  styleUrls: ['./da-list-pe.component.css']
})
export class DaListPeComponent implements OnInit {

  public tablelist:any;
  public tablelist_approved:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  displayedColumns = ['slno.', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();

  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();
  displayedColumns2 = ['slno.', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource2 = new MatTableDataSource<['']>();

  constructor(private formBuilder: UntypedFormBuilder,
    private http: HttpClient,
    public api: ApiserviceService,
    public toast:ToastrService, 
    public dialog: MatDialog,
    public storage: StorageServiceService,
    private toastr: ToastrService,
    private router: Router
    ) { 


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
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };
  }
  getListOfDispatchValues(){
    let data={ 
      type: 'panel_verifer',
      data_approver:{
        

      },
      status_approver:'DA_project_Engg'
      
    }   
    this.api.postData("work_flow_access/da_list_others/",data).then((response:any) => {
      this.tablelist=response;
      this.dtTrigger.next(void 0);   
    },(error)=>{
        console.log("error");
    })

    let data1={ 
      type: 'panel_verifer',
      data_approver:{
        
        
      },
      status_approver:'DA_project_Engg'
      
    }   

     this.api.postData("work_flow_access/da_list_others/",data1).then((response:any) => {
      this.tablelist_approved=response;
      this.dtTrigger2.next(void 0);   
    },(error)=>{
        console.log("error");
    })

  }
  daNavigation(id,nav_url){
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.router.navigate([nav_url], navigationExtras);
  }
  daNavigation_bom(id,nav_url,user_action){
    const navigationExtras: NavigationExtras = {state: {dad_id: id,user_action: user_action}};
    this.router.navigate([nav_url], navigationExtras);
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  daNavigation_da(id,nav_url,actions){
    const navigationExtras: NavigationExtras = {state: {dad_id: id,action: actions}};
    this.router.navigate([nav_url], navigationExtras);
  }

}


