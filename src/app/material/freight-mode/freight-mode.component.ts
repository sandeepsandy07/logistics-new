import { Component, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-freight-mode',
  templateUrl: './freight-mode.component.html',
  styleUrls: ['./freight-mode.component.css']
})
export class FreightModeComponent implements OnInit {

  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  EditForm:boolean=false;
  MainFormHeader:boolean=true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  FreightModeName:any="";
  resultList: any;

  url = "logistics_freight_mode/";
  viewRecords: any;
  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','FreightModeName', 'CreatedBy', 'UpdatedBy','Action'];
  resultsLength: any;
  freightModeList: any;
  EmpListData: any;
  freightModeId: any;
  freightModeName: any="";
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
  if(this.FreightModeName == ""){
    this.toast.error("Please Enter Freight Mode Name");
    }
  else
  {
    let data={
      'freight_name':this.FreightModeName
    }
    console.log(data)
    let url = "logistics_freight_mode/";
    this.api.postData(url,data).then(res => {
      console.log(res)
      this.toast.success("Record Successfully Inserted!");
      this.resultList=res;
      this.getFreightModeList();
      this.FreightModeName = "";
    })
  }
}

getFreightModeList(){
  let url = "logistics_freight_mode/";
  this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(res);
      this.resultsLength=res.length;
      console.log("ResultLength =",this.resultsLength)

      this.freightModeList=res;

      this.freightModeList?.forEach((element: any) => {
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
    this.getFreightModeList();
  });
}

deleteData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      this.resultList=data.records;
      this.getFreightModeList();
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
    this.getFreightModeList();
   })
}

update(element: any){
  this.EditForm=true;
  this.ListForm=false;
  this.ViewForm=false;
  this.CreateForm=false;
  this.MainFormHeader = false;
  this.freightModeId = element.freight_mode_id;
  this.freightModeName=element.freight_name;
}

updateList()
{
  if(this.freightModeName=="")
  {
    this.toast.error("Please Enter Freight Mode Name");
  }
  else
  {
    let data={
      'freight_name':this.freightModeName
    }
      console.log(data)
      let url = "logistics_freight_mode/"+this.freightModeId+"/";
      this.api.updateData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
        this.getFreightModeList();
        this.EditForm=false;
        this.ListForm=true;
        this.ViewForm=false;
        this.CreateForm=true;
        this.MainFormHeader=true;
      })
  }
}

}
