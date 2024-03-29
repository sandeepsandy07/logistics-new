import { Component, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-dispatch-mode',
  templateUrl: './dispatch-mode.component.html',
  styleUrls: ['./dispatch-mode.component.css']
})
export class DispatchModeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  EditForm:boolean=false;
  MainFormHeader:boolean=true;

  DispatchModeName:any="";
  resultList: unknown;

  url = "logistics_dispatch_mode/";
  viewRecords: any;
  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','DispatchModeName', 'CreatedBy', 'UpdatedBy','Action'];
  resultsLength: any;
  dispatchModeList: any;
  EmpListData: any;
  dmId: any;
  dmName: any="";

  constructor(public api: ApiserviceService,public toast:ToastrService) { }

  ngOnInit(){
    this.EmpName();
  }

  applyFilter(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

createList()
{
  if(this.DispatchModeName == ""){
    this.toast.error("Please Enter Dispatch Mode Name");
    }
  else
  {
    let data={
      'dm_name':this.DispatchModeName
    }
    console.log(data)
    let url = "logistics_dispatch_mode/";
    this.api.postData(url,data).then(res => {
      console.log(res)
      this.toast.success("Record Successfully Inserted!");
      this.resultList=res;
      this.getDispatchModeList();
      this.DispatchModeName = "";
    })
  }
}

getDispatchModeList(){
  let url = "logistics_dispatch_mode/";
  this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(res);
      this.resultsLength=res.length;
      console.log("ResultLength =",this.resultsLength)

      this.dispatchModeList=res;

      this.dispatchModeList?.forEach((element: any) => {
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

EmpName(){
  let url = "user_list/";
  this.api.getData(url).then((res: any) => {
    this.EmpListData = res.data;
    console.log(res);
    this.getDispatchModeList();
  });
}

deleteData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      this.resultList=data.records;
      this.getDispatchModeList();
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
    this.getDispatchModeList();
   })
}

update(element: any){
  this.EditForm=true;
  this.ListForm=false;
  this.ViewForm=false;
  this.CreateForm=false;
  this.MainFormHeader = false;
  this.dmId = element.dm_id;
  this.dmName=element.dm_name;
}

updateList()
{
  if(this.dmName=="")
  {
    this.toast.error("Please Enter Dispatch Mode Name");
  }
  else
  {
    let data={
      'dm_name':this.dmName
    }
      console.log(data)
      let url = "logistics_dispatch_mode/"+this.dmId+"/";
      this.api.updateData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
        this.getDispatchModeList();
        this.EditForm=false;
        this.ListForm=true;
        this.ViewForm=false;
        this.CreateForm=true;
        this.MainFormHeader=true;
      })
  }
}

}
