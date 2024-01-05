import { Component, OnInit, ViewChild } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-license-type',
  templateUrl: './license-type.component.html',
  styleUrls: ['./license-type.component.css']
})
export class LicenseTypeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  MainFormHeader:boolean=true;
  CreateForm:boolean=true;
  ListForm:boolean=true;
  ViewForm:boolean=false;
  EditForm:boolean=false;

  LicenseTypeName:any="";
  resultList: unknown;
  url = "logistics_license_type/";
  viewRecords: any;
  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['Sl.no.','LicenseTypeName', 'CreatedBy', 'UpdatedBy','Action'];
  resultsLength: any;
  licenseTypeList: any;
  EmpListData: any;
  licenseTypeId: any;
  licenseTypeName: any="";

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
  if(this.LicenseTypeName == ""){
    this.toast.error("Please Enter License Type Name");
    }
  else
  {
    let data={
      'license_type_name':this.LicenseTypeName
    }
    console.log(data)
    let url = "logistics_license_type/";
    this.api.postData(url,data).then(res => {
      console.log(res)
      this.toast.success("Record Successfully Inserted!");
      this.resultList=res;
      this.getLicenseTypeList();
      this.LicenseTypeName = "";
    })
  }
}

getLicenseTypeList(){
  let url = "logistics_license_type/";
  this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(res);
      this.resultsLength=res.length;
      console.log("ResultLength =",this.resultsLength)

      this.licenseTypeList=res;

      this.licenseTypeList?.forEach((element: any) => {
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
    this.getLicenseTypeList();
  });
}

deleteData(element:any)
  {
    console.log(element);
    this.api.deleteUser(element,this.url).subscribe((data:any) =>
     {
      this.toast.success("Deleted");
      this.resultList=data.records;
      this.getLicenseTypeList();
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
    this.getLicenseTypeList();
   })
}

update(element: any){
  this.EditForm=true;
  this.ListForm=false;
  this.ViewForm=false;
  this.CreateForm=false;
  this.MainFormHeader = false;
  this.licenseTypeId = element.license_type_id;
  this.licenseTypeName=element.license_type_name;
}

updateList()
{
  if(this.licenseTypeName=="")
  {
    this.toast.error("Please Enter License Type Name");
  }
  else
  {
    let data={
      'license_type_name':this.licenseTypeName
    }
      console.log(data)
      let url = "logistics_license_type/"+this.licenseTypeId+"/";
      this.api.updateData(url,data).then(res => {
        console.log(res)
        this.toast.success("Record Updated Successfully!");
        this.resultList=res;
        this.getLicenseTypeList();
        this.EditForm=false;
        this.ListForm=true;
        this.ViewForm=false;
        this.CreateForm=true;
        this.MainFormHeader=true;
        
      })
  }
}

}












//import { Component, OnInit } from '@angular/core';
//import { ToastrService } from 'ngx-toastr'; 
// import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 

// @Component({
//   selector: 'app-material',
//   templateUrl: './material.component.html',
//   styleUrls: ['./material.component.scss']
// })

// export class MaterialComponent implements OnInit {
//   public addmore!: FormGroup;
  
//   constructor(private toastr: ToastrService, private _fb:FormBuilder,public dialogRef:MatDialogRef<MaterialComponent>,
//     @Inject(MAT_DIALOG_DATA) public editData:any) { }
  
//   ngOnInit(){  
//     console.log("editData",this.editData)
//     this.addmore=this._fb.group({
//       title:[''],
//       type:[''],
//       description:[''],
//       itemRows: this._fb.array([this.initItemRows()])
//     });   
//   }  

//   get formArr()
//   {
//     return this.addmore.get('itemRows') as FormArray;
//   }
//   get f()
//   {
//     return this.addmore.controls;
//   }
//   initItemRows()
//   {
//     return this._fb.group({
//       task:[''],
//       timeRange:[''],
//       status:[''],
//       client:[''],
//       assignTo:[''],
//       qa:[''],
//       test:[''],
//       learn:[''],
//       description:[''],
//       suggestion:['']
//     });
//   }

//   addNewRow()
//   {
//     this.formArr.push(this.initItemRows());
//   }

//   deleteRow(index:number)
//   {
//     this.formArr.removeAt(index);
//   }

//   OnSubmit()
//   {
//     console.log(this.addmore);
//     if(this.addmore.invalid)
//     {
//       return;
//     }
//     this.dialogRef.close(this.addmore.value);
//   }

//   addForm(addForm:any)
//   {
//     throw new Error('method not implemented.')
//   }


// }
// // https://stackblitz.com/edit/dynamically-add-rows-gk4veg?file=app%2Fapp.component.ts