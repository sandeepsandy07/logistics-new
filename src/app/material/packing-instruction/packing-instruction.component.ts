import { Component, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-packing-instruction',
  templateUrl: './packing-instruction.component.html',
  styleUrls: ['./packing-instruction.component.css']
})
export class PackingInstructionComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  EditForm:boolean=false;
  MainFormHeader:boolean=true;

  PackingInstructionName:any="";
  resultList: unknown;

  url = "logistics_packing_instruction/";
  viewRecords: any;
  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','PackingInstructionName', 'CreatedBy', 'UpdatedBy','Action'];
  resultsLength: any;
  packingInstructionList: any;
  EmpListData: any;
  packingInstructionId: any;
  packingInstructionName: any="";

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
  if(this.PackingInstructionName == ""){
    this.toast.error("Please Enter Packing Instruction Name");
    }
  else
  {
    let data={
      'packing_instruction_name':this.PackingInstructionName
    }
    console.log(data)
    let url = "logistics_packing_instruction/";
    this.api.postData(url,data).then(res => {
      console.log(res)
      this.toast.success("Record Successfully Inserted!");
      this.resultList=res;
      this.getPackingInstructionList();
      this.packingInstructionName = "";
    })
  }
}

getPackingInstructionList(){
  let url = "logistics_packing_instruction/";
  this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(res);
      this.resultsLength=res.length;
      console.log("ResultLength =",this.resultsLength)

      this.packingInstructionList=res;

      this.packingInstructionList?.forEach((element: any) => {
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
    this.getPackingInstructionList();
  });
}

deleteData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      this.resultList=data.records;
      this.getPackingInstructionList();
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
    this.getPackingInstructionList();
   })
}

update(element: any){
  this.EditForm=true;
  this.ListForm=false;
  this.ViewForm=false;
  this.CreateForm=false;
  this.MainFormHeader = false;
  this.packingInstructionId = element.packing_instruction_id;
  this.packingInstructionName = element.packing_instruction_name;
}

updateList()
{
  if(this.packingInstructionName == "")
  {
    this.toast.error("Please Enter Packing Instruction Name");
  }
  else
  {
    let data={
      'packing_instruction_name':this.packingInstructionName
    }
      console.log(data)
      let url = "logistics_packing_instruction/"+this.packingInstructionId+"/";
      this.api.updateData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
        this.getPackingInstructionList();
        this.EditForm=false;
        this.ListForm=true;
        this.ViewForm=false;
        this.CreateForm=true;
        this.MainFormHeader=true;
      })
  }
}

}
