import { Component, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-box-size',
  templateUrl: './box-size.component.html',
  styleUrls: ['./box-size.component.css']
})
export class BoxSizeComponent implements OnInit {


  mainFormHeader:boolean=true;
  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  viewFormHeader:boolean=false;
  EditForm:boolean=false;
  editFormHeader:boolean=false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  BoxSize:any="";
  BoxDescription:any="";
  boxSize:any="";
  boxDescription:any="";
  resultsLength:any="";
  boxId:any="";
  public BoxTypeId:any="";
  public boxTypeID:any="";
  BoxTypeIdList:any="";

  boxSizeList:any="";
  url = "logistics_box_size/";

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','BoxSize','BoxDescription','BoxType', 'CreatedBy', 'UpdatedBy','Action'];
  resultList: any="";
  EmpListData: any;
  viewRecords: any;

  constructor(public api: ApiserviceService,public toast:ToastrService) { }

  ngOnInit()
  {
    this.EmpName();
    this.BoxTypeIdlist();
    this.getBoxSizeList();
  }

  applyFilter(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  BoxTypeIdlist()
  {
    let url = "logistics_box_type/";
    this.api.getData(url).then(res => {
      this.BoxTypeIdList=res;
      this.getBoxSizeList();
    })
  }

  getBoxSizeList()
  {
    let url = "logistics_box_size/";
      this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.resultsLength=res.length;
      console.log("ResultLength =",this.resultsLength)

      this.boxSizeList=res;
      console.log(this.boxSizeList);

      this.boxSizeList?.forEach((element: any) => {
        this.EmpListData?.forEach((val: any) => {
          if(element.created_by == val.id){
            element['created_by'] = val.employee_name;
          }
          if(element.updated_by == val.id){
            
            element['updated_by']=val.employee_name;
          }
        });
      });

      this.boxSizeList?.forEach((element: any) => {
        this.BoxTypeIdList?.forEach((val: any) => {
          if(element.boxTypeId == val.boxTypeId){
            element['boxTypeName'] = val.boxType;
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
      this.getBoxSizeList();
    });
  }

  createList()
  {
    debugger;
    if(this.BoxSize == ""){
      this.toast.error("Please Enter Box Size Value");
      }
    else if(this.BoxDescription == "")
    {
      this.toast.error("Please Enter Box Description Value")
    }
    else if(this.BoxTypeId == "")
    {
      this.toast.error("Please Select Box Type")
    }
    else
    {
      debugger;
      let data={
        'boxSize':this.BoxSize,
        'boxDescription':this.BoxDescription,
        'boxTypeId':this.BoxTypeId
      }
      console.log(data)
      let url = "logistics_box_size/";
      this.api.postData(url,data).then(res => {
        console.log(res)
        debugger;
        if(res == false)
        {
          this.toast.error("Value already exist in table");
        }
        else
        {
          this.toast.success("Record Successfully Inserted!");
          this.resultList=res;
          this.resultsLength = this.resultList.length;
          this.getBoxSizeList();
          this.BoxSize="";
          this.BoxDescription="";
          this.BoxTypeId = "";
        }
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
      this.getBoxSizeList();
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
      this.getBoxSizeList();
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
  this.getBoxSizeList();
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
  this.getBoxSizeList();
}

update(element:any)
{
  console.log("element=",element)
  this.EditForm=true;
  this.editFormHeader=true;
  this.ListForm=false;
  this.ViewForm=false;
  this.CreateForm=false;
  this.mainFormHeader=false;
  this.boxId = element.boxId;
  this.boxSize=element.boxSize;
  this.boxDescription=element.boxDescription;
  this.boxTypeID = element.boxTypeId;
}

updateList()
{debugger;
  if(this.boxSize=="")
  {
    this.toast.error("Please Enter Box Size");
  }
  else if(this.boxDescription == "")
  {
    this.toast.error("Please Enter Box Description Value")
  }
  else if(this.boxTypeID == null)
  {
    this.toast.error("Please Select Box Type")
  }
  else
  {
    let data={
      'boxSize':this.boxSize,
      'boxDescription':this.boxDescription,
      'boxTypeId':this.boxTypeID,
      'boxId':this.boxId
    }
      console.log(data)
      let url = "logistics_box_size/"+this.boxId+"/";
      this.api.updateData(url,data).then(res => {
        console.log(res)
        debugger;
        if(res == false)
        {
          this.toast.error("Value already exist in table");
        }
        else
        {
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
        this.getBoxSizeList();
        this.ViewForm=false;
        this.ListForm=true;
        this.CreateForm=true;
        this.mainFormHeader=true;
        this.viewFormHeader=false;
        this.editFormHeader = false;
        this.EditForm=false;
      }
      })
  }
}
}
