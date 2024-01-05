import { Component, OnInit } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-truck-request',
  templateUrl: './truck-request.component.html',
  styleUrls: ['./truck-request.component.css']
})
export class TruckRequestComponent implements OnInit {

  ContractForm:boolean=false;
  ManualForm:boolean=false;
  ListForm:boolean=true;
  TableHeaderForm:boolean=true;
  TableDisplayForm:boolean=true;
  TransportsTypeList: any;
  DestinationList: any;
  i:number=1;
  k:number=0;
  requesType:any="";

  transportationMode:any="";
  transportationModeList:any="";
  freightMode:any="";
  freightModeList:any="";
  descriptionOfGoods:any="";
  otherTransportationMode:any="";
  boolotherTransportation:boolean=false;

  stateId:any="";
  StateList:any
  talukId:any="";
  TalukList:any
  pincodeId:any="";
  PincodeList:any
  Pincode:any="";
  mode_of_transport:any="";
  mode_of_payment:any="";

  destinationId:any="";
  transportationID:any="";
  daId:any="";
  remark:any="";
  TruckID:any="";

  url = 'logistics_truck_request/';
  url2 = "logistics_truck_approval/";

  public contractArray: any = [];
  public truckListArray:any = [];
  public finalTruckListArray:any = [];
  itemsArr: any = [];
  truckApproveArray:any=[];

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['SL.NO.','DA_Id','TruckType','Quantity'];

  public usersForm!: UntypedFormGroup;
  TruckList: any;
  DAIDList: any;
  TransportationList: any;
  quantity: any = {};
  Quantity: any;
  InsertedData: any;
  truckReqID: any;
  truckApprovalInsertedData: any;
  j:number=0;
  data: boolean;

  freightList:any="";
  transportationList:any="";

  TransportationId: any;
  Remarks: any;
  DestinationID: any;
  truckRequestType: any;
  TRUCKID: any;
  DESTINATIONID: any;
  AmountList: any;
  AmountList2: any;
  freightValue: any;
  passedDANo:any="";
  route: any;
  ApprovedList:any="";
  TruckReqId: any;
  finalTruckListData: any;
  finalDATruckListData: any;
  truckRequestResult: any;

  Pincodes: any = [];
  pincodeDetails:any="";

  constructor(public api: ApiserviceService,public toast:ToastrService,private fb: UntypedFormBuilder
    , private activatedroute: ActivatedRoute,
    private router: Router) {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as {dad_id: string};
      const state1 = navigation.extras.state as {bill_type: string};
      this.passedDANo = state.dad_id
      console.log("dano=",this.passedDANo)
     }


  ngOnInit() {
    this. Transportationlist();
    this.Destinationlist();
    this.Trucklist();
    this.DA_Idlist();
    this.StateNameslist();
    this.TalukNameslist();
    this.PincodeNumberList();
    this.TransportationModeList();
    this.FreightTypeList();
  }

  SelectType(type)
  {
    this.requesType = type;
    console.log("selected type=",type)
    this.truckRequestType=type
    if(type=="contract")
    {
      this.ContractForm=true;
      this.ManualForm=false;
    }
    else
    {
      this.ContractForm=false;
      this.ManualForm=true;
    }
  }

  fetchingAmountValue(truckID,i)
  {
    if(this.quantity[i] == "" && this.quantity[i] == undefined && this.quantity[i] == null)
    {
      this.toast.error("Quantity Value Cannot be Empty")
    }
    else if(truckID == undefined && truckID == "")
    {
      this.toast.error("Truck Type is required")
    }
    else if(this.transportationID == "")
    {
      this.toast.error("Transportation Type is required")
    }
    if(this.requesType == 'contract')
    {
      console.log("truck Id=",truckID,"Transportation=",this.transportationID)
      //if(truckID !="" && this.destinationId !="")
      if(truckID !="" && this.pincodeId !="")
      {
        let record:any = {
        //destinationId : this.destinationId,
        pincodeId:this.pincodeId,
        truckId : truckID,
        }
        console.log("record",record)
        let url = 'logistics_delivery_charges/getDeliveryChargeAmount/';
        this.api.postData(url,record).then((res: any) => {
        this.AmountList=res;
        console.log("AMount list VALUE=",this.AmountList)
        
        if(this.AmountList != "Empty" && this.AmountList != 0)
        {
          let item :any = {
            truckID : truckID,
            quantity:this.quantity[i],
            transportationID : this.transportationID,
            amount : this.AmountList,
            daID : null,
            destinationId : this.destinationId,
            pincodeId : this.pincodeId
          }
          if(this.contractArray.find(e => e.truckID === item.truckID , e => e.destinationId === item.destinationId ))
          {
            let quantity_index = this.contractArray.indexOf(this.contractArray.find(e => e.truckID === item.truckID , e => e.destinationId === item.destinationId))
            this.contractArray[quantity_index].quantity = item.quantity
            if(this.contractArray[quantity_index].quantity == "")
            {
              this.contractArray.splice(quantity_index,1);
            }
          }
          else
          {
          this.contractArray.push(item);
          }
          console.log("Vlaues inside contract array = ", this.contractArray)
        }
        else if(this.AmountList == 0)
        {
          this.quantity[i] = "";
         this.toast.error("Amount value for Selected Transportation is not available")
        }
        else if(this.AmountList == "Empty")
        {
          this.quantity[i] = "";
          this.toast.error("Selected Destination and TruckType Values are not Present in Delivery Charge Table")
          // this.router.navigate(['tracking/destination-details/'])
          //alert('/users;display=verbose/sammy')
          // alert(this.router.navigate(['tracking/destination-details/']))
        }
      })
    }
    }

    else if(this.requesType == 'manual')
    {
      if(this.transportationID.length>=1)
      {
        this.transportationID?.forEach((element: any) => {
          let item = {
            'truckID':truckID,
            'destinationId' : this.destinationId,
            'quantity':this.quantity[i],
            //'transportationID':this.transportationID[this.k++],
            'transportationID':element,
            'amount':null,
            'daID':null,
          }
          this.contractArray.push(item);
          console.log("Vlaues inside contract array = ", this.contractArray)
        })
          //if(this.contractArray.find(e => e.truckID === item.truckID))
          //{
           // let quantity_index = this.contractArray.indexOf(this.contractArray.find(e => e.truckID === item.truckID,e => e.transportationID === item.transportationID))
            //let quantity_index = this.contractArray.indexOf(this.contractArray.find(e => e.transportationID === item.transportationID,e => e.quantity === item.quantity))
          //   this.contractArray[quantity_index].quantity = item.quantity
          //   console.log("Vlaues inside contract array = ", this.contractArray)
          //   if(this.contractArray[quantity_index].quantity == "")
          //   {
          //     this.contractArray.splice(quantity_index,1);
          //     console.log("Vlaues inside contract array = ", this.contractArray)
          //   }
          // }
          // else
          // {
         // this.contractArray.push(item);
         // console.log("Vlaues inside contract array = ", this.contractArray)
          //}
         
      }
    }
}

CreateList()
{
  let url = "logistics_truck_request/createContractRequestList/"
  let records={
    transportationID:this.transportationID,
    destinationID:this.destinationId,
    stateID:this.stateId,
    pincode_id:this.pincodeId,
    talukID:this.talukId,
    remarks:this.remark,
    requestType:this.truckRequestType,
    daID : this.passedDANo,
    //change
    transportation_mode_id: this.transportationMode,
    freight_type_id:this.freightMode,
    descriptionOfGoods:this.descriptionOfGoods,
    approvalData:this.contractArray,
    mode_of_transport:this.mode_of_transport,
    mode_of_payment:this.mode_of_payment
  }
  console.log("truck request inertion data=",records)
  this.api.postData(url, records).then((res: any) => {
    this.truckRequestResult=res;
    console.log("truck Request Result=",this.truckRequestResult);
  });
  const navigationExtras: NavigationExtras = {state: {passedDANo: this.passedDANo}};
  this.router.navigate(['/tracking/truck-approval/',this.passedDANo])
}

CreateListOld()
{
  if(this.truckRequestType == "contract")
  {
    let records={
      transportationID:this.transportationID,
      destinationID:this.destinationId,
      remarks:this.remark,
      requestType:this.truckRequestType
    }

    console.log("submitting data=",records)
    this.api.postData(this.url, records).then((res: any) => {
      this.InsertedData=res;
      console.log("Inserted data to Truck Request Table=",this.InsertedData)
      this.truckReqID = this.InsertedData['truckReqId']
      console.log("TruckReqId after inserting row in truck request table=",this.truckReqID);
      if(this.truckReqID != "" && this.truckReqID != undefined)
      {
        this.contractArray?.forEach((element: any) => {
          element.truckReqID=this.truckReqID
          element.status = "Approved"
          element.daID = this.passedDANo 
        })

        let data={
          data : this.contractArray,
        }
        console.log("data to insert for truckApproval Table=",data)
        this.api.postData(this.url2, data).then((res: any) => {
          this.truckApprovalInsertedData=res;
          console.log("truck Approval inserted data=",this.truckApprovalInsertedData);
        })

        let data2={
          truckReqID:this.truckReqID,
          'status':"Approved"
        }
        console.log("values to accept approved rows",data2)
        let url4 = "logistics_truck_approval/getApprovedData/";
        this.api.postData(url4,data2).then(res => {
          this.ApprovedList = res;
          console.log("Approved data list = ",this.ApprovedList)
          this.ApprovedList?.forEach((element) => {
            let val={
              TruckReqId:element.truckReqID,
              truckID : element.truckID,
              Quantity : element.quantity
            }
            this.truckListArray.push(val)
            console.log("value to insert for truck List=",this.truckListArray)
        });
        this.truckListArray?.forEach((val:any) => {
          this.TruckReqId = val.TruckReqId
          for(val.Quantity;val.Quantity>=1;val.Quantity--)
          {
            let record={
              truckReqID:val.TruckReqId,
              truckID : val.truckID,
              daID : this.passedDANo
            }
            console.log("truck id to insert into truck list Table=",record)
            let url = "logistics_truck_list/";
            this.api.postData(url,record).then(res => {
              this.finalTruckListData = res;
              console.log("final Truck List Values=",res);
              })
          }
        })
      })
    }
  })
}
  else if(this.truckRequestType == "manual")
  {
    let records={
      transportationID:null,
      destinationID:this.destinationId,
      remarks:this.remark,
      requestType:this.truckRequestType
    }
    console.log("submitting data=",records)
    this.api.postData(this.url, records).then((res: any) => {
      this.InsertedData=res;
      console.log("Inserted data to Truck Request Table=",this.InsertedData)
      this.truckReqID = this.InsertedData['truckReqId']
      console.log("TruckReqId after inserting row in truck request table=",this.truckReqID);
      if(this.truckReqID != "" && this.truckReqID != undefined)
      {
        this.contractArray?.forEach((element: any) => {
          element.truckReqID=this.truckReqID,
          element.daID = this.passedDANo
        })
        let data={
          data : this.contractArray,
        }
        console.log("data to insert for truckApproval Table=",data)
        this.api.postData(this.url2, data).then((res: any) => {
          this.truckApprovalInsertedData=res;
          console.log("truck Approval inserted data=",this.truckApprovalInsertedData);
        })
      }
    })
  }
  const navigationExtras: NavigationExtras = {state: {passedDANo: this.passedDANo}};
  this.router.navigate(['/tracking/truck-approval/',this.passedDANo])
}

  onSubmit()
  {
    let records = {
      TransportationID:this.transportationID,
      destinationID:this.destinationId,
        data:this.usersForm.value
    }
    console.log("values of array",this.usersForm.value);
    console.log("Record value=",records)
  }

  Transportationlist(){
    let url = "logistics_tracking_transportations/";
    this.api.getData(url).then((res: any) => {
      this.TransportationList = res;
    });
  }

  TransportationModeList(){
    let url = "logistics_transportation_mode/";
    this.api.getData(url).then((res: any) => {
      this.transportationList = res;
    });
  }

  FreightTypeList(){
    let url = "logistics_freight_type/";
    this.api.getData(url).then((res: any) => {
      this.freightList = res;
    });
  }

  onOptionsSelected(val)
  {
    if(this.requesType == "contract")
    {
      if(val == 22)
    this.boolotherTransportation = true;
    else if(val != 22)
    this.boolotherTransportation = false;
    }
    else if(this.requesType == "manual")
    {
      if (val.includes(22)) {
        this.boolotherTransportation = true;
    }
    else
    {
      this.boolotherTransportation = false;
    }
  }
    
  }

  Trucklist(){
    let url = "logistics_truck_type/";
    this.api.getData(url).then((res: any) => {
      this.TruckList = res;
    });
  }

  DA_Idlist()
  {
    let url="logistics_dispatch_advice/";
    this.api.getData(url).then((res: any) => {
      this.DAIDList = res;
    });
  }

  StateNameslist(){
    let url = "logistics_states/";
    this.api.getData(url).then((res: any) => {
      this.StateList = res;
    });
  }

 
  DestinationName(e:any){
    let url = "logistics_destinations/getDestinationNameList/";
    let data = {
      stateId : e
    }
    this.api.postData(url, data).then((res: any) => {
      this.DestinationList=res;
      let length = res.length
      console.log("District list=", this.DestinationList)
      // debugger;
      if(length == 0)
      {
        this.toast.error("No District Name exist for selected State");
      }
      })
  }

  Destinationlist(){
    let url = "logistics_destinations/";
    this.api.getData(url).then((res: any) => {
      this.DestinationList = res;
    });
  }

  TalukNameslist(){
    let url = "logistics_taluk_list/";
    this.api.getData(url).then((res: any) => {
      this.TalukList = res;
    });
  }

  onDestinationSelected(value)
  {
    console.log("the selected value is " , value);
    this.subTalukName(value)
  }

  subTalukName(e:any){
    let url = "logistics_taluk_list/getTalukNameList/";
    let data = {
      destinationId : e
    }
    this.api.postData(url, data).then((res: any) => {
      this.TalukList=res;
      let length = res.length
      console.log("Taluk Names list=", this.TalukList)
      // debugger;
      if(length == 0)
      {
        this.toast.error("Taluk Name does not exist for selected district");
      }
      })
  }

  onTalukSelected(talukSelect)
  {
    console.log("the selected value is " , talukSelect);
    this.PincodeNumber(talukSelect)
  }

  PincodeNumber(e:any){
    let url = "logistics_pincode_list/getPincodeList/";
    let data = {
      talukId : e
    }
    this.api.postData(url, data).then((res: any) => {
      this.Pincode=res;
      this.pincodeId = this.Pincode
      console.log("Pincode list=", this.Pincode)
      if(this.Pincode == false)
      {
        this.toast.error("Pincode does not exist for selected Taluk");
      }
      })
  }

  PincodeNumberList()
  {
    let url = "logistics_pincode_list/";
    this.api.getData(url).then((res: any) => {
      this.PincodeList = res;
      this.PincodeList?.forEach((val: any) => {
        this.Pincodes.push(val.pincodeNo);
      });
    });
  }

  searchFilter1()
  {
    return this.Pincodes.filter((option:any) => option.toString().indexOf(this.pincodeId) === 0) || this.Pincodes;
  }

  getSoDetails_by_p_id(){
    let data={
      'pincodeNo':this.pincodeId
    }    
    this.api.postData("logistics_pincode_list/getStateDetails/",data).then((response:any) => {
      this.pincodeDetails = response
      if(response == false)
      {
        this.toast.error("Destination Details for the given Pincode is not exist");
      }
      else
      {
      console.log("Pincode Details:",this.pincodeDetails);
      this.pincodeDetails?.forEach((element: any) => {
        this.destinationId = element.destinationId
        this.stateId = element.stateId
        this.talukId = element.taluk_id
        console.log("this destinatio",this.destinationId)
        console.log("this state",this.stateId)
        console.log("this taluk id=",this.talukId)
      })
    }
    })
  }

}
















// AddNewElement()
//   {
//     if(this.truckRequestType == "manual")
//     {
//       let records={
//         transportationID:null,
//         destinationID:this.destinationId,
//         remarks:this.remark,
//         request_id:"TR-00"+this.i++,
//         requestType:this.truckRequestType
//       }
//       console.log("submitting data=",records)
//       this.api.postData(this.url, records).then((res: any) => {
//         this.InsertedData=res;
//         console.log("Inserted data to Truck Request Table=",this.InsertedData)
//         this.truckReqID = this.InsertedData['truckReqId']
//         console.log("TruckReqId after inserting row in truck request table=",this.truckReqID);
//         if(this.truckReqID != "" && this.truckReqID != undefined)
//         {
//           this.itemsArr?.forEach((element: any) => {
//             console.log("element=",element)
//             element.truckReqID=this.truckReqID
//           })
//           let data={
//             data : this.itemsArr,
//           }
//           console.log("data to insert for truckApproval Table=",data)
//           this.api.postData(this.url2, data).then((res: any) => {
//             this.truckApprovalInsertedData=res;
//             console.log("truck Approval inserted data=",this.truckApprovalInsertedData);
//           })
//         }
//       })
//     }
//     else
//     {
//       let records={
//         transportationID:this.transportationID,
//         destinationID:this.destinationId,
//         remarks:this.remark,
//         request_id:"TR-00"+this.i++,
//         requestType:this.truckRequestType
//       }
//       console.log("submitting data=",records)
//       this.api.postData(this.url, records).then((res: any) => {
//         this.InsertedData=res;
//         console.log("Inserted data to Truck Request Table=",this.InsertedData)
//         this.truckReqID = this.InsertedData['truckReqId']
//         console.log("TruckReqId after inserting row in truck request table=",this.truckReqID);
//         if(this.truckReqID != "" && this.truckReqID != undefined)
//         {
//           this.itemsArr?.forEach((element: any) => {
//             console.log("element=",element)
//             element.truckReqID=this.truckReqID
//             //have to remove once above error is fixed.
//             element.amount = this.AmountList
//             element.status = "Approved"
//           })
//           let data={
//             data : this.itemsArr,
//           }
//           console.log("data to insert for truckApproval Table=",data)
//           this.api.postData(this.url2, data).then((res: any) => {
//             this.truckApprovalInsertedData=res;
//             console.log("truck Approval inserted data=",this.truckApprovalInsertedData);
//             this.toast.success("Record Inserted Successfully!");
//           })
//         }
//       })
  //   }
  //   const navigationExtras: NavigationExtras = {state: {passedDANo: this.passedDANo}};
  //   //this.route.navigate([nav_url], navigationExtras);
  //   this.router.navigate(['/tracking/truck-approval/',this.passedDANo])  
  // }


  // fetchingAmountValue(truckID)
  // {
  //   console.log("truck Id=",truckID,"Transportation=",this.transportationID)
  //   if(truckID !="" && this.destinationId !="")
  //   {
  //     let record:any = {
  //     destinationId : this.destinationId,
  //     truckId : truckID,
  //     }
  //     console.log("record",record)
  //     let url = 'logistics_delivery_charges/getDeliveryChargeAmount/';
  //     this.api.postData(url,record).then((res: any) => {
  //     this.AmountList=res;
  //      console.log("Amount data=",this.AmountList)
  //     });
  //   }
  // }




  ///-------------------------------------------------
  //not in used
// setCheckbox(data:any, i:any, check:any)
// {
//   console.log("this transportation=",this.transportationID)
//   console.log("truckID=",this.TRUCKID, "Destination ID=",this.DESTINATIONID)
//   this.TruckID=data['truckId'],
//   this.Quantity=this.quantity[i]
//   console.log("data=",data)
//   console.log("i",i)
//   console.log("check=",check)
//   console.log("quantity=", this.quantity[i])
//   if(check == true)
//   {
//     if(this.transportationID.length>1)
//     {
//     this.transportationID?.forEach((element: any) => {
//     let val = {
//       'truckID':data['truckId'],
//       'quantity':this.quantity[i],
//       'transportationID':this.transportationID[this.j++],
//       'amount':null,
//       // 'daID':null,
//       'daID':this.passedDANo
//     }
//     this.itemsArr.push(val);
//     console.log("items array inside check box=",this.itemsArr)
//   })
//   }
//   else
//   {
//     console.log(this.AmountList)
//     let val = {
//       'truckID':data['truckId'],
//       'quantity':this.quantity[i],
//       'transportationID':this.transportationID,
//       'amount':this.AmountList,
//       'daID':this.passedDANo
//     }
//     this.itemsArr.push(val);
//     console.log("items array inside check box=",this.itemsArr)
//   }
//   }
//   this.j=0;
//   }



  //not in used
//   AddNewElement()
//   {
//     if(this.truckRequestType == "manual")
//     {
//       let records={
//         transportationID:null,
//         destinationID:this.destinationId,
//         remarks:this.remark,
//         request_id:"TR-00"+this.i++,
//         requestType:this.truckRequestType
//       }
//       console.log("submitting data=",records)
//       this.api.postData(this.url, records).then((res: any) => {
//         this.InsertedData=res;
//         console.log("Inserted data to Truck Request Table=",this.InsertedData)
//         this.truckReqID = this.InsertedData['truckReqId']
//         console.log("TruckReqId after inserting row in truck request table=",this.truckReqID);
//         if(this.truckReqID != "" && this.truckReqID != undefined)
//         {
//           this.itemsArr?.forEach((element: any) => {
//             console.log("element=",element)
//             element.truckReqID=this.truckReqID
//           })
//           let data={
//             data : this.itemsArr,
//           }
//           console.log("data to insert for truckApproval Table=",data)
//           this.api.postData(this.url2, data).then((res: any) => {
//             this.truckApprovalInsertedData=res;
//             console.log("truck Approval inserted data=",this.truckApprovalInsertedData);
//           })
//         }
//       })
//     }
//     else
//     {
//       let records={
//         transportationID:this.transportationID,
//         destinationID:this.destinationId,
//         remarks:this.remark,
//         request_id:"TR-00"+this.i++,
//         requestType:this.truckRequestType
//       }
//       console.log("submitting data=",records)
//       this.api.postData(this.url, records).then((res: any) => {
//         this.InsertedData=res;
//         console.log("Inserted data to Truck Request Table=",this.InsertedData)
//         this.truckReqID = this.InsertedData['truckReqId']
//         console.log("TruckReqId after inserting row in truck request table=",this.truckReqID);
//         if(this.truckReqID != "" && this.truckReqID != undefined)
//         {
//           this.itemsArr?.forEach((element: any) => {
//             console.log("element=",element)
//             element.truckReqID=this.truckReqID
//             element.status = "Approved"
//           })
//           let data={
//             data : this.itemsArr,
//           }
//           console.log("data to insert for truckApproval Table=",data)
//           this.api.postData(this.url2, data).then((res: any) => {
//             this.truckApprovalInsertedData=res;
//             console.log("truck Approval inserted data=",this.truckApprovalInsertedData);
//             this.toast.success("Record Inserted Successfully!");
//           })
    
//       let data2={
//         truckReqID:this.truckReqID,
//         'status':"Approved"
//       }
//       console.log("values to accept approved rows",data2)
//       let url4 = "logistics_truck_approval/getApprovedData/";
//       this.api.postData(url4,data2).then(res => {
//         this.ApprovedList = res;
//         console.log("Approved data list = ",this.ApprovedList)
//         this.ApprovedList?.forEach((element) => {
//           let val={
//             TruckReqId:element.truckReqID,
//             TruckId : element.truckID,
//             Quantity : element.quantity
//           }
//           this.itemsArr.push(val)
//           console.log("value to insert for truck List=",this.itemsArr)
//       });
//       this.itemsArr?.forEach((val:any) => {
//         for(val.Quantity;val.Quantity>=1;val.Quantity--)
//         {
//           let record={
//             truckReqID:val.TruckReqId,
//             truckID : val.TruckId,
//           }
//           console.log(record)
//           let url = "logistics_truck_list/";
//           this.api.postData(url,record).then(res => {
//           console.log(res)
//           this.toast.success("Record Inserted Successfully!");
//           })
//         }
//       })
//     })
//   }
// })
// }
// const navigationExtras: NavigationExtras = {state: {passedDANo: this.passedDANo}};
// this.router.navigate(['/tracking/truck-approval/',this.passedDANo])
// }


