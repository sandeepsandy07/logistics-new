import { Component, OnInit } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public hide:boolean=true;
  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  EditForm:boolean=false;
  RoleName:any;
  roleName:any;
  resultList:any;
  updateRow:any;
  resultsLength = 0;
  reslen=0;
  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['RoleId','RoleName', 'CreatedBy', 'UpdatedBy','Delete','View','Edit'];

  public dataSource2 = new MatTableDataSource<['']>();
  public displayedColumns2: string[] = ['RoleId','RoleName', 'CreatedBy', 'UpdatedBy','UpdatedAt','CreatedAt'];
 
  url = "logistics_role_master/";
  viewRecords: any;
  roleId: any;
  EditFormData: any;
  role_name: any;

  constructor(public api: ApiserviceService,public toast:ToastrService) { }

  ngOnInit() {
    this.getRoleMasterList();
  }
setViewForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
}

setEditForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.EditForm=false; 
}

getRoleMasterList(){

  let url = "logistics_role_master/";
  this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.resultsLength=res.length;
      console.log("ResultLength =",this.resultsLength)
    }
  );
}

createList()
{
  let data={
    'role_name':this.RoleName
  }
  let url = "logistics_role_master/";
  //console.log(data) Every time before hitting the api i should check if all data entered in input box is binding to the models names
  //debugger
  this.api.postData(url,data).then(res => {
    console.log(res)
    this.toast.success("Record Successfully Inserted!");
    this.resultList=res;
    this.getRoleMasterList();
  })
}

deleteData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      console.log(data);
      this.resultList=data.records;
      this.getRoleMasterList();
     })
}

viewData(element:any)
{
  console.log(element);
  this.api.viewuser(element,this.url).then((data:any) => {
    this.ViewForm=true;
    this.ListForm=false;
    this.CreateForm=false;
    this.viewRecords = data.records;
    this.getRoleMasterList();
   })
}

update(element: any){
  this.EditForm=true;
  this.ListForm=false;
  this.ViewForm=false;
  this.CreateForm=false;
  // this.api.viewuser(element.role_id,this.url).subscribe((data:any) => {
  //   this.EditFormData = data.records;
  // })
  this.roleId = element.role_id;
  this.roleName=element.role_name;
}

updateList()
{
  let data={
    'role_name':this.roleName
  }
    console.log(data)
    let url = "logistics_role_master/"+this.roleId+"/";
    this.api.updateData(url,data).then(res => {
      console.log(res)
      this.toast.success("Record Updated Successfully!");
      //alert("Record Updated Successfully");
      this.resultList=res;
      this.getRoleMasterList();
    })
  } 
  }




// deleteCategory(id){
//   let url = "category_master_list/delete/"+id;
//   this.api.getData(url).then((res: any) => {
//     this.toastr.success("Deleted");
//     this.getCategoryList();
//   });
// }

// getRoleMasterList(){

//   let url = "LogisticsRoleMaster_List/"
//   this.api.getData(url).then((res: any) => {
//       this.dataSource = new MatTableDataSource(res);
//       this.dataSource.data = res;
//       this.resultsLength=res.length;
//       console.log("ResultLength =",this.resultsLength)
//     }
//   );
// }

// viewData(element:any)
// {
//   // this.ViewForm=true;
//   console.log(element);
//   this.api.viewuser(element,this.url).subscribe((data:any) => {
//     this.ViewForm=true;
//      this.dataSource2 = new MatTableDataSource(data.records);
//      console.log(data);
//     this.dataSource2.data = data.records;
//     this.viewRecords = data.records;
//    })
// }