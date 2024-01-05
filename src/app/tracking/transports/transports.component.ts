import { Component, OnInit,ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { StorageServiceService } from 'src/app/service-storage.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-transports',
  templateUrl: './transports.component.html',
  styleUrls: ['./transports.component.css']
})
export class TransportsComponent implements OnInit {

  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  EditForm:boolean=false;
  mainFormHeader:boolean = true;
  editFormHeader:boolean = false;
  EmpListData: any;
  TruckName:any="";
  url = "logistics_transports_type/";
  TransportsName: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  UserRole: any;
  userRoleArr:any;

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','TransportsName', 'CreatedBy', 'UpdatedBy','Action'];
  resultsLength: any;
  
  resultList: unknown;
  viewRecords: any;
  transportsID: any;

  transportsName:any="";
  TransportName:any="";
  transportsList: any;

  constructor(public api: ApiserviceService,public toast:ToastrService,public storage:StorageServiceService) { }

  ngOnInit(){
    this.EmpName();
    this.getUserRole();
  }

  applyFilter(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getUserRole()
  {
    console.log("session storage value for user role=",this.storage.getUserRole())
    this.UserRole = this.storage.getUserRole()
    console.log("User Roles=",this.UserRole)
  
      if(this.UserRole.find(e => e.module_slug_name === "transports"))
      {
        let module_id_index=this.UserRole.indexOf(this.UserRole.find(e => e.module_slug_name === "transports"))
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
    return this.TransportsName.filter((option:any) => option.toString().indexOf(this.TransportsName) === 0) || this.TransportsName;
  }
  searchFilter2()
  {
    return this.TransportsName.filter((option:any) => option.toString().indexOf(this.transportsName) === 0) || this.TransportsName;
  }

  getTransportsList()
  {debugger;
    let url = "logistics_transports_type/";
    this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.transportsList=res;
      this.resultsLength=res.length;
      console.log("ResultLength =",this.resultsLength)

      
      console.log("Transports list=",this.transportsList);

      this.transportsList?.forEach((element: any) => {
        this.TransportsName.push(element.transportName);
        this.EmpListData?.forEach((val: any) => {
          if(element.created_by == val.id){
            element['created_by'] = val.employee_name;
          }
          if(element.updated_by == val.id){
            
            element['updated_by']=val.employee_name;
          }
        });
      });
      this.searchFilter();
      this.searchFilter2();
  });
  }

  EmpName(){
    let url = "user_list/";
    this.api.getData(url).then((res: any) => {
      this.EmpListData = res.data;
      console.log(this.EmpListData);
      this.getTransportsList();
    });
  }

  createList()
  {
    if(this.TransportName == ""){
      this.toast.error("Please Enter Transports Name");
      }
    else
    {
      let data={
        'transportName':this.TransportName
      }
      console.log(data)
      let url = "logistics_transports_type/";
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
        this.getTransportsList();
        }
      })
    }
  }

  viewData(element:any)
  {
    console.log(element);
    this.api.viewuser(this.url,element).then((data:any) => {
      this.ViewForm=true;
      this.ListForm=false;
      this.CreateForm=false;
      this.viewRecords = data.records;
      console.log(this.viewRecords);
      this.getTransportsList();
     })
  }
  update(element:any)
  {
    this.EditForm=true;
    this.ListForm=false;
    this.ViewForm=false;
    this.CreateForm=false;
    this.editFormHeader = true;
    this.mainFormHeader = false;
    this.transportsID = element.transportId;
    this.transportsName=element.transportName;
  }
  deleteData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      console.log(data);
      this.resultList=data.records;
      this.getTransportsList();
     })
}
  setViewForm()
  {
    this.ViewForm=false;
    this.ListForm=true;
    this.CreateForm=true;
    this.mainFormHeader = true;
    this.getTransportsList();
  }
  setEditForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.EditForm=false;
  this.mainFormHeader = true;
  this.editFormHeader = false;
  this.getTransportsList(); 
}

updateList()
{
  if(this.transportsName=="")
  {
    this.toast.error("Please Enter Transports Name");
  }
  else
  {
    let data={
      'transportName':this.transportsName,
      'transportId':this.transportsID
    }
      console.log(data)
      let url = "logistics_transports_type/"+this.transportsID+"/";
      this.api.updateData(url,data).then(res => {
        console.log(res)
        if(res == false)
        {
          this.toast.error("Value already exist in table");
        }
        else
        {
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
        this.getTransportsList();
        this.ViewForm=false;
        this.ListForm=true;
        this.CreateForm=true;
        this.EditForm=false;
        this.mainFormHeader = true;
        this.editFormHeader = false;
        }
      })
  }
} 

}
