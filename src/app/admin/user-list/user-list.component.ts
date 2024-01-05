import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import * as moment from 'moment';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  CreateForm:boolean=true;
  mainFormHeader:boolean=true;
  EditFormHeader:boolean = false;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  MainFormHeader:boolean=true;
  EditForm:boolean=false;
  createFormHeader:boolean=true;
  viewFormHeader:boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  //Edit Page Variables
  userName:any="";
  employeeNo:any="";
  employeeName
  deptCode:any="";
  deptName:any="";
  designation:any="";
  location:any="";
  gender: any="";
  DateOfBirth:any="";
  dateOfBirth:any="";
  resultsLength:any;
  hide:any;
  superUserStatus:boolean;
  SuperUserStatus:boolean;
  resultList: any;

  public superUsername:boolean;
  public Active:boolean;

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','UserName','EmployeeName','Department','SubDepartment','Location','SuperUserStatus','Action'];
  url = "user_list/";
  viewRecords: any;
  Id: any;
  DeptIdDataList:any="";
  SubDeptIdDataList:any="";
  UserList:any="";

  ActiveStatus:boolean=true;
  UID: any;

  constructor(public api: ApiserviceService,public toast:ToastrService,private datePipe: DatePipe, public dialog: MatDialog,) { }

  ngOnInit() {
    //this.getUserList();
    this.departmentNameList();
    this.subDepartmentNameList();
  }

  applyFilter(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  departmentNameList(){
    let url = "user_dept_list/";
    this.api.getData(url).then((res: any) => {
      this.DeptIdDataList = res;
      console.log("Department list=", this.DeptIdDataList)
      this.getUserList();
    });
  }

  subDepartmentNameList(){
    let url = "user_sub_dept_list/";
    this.api.getData(url).then((res: any) => {
      this.SubDeptIdDataList = res;
      console.log("SubDepartment list=", this.SubDeptIdDataList)
      this.getUserList();
    });
  }


  getUserList(){
    //debugger;
    let url = "user_list/";
    this.api.getData(url).then((res: any) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.data = res.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.UserList = res.data;
        console.log("userlist",this.UserList);
        this.UserList?.forEach((element: any) => {
          this.DeptIdDataList?.forEach((val: any) => {
            if(element.dept_id == val.dept_id){
              element['departmentName'] = val.department;
            }
          });
        });

        this.UserList?.forEach((element: any) => {
          this.SubDeptIdDataList?.forEach((val: any) => {
            if(element.sub_dept_id == val.sub_dept_id){
              element['subDepartmentName'] = val.sub_department;
            }
          });
        });
  });
 }

public OnSuperUserStatusChecked(value:boolean)
{
  this.SuperUserStatus=value;
  console.log(this.SuperUserStatus);
}

public onActive(value:boolean)
{
  this.Active=value;
  console.log(this.Active);
}


deleteData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      console.log(data);
      this.resultList=data.records;
      this.getUserList();
     })
}

viewData(element:any)
{
  console.log(element);
  this.api.viewuser(this.url,element).then((data:any) => {
    this.ViewForm=true;
    this.ListForm=false;
    this.CreateForm=false;
    this.viewFormHeader = true;
    this.mainFormHeader = false;
    this.createFormHeader = false;
    this.viewRecords = data.records;
    console.log(1,this.viewRecords);
    this.getUserList();
   })
}

DatePickerChange()
{
  console.log("selected dob",this.DateOfBirth)
  // this.dateOfBirth = this.datePipe.transform(this.DateOfBirth, 'yyyy-MM-dd');
  this.DateOfBirth = this.datePipe.transform(this.DateOfBirth, 'yyyy-MM-dd');
  console.log("dob after converstion",this.DateOfBirth)
}

OnSuperUserStatusChanged(value:boolean)
{
  this.superUsername = value;
  console.log("superUserName=", this.superUsername)
}

onActiveChange(value:boolean)
{
  this.Active = value
  console.log("Active value=",this.Active)
}

Update(element: any)
{
  console.log("Previous data=",element)
  this.CreateForm = false;
  this.ListForm = false;
  this.mainFormHeader = false;
  this.EditForm = true;
  this.EditFormHeader = true;
  this.createFormHeader = false;
  this.Id=element.id;
  this.userName=element.username;
  this.employeeNo=element.employee_no;
  this.employeeName=element.employee_name;
  this.gender=element.gender;
  //this.DateOfBirth=element.DOB;
  this.DateOfBirth = element.dob
  this.deptCode=element.dept_code;
  //this.deptName=element.dept_name;
  this.designation=element.designation;
  this.location=element.location;
  // this.superUserStatus=element.is_superuser;
  this.superUsername=element.is_superuser;
  this.Active=element.is_active;
}

updateList()
{
  debugger;
  let data={ 
    'username':this.userName,
    'employee_no':this.employeeNo,
    'employee_name':this.employeeName,
    'gender':this.gender,
    'dob':this.DateOfBirth,
    'dept_code':this.deptCode,
    'dept_name':this.deptName,
    'designation':this.designation,
    'location':this.location,
    // 'is_superuser':this.SuperUserStatus,
    'is_superuser':this.superUsername,
    'is_active':this.Active,
    'id':this.Id,
  }
    console.log("Updated Data=",data)
    let url = "user_list/"+this.Id+"/";
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
            this.CreateForm = true;
            this.ListForm = true;
            this.mainFormHeader = true;
            this.EditForm = false;
            this.EditFormHeader = false;
            this.createFormHeader = true;
            this.getUserList();
        }
    })
  } 

setViewForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.mainFormHeader = true;
  this.createFormHeader = true;
  this.viewFormHeader = false;
  this.getUserList();
}

setEditForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
}

activeStatus(element: any){
  console.log(element);
  this.UID=element.id;
  this.ActiveStatus=element.is_active;
  console.log(this.UID,this.ActiveStatus);
  debugger;
  if(this.ActiveStatus==false){
      this.ActiveStatus=true;
  } else if(this.ActiveStatus==true){
      this.ActiveStatus=false;
  }
  let data={'is_active':this.ActiveStatus,'username':element.username}
  console.log(data)
  let url = "user_list/"+this.UID+"/";
  this.api.updateData(url,data).then(res => {
  console.log(res)
  this.toast.success("Record Updated Successfully!");
})
}

SuperStatus(element:any)
{
  console.log(element);
  this.UID=element.id;
  this.SuperUserStatus=element.is_superuser;
  console.log(this.UID,this.SuperUserStatus);
  debugger;
  if(this.SuperUserStatus==false){
      this.SuperUserStatus=true;
  } else if(this.SuperUserStatus==true){
      this.SuperUserStatus=false;
  }
  let data={'is_superuser':this.SuperUserStatus,'username':element.username,'id':this.UID}
  console.log(data)
  let url = "user_list/"+this.UID+"/";
  this.api.updateData(url,data).then(res => {
  console.log(res)
  this.toast.success("Record Updated Successfully!");
})
}

setEditFormPage()
{
  this.CreateForm = true;
  this.ListForm = true;
  this.mainFormHeader = true;
  this.EditForm = false;
  this.EditFormHeader = false;
  this.createFormHeader = true;
  this.getUserList();
}

openDialog()
{
  const dialogRef = this.dialog.open(CreateNewPage, {
    height: '70%',
    width: '70%',
    maxWidth:'100%',
    // data: {
    //       element: element
    //       }
  });
  dialogRef.afterClosed().subscribe(result => {
    this.getUserList();
  });
}

}

@Component({
  selector: 'createnewpage',
  templateUrl: 'CreateNewPage.html',
   styles: [`
    :host {
      width:'60%'
     
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class CreateNewPage {

  CreateForm:boolean=true;
  url = "user_list/";
  UserName:any="";
  Password:any="";
  EmployeeNo:any="";
  EmployeeName:any="";
  Gender: any="";
  hide:any;
  DOB=new UntypedFormControl(moment());
  DeptCode:any="";
  DeptName:any="";
  Designation:any="";
  Location:any="";
  SuperUserStatus:boolean=true;
  Active:boolean=true;
  resultList: any;
  dob:any="";
  ActiveStatus:boolean=true;
  UID: any;
  dept_ID:any="";
  sub_dept_ID:any="";
  DeptIdList:any="";
  SubDeptIdList=[];
  deptHead:any="";

  constructor(
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<CreateNewPage>,
    public toast:ToastrService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any)
    {
      this.departmentName();
    }

  departmentName(){
    let url = "user_dept_list/";
    this.apiService.getData(url).then((res: any) => {
      this.DeptIdList = res;
      console.log("Department list=", this.DeptIdList)
    });
  }

  onOptionsSelected(e)
  {
    console.log("the selected value is " , e);
    this.subDepartmentName(e)
  }
  

  subDepartmentName(e:any){
    let url = "user_sub_dept_list/getSubDeptIdList/";
    let data = {
      dept_id : e
    }
    this.apiService.postData(url, data).then((res: any) => {
      this.SubDeptIdList=res;
      let length = res.length
      console.log("Sub Department list=", this.SubDeptIdList)
      debugger;
      if(length == 0)
      {
        this.toast.error("Please add Sub Department for Selected Department Name");
      }
      })
  }

  createList()
{
  debugger;
  console.log(this.Gender);
  if(this.UserName=="")
{
  this.toast.error("Please Enter UserName");
}
else if(this.EmployeeNo=="")
{
  this.toast.error("Please Enter Employee Number");
}
else if(this.EmployeeName=="")
{
  this.toast.error("Please Enter Employee Name");
}
else if(this.Gender=="")
{
  this.toast.error("Please Select Gender");
}
else if(this.dob=="")
{
  this.toast.error("Please select Date of Birth");
}
else if(this.DeptCode=="")
{
  this.toast.error("Please Enter Department Code");
}
else if(this.dept_ID=="")
{
  this.toast.error("Please Select Department Name");
}
else if(this.deptHead=="")
{
  this.toast.error("Please Select Department Head Value");
}
else if(this.sub_dept_ID=="")
{
  this.toast.error("Please Select Sub Department Name");
}
else if(this.Designation=="")
{
  this.toast.error("Please Enter Designation");
}
else if(this.Location=="")
{
  this.toast.error("Please Enter Location");
}
else
{
  let data={ 
    'username':this.UserName,
    'employee_no':this.EmployeeNo,
    'employee_name':this.EmployeeName,
    // 'first_name':this.EmployeeName,
    'gender':this.Gender,
    'dob':this.dob,
    'dept_code':this.DeptCode,
    // 'dept_name':this.DeptName,
    'dept_id':this.dept_ID,
    'sub_dept_id':this.sub_dept_ID,
    'dept_head':this.deptHead,
    'designation':this.Designation,
    'location':this.Location,
    'is_superuser':this.SuperUserStatus,
    'is_active':this.Active,
  }
  let url = "user_list/";
  this.apiService.postData(url,data).then(res => {
    console.log(res)
    if(res == false)
    {
      this.toast.error("Value already exist in table");
    }
    else
    {
    this.toast.success("Record Successfully Inserted!");
    this.resultList=res;
    }
  })
}
this.dialogRef.close();
}

public onSuperUserStatusChecked(value:boolean)
{
  this.SuperUserStatus=value;
  console.log(this.SuperUserStatus);
}

public onActive(value:boolean)
{
  this.Active=value;
  console.log(this.Active);
}

genderSelect(val: any){
  this.Gender = val;
}

datePickerChange()
{
  this.dob = this.datePipe.transform(this.DOB.value, 'yyyy-MM-dd');
}

SuperStatus(element:any)
{
  console.log(element);
  this.UID=element.id;
  this.SuperUserStatus=element.is_superuser;
  console.log(this.UID,this.SuperUserStatus);
  debugger;
  if(this.SuperUserStatus==false){
      this.SuperUserStatus=true;
  } else if(this.SuperUserStatus==true){
      this.SuperUserStatus=false;
  }
  let data={'is_superuser':this.SuperUserStatus,'username':element.username,'id':this.UID}
  console.log(data)
  let url = "user_list/"+this.UID+"/";
  this.apiService.updateData(url,data).then(res => {
  console.log(res)
  this.toast.success("Record Updated Successfully!");
})
}

  dialogClose(){
    this.dialogRef.close();
  }

}



