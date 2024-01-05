import { Component, OnInit,Inject, ViewChild, ElementRef } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';

import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';
import { Subject } from 'rxjs';
import { ActivatedRoute ,Params} from '@angular/router';
import { DatePipe } from '@angular/common';

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
  selector: 'app-godown-truck-details',
  templateUrl: './godown-truck-details.component.html',
  styleUrls: ['./godown-truck-details.component.css']
})
export class GodownTruckDetailsComponent implements OnInit {

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    public dialog: MatDialog,
    public toast:ToastrService,
    private fb:UntypedFormBuilder) { }

  ngOnInit(): void {
    this.getListOfGoDownTrucks();
    this.dtOptions = {
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true,
      retrieve: true,
    };
  }

  daNavigation(id,nav_url,actions,readonly,screenvalue){
    const navigationExtras: NavigationExtras = {state: {dad_id: id,action: actions,readonly:readonly,screenvalue:screenvalue}};
    this.route.navigate([nav_url], navigationExtras);
  }

  getListOfGoDownTrucks(){  
    let data={
      truck_filter:{
      tracking_flag:1
      }
    }   
    this.api.postData("logistics_truck_list/get_godown_truck_list/",data).then((response)=>{
      this.tablelist=response;
      this.dtTrigger.next(void 0);
      if (Response) {
        this.hideloader();
      }
    },(error)=>{
        console.log("error");
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  hideloader() {
    document.getElementById('loading') .style.display = 'none';       
    }

    moveTruckToGoDown(trucklistId)
    {
      const dialogRef = this.dialog.open(OpenConfirmPopup, {
        height: '200px',
        width: '400px',
        maxWidth:'100%',
        data: {
          truckListId:trucklistId
              }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getListOfGoDownTrucks()
      });
    }

    // moveTruckToGoDown(trucklistId)
    // {
    //   debugger
}


@Component({
  selector: 'confirm-popup',
  templateUrl: 'confirm-popup.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 20%;
      max-width:20% !important;
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class OpenConfirmPopup{
  tableShow= 1;

  constructor(
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public api: ApiserviceService,
    public storage:StorageServiceService ,
    private http: HttpClient,
    private route:Router,
    public dialogRef: MatDialogRef<OpenConfirmPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    }

    moveTruckToGoDownStorage()
    {
      let record={
        truckListId:this.data.truckListId
      }   
      this.api.postData("logistics_truck_list/updateTrackingFlagAndDate/",record).then((response:any)=>{
        if(response == 1)
        {
          this.route.navigate(['/loading/godown-truck-details/']);
          this.toast.success("Sucessfully updated.")
          this.dialogClose();
      }
      else
      {
        this.toast.error("Error")
      }
        }
        ,(error)=>{
          console.log("error");
      })
    }
   
    dialogClose(){
      this.dialogRef.close();
    }
    
  }

