import { Component, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.css']
})
export class UserAccessComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  url = "logistics_user_access/";
  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  EditForm:boolean=false;
  MainFormHeader:boolean=true;

  salesOrderNo:any;
  RoleIdList: any;
  EmpId:any="";
  RoleId:any="";
  EmpIdList:any;
  resultList: any;

  UserNames:string[];
 

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','EmployeeName','RoleName','CreatedBy', 'UpdatedBy','Action'];
  resultsLength: any;
  roleListData: any;
  userAccessList: any;
  EmpListData: any;
  viewRecords: any;
  emp_id: any;
  role_id: any;
  
  useraccessId: any;
  salesOrderId: any;

  constructor(public api: ApiserviceService,public toast:ToastrService) { }

  ngOnInit() {
    this.getRoleIdList();
    this.getEmpIdList();
    this.roleName();
    this.EmpName();
  }

  searchFilter1()
  {
    return this.UserNames.filter((option:any) => option.toString().indexOf(this.EmpId) === 0) || this.UserNames;
  }
  searchFilter2()
  {
    return this.UserNames.filter((option:any) => option.toString().indexOf(this.EmpId) === 0) || this.UserNames;
  }

  applyFilter(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  searchFilter(){
    return this.salesOrderId.filter((option:any) => option.toString().indexOf(this.salesOrderNo) === 0) || this.salesOrderId;
  }

  setViewForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.getUserAccessList();
}

setEditForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.EditForm=false; 
  this.MainFormHeader=true;
  this.getUserAccessList();
}
  getRoleIdList()
  {
    let url = "logistics_role_master/";
    this.api.getData(url).then(res => {
      this.RoleIdList=res;
    })
  }

  getEmpIdList()
  {
    let url = "user_list/";
    this.api.getData(url).then((res: any) => {
      this.EmpIdList=res.data;
      console.log("emplist=",this.EmpIdList)
    })
  }

createList()
{
  if(this.EmpId=="")
  {
    this.toast.error("Please Select Employee ID");
  }
  else if(this.RoleId=="")
  {
      this.toast.error("Please Select Role Name");
  }
  else
  {
    let data={
      'role_id':this.RoleId,'emp_id':this.EmpId
    }
    let url = "logistics_user_access/";
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
      this.getUserAccessList();
      }
    })
  }
}

getUserAccessList(){
  let url = "logistics_user_access/";
  this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.resultsLength=res.length;
      console.log("ResultLength =",this.resultsLength)
      this.userAccessList = res;
      console.log("user access list=",this.userAccessList)
      this.userAccessList?.forEach((element: any) => {
        //console.log("element=",element);
       // this.UserNames.push(element.role_name);
        this.EmpListData?.forEach((val: any) => {
          if(element.emp_id == val.id){
            element['employee_name'] = val.employee_name;
          }
          if(element.emp_id == val.id){
            element['created_by']=val.employee_name;
          }
          
          if(element.updated_by == val.id){
            element['updated_by']=val.employee_name;
          }
        });
        console.log(this.roleListData);
            this.roleListData?.forEach((val: any) => {
              if(element.role_id == val.role_id){
                element['role_name'] = val.role_name;
          }
        });
      });
      this.searchFilter1();
      this.searchFilter2();
  });
}
roleName(){
  let url = "logistics_role_master/";
  this.api.getData(url).then((res: any) => {
    this.roleListData = res;
    this.getUserAccessList();
  });
}

EmpName(){
  let url = "user_list/";
  this.api.getData(url).then((res: any) => {
    this.EmpListData = res.data;
    this.getUserAccessList();
  });
}

deleteData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      this.resultList=data.records;
      this.getUserAccessList();
     })
}
viewData(element:any)
{
  console.log(element);
  this.api.viewuser(this.url,element).then((data:any) => {
    this.ViewForm=true;
    this.ListForm=false;
    this.CreateForm=false;
    this.MainFormHeader = false;
    this.viewRecords = data.records;
    this.getUserAccessList();
   })
}
update(element: any){
  this.EditForm=true;
  this.ListForm=false;
  this.ViewForm=false;
  this.CreateForm=false;
  this.MainFormHeader = false;
  this.useraccessId=element.id;
  this.emp_id = element.emp_id;
  this.role_id = element.role_id;
}


updateList()
{
  debugger;
  if(this.emp_id=="")
  {
    this.toast.error("Please Select Employee ID");
  }
  else if(this.role_id=="")
  {
    this.toast.error("Please Select Role Name");
  }
  else
  {
    let data={
      'emp_id':this.emp_id,
      'role_id':this.role_id,
      'id':this.useraccessId
    }
      console.log(data)
      let url = "logistics_user_access/"+this.useraccessId+"/";
      this.api.updateData(url,data).then(res => {
        if(res == false)
        {
          this.toast.error("Value already exist in table");
        }
        else
        {
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
        this.getUserAccessList();
        this.EditForm=false;
        this.ListForm=true;
        this.ViewForm=false;
        this.CreateForm=true;
        this.MainFormHeader=true;
        }
      })
    } 
  }
}


