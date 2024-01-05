import { Component, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { StorageServiceService } from 'src/app/service-storage.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-truck-type',
  templateUrl: './truck-type.component.html',
  styleUrls: ['./truck-type.component.css'],
})
export class TruckTypeComponent implements OnInit {

  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  EditForm:boolean=false;
  editFormHeader:boolean = false;
  mainFormHeader:boolean = true;
  EmpListData: any;
  TruckName:any="";
  url = "logistics_truck_type/";
  TrucksName: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','TruckName', 'CreatedBy', 'UpdatedBy','Action'];
  resultsLength: any;
  truckTypeList: any;
  resultList: unknown;
  viewRecords: any;
  truckID: any;
  truckName: any;
  truck_name: string;

  UserRole: any;
  userRoleArr:any;

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

    if(this.UserRole.find(e => e.module_slug_name === "truck_type"))
    {
      let module_id_index=this.UserRole.indexOf(this.UserRole.find(e => e.module_slug_name === "truck_type"))
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
    return this.TrucksName.filter((option:any) => option.toString().indexOf(this.TruckName) === 0) || this.TrucksName;
  }
  searchFilter2()
  {
    return this.TrucksName.filter((option:any) => option.toString().indexOf(this.truckName) === 0) || this.TrucksName;
  }


  getTruckTypeList()
  {
    let url = "logistics_truck_type/";
    this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.resultsLength=res.length;
      console.log("ResultLength =",this.resultsLength)

      this.truckTypeList=res;
      console.log(this.truckTypeList);

      this.truckTypeList?.forEach((element: any) => {
        this.TrucksName.push(element.truckName);
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
      this.getTruckTypeList();
    });
  }

  createList()
  {
    if(this.TruckName == ""){
      this.toast.error("Please Enter Truck Name");
      }
    else
    {
      let data={
        'truckName':this.TruckName
      }
      console.log(data)
      let url = "logistics_truck_type/";
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
        this.getTruckTypeList();
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
      this.getTruckTypeList();
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
    this.truckID = element.truckId;
    this.truckName=element.truckName;
  }
  deleteData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      console.log(data);
      this.resultList=data.records;
      this.getTruckTypeList();
     })
}
  setViewForm()
  {
    this.ViewForm=false;
    this.ListForm=true;
    this.CreateForm=true;
    this.mainFormHeader = true;
    this.getTruckTypeList();
  }
  setEditForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.EditForm=false; 
  this.editFormHeader = false;
  this.mainFormHeader = true;
  this.getTruckTypeList();
}

updateList()
{
  if(this.truckName=="")
  {
    this.toast.error("Please Enter Truck Name");
  }
  else
  {
    let data={
      'truckName':this.truckName,
      'truckId':this.truckID
    }
      console.log(data)
      let url = "logistics_truck_type/"+this.truckID+"/";
      this.api.updateData(url,data).then(res => {
        console.log(res)
        if(res == false)
        {
          this.toast.error("Value already exist in table");
        }
        else
        {
        this.toast.success("Record Updated Successfully!");
        //alert("Record Updated Successfully");
        this.resultList=res;
        this.getTruckTypeList();
        this.ViewForm=false;
        this.ListForm=true;
        this.CreateForm=true;
        this.EditForm=false; 
        this.editFormHeader = false;
        this.mainFormHeader = true;
        }
      })
  }
} 

}
