import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';
import { DatePipe } from '@angular/common';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";

import { HttpClient, HttpHeaders } from "@angular/common/http";


import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';





@Component({
  selector: 'app-vehicle-tracking-view',
  templateUrl: './vehicle-tracking-view.component.html',
  styleUrls: ['./vehicle-tracking-view.component.css']
})
export class VehicleTrackingViewComponent implements OnInit {

  public da_id: any;
  public loaded_truck_list: any;
  public truck_details: UntypedFormGroup;
  public truck_track: any;
  public statusList: any;
  public truckIds: any = [];


  constructor(public api: ApiserviceService, private datePipe: DatePipe,
    public dialog: MatDialog,
    public storage: StorageServiceService,
    private activatedroute: ApiserviceService, private router: Router,
    private formBuilder: UntypedFormBuilder) {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as { dad_id: string };
      if(state != undefined){
        
        this.da_id = state.dad_id
       }else{
        this.da_id = this.storage.getda_id()
       }

    this.truck_details = this.formBuilder.group({
      boxLIst_panel: '',
      boxLIst_loose: this.formBuilder.array([]),
    })
  }

  ngOnInit(): void {
    this.getcurrentTucklist();
  }

  getcurrentTucklist() {
    let data = {
      da_id: this.da_id,
      status: 'all'
    }
    this.api.postData("logistics_truck_list/get_truck_list/", data).then((response: any) => {
      response = response;
      let loaded_truck_list = response.filter(row => row.loaded_flag == true);
      console.log("Truck list hsdhsdh=", loaded_truck_list)
      this.getTruckStatus(loaded_truck_list);
    }, (error) => {
      console.log("error");
    })
  }

  getTruckStatus(res: any) {
    //debugger
    res?.forEach((element: any) => {
      this.truckIds.push(element.truckListId)
    })
    let data = {
      truck_id: this.truckIds 
    }   
    //debugger;
    console.log("passing truck list id=", data)
    let url = "logistics_truck_delivery_details/get_truck_delivery_details_latest/";
    this.api.postData(url, data).then((response: any) => {
      this.statusList = response;
      res?.forEach((element: any) => {
        this.statusList.forEach(val => {
          //debugger;
          if (element?.truckListId == val?.trucklist_id_id) {
            // if(element.truckListId == val.trucklist_id){
            element['tracking_status'] = val;
          }
        });

      })
      this.loaded_truck_list = res;
    })
  }


  callvehicledetailsapi(truck_id) {

    let data = {
      truck_id: truck_id
    }

    this.api.postData("logistics_truck_list/get_truck_tracking_details/", data).then((response: any) => {
      this.truck_track = response;
    }, (error) => {

      console.log("error");

    })
  }

  getTruckDeliveryStatus(truck_id) {
    let url = "logistics_truck_delivery_details/get_truck_delivery_details/";
    let data = {
      truck_id: truck_id
    }
    this.api.postData(url, data).then((res: any) => {
      this.statusList = res;
      let length = res.length
      console.log("Truck list=", this.statusList)
    })
  }




  daNavigation(id, nav_url) {
    const navigationExtras: NavigationExtras = { state: { dad_id: id } };
    this.router.navigate([nav_url], navigationExtras);
  }

  hideloader() {
    document.getElementById('loading').style.display = 'none';
  }

  openDialogPanel(truck_list_id: any) {
    const dialogRef = this.dialog.open(OpenDialogVehicleHistory, {
      height: '400px',
      width: '850px',
      maxWidth: '100%',
      data: {
        truck_tack: truck_list_id
      }
    });
  }

  openTruckDeliveryDetailsAdd(truck_list_Id: any) {
    const dialogRef = this.dialog.open(truckDeliveryDetailsAdd, {
      height: '50%',
      width: '80%',
      maxWidth: '100%',
      data: {
        trucklist_id: truck_list_Id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getcurrentTucklist();
    });
  }


  // trucklist(par4): FormArray {

  // console.log("hdgsfjds", (this.bigbox_details.value.boxLIst_panel.length));

  // if(par4){

  //   return this.bigbox_details.get("boxLIst_panel") as FormArray

  // }else{

  //   return this.bigbox_details.get("boxLIst_loose") as FormArray

  // }

  // }
  newtrucklist(par1, par2, par3): UntypedFormGroup {
    return this.formBuilder.group({
      truck_list: par1,
      item: par2,
      panel: par3
    })
  }
  addtrucklist(par1, par2, par3) {
    // this.trucklist(par1.panel_flag).push(this.newtrucklist(par1,par2,par3));  
  }
}

@Component({
  selector: 'open-dialog-panel',
  templateUrl: 'show-vehicle-transit-history.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 89%;
      max-width:100% !important;
      
    }

    mat-dialog-content {
      flex-grow: 1;
      
    }
    mat-dialog-container{
      background-color:#62b8f56e !important;
    }
  `]
})
export class OpenDialogVehicleHistory {

  // displayedColumns = ['slno','item_desc', 'qty', 'check_by'];
  // list: any;
  // resultbox:Array<any>=[];
  // sectionName:any;
  // panelName:any;
  // box_types:any;
  //truck_track_details = [];
  truck_list_id: any = "";
  truckList: any = "";

  tableShow: boolean = false;
  displayedColumns = ['slno', 'DateTime', 'Status', 'Location'];
  dataSource = new MatTableDataSource<['']>();

  constructor(
    public toast: ToastrService,
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogVehicleHistory>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.truck_list_id = data.truck_tack;
    console.log("truck list id=", this.truck_list_id);
    this.getTruckDeliveryDetails();

  }

  getTruckDeliveryDetails() {
    let url = "logistics_truck_delivery_details/get_truck_delivery_details/";
    let data = {
      truck_id: this.truck_list_id
    }
    this.apiService.postData(url, data).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.truckList = res;
      let length = res.length
      console.log("Truck list=", this.truckList)
    })
  }

  dialogClose() {
    this.dialogRef.close({ data: "Close" });
  }
}

// openDialog(id){
//   const dialogRef = this.dialog.open(OpenDialogPanelLoading, {

//     width: '1255px',
//     maxWidth:'100%',
//     position: {
//       top: '0px',
//     },

//     data: {
//           id: id
//           }
//   });
// }


//Truck Delivery Deatils Add Page

@Component({
  selector: 'truckdeliverydetailsadd',
  templateUrl: 'truckDeliveryDetailsAdd.html',
  styles: [`
      :host {
        width:'60%'
      }
  
      mat-dialog-content {
        flex-grow: 1;
      }
    `]
})
export class truckDeliveryDetailsAdd {
  //create variables
  trucklist_id: any = "";
  currentLocation: any = "";
  currentDateTime: any = "";
  currentLatitude: any = "";
  currentLongitude: any = "";
  currentStatus: any = "";
  cdatetime: any = "";
  date: any = "";
  time: any = "";
  currentTimeValue: any = "";
  myDate = new Date();
  MyDate: any = "";

  constructor(
    public apiService: ApiserviceService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<truckDeliveryDetailsAdd>,
    public toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.trucklist_id = data.trucklist_id;
    console.log("truck list id=", this.trucklist_id);
    this.MyDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd')
  }

  datePickerChange() {
    this.date = this.datePipe.transform(this.currentDateTime, 'yyyy-MM-dd');
    console.log('date=', this.date)
    const _ = moment();
    const date = moment(this.currentDateTime).add({ hours: _.hour(), minutes: _.minute(), seconds: _.second() })
    this.currentDateTime.value = date.toDate();
    console.log({ hours: _.hour(), minutes: _.minute(), seconds: _.second() })
    this.time = _.hour() + ":" + _.minute() + ":" + _.second()
    console.log("time value=", this.time)
    // this.cdatetime = this.date +" "+ this.time; //binding date with current time value
    // this.cdatetime = this.date +" "+ this.currentTimeValue;
    this.cdatetime = this.date;
    console.log("Current Date time=", this.cdatetime);
  }

  onDataChange(newdate) {
    const _ = moment();
    const date = moment(newdate).add({ hours: _.hour(), minutes: _.minute(), seconds: _.second() })
    this.currentDateTime.value = date.toDate();
    console.log({ hours: _.hour(), minutes: _.minute(), seconds: _.second() })
    this.time = _.hour() + ":" + _.minute() + ":" + _.second()
    console.log("time value=", this.time)
    this.currentDateTime = this.datePipe.transform(this.currentDateTime, 'yyyy-MM-dd');
    this.currentDateTime = this.date + " " + this.time;
    console.log("Current Date time=", this.currentDateTime);
  }

  createList() {
    if (this.cdatetime != "" && this.currentTimeValue != "") {
      this.cdatetime = this.date + " " + this.currentTimeValue;
    }
    if (this.trucklist_id == "") {
      this.trucklist_id = null
    }
    if (this.currentLocation == "") {
      this.currentLocation = null;
    }
    // if(this.cdatetime == "")
    // {
    //   //this.cdatetime = null;
    //   this.cdatetime = this.MyDate + " " + this.currentTimeValue;
    // }
    if (this.currentLatitude == "") {
      this.currentLatitude = null;
    }
    if (this.currentLongitude == "") {
      this.currentLongitude = null;
    }
    if (this.currentStatus == "") {
      this.currentStatus = null;
    }
    {
      let data = {
        'trucklist_id': this.trucklist_id,
        'current_location': this.currentLocation,
        'current_datetime': this.cdatetime,
        'current_latitude': this.currentLatitude,
        'current_longitude': this.currentLongitude,
        'current_status': this.currentStatus,
        'manual_flag': true
      }
      let url = "logistics_truck_delivery_details/";
      this.apiService.postData(url, data).then(res => {
        console.log(res)
        this.toast.success("Record Successfully Inserted!");
      })
    }
    this.dialogRef.close();
  }
  dialogClose() {
    this.dialogRef.close();
  }
}



