import { Component, OnInit } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-module-work-flow',
  templateUrl: './module-work-flow.component.html',
  styleUrls: ['./module-work-flow.component.css']
})
export class ModuleWorkFlowComponent implements OnInit {

  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  EditForm:boolean=false;
  url = "module_work_flow/";
  moduleId:any="";
  ModuleIdList:any;
  wfId:any="";
  WorkFlowIdList:any;
  resultList: unknown;

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','ModuleName','WorkFlowTypeName', 'CreatedBy', 'UpdatedBy','View','Edit','Delete'];
  resultsLength: any;
  ModuleWorkFlowList: any;
  EmpListData: any;
  viewRecords: any;
  mwf_id: any;
  ModuleId: any;
  WfId: any;
  moduleListData: any;
  workFlowTypeListData: any;

  module_id:any;
  wf_id:any;

  constructor(public api: ApiserviceService,public toast:ToastrService) { }

  ngOnInit(){
    this.getWorkFlowIDList();
    this.getModuleIdList();
    this.EmpName();
    this.moduleName();
    this.WorkFlowTypeName();
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
  createList()
  {
    if(this.moduleId =="")
    {
        this.toast.error("Please Select Module Name");
    }
    else if(this.wfId=="")
    {
      this.toast.error("Please Select Workflow Type");
    }
    else
    {
      let data={
        'module_id':this.moduleId,
        'wf_id':this.wfId,
      }
      let url="module_work_flow/";
      this.api.postData(url,data).then(res => {
        this.toast.success("Record Successfully Inserted!");
        this.resultList=res;
        this.getModuleWorkFlowList();
      })
    }
  }
  getWorkFlowIDList()
  {
    let url = "work_flow_type/";
    this.api.getData(url).then(res => {
      this.WorkFlowIdList=res;
    })
  }
  getModuleIdList()
  {
    let url = "logistics_module_master/";
    this.api.getData(url).then(res => {
      this.ModuleIdList=res;
    })
  }
  getModuleWorkFlowList(){
    let url = "module_work_flow/";
    this.api.getData(url).then((res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.data = res;
        this.resultsLength=res.length;
        console.log("ResultLength =",this.resultsLength)
  
        this.ModuleWorkFlowList=res;

        this.ModuleWorkFlowList?.forEach((element:any)=>{
          this.moduleListData?.forEach((val:any)=>{
            if(element.module_id==val.module_id){
              element['module_name']=val.module_name;
            }
          });
        });

        this.ModuleWorkFlowList?.forEach((element:any)=>{
          this.workFlowTypeListData?.forEach((val:any)=>{
            if(element.wf_id==val.wf_id){
              element['wf_name']=val.wf_name;
            }
          });
        });

  
        this.ModuleWorkFlowList?.forEach((element: any) => {
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
  deleteData(element:any)
  {
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      this.resultList=data.records;
      this.getModuleWorkFlowList();
     })
}
viewData(element:any)
{
  console.log(element);
  this.api.viewuser(this.url,element).then((data:any) => {
    this.ViewForm=true;
    this.ListForm=false;
    this.CreateForm=false;
    this.viewRecords = data.records;
    this.getModuleWorkFlowList();
   })
}
update(element: any){
  this.EditForm=true;
  this.ListForm=false;
  this.ViewForm=false;
  this.CreateForm=false;
  this.mwf_id = element.mwf_id;
  this.module_id = element.module_id;
  this.wf_id = element.wf_id;
}

updateList()
{
  if(this.module_id=="")
  {
    this.toast.error("Please Select Module Name");
  }
  else if(this.wf_id=="")
  {
    this.toast.error("Please Select WorkFlow Type");
  }
  else
  {
    let data={
      'module_id':this.module_id,
      'wf_id':this.wf_id
    }
      let url = "module_work_flow/"+this.mwf_id+"/";
      this.api.updateData(url,data).then(res => {
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
        this.getModuleWorkFlowList();
      })
  }
} 

  EmpName(){
    let url = "user_list/";
    this.api.getData(url).then((res: any) => {
      this.EmpListData = res.data;
      this.getModuleWorkFlowList();
    });
  }
  moduleName(){
    let url = "logistics_module_master/";
    this.api.getData(url).then((res: any) => {
      this.moduleListData = res;
      this.getModuleWorkFlowList();
    });
  }
  WorkFlowTypeName(){
    let url = "work_flow_type/";
    this.api.getData(url).then((res: any) => {
      this.workFlowTypeListData = res;
      this.getModuleWorkFlowList();
    });
  }
}
