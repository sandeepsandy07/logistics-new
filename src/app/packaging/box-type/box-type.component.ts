import { Component, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-box-type',
  templateUrl: './box-type.component.html',
  styleUrls: ['./box-type.component.css']
})
export class BoxTypeComponent implements OnInit {

  mainFormHeader:boolean=true;
  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  viewFormHeader:boolean=false;
  EditForm:boolean=false;
  editFormHeader:boolean=false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  BoxType:any="";
  boxType:any="";
  resultsLength:any="";
  boxTypeId:any="";

  boxTypeList:any="";
  url = "logistics_box_type/";

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','BoxType', 'CreatedBy', 'UpdatedBy','Action'];
  resultList: any="";
  EmpListData: any;
  viewRecords: any;

  constructor(public api: ApiserviceService,public toast:ToastrService) { }

  ngOnInit()
  {
    this.EmpName();
    this.getBoxTypeList();
  }

  applyFilter(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getBoxTypeList()
  {
    let url = "logistics_box_type/";
      this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.resultsLength=res.length;
      console.log("ResultLength =",this.resultsLength)

      this.boxTypeList=res;
      console.log(this.boxTypeList);

      this.boxTypeList?.forEach((element: any) => {
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
      console.log(this.EmpListData);
      this.getBoxTypeList();
    });
  }

  createList()
  {
    if(this.BoxType == ""){
      this.toast.error("Please Enter Box Type Value");
      }
    else
    {
      let data={
        'boxType':this.BoxType
      }
      console.log(data)
      let url = "logistics_box_type/";
      this.api.postData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Successfully Inserted!");
        this.resultList=res;
        this.resultsLength = this.resultList.length;
        this.getBoxTypeList();
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
      this.getBoxTypeList();
     })
  }
 
  viewData(element:any)
  {
    console.log(element);
    this.api.viewuser(this.url,element).then((data:any) => {
      this.ViewForm=true;
      this.viewFormHeader=true;
      this.ListForm=false;
      this.CreateForm=false;
      this.mainFormHeader = false;
      this.viewRecords = data.records;
      console.log(this.viewRecords);
      this.getBoxTypeList();
     })
  }

  setViewForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.mainFormHeader=true;
  this.viewFormHeader=false;
  this.editFormHeader = false;
  this.getBoxTypeList();

}

setEditForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.mainFormHeader=true;
  this.viewFormHeader=false;
  this.editFormHeader = false;
  this.EditForm=false;
  this.getBoxTypeList();
}

update(element:any)
{
  this.EditForm=true;
  this.editFormHeader=true;
  this.ListForm=false;
  this.ViewForm=false;
  this.CreateForm=false;
  this.mainFormHeader=false;
  this.boxTypeId = element.boxTypeId;
  this.boxType=element.boxType;
}

updateList()
{
  if(this.boxType=="")
  {
    this.toast.error("Please Enter Box Type");
  }
  else
  {
    let data={
      'boxType':this.boxType,
    }
      console.log(data)
      let url = "logistics_box_type/"+this.boxTypeId+"/";
      this.api.updateData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
        this.getBoxTypeList();
        this.ViewForm=false;
        this.ListForm=true;
        this.CreateForm=true;
        this.mainFormHeader=true;
        this.viewFormHeader=false;
        this.editFormHeader = false;
        this.EditForm=false;
      })
  }
}

}
