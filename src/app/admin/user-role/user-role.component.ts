import { Component, OnInit, ViewChild } from '@angular/core';;
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit {
  url = "logistics_user_role/";
  RoleIdList:any;
  RoleId:any="";
  ModuleIdList:any;
  ModuleId:any="";
 deleteAccess:boolean = true;
 viewaccess:boolean = true;
 editaccess: boolean = true;
 addAccess: boolean = true;
 MainFormHeader:boolean=true;
 resultList: unknown;

 @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

 CreateForm:boolean=true;
 ListForm:boolean=true;
 ViewForm:boolean=false;
 EditForm:boolean=false;
  
  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','RoleName','ModuleName', 'CreatedBy', 'UpdatedBy','AddAccess','ViewAccess','EditAccess','DeleteAccess','Action'];
  resultsLength: any;
  delAccess: any;
  userRoleList: any;
  roleListData: any;
  moduleListData:any;
  userModuleList:any;
  EmpListData: any;
  viewRecords: any;
  userId: any;


  module_id: any;
  role_ID: any;
  UserID: any;
  AddAccess: any;
  VAaccess: any;
  EditAccess: any;
  Deleteaccess: any;

 
  constructor(public api: ApiserviceService,public toast:ToastrService) { }

  ngOnInit() {
    this.getRoleIdList();
    this.getModuleIdList();
    this.roleName();
    this.moduleName();
    this.EmpName();
  }

  applyFilter(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRoleIdList()
  {
    let url = "logistics_role_master/";
    this.api.getData(url).then(res => {
      this.RoleIdList=res;
      console.log("roleid list=", this.RoleIdList)
    })
  }

  getModuleIdList()
  {
    let url = "logistics_module_master/";
    this.api.getData(url).then(res => {
      this.ModuleIdList=res;
    })
  }

  setViewForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.MainFormHeader=true;
}

setEditForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.EditForm=false; 
  this.MainFormHeader=true;
}
  getUserRoleList(){
    let url = "logistics_user_role/";
    this.api.getData(url).then((res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.resultsLength=res.length;
        console.log("ResultLength =",this.resultsLength)

        this.userRoleList = res;
        this.userRoleList?.forEach((element: any) => {
          this.roleListData?.forEach((val: any) => {
            if(element.role_id == val.role_id){
              element['role_name'] = val.role_name;
            }
          });
        });

        this.userRoleList?.forEach((element:any)=>{
          this.moduleListData?.forEach((val:any)=>{
            if(element.module_id==val.module_id){
              element['module_name']=val.module_name;
            }
          });
        });

        this.userRoleList?.forEach((element:any)=>{
          this.EmpListData?.forEach((val:any)=>{
            if(element.created_by==val.id){
              element['created_by']=val.employee_name;
            }
            if(element.updated_by==val.id)
            {
              element['updated_by']=val.employee_name;
            }
          })
        })
      }
      );
  }

  roleName(){
    let url = "logistics_role_master/";
    this.api.getData(url).then((res: any) => {
      this.roleListData = res;
      this.getUserRoleList();
    });
  }

  moduleName(){
    let url = "logistics_module_master/";
    this.api.getData(url).then((res: any) => {
      this.moduleListData = res;
      this.getUserRoleList();
    });
  }

  EmpName(){
    let url = "user_list/";
    this.api.getData(url).then((res: any) => {
      this.EmpListData = res.data;
      console.log(this.EmpListData);
      this.getUserRoleList();
    });
  }

public onaddAccessChanged(value:boolean){
    this.addAccess = value;
    console.log(this.addAccess);
}
public ondeleteAccessChanged(value:boolean)
{
  this.deleteAccess=value;
  console.log(this.deleteAccess);
}

public onviewAccessChanged(value:boolean)
{
  this.viewaccess=value;
  console.log(this.viewaccess);
}

public oneditAccessChanged(value:boolean)
{
  this.editaccess=value;
  console.log(this.editaccess);
}

createList()
{
  if(this.RoleId=="")
  {
    this.toast.error("Please Select Role Name");
  }
  else if(this.ModuleId=="")
  {
    this.toast.error("Please Select Module Name")
  }
  else
  {
    let data={
      'role_id':this.RoleId,
      'module_id':this.ModuleId,
      'add_access':this.addAccess,
      'delete_access':this.deleteAccess,
      'view_access':this.viewaccess,
      'edit_access':this.editaccess
    }
    let url = "logistics_user_role/";
    this.api.postData(url,data).then(res => {
      console.log(res)
      this.toast.success("Record Successfully Inserted!");
      this.resultList=res;
      this.getUserRoleList();

    })
  }
  
}
deleteData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      console.log(data);
      this.resultList=data.records;
      this.getUserRoleList();
     })
}
viewData(element:any)
{
  console.log(element);
  this.api.viewuser(this.url,element).then((data:any) => {
    this.ViewForm=true;
    this.MainFormHeader = false;
    this.ListForm=false;
    this.CreateForm=false;
    this.viewRecords = data.records;
    this.getUserRoleList();
   })
}

update(element: any){
  console.log(element)
  this.EditForm=true;
  this.ListForm=false;
  this.ViewForm=false;
  this.CreateForm=false;
  this.MainFormHeader = false;
  this.userId=element.user_id;
  this.module_id = element.module_id;
  this.role_ID = element.role_id;
}

updateList()
{debugger;
  if(this.module_id=="")
  {
    this.toast.error("Please Select Module Name");
  }
  else if(this.role_ID=="")
  {
    this.toast.error("Please Select Role Name")
  }
  else
  {
    let data={
      'module_id':this.module_id,
      'role_id':this.role_ID,
      'add_access':this.addAccess,
      'delete_access':this.deleteAccess,
      'view_access':this.viewaccess,
      'edit_access':this.editaccess
    }
      console.log(data)
      let url = "logistics_user_role/"+this.userId+"/";
      this.api.updateData(url,data).then(res => {
        console.log(res);
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
        this.getUserRoleList();
      })
    }
        this.EditForm=false;
        this.ListForm=true;
        this.ViewForm=false;
        this.CreateForm=true;
        this.MainFormHeader=true;
  }

  ADDAccess(element:any)
  {
    console.log(element);
    this.UserID=element.user_id;
    this.AddAccess=element.add_access;
    console.log(this.UserID,this.AddAccess);
    debugger;
    if(this.AddAccess==false){
        this.AddAccess=true;
    } else if(this.AddAccess==true){
        this.AddAccess=false;
    }
    let data={'add_access':this.AddAccess}
    console.log(data)
    let url = "logistics_user_role/"+this.UserID+"/";
    this.api.updateData(url,data).then(res => {
    console.log(res)
    this.toast.success("Record Updated Successfully!");
})
}
VIEWAccess(element:any)
{
  console.log(element);
  this.UserID=element.user_id;
  this.VAaccess=element.view_access;
  console.log(this.UserID,this.VAaccess);
  if(this.VAaccess==false){
      this.VAaccess=true;
  } else if(this.VAaccess==true){
      this.VAaccess=false;
  }
  let data={'view_access':this.VAaccess}
  console.log(data)
  let url = "logistics_user_role/"+this.UserID+"/";
  this.api.updateData(url,data).then(res => {
  console.log(res)
  this.toast.success("Record Updated Successfully!");
})
}
EDITAccess(element:any)
{
  console.log(element);
  this.UserID=element.user_id;
  this.EditAccess=element.edit_access;
  console.log(this.UserID,this.EditAccess);
  if(this.EditAccess==false){
      this.EditAccess=true;
  } else if(this.EditAccess==true){
      this.EditAccess=false;
  }
  let data={'edit_access':this.EditAccess}
  console.log(data)
  let url = "logistics_user_role/"+this.UserID+"/";
  this.api.updateData(url,data).then(res => {
  console.log(res)
  this.toast.success("Record Updated Successfully!");
})
}

DELETEAccess(element:any)
{
  console.log(element);
  this.UserID=element.user_id;
  this.Deleteaccess=element.delete_access;
  console.log(this.UserID,this.Deleteaccess);
  if(this.Deleteaccess==false){
      this.Deleteaccess=true;
  } else if(this.Deleteaccess==true){
      this.Deleteaccess=false;
  }
  let data={'delete_access':this.Deleteaccess}
  console.log(data)
  let url = "logistics_user_role/"+this.UserID+"/";
  this.api.updateData(url,data).then(res => {
  console.log(res)
  this.toast.success("Record Updated Successfully!");
})
}
  
}
