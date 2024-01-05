import { Component, OnInit } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import {UntypedFormGroup, UntypedFormBuilder, Validators, FormArray} from '@angular/forms';

@Component({
  selector: 'app-loose-item-verification',
  templateUrl: './loose-item-verification.component.html',
  styleUrls: ['./loose-item-verification.component.css']
})
export class LooseItemVerificationComponent implements OnInit {

  panelWiseArray=[];
  public checkedQty : any = {};
  public remarks:any={};
  public checked:any={};
  pendingQty:any;
  pending:number=4;


  public qty=[];
  v=[];
  r=[];
  count:number=0;


  ListForm:boolean=true;
  Remarks:any;
  //checkedQty:any;
  //remarks:any;
  quantity:any;

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['SLNo.','ItemID','Item Description','TotalQty','PendingQty','Verify','Checked Qty','Remarks'];
  url = "logistics_looseItems_verification/";
  status: any;
  ID: any;
  Status:boolean = true;
  EmpListData: any;
  itemList: any;
  PanelList: any;

  itemForm !: UntypedFormGroup;
  resultList: unknown;

  constructor(public api: ApiserviceService,public toast:ToastrService, private formBuilder:UntypedFormBuilder) { }

  ngOnInit(){
    this.getPanelWiseList();
  }

  setCheckbox(i)
  {
    console.log("i=",i);
    this.checked[i] = true;
    this.count=this.count+1
  }
  
  submitData()
  {
    console.log(this.checkedQty)

    this.itemList?.forEach((element: any) => {
      if(element.qty != null ){
        this.pending = element.qty;
      }
    })

      this.qty=this.checkedQty;
      this.r=this.remarks;
      this.v=this.checked;
      
    for(var counter:number =0; counter<this.count; counter++){
      if(this.qty[counter]>this.pending)
      {
        this.toast.error("checked quantity should be less than quantity")
      }
      else
      {
        let records = {
          'quantity':this.qty[counter],
          'remarks':this.r[counter],
          'verify':this.v[counter],
          'pending_qty':this.pending - this.qty[counter]
        }
        console.log("records=",records)
        let url = "logistics_looseItems_verification/";
      this.api.postData(url,records).then(res => {
        console.log(res)
        this.toast.success("Record Successfully Inserted!");
        this.resultList=res;
      })
    } 
   } 
  }

  getPanelWiseList()
  {
    let url = "panel_wise/getPanelLooseSupply/";
    this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      console.log(res)
    }); 
  }

  getItemList(){
    let url = "logistics_looseItems_verification/";
      this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      console.log(res);

      this.itemList=res;

      this.itemList?.forEach((element: any) => {
        this.EmpListData?.forEach((val: any) => {
          if(element.created_by == val.id){
            element['created_by'] = val.employee_name;
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
    this.getItemList();
  });
}

}

//https://stackoverflow.com/questions/52035460/accessing-input-fields-inside-angular-material-table
//https://www.c-sharpcorner.com/article/angular-7-multiple-data-save-using-formgroup-formarray/

// ngOnInit(){
//   //this.EmpName();
//   this.getPanelWiseList();
//   // this.itemForm = this.formBuilder.group({   //here our form is ready.we have initialized form then we have to bind this form on UI
//   //           checkedQty : [''],
//   //           remarks : ['']
//   // })
// }

// get itemFormGroups () {
  //   return this.itemForm.get('items') as FormArray
  // }

  // submitData(element:any,remarks:any)
//  {
//    debugger;
//    this.ID=element.id;
//    let values={'remarks':remarks}
//    console.log("values=",values)
//    let url = "logistics_looseItems_verification/"+this.ID+"/";
//     this.api.updateData(url,values).then(res => {
//     console.log(res)
//     this.toast.success("Remarks Added Successfully!");
// })
// }

// let data={
      // 'quantity':this.checkedQty,
      // 'remarks':this.remarks,
      // 'verify':this.checked
      //}

//       StatusUpdate(element:any)
//   {
//     console.log(element);
//     this.ID=element.id;
//     this.Status=element.status;
//     console.log(this.ID,this.Status);
//     debugger;
//     if(this.Status==false){
//         this.Status=true;
//     } else if(this.Status==true){
//         this.Status=false;
//     }
//     let data={'status':this.Status}
//     console.log(data)
//     let url = "logistics_looseItems_verification/"+this.ID+"/";
//     this.api.updateData(url,data).then(res => {
//     console.log(res)
//     //this.toast.success("Record Updated Successfully!");
// })
// }


// statusSelect(val: any){
  
// }

// deleteData(val:any)
// {

// }