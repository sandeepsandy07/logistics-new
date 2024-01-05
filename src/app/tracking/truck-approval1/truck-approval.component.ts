import { Component,Inject, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators, UntypedFormArray } from '@angular/forms';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { Router,ActivatedRoute, Params } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { E } from '@angular/cdk/keycodes';
import { ThrowStmt } from '@angular/compiler';
import { FileUploader } from "ng2-file-upload";
import { StorageServiceService } from 'src/app/service-storage.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';



@Component({
  selector: 'app-truck-approval',
  templateUrl: './truck-approval.component.html',
  styleUrls: ['./truck-approval.component.css']
})
export class TruckApprovalComponent implements OnInit {

  DetailsForm:boolean=true;
  totalDisplayRow:boolean=false;
  EditForm:boolean=false;
  ListForm:boolean=false;
  headerForm:boolean=false;
  headerFordApprove:boolean=false;
  headerFormEdit:boolean=false;


  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','TruckReqId','RequestDate','Remarks','Status','DestinationId','RequestedBy','Approve','Action'];
 // public displayedColumns: string[] = ['Sl.no.','TruckReqId','RequestDate','Remarks','Status','RequestedBy','Approve','Edit','Delete'];
  
  @ViewChild(MatSort) sort!:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  TruckList: any;

  itemsArr: any = [];
  Approvedatainsert:any=[];
  AmountArr:any=[];
  truckFinalList:any=[];
  public files:any;
  truckApprove:any="";
  public insurance_files:any=[];
  public transportationFiles:any=[];
  Total:any=[];
  fileToUpload: File | null = null;
  
  transportationsList: any;
  ApprovalList: any;
  resultsLength: any;
  Approvallist: any;
  countnum:any=1;
  truckApprovallist: any;
  FilteredTransportationList:any=[];

  t1AMount: any = [[]];
  t2AMount:any={};
  finalTotal:any= [];
  truckRequestID="";
  truckApproveTransportationID="";
  resultList: any;
  ApprovedList: any;
  passedDANo:any="";
  DaId="";

 
  total:number=0;
  final:number=0;
  total2:number=0;
  public usersForm!: UntypedFormGroup;
  TruckRequestDataList: any;
  truckReqID: any;
  ApprovalTransportationIDlist: any;
  fileName: string;
  private _activatedRoute: any;
  private _productService: any;
  productDetail: any;
  TruckFinalizationList: any;
  EmpListData: any;
  DestinationData: any;
  truckListLength:any="";
  finalTruckListData: any;
  ResultDATruckListData: any;
  statusValue:any="";
  DestinationList: any;
  truckApprovalResult: any;
  
  constructor(public api: ApiserviceService,public toast:ToastrService,
    private fb: UntypedFormBuilder, private activatedroute: ActivatedRoute,private dialog : MatDialog,
    private router: Router,public storage:StorageServiceService,private http: HttpClient,) { 
  }

  ngOnInit(){
    this.activatedroute.params.subscribe(
      (params: Params) => {
        console.log("jhdjshdjh truck approval",params['id']);
        this.passedDANo = params['id'];
        console.log("this Passed DANo inside ngonit in=",this.passedDANo) 
      }
    );
    console.log("this Passed DANo inside ngonit out=",this.passedDANo)
    this.Trucklist();
    this.Transportation();
    this.EmpName();
    this.getDestinationList();
    this.getTruckRequestData();
  }

  applyFilter(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTruckRequestData()
  {
    debugger;
    this.headerForm=true;
    this.DetailsForm=true;
    this.EditForm = false;
    this.headerFormEdit=false;
    this.ListForm=false;
    this.headerFordApprove=false;
    let data={}
    let url = 'logistics_truck_request/getManualDataList/';
    this.api.postData(url,data).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      // this.dataSource = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.TruckRequestDataList = res;
      console.log("truck Request list=",this.TruckRequestDataList);

      this.TruckRequestDataList = res;
      this.TruckRequestDataList?.forEach((element: any) => {
        this.DestinationData?.forEach((val: any) => {
          if(element.destinationID == val.destinationId){
            element['destinationName'] = val.destinationName;
          }
        });
      });

      this.TruckRequestDataList?.forEach((element: any) => {
        this.EmpListData?.forEach((val: any) => {
          if(element.request_by == val.id){
            element['request_by'] = val.employee_name;
          }
        });
      });

    });
  }

  EmpName(){
    let url = "user_list/";
    this.api.getData(url).then((res: any) => {
      this.EmpListData = res.data;
      this.getTruckRequestData();
    });
  }

  getDestinationList()
  {
    let url = "logistics_destinations/";
    this.api.getData(url).then((res: any) => {
      this.DestinationData=res;
      this.getTruckRequestData();
      });
  }

onFileSelected(event) {
  const file:File = event.target.files[0];
  if (file) {
      this.fileName = file.name;
      console.log("fileName=",this.fileName)
  }}

  onImagePicked(event: any) {
    const file = (event.target as HTMLInputElement).files;
    this.files=file;
      for(let obj of this.files){
        this.insurance_files.push(obj);
        this.transportationFiles.push(obj.name)
      }
    console.log("insurance_files=",this.insurance_files);
    console.log("file names=",this.transportationFiles)
  }

  //function called when Approve button selected on table 
  approveData(element)
  {
    this.headerFordApprove=true;
    this.ListForm=true;
    this.headerForm=false;
    this.DetailsForm=false;
    this.headerFormEdit=false;
    this.EditForm=false;
    
    // this.finalTotal= element.amount
    console.log("element=",element)
    this.truckReqID = element.truckReqId
    let data:any = {
      truckReqID:this.truckReqID
    }
    console.log("data=",data)
    let url = 'logistics_truck_approval/getTruckApprovalLists/';
    this.api.postData(url,data).then((res: any) => {
      this.Approvallist=res; 
    console.log("approval data=",this.Approvallist)
      
     this.Approvallist?.forEach((element: any) => {
      // this.DaId = element.daID;
        this.TruckList?.forEach((val: any) => {
          if(element.truckID == val.truckId){
            element['truckName'] = val.truckName;
          }
        });
      });

    let url2 = 'logistics_truck_approval/getTransportationListValues/';
    this.api.postData(url2,data).then((res: any) => {
      
      this.ApprovalTransportationIDlist=res; 
    console.log("Approval Transportation ID list data=",this.ApprovalTransportationIDlist)
    this.ApprovalTransportationIDlist?.forEach((element:any)=> {
      this.transportationsList?.forEach((val:any) => {
        if(element.transportationID == val.transportationId)
        {
          element['transpotationName'] = val.transportationName
        }
      })
    })

    this.ApprovalTransportationIDlist?.forEach((element:any)=> {
      this.Approvallist?.forEach((val:any) => {
        if(element.transportationID == val.transportationID)
        {
          element['DestinationId'] = val.destination_Id
        }
      })
    })

    this.ApprovalTransportationIDlist?.forEach((element:any)=> {
      this.DestinationData?.forEach((val:any) => {
        if(element.DestinationId == val.destinationId)
        {
          element['DestinationName'] = val.destinationName
        }
      })
    })

    // this.displayedColumns.push(this.ApprovalTransportationIDlist);
  })
})
  //this.router.navigate(['/tracking/truck-approval/'])
}

//function called when amount value is entered in corresponding text box.
  add(j,i,element,amount)
  {
    console.log("element=",element)
    console.log(i+"="+j);
   console.log("thsdhsgd amount=",amount);
   if(amount == "")
    {
      amount=0;
    }
   this.total = parseInt(amount)* parseInt(element.quantity);
   if(this.finalTotal[i] == undefined){
     this.finalTotal[i]=0;
   }
   this.finalTotal[i] = this.total + parseInt(this.finalTotal[i]);
   console.log("total=",this.finalTotal[i])

   let data={
     'amount':amount,
     'transportationID':element.transportationID,
     'truckReqID':element.truckReqID,
     'truckApprovalID':element.truckApprovalId,
     'status':"Pending"
   }
   //this.Approvedatainsert.push(data)
   //console.log("add array=",this.Approvedatainsert)

   if(this.Approvedatainsert.find(e => e.truckApprovalID === data.truckApprovalID))
   {
     let amount_index = this.Approvedatainsert.indexOf(this.Approvedatainsert.find(e => e.truckApprovalID === data.truckApprovalID))
     this.Approvedatainsert[amount_index].amount = data.amount
     console.log("Approval list array values=", this.Approvedatainsert)
     if(this.Approvedatainsert[amount_index].amount == "")
     {
       this.Approvedatainsert.splice(amount_index,1);
       console.log("Approval list array values=", this.Approvedatainsert)
     }
   }
   else
   {
    this.Approvedatainsert.push(data);
    console.log("Approval list array values=", this.Approvedatainsert)
   }
 }

 saveApproveDataList()
  {
    let url = "logistics_truck_approval/updateAmountValueAddFun/"
    let records={
      truckApprovalTransportationID:this.truckApproveTransportationID,
      truckApprovalRequestID:this.truckRequestID,
      approvalData:this.Approvedatainsert
    }
    this.api.postData(url,records).then((res: any) => {
      this.truckApprovalResult=res;
      console.log("truck Approval Result=",this.truckApprovalResult);
    });
    this.ListForm = false;
    this.EditForm = false;
    this.DetailsForm = true;
    this.headerForm = true;
    this.headerFordApprove = false;
    this.headerFormEdit = false;
    this.Approvedatainsert=[];
    this.getTruckRequestData();
  }

  saveApproveDataListOld()
  {
    // console.log("file names in submit=",this.transportationFiles)
    // this.Approvedatainsert?.forEach((val:any) => {
    //   val.file = this.insurance_files
    // })
    // console.log("Array value for truck approve",this.Approvedatainsert)
    // let url = "logistics_truck_approval/"+this.Approvedatainsert.truckApprovalId+"/";
    // this.api.updateData(url,this.Approvedatainsert).then(res => {
    //   console.log(res)
    //   this.toast.success("Record Updated Successfully!");
    // })


     // this code just update the Amount value and status = pending in truck approve page alone.
      this.Approvedatainsert?.forEach((val:any) => {
      let url = "logistics_truck_approval/"+val.truckApprovalID+"/";
      this.api.updateData(url,val).then(res => {
       console.log("edit value inseted result data",res)
      });
      })
      this.toast.success("Record Updated Successfully!");

    
  // if the user also click on approve button then remaining tables along with truckApprove tables also updated.
  console.log("trujhh",this.truckApproveTransportationID,"fjsjfsjs",this.truckRequestID)
  if(this.truckApproveTransportationID != undefined && this.truckApproveTransportationID != "" && this.truckRequestID != undefined && this.truckRequestID != "" )
  {
    let data={
      status:"Rejected",
      truckReqID:this.truckReqID
    }
      console.log(data)
      let url = "logistics_truck_approval/updateTruckReqIds/";
      this.api.postData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Updated Successfully!");
      })
  
      let data2={
        status:"Approved",
        truckReqID:this.truckRequestID,
        transportationID:this.truckApproveTransportationID,
      }
      console.log(data2)
      let url2 = "logistics_truck_approval/updateTruckReqStatus/";
      this.api.postData(url2,data2).then(res => {
        this.ApprovedList = res;
        console.log(this.ApprovedList)
        this.toast.success("Record Updated Successfully!");
        this.getTruckRequestData();
      })

      let data3={
        truckReqID:this.truckRequestID,
        transportationID:this.truckApproveTransportationID
      }
      console.log(data3)
      let url3 = "logistics_truck_request/updateTruckReqTransportationId/";
      this.api.postData(url3,data3).then(res => {
        console.log(res)
        this.toast.success("Record Updated Successfully!");
      })
      
      let data4={
        truckReqID:this.truckRequestID,
        'status':"Approved"
      }
      console.log(data4)
      let url4 = "logistics_truck_approval/getApprovedData/";
      this.api.postData(url4,data4).then(res => {
        this.ApprovedList = res;
        console.log("Approved data list = ",this.ApprovedList)
         this.ApprovedList?.forEach((element: any) => {
          this.DaId = element.daID;
         let val={
           TruckReqId:element.truckReqID,
           TruckId : element.truckID,
           Quantity : element.quantity
         }
         this.itemsArr.push(val)
         console.log("value to insert for truck List=",this.itemsArr)
        });
        this.itemsArr?.forEach((val:any) => {
          for(val.Quantity;val.Quantity>=1;val.Quantity--)
          {
            let record={
              truckReqID:val.TruckReqId,
              truckID : val.TruckId,
              daID : this.DaId
            }
            console.log(record)
            let url = "logistics_truck_list/";
            this.api.postData(url,record).then(res => {
              this.finalTruckListData = res;
              console.log("final Truck List Values=",res);

              // console.log("DAID is =",this.DaId)
              // let val={
              //   truckListID :this.finalTruckListData['truckListId'],
              //   daID_id : this.DaId,
              // }
              // let url4 = "logistics_da_truck_list/";
              // this.api.postData(url4,val).then(data => {
              //   debugger;
              //   this.ResultDATruckListData = data;
              //   console.log("Final Da Truck List Values=",this.ResultDATruckListData)
              // })

            })
          }
        })
      })
  }
  this.ListForm = false;
  this.EditForm = false;
  this.DetailsForm = true;
  this.headerForm = true;
  this.headerFordApprove = false;
  this.headerFormEdit = false;
}

  approveSelect(transportationID,truckReqID)
  {
    console.log(transportationID,truckReqID)
    this.truckApproveTransportationID=transportationID
    this.truckRequestID=truckReqID
  }

  setListForm()
  {//debugger;
    this.ListForm=false;
    this.DetailsForm=true;
    this.headerForm=true;
    this.headerFormEdit=false;
    this.headerFordApprove=false;
    this.EditForm = false;
    this.getTruckRequestData();
  }

  clearTotalTextBox(val,index)
  {
    console.log("output=",val)
    this.Total[index]=0;
    this.finalTotal[index]=0;
    console.log("t1amount=",this.t1AMount[index])
    this.t1AMount[index]=0;
    //when they click on clear box even other data in textbox should also get cleared.
  }

  DeteteData(element:any)
  {
    let url = 'logistics_truck_request/';
    console.log("id=",element);
    this.api.deleteUser(element,url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      console.log(data);
      this.resultList=data.records;
      this.getTruckRequestData();
     })
  }

  Trucklist(){
    let url = "logistics_truck_type/";
    this.api.getData(url).then((res: any) => {
      this.TruckList = res;
      console.log("truck list=",this.TruckList);
    });
  }

  Transportation()
  {
    let url = "logistics_tracking_transportations/";
    this.api.getData(url).then((res: any) => {
      this.transportationsList = res;
      console.log("Transportation list=",this.transportationsList)
    });
  }

  filteredTransportationList()
  {
    let url = "logistics_truck_approval/";
    this.api.getData(url).then((res: any) => {
      this.truckApprovallist = res;
      console.log("Truck Approval list=",this.truckApprovallist);
    });
   // debugger;
    this.transportationsList?.forEach((element: any) => {
      this.truckApprovallist?.forEach((val: any) => {
        if(element.transportationId == val.transportationID){
          this.FilteredTransportationList.push(element.transportationId);
        }
      });
      console.log("final filtered list=",this.FilteredTransportationList);
    });
  }

  //function called when edit button in table is clicked.
  editData(element)
  {
    //debugger
    this.EditForm=true;
    this.DetailsForm=false;
    this.ListForm=false;
    this.headerForm=false;
    this.headerFordApprove=false;
    this.headerFormEdit=true;
    console.log("element=",element)
    this.truckReqID = element.truckReqId
    let data:any = {
      truckReqID:this.truckReqID
    }
    console.log("data=",data)
    let url = 'logistics_truck_approval/getTruckApprovalLists/';
    this.api.postData(url,data).then((res: any) => {
      this.Approvallist=res; 
    console.log("approval data=",this.Approvallist)

     this.Approvallist?.forEach((element: any) => {
        this.TruckList?.forEach((val: any) => {
          if(element.truckID == val.truckId){
            element['truckName'] = val.truckName;
          }
        });

    this.Approvallist?.forEach((element:any)=> {
      this.transportationsList?.forEach((val:any) => {
        if(element.transportationID == val.transportationId)
        {
          element['transpotationName'] = val.transportationName
        }
      })
    })
  });
    })
    let url2 = 'logistics_truck_approval/getTransportationListValues/';
    this.api.postData(url2,data).then((res: any) => {
      this.ApprovalTransportationIDlist=res; 
    console.log("Approval Transportation ID list data=",this.ApprovalTransportationIDlist)

    this.ApprovalTransportationIDlist?.forEach((element:any)=> {
      this.transportationsList?.forEach((val:any) => {
        if(element.transportationID == val.transportationId)
        {
          element['transpotationName'] = val.transportationName
        }
      })
    })
    })
  }

  setupdateEditForm()
  {
    this.EditForm=false;
    this.DetailsForm=true;
    this.ListForm=false;
    this.headerForm=true;
    this.headerFormEdit=false;
    this.headerFordApprove=false;
    this.getTruckRequestData();
  }

  //function called when amount value get changes in edit form and insert values to array
  edit(val,element,i)
  {
    this.totalDisplayRow=true;
    if(this.Total[i] == undefined)
    {
      this.Total[i] = 0
    }
    console.log(val,element);
    if(val == "")
    {
      val=0;
    }
    this.Total[i] =this.Total[i] + parseInt(val)*parseInt(element.quantity)
    console.log("total=",this.Total)
    let data={
      'amount':val,
      'daID':element.daID,
      'quantity':element.quantity,
      'status':element.status,
      'transportationID':element.transportationID,
      'truckApprovalId':element.truckApprovalId,
      'truckID':element.truckID,
      'truckReqID':element.truckReqID
    }
    //this.AmountArr.push(data)
    //console.log("New entered value from edit page",this.AmountArr)

    if(this.AmountArr.find(e => e.truckApprovalId === data.truckApprovalId))
    {
      let amount_index = this.AmountArr.indexOf(this.AmountArr.find(e => e.truckApprovalId === data.truckApprovalId))
      this.AmountArr[amount_index].amount = data.amount
      console.log("Approval list edit array values=", this.AmountArr)
      if(this.AmountArr[amount_index].amount == "")
      {
        this.AmountArr.splice(amount_index,1);
        console.log("Approval list edit array values=", this.AmountArr)
      }
    }
    else
    {
      this.AmountArr.push(data);
     console.log("Approval list edit array values=", this.AmountArr)
    }
  }

  //saveEditDataList() when update button on edit page is clicked.
  saveEditDataList()
  { 
    this.AmountArr?.forEach((val:any) => {
       let url = "logistics_truck_approval/"+val.truckApprovalId+"/";
      this.api.updateData(url,val).then(res => {
        console.log("edit value inseted result data",res)
        this.toast.success("Record Updated Successfully!");
        this.getTruckRequestData();
        this.EditForm=false;
        this.headerFormEdit=false;
        this.ListForm=false;
        this.headerFordApprove=false;
        this.DetailsForm=true;
        this.headerForm = true;
      })
    })
  }

  fileUploadFun(transportationID,truckReqID,daID)
  {debugger;
    const dialogRef = this.dialog.open(fileUpload, {
      height: '20%',
      width: '30%',
      maxWidth:'100%',
      data: {
        transportationID : transportationID,
        truckReqID : truckReqID,
        DaID : daID,
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.getCheckedInList()
    });
  }

}

@Component({
  selector: 'fileUpload',
  templateUrl: 'fileUpload.html',
   styles: [`
    :host {
      width:'60%'
     
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class fileUpload {
  uploadForm: UntypedFormGroup;
  public form:UntypedFormGroup;
  apiUrl = environment.apiUrl;
  fileToUpload: File | null = null;
  files: any;
  daId:any=2;

  constructor(public api: ApiserviceService,public toast:ToastrService,
    private fb: UntypedFormBuilder, private dialog : MatDialog,public storage:StorageServiceService,
    private http: HttpClient, 
    public dialogRef: MatDialogRef<fileUpload>,
    @Inject(MAT_DIALOG_DATA) public data: any)
    {
      this.form = this.fb.group({
        transportationFile: new UntypedFormArray([]),
      })
    }

    onImagePicked(event: any) {
      let file = event.target.files;
      this.files=file;
      for(let obj of this.files){
        this.form.value.transportationFile.push(obj);
      }  
      console.log("file name=", this.form.value.transportationFile)
    }

  saveUploadFiles()
  {
    console.log("dhshgsg",this.data.transportationID)
    debugger;
    const formData: FormData  = new FormData();
    formData.append('transportation_files',  this.form.value.transportationFile[0]);
    formData.append('transportationID',this.data.transportationID)
    formData.append('TruckReqID',this.data.truckReqID)
    formData.append('DaID',this.data.DaID)
    console.log(formData);

    let bearer = this.storage.getBearerToken();
    let headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer'+' '+bearer
      })
    };
    this.http.post<any>(this.apiUrl + "logistics_truck_approval/uploadTransportationFile/", formData,  headers).subscribe(
      (res: any) => {                
    });
  this.dialogRef.close();
  }
  dano(arg0: string, dano: any) {
    throw new Error('Method not implemented.');
  }


  dialogClose()
  {
    this.dialogRef.close();
  }

}






 // add(j,i,element)
  //  {
  //    console.log("element=",element)
  //    console.log(i+"="+j);
  //   console.log("thsdhsgd amount=",this.t1AMount[j]);
  //   this.total = parseInt(this.t1AMount[j] )* parseInt(element.quantity);
  //   if(this.finalTotal[i] == undefined){
  //     this.finalTotal[i]=0;
  //   }
  //   this.finalTotal[i] = this.total + parseInt(this.finalTotal[i]);
  //   console.log("total=",this.finalTotal[i])

  //   let data={
  //     'amount':this.t1AMount[j],
  //     'transportationID':element.transportationID,
  //     'truckReqID':element.truckReqID,
  //     'truckApprovalID':element.truckApprovalId
  //   }
  //   this.Approvedatainsert.push(data)
     
  //     // let url = "logistics_truck_approval/"+element.truckApprovalId+"/";
  //     // this.api.updateData(url,data).then(res => {
  //     //   console.log(res)
  //     //   this.toast.success("Record Updated Successfully!");
  //     // })
  // }




 // this.ApprovalTransportationIDlist?.forEach((element:any)=> {
    //   this.transportationsList?.forEach((val:any) => {
    //     if(element.transportationID == val.transportationId)
    //     {
    //       element['transpotationName'] = val.transportationName
    //     }
    //   })
    // })
    // this.displayedColumns.push(this.ApprovalTransportationIDlist);


 // let url = "logistics_truck_approval/"+element.truckApprovalId+"/";
      // this.api.updateData(url,data).then(res => {
      //   console.log(res)
      //   this.toast.success("Record Updated Successfully!");
      // })

    //   onFileSelected(files: FileList) {
//     this.fileToUpload = files.item(0);
//     console.log("file name=",this.fileToUpload)
// }


// updateEditDataList()
//   {
//     let data={
//       status:"Rejected",
//       truckReqID:this.truckReqID
//     }
//       console.log(data)
//       let url = "logistics_truck_approval/updateTruckReqIds/";
//       this.api.postData(url,data).then(res => {
//         console.log(res)
//         this.toast.success("Record Updated Successfully!");
//       })

//       let data2={
//         status:"Approved",
//         truckReqID:this.truckRequestID,
//         transportationID:this.truckApproveTransportationID
//       }
//       console.log(data2)
//       let url2 = "logistics_truck_approval/updateTruckReqStatus/";
//       this.api.postData(url2,data2).then(res => {
//         this.ApprovedList = res;
//         console.log(this.ApprovedList)
//         this.toast.success("Record Updated Successfully!");
//       })

//       let data3={
//         truckReqID:this.truckRequestID,
//         transportationID:this.truckApproveTransportationID
//       }
//       console.log(data3)
//       let url3 = "logistics_truck_request/updateTruckReqTransportationId/";
//       this.api.postData(url3,data3).then(res => {
//         console.log(res)
//         this.toast.success("Record Updated Successfully!");
//       })
//       this.refreshPage();

//       let data4={
//         truckReqID:this.truckRequestID,
//         'status':"Approved"
//       }
//       console.log(data4)
//       let url4 = "logistics_truck_approval/getApprovedData/";
//       this.api.postData(url4,data4).then(res => {
//         this.ApprovedList = res;
//         console.log("Approved data list = ",this.ApprovedList)
//          this.ApprovedList?.forEach((element: any) => {
//          let val={
//            TruckReqId:element.truckReqID,
//            TruckId : element.truckID,
//            Quantity : element.quantity
//          }
//          this.itemsArr.push(val)
//          console.log("value to insert for truck List=",this.itemsArr)
//         });
//         this.itemsArr?.forEach((val:any) => {
//           //debugger;
//           for(val.Quantity;val.Quantity>=1;val.Quantity--)
//           {
//             let record={
//               truckReqID:val.TruckReqId,
//               truckID : val.TruckId,
//             }
//             console.log(record)
//             let url = "logistics_truck_list/";
//             this.api.postData(url,record).then(res => {
//             console.log(res)
//             this.toast.success("Record Inserted Successfully!");
//             })
//           }
//         })
//       })

//       let data5={
//         truckReqID:this.truckReqID
//       }
//       console.log("truck Req Id=",data5)
//       let url1 = "logistics_truck_list/getTruckFinalizationList/";
//             this.api.postData(url1,data5).then(res => {
//               this.TruckFinalizationList = res;
//             console.log("Truck finalization list=",res)
//           })
//       //     this.TruckFinalizationList?.forEach((element: any) => {
//       //         console.log("element=",element)
//       //         element.truckReqID=this.truckReqID
//       // }) 
//     this.headerFordApprove=false;
//     this.headerFormEdit=false;
//     this.headerForm=true;
//     this.DetailsForm=true;
//     this.ListForm=false;
//     this.EditForm=false;
//   }


