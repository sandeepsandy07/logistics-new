import { Component, OnInit } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transportation',
  templateUrl: './transportation.component.html',
  styleUrls: ['./transportation.component.css']
})
export class TransportationComponent implements OnInit {

  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  EditForm:boolean=false;
  EmpListData: any;
  TruckName:any="";
  url = "logistics_tracking_transportations/";
  TransportationsName: any = [];


  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','TransportationName', 'CreatedBy', 'UpdatedBy','View','Edit','Delete'];
  resultsLength: any;
  
  resultList: unknown;
  viewRecords: any;
  transportationID: any;
  TransportationName:any="";
  transportationName:any="";
  transportationList: any;

  constructor(public api: ApiserviceService,public toast:ToastrService) { }

  ngOnInit(){
    this.EmpName();
  }

  searchFilter()
  {
    return this.TransportationsName.filter((option:any) => option.toString().indexOf(this.TransportationName) === 0) || this.TransportationsName;
  }
  searchFilter2()
  {
    return this.TransportationsName.filter((option:any) => option.toString().indexOf(this.transportationName) === 0) || this.TransportationsName;
  }
  getTransportationList()
  {
    let url = "logistics_tracking_transportations";
    this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.resultsLength=res.length;
      console.log("ResultLength =",this.resultsLength)

      this.transportationList=res;
      console.log(this.transportationList);

      this.transportationList?.forEach((element: any) => {
        this.TransportationsName.push(element.transportationName);
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
      this.getTransportationList();
    });
  }

  createList()
  {
    if(this.TransportationName == ""){
      this.toast.error("Please Enter Transportation Name");
      }
    else
    {
      let data={
        'transportationName':this.TransportationName
      }
      console.log(data)
      let url = "logistics_tracking_transportations/";
      this.api.postData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Successfully Inserted!");
        this.resultList=res;
        this.getTransportationList();
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
      this.getTransportationList();
     })
  }
  update(element:any)
  {
    this.EditForm=true;
    this.ListForm=false;
    this.ViewForm=false;
    this.CreateForm=false;
    this.transportationID = element.transportationId;
    this.transportationName=element.transportationName;
  }
  deleteData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      console.log(data);
      this.resultList=data.records;
      this.getTransportationList();
     })
}
  setViewForm()
  {
    this.ViewForm=false;
    this.ListForm=true;
    this.CreateForm=true;
    this.getTransportationList();
  }
  setEditForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.EditForm=false; 
  this.getTransportationList();
}

updateList()
{
  if(this.transportationName=="")
  {
    this.toast.error("Please Enter Transportation Name");
  }
  else
  {
    let data={
      'transportationName':this.transportationName
    }
      console.log(data)
      let url = "logistics_tracking_transportations/"+this.transportationID+"/";
      this.api.updateData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Updated Successfully!");
        //alert("Record Updated Successfully");
        this.resultList=res;
        this.getTransportationList();
      })
  }
} 

}
