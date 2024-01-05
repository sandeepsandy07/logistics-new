import { Component, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FormGroup, UntypedFormBuilder, UntypedFormControl, Validators, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { StorageServiceService } from 'src/app/service-storage.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';


@Component({
  selector: 'app-destination-details',
  templateUrl: './destination-details.component.html',
  styleUrls: ['./destination-details.component.css']
})
export class DestinationDetailsComponent implements OnInit {

  MainForm:boolean=true;
  addDetailsForm:boolean=false;
  EditForm:boolean=false;
  AddToExistingDetils:boolean=false;
  AddStateForm:boolean=false;

  UserRole: any;
  userRoleArr:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  EDDsundries:any="";
  EDDsystems:any="";
  FreightValue:any="";
  ValidFromDate="";
  ValidToDate="";
  StateName="";

  todayDate="2022-02-28";

  Destination:any="";
  StatesList: any;
  destinations: any = [];
  destinationName:any="";
  DestinationIdList: any;
  stateId:any="";
  TruckTypeList: any;
  public disDate:any;

  // FreightValue:any="";
  ValidFrom:any="";
  ValidTo:any="";
  // EDDSystems:any="";
  // EDDSundries:any="";

  resultsLength:any="";
  url = "logistics_delivery_charges/";

  addAccess: boolean = false;
  addaccess:boolean = false;
  DestinationNotExist:boolean=false;

  public dataSource1 = new MatTableDataSource<['']>();
  public displayedColumns1: string[] = ['Sl.no.','State', 'Destination', 'TruckType','FreightValue','ValidityFrom','ValidityTo','EDDSystems','EDDSundries','Action','Add'];  

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','TruckType', 'FreightValue', 'ValidityDate','EDDSystems','EDDSundries'];
  deliverylist: any;
  resultList: any;
  deliveryChargeId: any;
  truckId: any;
  destinationId: any;
  // validFrom: any;
  // validTo: any;
  // freightValue: any;

  validFrom = new UntypedFormControl();
  validTo = new UntypedFormControl();

  
  freightValue: any = {};
  EDDSystems: any = {};
  EDDSundries: any = {};

  itemsArr: any = [];
  Result: any;
  DestinationID: any;
  updateDestinationID: any;
  updateDeliveryChargeId: any;
  existingDataAddDeliveryChargeID: any;
  AddDeliveryChargeId: any;
  existingDataAddDestinationID: any;
  VALIDFROM: any;
  destinationAddedDetails: any;
  
  constructor(public api: ApiserviceService,public toast:ToastrService,private datePipe: DatePipe,private fb: UntypedFormBuilder,public storage:StorageServiceService) { }

  ngOnInit(){
    this.StatesName();
    this.getDestinationList();
    this.TruckType();
    this.getdeliveryCharges();
    this.getUserRole();
  }

  applyFilter(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }


  getUserRole()
  {
    console.log("session storage value for user role=",this.storage.getUserRole())
    this.UserRole = this.storage.getUserRole()
    console.log("User Roles=",this.UserRole)
  
      if(this.UserRole.find(e => e.module_slug_name === "destination_details"))
      {
        let module_id_index=this.UserRole.indexOf(this.UserRole.find(e => e.module_slug_name === "destination_details"))
        this.userRoleArr=this.UserRole[module_id_index];
      }
      if(this.userRoleArr == undefined)
      {
        this.userRoleArr=0;
      }
      console.log("UserRoleArr=",this.userRoleArr)
  }

  validFromChange(event)
  {
    console.log(event);
  }
  validFromPickerChange()
  {
    this.ValidFrom = this.datePipe.transform(this.validFrom.value, 'dd-MM-yyyy');
    console.log(this.ValidFrom)
  }
  validToPickerChange()
  {
    this.ValidTo = this.datePipe.transform(this.validTo.value, 'dd-MM-yyyy');
    console.log(this.ValidTo)
  }

  CheckDestinationExist(state,Dest)
  {
    console.log("state details to check=",state)
    console.log("destination details to check=",Dest)
    let data:any = {
      destinationName:Dest,
      stateId:state
    }
    console.log("data=",data)
  let url = 'logistics_destinations/checkDestinationExist/';
  this.api.postData(url,data).then((res: any) => {
  this.Result=res; 
  console.log("Result=",this.Result);
  if(this.Result == false)
  {
    this.toast.error("Entered Destination And State values are already existed");
  }
  else
  {
    let data={
      'destinationName':this.Destination,
      'stateId':parseInt(this.stateId),
    }
    console.log(data)
    let url = "logistics_destinations/";
    this.api.postData(url,data).then(res => {
      this.destinationAddedDetails = res;
      this.DestinationID = this.destinationAddedDetails['destinationId']
      console.log("destination id after insertion=",this.DestinationID)
      
    this.getDestinationList();
    this.DestinationNotExist=true;
    })
  }
  })
  }

  StatesName(){
    let url = "logistics_states/";
    this.api.getData(url).then((res: any) => {
      this.StatesList = res;
      console.log("states=",this.StatesList);
    });
  }

  TruckType(){
    let url = "logistics_truck_type/";
    this.api.getData(url).then((res: any) => {
      this.TruckTypeList = res;
      console.log("truck types=",this.TruckTypeList);
    });
  }

  getDestinationList()
  {
    let url = "logistics_destinations/";
    this.api.getData(url).then((res: any) => {
      this.DestinationIdList=res;
      console.log("DocId List=",this.DestinationIdList);
      this.DestinationIdList.forEach(element => {
        this.destinations.push(element.destinationName);
      });
      this.searchFilter();
    })
  }
  searchFilter()
  {
    return this.destinations.filter((option:any) => option.toString().indexOf(this.destinationName) === 0) || this.destinations;
  }

  getDestID(destinationId)
  {
    console.log("Destinatiosn ID=",destinationId)
    this.DestinationID=destinationId
  }

  getUpdateDestID(destId)
  {
    console.log("Update Destinatiosn ID=",destId)
    this.updateDestinationID=destId
  }

getdeliveryCharges(){
  let url = "logistics_delivery_charges/";
  this.api.getData(url).then((res: any) => {
      this.dataSource1 = new MatTableDataSource(res);
      this.dataSource1.data = res;
      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator;
      this.resultsLength=res.length;
      console.log("result=",res);
      console.log("ResultLength =",this.resultsLength)

      this.deliverylist = res;
      console.log("statess=",this.StatesList)
      this.deliverylist?.forEach((element: any) => {
        this.StatesList?.forEach((val: any) => {
          if(element.stateID == val.stateId){
            element['stateName'] = val.stateName;
          }
        });
      });

      this.deliverylist = res;
      this.deliverylist?.forEach((element: any) => {
        console.log("desydysg",this.DestinationIdList)
        this.DestinationIdList?.forEach((val: any) => {
          if(element.destinationID == val.destinationId){
            element['destinationName'] = val.destinationName;
          }
        });
      });

      this.deliverylist = res;
      this.deliverylist?.forEach((element: any) => {
        this.TruckTypeList?.forEach((val: any) => {
          if(element.truckID == val.truckId){
            element['truckName'] = val.truckName;
          }
        });
      });
     }
    );
}

SetAddNewElementForm()
{
  this.MainForm=false;
  this.addDetailsForm=true;
  this.getdeliveryCharges();
}
setStateForm()
{
  this.addDetailsForm=false;
  this.AddStateForm=true;
}

setAddForm()
{
  this.addDetailsForm=false;
  this.MainForm=true;
  this.DestinationNotExist = false;
  this.Destination = "";
  this.stateId = "";
  this.getdeliveryCharges();
}

setStateFormBack()
{
  this.AddStateForm=false;
  this.addDetailsForm=true;
}

SubmitState()
{
  if(this.StateName=="")
    {
      this.toast.error("Please Enter State Name");
    }
    else
  {
    let data={
        'stateName':this.StateName
    }
      console.log(data)
      let url = "logistics_states/";
      this.api.postData(url,data).then(res => {
      console.log(res)
      if(res == false)
      {
        this.toast.error("Value already exist in table");
      }
      else
      {
      this.toast.success("Record Successfully Inserted!");
      this.resultList=res;
      this.StatesName();
      this.StateName = "";
      this.AddStateForm=false;
      this.addDetailsForm=true;
      // this.getUserRoleList();
      }
    })
    }
}


setCheckbox(data:any, i:any, check:any)
{
console.log("data=",data)
console.log("i",i)
console.log("check=",check)
console.log("EDDSundries=", this.EDDSundries[i])
if(check == true)
{
    let val = {
      'freightValue':this.freightValue[i],
      'EDDSystems':this.EDDSystems[i],
      'EDDSundries':this.EDDSundries[i],
      'stateID':this.stateId,
      'destinationID':this.DestinationID,
      'truckID':data['truckId'],
      'validFrom':this.ValidFrom,
      'validTo':this.ValidTo
    }
    this.itemsArr.push(val);
  }
}

AddNewElement()
{
  let url = 'logistics_delivery_charges/';
    let data = {
      data : this.itemsArr,
    }
    console.log("submitting data=",data)
    this.api.postData(url, data).then((res: any) => {
      this.freightValue = {};
      this.EDDSystems = {};
      this.EDDSundries = {};
      this.getdeliveryCharges();
      this.addDetailsForm=false;
      this.MainForm=true;
      this.DestinationNotExist = false;
      this.Destination = "";
      this.stateId = "";
      })
  }

  AddData(element)
  {
  this.MainForm=false;
  this.addDetailsForm=false;
  this.EditForm=false;
  this.AddToExistingDetils=true;
  console.log("element inside add to existing block=",element)
  this.AddDeliveryChargeId = element.deliveryChargeId;
  this.stateId=element.stateID;
  this.truckId=element.truckID;
  this.Destination=element.destinationName;
  this.existingDataAddDestinationID = element.destinationID;
  }

  AddDataToExistingList()
  {
    if(this.ValidFrom=="")
    {
      this.toast.error("Please Select Date Value");
    }
    else if(this.ValidTo == "")
    {
      this.toast.error("Please Select Date Value")
    }
    else if(this.EDDsystems == "")
    {
      this.toast.error("Please Enter EDDSystems Value");
    }
    else if(this.EDDsundries == "")
    {
      this.toast.error("Please Enter EDDSundries Value");
    }
    else if(this.FreightValue =="")
    {
      this.toast.error("Please Enter Freight Value")
    }
    else if(this.stateId=="")
    {
      this.toast.error("Please Select State Name")
    }
    else if(this.truckId=="")
    {
      this.toast.error("Please Select Truck Name")
    }
    else if(this.Destination=="")
    {
      this.toast.error("Please Enter Destionation Value")
    }
    if(this.ValidFrom < this.ValidTo)
    {
      let record={
        'freightValue':this.FreightValue,
        'validFrom':this.ValidFrom,
        'validTo':this.ValidTo,
        'EDDSystems':this.EDDsystems,
        'EDDSundries':this.EDDsundries,
        'destinationID':this.existingDataAddDestinationID,
        'stateID':this.stateId,
        'truckID':this.truckId
      }
      this.itemsArr.push(record);
        console.log(record)
        let data = {
          data : this.itemsArr,
        }
        // let url = "logistics_delivery_charges/"+this.AddDeliveryChargeId+"/";
        let url = "logistics_delivery_charges/";
        this.api.postData(url,data).then(res => {
          console.log(res)
          this.toast.success("Record Inserted Successfully!");
          this.resultList=res;
          this.getdeliveryCharges();
          this.AddToExistingDetils=false;
          this.addDetailsForm=false;
          this.EditForm=false;
          this.MainForm=true;
          this.ValidFrom= "";
          this.ValidTo = "";
          this.EDDsystems = "";
          this.EDDsundries = "";
          this.FreightValue ="";
          this.stateId="";
          this.truckId="";
          this.Destination ="";
          this.validFrom.reset();
          this.validTo.reset();
        })
    }
    else
    {
      this.toast.error("ValidTo Date Cannot be less than ValidFrom Date")
    }

  }

  update(element:any)
{
  // let validFrom = '';
  // if(element.validFrom != "" && element.validFrom != null && element.validFrom != undefined)
  // {
  //   validFrom = this.datePipe.transform(element.validFrom, 'MM-dd-yyyy');
  // }
  this.MainForm=false;
  this.addDetailsForm=false;
  this.EditForm=true;
  console.log("element inside update block=",element)
  this.updateDeliveryChargeId = element.deliveryChargeId;
  this.ValidTo = element.validTo;
  this.EDDSystems = element.EDDSystems;
  this.EDDSundries = element.EDDSundries;
  this.freightValue = element.freightValue;
  this.stateId=element.stateID;
  this.truckId=element.truckID;
  this.Destination=element.destinationName
  this.ValidFromDate=element.validFrom;
  this.ValidToDate=element.validTo;
}

  updateList()
  {
    let FromDate=this.datePipe.transform(this.ValidFromDate, 'MM-dd-yyyy')
    let ToDate = this.datePipe.transform(this.ValidToDate,'MM-dd-yyyy')

    if(this.ValidFromDate=="")
  {
    this.toast.error("Please Select Date Value");
  }
  else if(this.ValidToDate == "")
  {
    this.toast.error("Please Select Date Value")
  }
  else if(this.EDDSystems == "")
  {
    this.toast.error("Please Enter EDDSystems Value");
  }
  else if(this.EDDSundries == "")
  {
    this.toast.error("Please Enter EDDSundries Value");
  }
  else if(this.freightValue =="")
  {
    this.toast.error("Please Enter Freight Value")
  }
  else if(this.stateId=="")
  {
    this.toast.error("Please Select State Name")
  }
  else if(this.truckId=="")
  {
    this.toast.error("Please Select Truck Name")
  }
  else if(this.Destination=="")
  {
    this.toast.error("Please Enter Destionation Value")
  }
  if(FromDate < ToDate)
  {
    // let FromDate=this.datePipe.transform(this.ValidFromDate, 'MM-dd-yyyy')
    // let ToDate = this.datePipe.transform(this.ValidToDate,'MM-dd-yyyy')
    let data={
      'freightValue':this.freightValue,
      'validFrom':FromDate,
      'validTo':ToDate,
      'EDDSystems':this.EDDSystems,
      'EDDSundries':this.EDDSundries,
      'destinationID':this.updateDestinationID,
      'stateID':this.stateId,
      'truckID':this.truckId
    }
      console.log(data)
      let url = "logistics_delivery_charges/"+this.updateDeliveryChargeId+"/";
      this.api.updateData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
        this.getdeliveryCharges();
        this.EditForm=false;
        this.addDetailsForm=false;
        this.MainForm=true;
      })
  }
  else
  {
    this.toast.error("ValidTo Date Cannot be less than ValidFrom Date")
  }
} 

setEditForm()
{
  this.EditForm=false;
  this.addDetailsForm=false;
  this.MainForm=true;
  this.getdeliveryCharges();
}

setExistingAddForm()
{
  this.AddToExistingDetils=false;
  this.addDetailsForm=false;
  this.EditForm=false;
  this.MainForm=true;
  this.getdeliveryCharges();
}

deleteData(element:any)
{
  this.api.deleteUser(element,this.url).subscribe((data:any) =>
   {
    this.toast.success("Deleted");
    console.log(data);
    this.resultList=data.records;
    this.getdeliveryCharges();
   })
}
}
// AddNewRows(data:any)
//   {

//   }

// updateList()
// {
//   if(this.stateId=="")
//   {
//     this.toast.error("Please Select State");
//   }
//   else if(this.truckId=="")
//   {
//     this.toast.error("Please Select Truck Type");
//   }
//   else if(this.Destination=="")
//   {
//     this.toast.error("Please Select Destination");
//   }
//   else if(this.ValidTo == "")
  // {
  //   this.toast.error("please select valid To Date");
  // }
  // else if(this.ValidFrom == "")
  // {
  //   this.toast.error("please select valid From Date");
  // }
  // else if(this.freightValue == "")
  // {
  //   this.toast.error("please Enter Freight Value");
  // }
  // else if(this.EDDSystems == "")
  // {
//     this.toast.error("please Enter EDDSystems");
//   }
//   else if(this.EDDSundries == "")
//   {
//     this.toast.error("please Enter EDDSundries");
//   }
//   else
//   {
//     let data={
//       'freightValue':this.freightValue,
//       'validFrom':this.ValidFrom,
//       'validTo':this.ValidTo,
//       'EDDSystems':this.EDDSystems,
//       'EDDSundries':this.EDDSundries,
//       'destinationID':this.Destination,
//       'stateID':this.stateId,
//       'truckID':this.truckId,
//     }
//       console.log(data)
//       let url = "logistics_delivery_charges/"+this.deliveryChargeId+"/";
//       this.api.updateData(url,data).then(res => {
//         console.log(res)
//         this.toast.success("Record Updated Successfully!");
//         this.resultList=res;
//         this.getdeliveryCharges();
//       })
//   }
// } 


// update(element:any)
// {
//   this.MainForm=false;
//   this.addDetailsForm=false;
//   this.EditForm=true;
//   console.log("element=",element)
//   this.deliveryChargeId = element.deliveryChargeId;
//   this.stateId = element.stateID;
//   this.truckId = element.truckID;
//       console.log("Destination=",this.DestinationIdList)
//         this.DestinationIdList?.forEach((val: any) => {
//           if(element.destinationID == val.destinationId){
//             this.Destination = val.destinationName;
//           }
//       });

//   this.ValidFrom=element.validFrom;
//   this.ValidTo = element.validTo;
//   this.EDDSystems = element.EDDSystems;
//   this.EDDSundries = element.EDDSundries;
//   this.freightValue = element.freightValue;
// }
