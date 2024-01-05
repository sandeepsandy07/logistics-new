import { Component, OnInit, ViewChild} from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { Router,ActivatedRoute } from '@angular/router';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.css']
})
export class RoleMasterComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public hide:boolean=true;
  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  EditForm:boolean=false;
  MainFormHeader:boolean=true;
  RoleName:any="";
  roleName:any="";
  resultList:any;
  updateRow:any;
  resultsLength = 0;
  reslen=0;

  roleListData: any;
  EmpListData: any;
  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','RoleName', 'CreatedBy', 'UpdatedBy','Action','role_access'];

  public dataSource2 = new MatTableDataSource<['']>();
  public displayedColumns2: string[] = ['RoleId','RoleName', 'CreatedBy', 'UpdatedBy','UpdatedAt','CreatedAt'];
 
  url = "logistics_role_master/";
  viewRecords: any;
  roleId: any;
  EditFormData: any;
  role_name: any;
  roleMasterList: any;

  passedDANo:any="";
  SAPDADetails: any;

  constructor(public api: ApiserviceService,public toast:ToastrService , private activatedroute: ActivatedRoute,
    private router: Router)
    {
      // const navigation = this.router.getCurrentNavigation();
      // const state = navigation.extras.state as {dad_id: string};
      // const state1 = navigation.extras.state as {bill_type: string};
      // this.passedDANo = state.dad_id
      // console.log("dano=",this.passedDANo)
    }

  ngOnInit() {
    this.EmpName();
    //this.getDAnoDetails();
  }

  applyFilter(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  keyPressNumbers(event)
   {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && (charCode < 32 || charCode > 32))
    {
      event.preventDefault();
      this.toast.error("Rolename must be a Character Value, Numbers and Special Characters are not allowed.");
    }
    if(this.RoleName.length >= 30)
    {
      this.toast.error("Rolename must be within 30 characters.");
        return false;
    }
    if(this.roleName.length >= 30)
    {
      this.toast.error("Rolename must be within 30 characters.");
        return false;
    }
    else
    {
      return true;
    }
  }

  createlskl(roleMasterForm)
  {
    
  }

  // getDAnoDetails()
  // {
  //   // let url = "logistics_dispatch_advice/"+4
  //   let url = "logistics_dispatch_advice/"+this.passedDANo
  //   this.api.getData(url).then((res:any) => {
  //     this.SAPDADetails = res;
  //     console.log("sapdetails",this.SAPDADetails);
  //   })
  // }

  generateDispatchCheckListPDF()
{
  let url = "panel_wise/getDispatchListData/";
  let data = {
    da_id : this.passedDANo,
    // da_id : 81
  }
  this.api.downloadPDF(url, data).then((data) => {
    var downloadURL = window.URL.createObjectURL(data);
    let tab = window.open();
    tab.location.href = downloadURL;
  });
}

generateDispatchListPanelWiseDataPdf()
{
  let url = "panel_wise/getDispatchListData/";
  let data = {
    da_id : 21
  }
  this.api.downloadPDF(url, data).then((data) => {
    var downloadURL = window.URL.createObjectURL(data);
    let tab = window.open();
    tab.location.href = downloadURL;
  });
}

  setViewForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.MainFormHeader = true;
}

setEditForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.EditForm=false; 
  this.MainFormHeader=true;
}

getRoleMasterList(){
  let url = "logistics_role_master/";
  this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.resultsLength=res.length;
      console.log("ResultLength =",this.resultsLength)

      this.roleMasterList=res;
      console.log(this.roleMasterList);

      this.roleMasterList?.forEach((element: any) => {
        this.EmpListData?.forEach((val: any) => {
          if(element.created_by == val.id){
            element['created_by'] = val.employee_name;
          }
          if(element.updated_by == val.id){
            
            element['updated_by']=val.employee_name;
          }
        });
      });
  });
}

createList()
{
  if(this.RoleName == ""){
    this.toast.error("Please Enter Role Name");
    }
  else
  {
    let data={
      'role_name':this.RoleName
    }
    console.log(data)
    let url = "logistics_role_master/";
    this.api.postData(url,data).then(res => {
      console.log(res)
      this.toast.success("Record Successfully Inserted!");
      this.resultList=res;
      this.getRoleMasterList();
      this.RoleName = "";
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
      this.getRoleMasterList();
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
    console.log(this.viewRecords);
    this.getRoleMasterList();
   })
}

update(element: any){
  this.EditForm=true;
  this.ListForm=false;
  this.ViewForm=false;
  this.CreateForm=false;
  this.MainFormHeader = false;
  this.roleId = element.role_id;
  this.roleName=element.role_name;
}

updateList()
{
  if(this.roleName=="")
  {
    this.toast.error("Please Enter Role Name");
  }
  else
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

        this.EditForm=false;
        this.ListForm=true;
        this.ViewForm=false;
        this.CreateForm=true;
        this.MainFormHeader=true;
        
      })
  }
} 

  EmpName(){
    let url = "user_list/";
    this.api.getData(url).then((res: any) => {
      this.EmpListData = res.data;
      console.log(this.EmpListData);
      this.getRoleMasterList();
    });
  }
  daNavigation_role(role_id,action,readonly,nav_url){
    const navigationExtras: NavigationExtras = {state: {role_id: role_id,action:action,readonly:readonly}};
    this.router.navigate([nav_url], navigationExtras);
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

