import { Component, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { StorageServiceService } from 'src/app/service-storage.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-transporter-details',
  templateUrl: './transporter-details.component.html',
  styleUrls: ['./transporter-details.component.css']
})
export class TransporterDetailsComponent implements OnInit {

  MainForm:boolean=true;
  EditForm:boolean=false;
  AddForm:boolean=false;
  mainFormHeader:boolean = true;
  editFormHeader:boolean = false;
  addFormHeader:boolean = false;
  url="logistics_tracking_transportations/";
  transportationName:any="";
  transportId:any="";
  ContactPerson:any="";
  Email:any="";
  Password:any="";
  UserName:any="";
  Token:any="";


  UserRole: any;
  userRoleArr:any;

  transportID:any="";
  transportationNAME:any="";
  contactPerson:any="";
  email:any="";
  password:any="";
  userName:any="";
  token:any="";

  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  TransportationName: any = [];

  public dataSource1 = new MatTableDataSource<['']>();
  public displayedColumns1: string[] = ['Sl.no.','TransporterType','Transporter','ContactPerson','Email','Action'];  
  resultsLength: any;
  TransportsTypeList: any;
  TransportationTypeList: any;
  resultList: any;
  transportationId: any;
  Result: any;

  constructor(public api: ApiserviceService,public toast:ToastrService,public storage:StorageServiceService) { }


  ngOnInit(): void {
    this.TransportsType();
    this.getTransportationList();
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

    if(this.UserRole.find(e => e.module_slug_name === "transporter_details"))
    {
      let module_id_index=this.UserRole.indexOf(this.UserRole.find(e => e.module_slug_name === "transporter_details"))
      this.userRoleArr=this.UserRole[module_id_index];
    }
    if(this.userRoleArr == undefined)
    {
      this.userRoleArr=0;
    }
    console.log("UserRoleArr=",this.userRoleArr)
}

  searchFilter()
  {
    return this.TransportationName.filter((option:any) => option.toString().indexOf(this.transportationName) === 0) || this.TransportationName;
  }
  searchFilter2()
  {
    return this.TransportationName.filter((option:any) => option.toString().indexOf(this.transportationNAME) === 0) || this.TransportationName;
  }

  TransportsType(){
    let url = "logistics_transports_type/";
    this.api.getData(url).then((res: any) => {
      this.TransportsTypeList = res;
      console.log("transports list at its function=",this.TransportsTypeList)
      console.log("transports types=",this.TransportsTypeList);
    });
  }

  getTransportationList(){
    let url = "logistics_tracking_transportations/";
    this.api.getData(url).then((res: any) => {
        this.dataSource1 = new MatTableDataSource(res);
        this.dataSource1.data = res;
        this.dataSource1.sort = this.sort;
        this.dataSource1.paginator = this.paginator;
        this.resultsLength=res.length;
        console.log("result=",res);
        console.log("ResultLength =",this.resultsLength)
  
        this.TransportationTypeList = res;
        console.log("transportatiomsdhh",this.TransportationTypeList)
        console.log("transportlist=",this.TransportsTypeList)
        this.TransportationTypeList?.forEach((element: any) => {
          this.TransportationName.push(element.transportationName);
          this.TransportsTypeList?.forEach((val: any) => {
            if(element.transportID == val.transportId){
              element['transportName'] = val.transportName;
            }
          });
        });
        this.searchFilter();
        this.searchFilter2();
       }
      );
  }

  update(element:any)
  {
    debugger;
    this.MainForm=false;
    this.EditForm=true;
    this.editFormHeader = true;
    this.mainFormHeader = false;
    this.addFormHeader = false;
    console.log("element=",element)
    this.transportId = element.transportID;
    this.transportationId = element.transportationId;
    this.transportationName=element.transportationName;
    this.email = element.email;
    this.contactPerson = element.contactPerson;
    this.password = element.pass_param;
    this.userName = element.user_param;
    this.token = element.token_param;
    console.log(this.transportId,this.transportationName,this.transportationId)
  }

  UpdateEditData()
{
  if(this.transportId=="")
  {
    this.toast.error("Please Select Transporter Type");
  }
  else if(this.transportationName == "")
  {
    this.toast.error("please Enter transportation Name");
  }
  else if(this.contactPerson == "")
  {
    this.toast.error("Please Enter Contact Person Name")
  }
  else if(this.email == "")
  {
    this.toast.error("Please Enter Email")
  }
  else
  {
    let data={
          'transportID':this.transportId,
          'transportationName':this.transportationName,
    }
    let url = 'logistics_tracking_transportations/checkTransportationDataExist/';
    this.api.postData(url,data).then((res: any) => {
    this.Result=res; 
    console.log("Result=",this.Result);
    if(this.Result == false)
    {
      this.toast.error("Entered transport and transportation values are already existed");
    }
    else
    {
      let data={
            'transportID':this.transportId,
            'transportationName':this.transportationName,
            'contactPerson':this.contactPerson,
            'email':this.email,
            'pass_param':this.password,
            'token_param':this.token,
            'user_param':this.userName
          }
            console.log(data)
            let url = "logistics_tracking_transportations/"+this.transportationId+"/";
            this.api.updateData(url,data).then(res => {
              console.log(res)
              this.toast.success("Record Updated Successfully!");
              this.resultList=res;
              this.getTransportationList();
              this.MainForm=true;
              this.EditForm=false;
              this.AddForm=false;
              this.mainFormHeader = true;
              this.editFormHeader = false;
              this.addFormHeader = false;
            })
          }
        })
  }
  }
  
setAddForm()
{
  this.AddForm=false;
  this.MainForm=true;
  this.EditForm=false;
  this.editFormHeader = false;
  this.mainFormHeader = true;
  this.addFormHeader = false;
  this.getTransportationList();
}

SetAddNewElementForm()
{
  this.MainForm=false;
  this.EditForm=false;
  this.AddForm=true;
  this.mainFormHeader = false;
  this.editFormHeader = false;
  this.addFormHeader = true;
  this.getTransportationList();
}

AddNewElement()
{debugger;
  this.MainForm=false;
  this.EditForm=false;
  this.AddForm=true;
  this.mainFormHeader = false;
  this.editFormHeader = false;
  this.addFormHeader = true;
  
  if(this.transportID=="")
  {
    this.toast.error("Please Select Transporter Type");
  }
  else if(this.transportationNAME == "")
  {
    this.toast.error("please Enter transportation Name");
  }
  else
  {
    let data={
      'transportID':this.transportID,
      'transportationName':this.transportationNAME
    }
    let url = 'logistics_tracking_transportations/checkTransportationDataExist/';
    this.api.postData(url,data).then((res: any) => {
    this.Result=res; 
    console.log("Result=",this.Result);
    if(this.Result == false)
    {
      this.toast.error("Entered transport and transportation values are already existed");
    }
    else
    { debugger;
          let data={
            'transportID':this.transportID,
            'transportationName':this.transportationNAME,
            'contactPerson':this.ContactPerson,
            'email':this.Email,
            'pass_param':this.Password,
            'token_param':this.Token,
            'user_param':this.UserName
          }
            console.log(data)
            let url = "logistics_tracking_transportations/";
            this.api.postData(url,data).then(res => {
              console.log("Result = ",res)
              this.toast.success("Record Successfully Inserted!");
              this.resultList=res;
              this.getTransportationList();
              this.MainForm=true;
              this.EditForm=false;
              this.AddForm=false;
              this.mainFormHeader = true;
              this.editFormHeader = false;
              this.addFormHeader = false;
              this.ContactPerson = "";
              this.Email = "";
              this.transportationNAME = "";
            })
        }
    })
  }
}

  deleteData(element:any)
  {
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
   {
    this.toast.success("Deleted");
    console.log(data);
    this.resultList=data.records;
    this.getTransportationList();
   })
  }

  setEditForm()
  {
    this.MainForm=true;
  this.EditForm=false;
  this.editFormHeader = false;
  this.mainFormHeader = true;
  this.getTransportationList(); 
  }

}

























// AddNewElement()
// {
//   this.MainForm=false;
//   this.EditForm=false;
//   this.AddForm=true;
//   if(this.transportID=="")
//   {
//     this.toast.error("Please Select Transporter Type");
//   }
//   else if(this.transportationNAME == "")
//   {
//     this.toast.error("please Enter transportation Name");
//   }
//   else
//   {
//     let data={
//       'transportID':this.transportID,
//       'transportationName':this.transportationNAME
//     }
//       console.log(data)
//       let url = "logistics_tracking_transportations/";
//       this.api.postData(url,data).then(res => {
//         console.log("Result = ",res)
//         this.toast.success("Record Successfully Inserted!");
//         this.resultList=res;
//         this.getTransportationList();
//       })
//   }
// }


// updateList()
// {
//   if(this.transportId=="")
//   {
//     this.toast.error("Please Select Transporter Type");
//   }
//   else if(this.transportationName == "")
//   {
//     this.toast.error("please Enter transportation Name");
//   }
//   else
//   {
//     let data={
//       'transportID':this.transportId,
//       'transportationName':this.transportationName
//     }
//       console.log(data)
//       let url = "logistics_tracking_transportations/"+this.transportationId+"/";
//       this.api.updateData(url,data).then(res => {
//         console.log(res)
//         this.toast.success("Record Updated Successfully!");
//         this.resultList=res;
//         this.getTransportationList();
//       })
//   }
// } 
