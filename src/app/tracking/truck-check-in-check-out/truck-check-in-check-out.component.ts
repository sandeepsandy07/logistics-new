import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-truck-check-in-check-out',
  templateUrl: './truck-check-in-check-out.component.html',
  styleUrls: ['./truck-check-in-check-out.component.css']
})
export class TruckCheckInCheckOutComponent implements OnInit {

  url="logistics_truck_list/";

  MainForm:boolean=true;
  MainHeader:boolean=true;
  checkOutRemarks:any="";

  @ViewChild('paginatorLegal') paginatorLegal: MatPaginator;
  @ViewChild('paginatorGSTN') paginatorGSTN: MatPaginator;

  public dataSource1 = new MatTableDataSource<['']>();
  public displayedColumns1: string[] = ['Sl.no.','TruckType','TruckReqID','ReqDate','Remarks','Status','Destination','Transportation','RequestedBy','Action'];
  
  public dataSource2 = new MatTableDataSource<['']>();
  public displayedColumns2: string[] = ['Sl.no.','Truck Type','DA no', 'SO no', 'Vehicle No','Driver Name','Status','Destination','Transportation','Requested By','Action'];
  
  public dataSource3 = new MatTableDataSource<['']>();
  public displayedColumns3: string[] = ['Sl.no.','Truck Type','DA no', 'SO no','Vehicle No','Driver Name','Checked In','Checked Out','CheckedIn Remarks','CheckedOut Remarks','Status','Action'];  

  resultsLength: any;
  TruckReqList: any;
  TransportsTypeList: any;
  TransportationName: any;
  EmpListData: any;
  truckList: any;
  truckListId: any;
  resultList: any;
  myDate = new Date();
  Date: string;
  CheckOutDate:string;
  CheckedInList: any;
  CheckedOutList: any;
  CompletedList: any;

  StartDate="";
  EndDate="";
  Startdate:any="";
  Enddate:any="";
  DestinationListData: any;
  TransportationList: any;
  FilteredDateList: any;
  viewRecords:any="";
  ViewForm:boolean=false;

  todayDate = new Date();

  constructor(public api: ApiserviceService,
    public toast:ToastrService,
    public dialog: MatDialog,
    private datePipe: DatePipe)
    {
      this.Date = this.datePipe.transform(this.myDate, 'yyyy-MM-dd h:mm:ss');
      this.CheckOutDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd h:mm:ss');
    }

  ngOnInit()
  {
    this.getCheckedOutList();
    this.getCompletedList();
  }

  applyFilter(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  applyFilter3(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }


  StartDatePickerChange()
  {
    this.Startdate = this.datePipe.transform(this.StartDate, 'yyyy-MM-dd h:mm:ss');
    console.log(this.Startdate)
  }

  EndDatePickerChange()
  {
    this.Enddate = this.datePipe.transform(this.EndDate, 'yyyy-MM-dd h:mm:ss');
    console.log(this.Enddate)
  }

  FilterDataOnDate()
  {
       let data={
         'startDate':this.Startdate,
         'endDate':this.Enddate
       }
       console.log("values of Dates",data)
      let url = "logistics_truck_list/getDateFilteredList/";
      this.api.postData(url,data).then((res:any) => {
        this.dataSource3 = new MatTableDataSource(res);
        this.FilteredDateList = res;
        console.log("this date filtered values=",this.FilteredDateList)
  })
}

  getCheckedInListCorrect()
  {
    let url = "logistics_truck_list/getTruckListValues/";
    let data={ 'status':"Open"}
    console.log(data)
    this.api.postData(url,data).then((res:any) => {
    this.dataSource1 = new MatTableDataSource(res);
     this.dataSource1.data = res;
     this.CheckedInList = res;
    
     this.CheckedInList?.forEach((element: any) => {
      this.EmpListData?.forEach((val: any) => {
        if(element.created_by == val.id){
          element['created_by'] = val.employee_name;
        }
      });
    });

    this.CheckedInList?.forEach((element:any) => {
      this.truckList?.forEach((val:any) => {
        if(element.truckID == val.truckId)
        {
          element['truckName'] = val.truckName
        }
      })
    })

    this.CheckedInList?.forEach((element:any) => {
      this.DestinationListData?.forEach((val:any) => {
        if(element.destination_Id == val.destinationId)
        {
          element['destinationName'] = val.destinationName
        }
      })
    })

    this.CheckedInList?.forEach((element:any) => {
      this.TransportationList?.forEach((val:any) => {
        if(element.truckRequest == val.transportationId)
        {
          element['transportationName'] = val.transportationName
        }
      })
    })


    })
  }

  getCheckedOutList()
  {
    let url = "logistics_truck_list/getTruckListValues/";
    this.api.getData(url).then((res:any) => {
    this.dataSource2 = new MatTableDataSource(res);
    console.log("Checked out list", res.CheckedOutList)
    this.dataSource2.data = res.CheckedOutList;
   
    this.dataSource2.paginator = this.paginatorLegal;
     this.CheckedOutList = res.CheckedOutList;
    })
  }

  getCompletedList()
  {
    let FromDate=this.datePipe.transform(this.todayDate, 'yyyy-MM-dd')
    let url = "logistics_truck_list/getTruckListValues/";
    this.api.getData(url).then((res:any) => {
    this.dataSource3 = new MatTableDataSource(res);
     this.dataSource3.data = res.CompletedList;
     this.dataSource3.paginator = this.paginatorGSTN;
     this.CompletedList = res.CompletedList;
     console.log("completed list", this.CompletedList)
    })
  }

  clearDataOnDate()
  {
    this.StartDate = "";
    this.EndDate = "";
    let url = "logistics_truck_list/getTruckListValues/";
    this.api.getData(url).then((res:any) => {
      this.dataSource3 = new MatTableDataSource(res);
       this.dataSource3.data = res.CompletedList;
       this.dataSource3.paginator = this.paginatorGSTN;
       this.CompletedList = res.CompletedList;
       console.log("completed list", this.CompletedList)
      })
  }

  addDriverDetails(element)
  {
    if(element.status == "Open")
    {
      this.MainForm=false;
      this.MainHeader=false;
      console.log("element = ",element)
      this.truckListId = element.truckListId;
      console.log("truck list Id=",this.truckListId)
      console.log("date=",this.Date)
    }
    else
    {
      this.MainForm=false;
      this.MainHeader=false;
      console.log("element = ",element)
      this.truckListId = element.truckListId;
      console.log("truck list Id=",this.truckListId)
    }
    
  }

  updateCheckOutData()
  {
    if(this.checkOutRemarks=="")
    {
      this.toast.error("Please Enter Check Out Remarks");
    }
    else
    {
      let data={
        'status':"CheckedOut",
        'check_out_remarks':this.checkOutRemarks,
        'check_out':this.CheckOutDate,
        'tracking_status':1
      }
        console.log(data)
        console.log("trucklist id=",this.truckListId)
        let url = "logistics_truck_list/"+this.truckListId+"/";
        this.api.updateData(url,data).then(res => {
          console.log(res)
          this.toast.success("Record Updated Successfully!");
          this.resultList=res;
        })
    }
    this.MainForm=true;
    this.MainHeader=true;
  }

  setCheckOutBackButton()
  {
    this.MainForm=true;
    this.MainHeader=true;
  }

  viewData(truckListid)
  {
    console.log(truckListid);
    let url="logistics_truck_list/";
    this.api.viewuser(url,truckListid).then((data:any) => {
      this.ViewForm=true;
      this.MainHeader=false;
      this.viewRecords = data.records;
      console.log(this.viewRecords);
     })
  }

  setViewForm()
  {
    this.ViewForm=false;
    this.MainHeader=true;
  }

  openDialog(element:any)
  {
    const dialogRef = this.dialog.open(OpenCheckInDialogBox, {
      height: '50%',
      width: '70%',
      maxWidth:'100%',
      
      data: {
            element: element
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getCheckedOutList();
    });
  }

openCheckOutDialog(element:any)
{
  const dialogRef = this.dialog.open(OpenCheckOutDialogBox, {
    height:'50%',
    width:'70%',
    maxWidth:'100%',

    data: {
      element:element
    }
  });
  dialogRef.afterClosed().subscribe(result => {
    this.getCheckedOutList()
    this.getCompletedList();
  });
}

}




//CheckIn DialogBox Component

@Component({
  selector: 'open-checked-in-dialog',
  templateUrl: 'OpenCheckInDialogBox.html',
   styles: [`
    :host {
      width:'60%'
     
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class OpenCheckInDialogBox {
  url="logistics_truck_list/";
  detailsAddForm:boolean=true;
  detailsAddFormHeader:boolean=true;
  vehicleNumber:any="";
  driverName:any="";
  driverPhoneNumber:any="";
  checkInRemarks:any="";
  Date: string;
  myDate = new Date();
  resultList: any="";
  truckListId:any="";

  constructor(
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenCheckInDialogBox>,
    public toast:ToastrService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any)
    {
      this.Date = this.datePipe.transform(this.myDate, 'yyyy-MM-dd h:mm:ss');
      // this.CheckOutDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd h:mm:ss');
    }

    addDetailsData()
  {
    console.log("dhshgsg",this.data.element)
    this.truckListId = this.data.element.truckListId

  if(this.vehicleNumber=="")
  {
    this.toast.error("Please Enter Vehicle Number");
  }
  else if(this.driverName == "")
  {
    this.toast.error("Please Enter Driver Name");
  }
  else if(this.driverPhoneNumber == "")
  {
    this.toast.error("Please Enter Driver Phone Number");
  }
  else
  {
    let data={
      'vehicle_no':this.vehicleNumber,
      'driver_name':this.driverName,
      'driver_no':this.driverPhoneNumber,
      'status':"CheckedIn",
      'check_in_remarks':this.checkInRemarks,
      'check_in':this.Date
    }
      console.log(data)
      let url = "logistics_truck_list/"+this.truckListId+"/";
      this.apiService.updateData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
      })
  }
  this.dialogRef.close();
  }


  dialogClose(){
    this.dialogRef.close();
  }

}


//CheckOutDialogBox Component
@Component({
  selector: 'open-checked-out-dialog',
  templateUrl: 'OpenCheckOutDialogBox.html',
   styles: [`
    :host {
      width:'60%'
     
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class OpenCheckOutDialogBox {
  url="logistics_truck_list/";
  checkOutHeader:boolean=true;
  checkOutDataForm:boolean=true;
  CheckOutDate: string;
  myDate = new Date();
  checkOutRemarks:any="";
  resultList: any;
  truckListId:any="";
  public emails: any = [];
  email_list:any="";

  constructor(
   
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenCheckInDialogBox>,
    public toast:ToastrService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any)
    {
       this.CheckOutDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd h:mm:ss');
    }


    updateCheckOutData()
    {
      console.log("data passed from element =", this.data.element)
      this.truckListId = this.data.element.truckListId
      if(this.checkOutRemarks=="")
      {
        this.toast.error("Please Enter Check Out Remarks");
      }
      else
      {
        let data={
          // 'status':"CheckedOut",
          'status':"Shipped",
          'check_out_remarks':this.checkOutRemarks,
          'check_out':this.CheckOutDate,
          'tracking_status':1,
          'truckListId':this.truckListId
        }
          console.log(data)
          console.log("trucklist id=",this.truckListId)
          let url = "logistics_truck_list/updateTruckStatusAndTriggerMail/";
          this.apiService.postData(url,data).then(res => {
            console.log(res)
            this.toast.success("Record Updated Successfully!");
            this.resultList=res;
            this.email_list = res
            console.log("email list=", this.email_list)
            //this.emails.push("punya.hc@yokogawa.com")
           // this.emails.push("yil.developer4@yokogawa.com")
           //"email_to":"punya.hc@yokogawa.com, yil.developer4@yokogawa.com, yil.developer4@yokogawa.com,n.senthilkumar@yokogawa.com"
            let mail_data = {
              "module":"truck_checked_out",
              "email_to":this.email_list
            }
            this.apiService.postData('logistics_dispatch_advice/alert_mail/', mail_data).then((mailres: any) => {
              console.log("res=",mailres)
            })
          })
     }
      this.dialogRef.close();
    }

    
  updateCheckOutDataOld()
  {
    console.log("data passed from element =", this.data.element)
    this.truckListId = this.data.element.truckListId
    if(this.checkOutRemarks=="")
    {
      this.toast.error("Please Enter Check Out Remarks");
    }
    else
    {
      let data={
        // 'status':"CheckedOut",
        'status':"Shipped",
        'check_out_remarks':this.checkOutRemarks,
        'check_out':this.CheckOutDate,
        'tracking_status':1
      }
        console.log(data)
        console.log("trucklist id=",this.truckListId)
        let url = "logistics_truck_list/"+this.truckListId+"/";
        this.apiService.updateData(url,data).then(res => {
          console.log(res)
          this.toast.success("Record Updated Successfully!");
          this.resultList=res;
        })
    }
    this.dialogRef.close();
  }

  
  closeCheckOutDialog(){
    this.dialogRef.close();
  }

}




