import { Component, OnInit , ViewChild} from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { StorageServiceService } from 'src/app/service-storage.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.css']
})
export class DestinationComponent implements OnInit {

  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  EditForm:boolean=false;
  editFormHeader:boolean = false;
  mainFormHeader:boolean = true;
  EmpListData: any;
  DestinationName:any="";
  url = "logistics_destinations/";

  UserRole: any;
  userRoleArr:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','DestinationName', 'CreatedBy', 'UpdatedBy','Action'];
  resultsLength: any;
  destinationList: any;
  resultList: unknown;
  viewRecords: any;
  destinationID: any;
  destinationName: any;
  DestinationID: any;
  DestinationsName: any = [];
  

  constructor(public api: ApiserviceService,public toast:ToastrService,public storage:StorageServiceService) { }

  ngOnInit() {
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

    if(this.UserRole.find(e => e.module_slug_name === "destination_add"))
    {
      let module_id_index=this.UserRole.indexOf(this.UserRole.find(e => e.module_slug_name === "destination_add"))
      this.userRoleArr=this.UserRole[module_id_index];
    }
    if(this.userRoleArr == undefined)
    {
      this.userRoleArr=0;
    }
    console.log("UserRoleArr=",this.userRoleArr)
}

  getDestinationList()
  {
    let url = "logistics_destinations/";
    this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.resultsLength=res.length;
      console.log("ResultLength =",this.resultsLength)

      this.destinationList=res;
      console.log(this.destinationList);

      this.destinationList?.forEach((element: any) => {
        this.DestinationsName.push(element.destinationName);
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
      this.getDestinationList();
    });
  }

  searchFilter()
  {
    return this.DestinationsName.filter((option:any) => option.toString().indexOf(this.DestinationName) === 0) || this.DestinationsName;
  }
  searchFilter2()
  {
    return this.DestinationsName.filter((option:any) => option.toString().indexOf(this.destinationName) === 0) || this.DestinationsName;
  }

  createList()
  {
    if(this.DestinationName == ""){
      this.toast.error("Please Enter Destination Name");
      }
    else
    {
      let data={
        'destinationName':this.DestinationName
      }
      console.log(data)
      let url = "logistics_destinations/";
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
        this.getDestinationList();
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
      this.getDestinationList();
     })
  }
  update(element:any)
  {
    this.EditForm=true;
    this.ListForm=false;
    this.ViewForm=false;
    this.CreateForm=false;
    this.mainFormHeader = false;
    this.editFormHeader = true;
    this.DestinationID = element.destinationId;
    this.destinationName=element.destinationName;
  }
  deleteData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      console.log(data);
      this.resultList=data.records;
      this.getDestinationList();
     })
}
  setViewForm()
  {
    this.ViewForm=false;
    this.ListForm=true;
    this.CreateForm=true;
    this.mainFormHeader = true;
    this.getDestinationList();
  }
  setEditForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.EditForm=false;
  this.mainFormHeader = true;
  this.editFormHeader = false;
  this.getDestinationList(); 
}

updateList()
{
  if(this.destinationName=="")
  {
    this.toast.error("Please Enter Destination Name");
  }
  else
  {
    let data={
      'destinationName':this.destinationName,
      'destinationId':this.DestinationID
    }
      console.log(data)
      let url = "logistics_destinations/"+this.DestinationID+"/";
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
        this.getDestinationList();
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
