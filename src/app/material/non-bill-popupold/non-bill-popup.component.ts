import { Component, Inject, OnInit } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EventEmitterService } from 'src/app/event-emitter.service';

@Component({
  selector: 'app-non-bill-popup',
  templateUrl: './non-bill-popup.component.html',
  styleUrls: ['./non-bill-popup.component.css']
})
export class NonBillPopupComponent implements OnInit {

  actionBtn : string = "Submit";
  SAPDANo:any="";
  billType:any="";
  CustomerPoRefNo:any="";
  ItemDescription:any="";
  ModelNo:any="";
  TotalQuantity:any="";
  TotalAmount:any="";
  UOM:any="";
  ActualDispatchedQuantity:any="";
  Total:any="";
  BalanceQuantity:any="";
  UnitPrice:any="";
  SGST:any="";
  CGST:any="";
  IGST:any="";
  GST:any="";
  TotalPrice:any="";
  NonBillableRemarks:any="";
  resultList: unknown;
  url = "logistics_panel_wise_material/";
  UnderWorNW: any;
  ReasonForSuppliesNW: any;

  constructor(public api: ApiserviceService,
    public toast:ToastrService, 
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private eventEmitterService: EventEmitterService, 
    private dialogRef:MatDialogRef<NonBillPopupComponent>) { }

  ngOnInit(){
    console.log("edit data list",this.editData);
    if(this.editData)
    {
      this.actionBtn = "Update";
      this.SAPDANo=this.editData.da_no;
      this.CustomerPoRefNo = this.editData.customerPoRefNo;
      this.ItemDescription = this.editData.item_desc;
      this.ModelNo = this.editData.model;
      this.TotalQuantity = this.editData.total_qty;
      this.TotalAmount = this.editData.total_amt;
      this.UOM = this.editData.uom;
      this.Total = this.editData.total;
      this.BalanceQuantity = this.editData.balance_qty;
      this.UnitPrice = this.editData.unit_price;
      this.SGST = this.editData.sgst_amt;
      this.CGST = this.editData.cgst_amt;
      this.GST = this.editData.gst_amt;
      this.IGST = this.editData.igst_amt;
      this.TotalPrice = this.editData.total_amt_gst
      this.NonBillableRemarks = this.editData.nonbillableRemark;
      this.ReasonForSuppliesNW = this.editData.reasonForSuppliesNW;
      this.UnderWorNW = this.editData.underWorNW;
    }
  }

  BillSelect(val: any){
    this.billType = val;
  }


 createList()
  { 
    if(!this.editData)
    {
      if(this.TotalQuantity != "" || this.UnitPrice != "")
    {
      this.TotalAmount=this.TotalQuantity*this.UnitPrice
    }
    if(this.IGST != "")
    {
      this.GST = this.IGST/100*this.TotalAmount;
      this.TotalPrice = (this.IGST/100*this.TotalAmount) + (this.TotalAmount)
    }
    else if(this.CGST != "" || this.SGST != "")
    {
      this.GST = (this.CGST/100*this.TotalAmount) + (this.SGST/100*this.TotalAmount);
      this.TotalPrice = (this.CGST/100*this.TotalAmount) + (this.SGST/100*this.TotalAmount) + (this.TotalAmount)
    }
    let data={
      'da_no':this.SAPDANo,
      'item_desc':this.ItemDescription,
      'model':this.ModelNo,
      'total_qty':this.TotalQuantity == "" ? null : parseInt(this.TotalQuantity),
      'unit_price':this.UnitPrice == "" ? null : parseInt(this.UnitPrice),
      'total_amt':this.TotalAmount == "" ? null : parseInt(this.TotalAmount),
      'sgst_amt':this.SGST == "" ? null : parseInt(this.SGST),
      'cgst_amt':this.CGST == "" ? null : parseInt(this.CGST),
      'igst_amt':this.IGST == "" ? null : parseInt(this.IGST),
      'total_amt_gst':this.TotalPrice == "" ? null : parseInt(this.TotalPrice),
      'nonbillableRemark':this.NonBillableRemarks,
      'underWorNW':this.UnderWorNW,
      'reasonForSuppliesNW':this.ReasonForSuppliesNW,
      'uom':this.UOM,
      'customerPoRefNo':this.CustomerPoRefNo,
      'bill_type':this.billType,
      'total':this.Total =="" ? null : parseInt(this.Total),
      'gst_amt' : this.GST == "" ? null : parseInt(this.GST)
    }
    console.log("data=",data)
      let url = "logistics_panel_wise_material/";
      this.api.PostData(url,data).then(res => {
      console.log(res)
      this.toast.success("Record Successfully Inserted!");
      this.dialogRef.close();
      this.resultList=res;
      this.eventEmitterService.onNonBillFormButtonClick(); //getList(billableform)
    })
  }
  else
  {
    this.updateList();
  }
}

updateList()
{
  if(this.TotalQuantity != "" || this.UnitPrice != "")
    {
      this.TotalAmount=this.TotalQuantity*this.UnitPrice
    }
    if(this.IGST != null && this.IGST != "")
    {
      this.GST = this.IGST/100*this.TotalAmount;
      this.TotalPrice = (this.IGST/100*this.TotalAmount) + (this.TotalAmount)
    }
    else if(this.CGST != null && this.CGST !="" || this.SGST != null && this.SGST != "")
    {
      this.GST = (this.CGST/100*this.TotalAmount) + (this.SGST/100*this.TotalAmount);
      this.TotalPrice = (this.CGST/100*this.TotalAmount) + (this.SGST/100*this.TotalAmount) + (this.TotalAmount)
    }
    let data={
      'da_no':this.SAPDANo,
      'item_desc':this.ItemDescription,
      'model':this.ModelNo,
      'total_qty':this.TotalQuantity == "" ? null : parseInt(this.TotalQuantity),
      'unit_price':this.UnitPrice == "" ? null : parseInt(this.UnitPrice),
      'total_amt':this.TotalAmount == "" ? null : parseInt(this.TotalAmount),
      'sgst_amt':this.SGST == "" ? null : parseInt(this.SGST),
      'cgst_amt':this.CGST == "" ? null : parseInt(this.CGST),
      'igst_amt':this.IGST == "" ? null : parseInt(this.IGST),
      'total_amt_gst':this.TotalPrice == "" ? null : parseInt(this.TotalPrice),
      'underWorNW':this.UnderWorNW,
      'reasonForSuppliesNW':this.ReasonForSuppliesNW,
      'uom':this.UOM,
      'nonbillableRemark':this.NonBillableRemarks,
      'customerPoRefNo':this.CustomerPoRefNo,
      'bill_type':this.billType,
      'total':this.Total =="" ? null : parseInt(this.Total),
      'gst_amt' : this.GST == "" ? null : parseInt(this.GST),
    }
    console.log("data=",data)
      let url = "logistics_panel_wise_material/"+this.editData.id+"/";
      this.api.updateData(url,data).then(res => {
      console.log(res)
      this.toast.success("Record Updated Successfully!");
      this.dialogRef.close();
      this.resultList=res;
      this.eventEmitterService.onNonBillFormButtonClick();
    })
}
  
}







// createList2()
// { 

//   if(this.editData)
//   {
//     if(this.TotalQuantity != "" || this.UnitPrice != "")
// {
//   this.TotalAmount=this.TotalQuantity*this.UnitPrice
// }
// if(this.IGST != "")
// {
//   this.TotalPrice = this.IGST/100*this.TotalAmount
// }
// if(this.CGST != "" || this.SGST != "")
// {
//   this.TotalPrice = (this.CGST/100*this.TotalAmount) + (this.SGST/100*this.TotalAmount) + (this.TotalAmount)
// }
//   let data={
//     'da_no':this.SAPDANo,
//     'item_desc':this.ItemDescription,
//     'model':this.ModelNo,
//     'total_qty':this.TotalQuantity == "" ? null : parseInt(this.TotalQuantity),
//     'unit_price':this.UnitPrice == "" ? null : parseInt(this.UnitPrice),
//     'total_amt':this.TotalAmount == "" ? null : parseInt(this.TotalAmount),
//     'sgst_amt':this.SGST == "" ? null : parseInt(this.SGST),
//     'cgst_amt':this.CGST == "" ? null : parseInt(this.CGST),
//     'igst_amt':this.IGST == "" ? null : parseInt(this.IGST),
//     'total_amt_gst':this.TotalPrice == "" ? null : parseInt(this.TotalPrice),
//     'nonbillableRemark':this.NonBillableRemarks,
//     'underWorNW':this.UnderWorNW,
//     'reasonForSuppliesNW':this.ReasonForSuppliesNW,
//     'uom':this.UOM,
//     'customerPoRefNo':this.CustomerPoRefNo,
//   }
//   debugger;
//   console.log("data=",data)
//   let url = "logistics_panel_wise_material/";
//   this.api.PostData(url,data).then(res => {
//     console.log(res)
//     this.toast.success("Record Successfully Inserted!");
//     this.dialogRef.close();
//    this.resultList=res;
//    this.eventEmitterService.onNonBillFormButtonClick();
//   })
// }
// else
// {
//   this.updateList();
// }
// }