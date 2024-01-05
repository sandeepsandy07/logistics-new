import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { E } from '@angular/cdk/keycodes';
import { StorageServiceService } from 'src/app/service-storage.service';

@Component({
  selector: 'app-module-master',
  templateUrl: './module-master.component.html',
  styleUrls: ['./module-master.component.css']
})
export class ModuleMasterComponent implements OnInit {
  ModuleName: any = "";
  ModuleSlug: any = "";
  Root: any = "";
  moduleId: any;
  EditFormData: any;
  module_name: any;EmpListData: any;
  moduleMasterList: any;

  moduleName: any="";
  moduleSlug: any="";
  root: any="";
  linkValue:any="";
  colorValue:any="";
  iconValue:any="";
  RootListData:any="";
  menuFlag:boolean;
  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  EditForm:boolean=false;
  MainFormHeader:boolean=true;

  UserRole: any;
  userRoleArr:any;

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','ModuleName','ModuleSlug','Root','Link','IconName','Color','CreatedBy', 'UpdatedBy','Action'];
  url = "logistics_module_master/";
  resultList: unknown;
  resultsLength: any;
  viewRecords: any;

  
  constructor(public api: ApiserviceService,public toast:ToastrService,public dialog: MatDialog,public storage:StorageServiceService) { }

  ngOnInit() {
    this.EmpName();
    this.getUserRole();
    //this.getRootValues();
  }

  applyFilter(event : Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  keyPressModuleName(event,Name)
  {
    console.log("san",Name);
    debugger;
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && (charCode < 32 || charCode > 32) && (charCode < 95 || charCode > 95))
    {
      event.preventDefault();
      this.toast.error(Name + " must be a Character Value, Numbers and Special Characters are not allowed.");
    }
    if(this.ModuleName.length >= 30)
    {
      this.toast.error(Name + " must be within 30 characters.");
        return false;
    }
    if(this.moduleName.length >= 30)
    {
      this.toast.error(Name + " must be within 30 characters.");
        return false;
    }

    if(this.ModuleSlug.length >= 30)
    {
      this.toast.error(Name + " must be within 30 characters.");
        return false;
    }
    if(this.moduleSlug.length >= 30)
    {
      this.toast.error(Name + " must be within 30 characters.");
        return false;
    }

    if(this.Root.length >= 30)
    {
      this.toast.error(Name + " must be within 30 characters.");
        return false;
    }
    if(this.root.length >= 30)
    {
      this.toast.error(Name + " must be within 30 characters.");
        return false;
    }

    else
    {
      return true;
    }
  }

  getModuleMasterList(){
    let url = "logistics_module_master/";
    this.api.getData(url).then((res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.data = res;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.resultsLength=res.length;
        console.log("ResultLength =",this.resultsLength)

        this.moduleMasterList=res;
      console.log(this.moduleMasterList);

      this.moduleMasterList?.forEach((element: any) => {
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
      this.getModuleMasterList();
    });
  }
  
  deleteData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      console.log(data);
      this.resultList=data.records;
      this.getModuleMasterList();
     })
}

viewData(element:any)
{
  console.log(element);
  this.api.viewuser(this.url,element).then((data:any) => {
    this.ViewForm=true;
    this.ListForm=false;
    this.MainFormHeader = false;
    this.CreateForm=false;
    this.viewRecords = data.records;
    this.getModuleMasterList();
   })
}

getRootValues()
  {
    let url = "logistics_module_master/getRootValueList/";
    let data = {
      root : "ROOT"
    }
    this.api.postData(url, data).then((res: any) => {
      this.RootListData=res;
      console.log(this.root);
      this.RootListData.forEach(element=>{
        if(this.root == element.module_id)
        {
          this.root = element.module_id;
          // element['isSelected'] = true;
        }
        // else
        // {
        //   element['isSelected'] = false;
        // }
      })
      let length = res.length
      console.log("Root Value list=", this.RootListData)
      })
  }

onMenuFlagStatusChecked(value:boolean)
{
  this.menuFlag=value;
  console.log(this.menuFlag);
}

update(element: any){
  this.getRootValues();
  console.log("element=",element)
  this.EditForm=true;
  this.ListForm=false;
  this.ViewForm=false;
  this.CreateForm=false;
  this.MainFormHeader=false;
  this.moduleId=element.module_id;
  console.log(this.moduleId);
  this.moduleName=element.module_name;
  console.log(this.moduleName);
  this.moduleSlug=element.module_slug;
  this.root=element.root;
  console.log("root value=",this.root);
  this.colorValue = element.m_color;
  this.linkValue = element.m_link;
  this.iconValue = element.m_icon_name;
  this.menuFlag = element.menu_flag;
}

updateList()
{
  if(this.moduleName=="")
  {
    this.toast.error("Please Enter Module Name.");
  }
  else if(this.moduleSlug=="")
  {
    this.toast.error("Please Enter Module Slug Value.")
  }
  else if(this.root=="")
  {
    this.toast.error("Please Enter Root Value.")
  }
  else if(this.colorValue=="")
  {
    this.toast.error("Please Enter Color Value.")
  }
  else if(this.iconValue=="")
  {
    this.toast.error("Please Enter Icon Name.")
  }
  else if(this.linkValue=="")
  {
    this.toast.error("Please Enter Link Value.")
  }
  else
  {
    let data={
      'module_name':this.moduleName, 
      'module_slug':this.moduleSlug,
      'root':this.root,
      'm_color':this.colorValue,
      'm_link':this.linkValue,
      'm_icon_name':this.iconValue,
      'module_id':this.moduleId,
      'menu_flag':this.menuFlag,
    }
      console.log(data)
      let url = "logistics_module_master/"+this.moduleId+"/";
      this.api.updateData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
        this.getModuleMasterList();
      })
  }
  this.EditForm=false;
  this.ListForm=true;
  this.ViewForm=false;
  this.CreateForm=true;
  this.MainFormHeader=true;
  } 

  setViewForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.MainFormHeader = true;
  this.getModuleMasterList();
}

setEditForm()
{
  this.ViewForm=false;
  this.ListForm=true;
  this.CreateForm=true;
  this.EditForm=false; 
  this.MainFormHeader=true;
  this.getModuleMasterList();
}

generatePackedPanelPdf()
{
  let url = "logistics_item_packing/box_code_filter_panel/"
  let data = {
    // box_code:"box-da_30-7633",
    box_code:"box-da_85-5321",
    da_id : 116
  }
  this.api.downloadPDF(url, data).then((data) => {
    var downloadURL = window.URL.createObjectURL(data);
    let tab = window.open();
    tab.location.href = downloadURL;
  });
}

generatePackedConsolidatePanelPdf()
{
  let url = "logistics_item_packing/box_code_filter_on_daID/"
  let data = {
    da_id : 30,
    status : "packed"
  }
  this.api.downloadPDF(url, data).then((data) => {
    var downloadURL = window.URL.createObjectURL(data);
    let tab = window.open();
    tab.location.href = downloadURL;
  });
}

generateLooseItemPdf()
{
  let url = "logistics_item_packing/box_code_filter_loose_supply/"
  let data = {
    box_code:"box-da_107-7622",
    da_id : 10
  }
  this.api.downloadPDF(url, data).then((data) => {
    var downloadURL = window.URL.createObjectURL(data);
    let tab = window.open();
    tab.location.href = downloadURL;
  });
}

generateConsolidateLooseItemPdf()
{
  let url = "logistics_item_packing/box_code_filter_loose_supply_on_DaId/"
  let data = {
    da_id : 3,
    mainBox : "True"
  }
  this.api.downloadPDF(url, data).then((data) => {
    var downloadURL = window.URL.createObjectURL(data);
    let tab = window.open();
    tab.location.href = downloadURL;
  });
}

generateDispatchCheckListPDF()
{
  let url = "panel_wise/get_panel_wise_dispatch_List/";
  let data = {
    da_id : 30,
  }
  this.api.downloadPDF(url, data).then((data) => {
    var downloadURL = window.URL.createObjectURL(data);
    let tab = window.open();
    tab.location.href = downloadURL;
  });
}

generateSinglePanelWisePdf()
{
  let url = "panel_wise/getPanel_List/";
  let data = {
    da_id : 116,
    panel_name: "HIS0258"
  }
  this.api.downloadPDF(url, data).then((data) => {
    var downloadURL = window.URL.createObjectURL(data);
    let tab = window.open();
    tab.location.href = downloadURL;
  });
}


openDialog()
{
  this.getRootValues();
  const dialogRef = this.dialog.open(CreateNewRecord, {
    height: '50%',
    width: '70%',
    maxWidth:'100%',
    // data: {
    //       element: element
    //       }
  });
  dialogRef.afterClosed().subscribe(result => {
  this.getModuleMasterList();
  });
}

getUserRole()
{
  console.log("session storage value for user role=",this.storage.getUserRole())
  this.UserRole = this.storage.getUserRole()
  console.log("User Roles=",this.UserRole)

    if(this.UserRole.find(e => e.module_slug_name === "module_master"))
    {
      let module_id_index=this.UserRole.indexOf(this.UserRole.find(e => e.module_slug_name === "module_master"))
      this.userRoleArr=this.UserRole[module_id_index];
    }
    if(this.userRoleArr == undefined)
    {
      this.userRoleArr=0;
    }
    console.log("UserRoleArr=",this.userRoleArr)
}

}


@Component({
  selector: 'createnewrecord',
  templateUrl: 'CreateNewRecord.html',
   styles: [`
    :host {
      width:'60%'
     
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class CreateNewRecord {

  CreateForm:boolean=true;
  url = "user_list/";
  ModuleName:any="";
  ModuleSlug:any="";
  Root:any="";
  RootList:any="";
  colorValue:any="";
  iconName:any="";
  link:any="";
  resultList:any="";
  SuperUserStatus:boolean=true;
  

  constructor(
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<CreateNewRecord>,
    public toast:ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any)
    {
      this.rootValues();
    }

public onSuperUserStatusChecked(value:boolean)
{
  this.SuperUserStatus=value;;
  console.log(this.SuperUserStatus);
}

  rootValues()
  {
    let url = "logistics_module_master/getRootValueList/";
    let data = {
      root : "ROOT"
    }
    this.apiService.postData(url, data).then((res: any) => {
      this.RootList=res;
      let length = res.length
      console.log("Root Value list=", this.RootList)
      })
  }

  createList()
  {
    if(this.ModuleName == "")
    {
      this.toast.error("Please Enter Module Name.");
    }
    else if(this.ModuleSlug=="")
    {
      this.toast.error("Please Enter Module Slug Value.")
    }
    else if(this.Root=="")
    {
      this.toast.error("Please Enter Root Value.")
    }
    else if(this.colorValue=="")
    {
      this.toast.error("Please Enter Color Value.")
    }
    else if(this.iconName=="")
    {
      this.toast.error("Please Enter Icon Name.")
    }
    else if(this.link=="")
    {
      this.toast.error("Please Enter Link Value.")
    }
    else
    {
      debugger;
      let data={
        'module_name':this.ModuleName,
        'module_slug':this.ModuleSlug,
        'root':this.Root,
        'm_color':this.colorValue,
        'm_link':this.link,
        'm_icon_name':this.iconName,
        'menu_flag':this.SuperUserStatus,
      }
      let url = "logistics_module_master/";
      this.apiService.postData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Successfully Inserted!");
        this.resultList=res;
      })
    }
    this.dialogRef.close();
  }

  dialogClose(){
    this.dialogRef.close();
  }

}


  



// generateLooseSupplyPdf()
// {
//   let url = "logistics_item_packing/box_code_filter/"
//   let data = {
    // da_id : this.passedDANo,
    //  da_id : 116,
    //  main_box : "True",
    //  status : "packed"
  //   box_code:"box-da_30-7633"
  // }

//   generateLooseSupplyPdf()
// {
//   let url = "logistics_item_packing/box_code_filter2/"
//   let data = {
//     box_code:"box-da_30-7633"
//   }
//   this.api.downloadPDF(url, data).then((data) => {
//     var downloadURL = window.URL.createObjectURL(data);
//     let tab = window.open();
//     tab.location.href = downloadURL;
//   });
// }

// generateConsolidateLooseItemPdf()
// {
//   let url = "logistics_item_packing/box_code_filter_loose_supply_on_DaId/"
//   let data = {
//     da_id : 30,
//     mainBox : "True"
//   }
//   this.api.downloadPDF(url, data).then((data) => {
//     var downloadURL = window.URL.createObjectURL(data);
//     let tab = window.open();
//     tab.location.href = downloadURL;
//   });
// }