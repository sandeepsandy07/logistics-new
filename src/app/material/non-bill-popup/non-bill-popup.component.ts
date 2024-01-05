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
    console.log("DA_ID inside ng onit of popup component=",this.editData);
    console.log("BILL Type inside popup component=",this.editData.BILL_TYPE)
    this.actionBtn = this.editData.btn
    this.editData = this.editData;
    this.SAPDANo=this.editData.DA_ID;
    console.log("this.editdatacjjcc=",this.editData);

    //if(this.editData)
    if(this.editData.btn != "Create")
    {
      // this.actionBtn = "Update";
      this.billType = this.editData.data.bill_type;
      this.SAPDANo=this.editData.data.da_id;
      this.CustomerPoRefNo = this.editData.data.customerPoRefNo;
      this.ItemDescription = this.editData.data.item_desc;
      this.ModelNo = this.editData.data.model;
      this.TotalQuantity = this.editData.data.total_qty;
      this.TotalAmount = this.editData.data.total_amt;
      this.UOM = this.editData.data.uom;
      this.Total = this.editData.data.total;
      this.BalanceQuantity = this.editData.data.balance_qty;
      this.UnitPrice = this.editData.data.unit_price;
      this.SGST = this.editData.data.sgst_amt;
      this.CGST = this.editData.data.cgst_amt;
      this.GST = this.editData.data.gst_amt;
      this.IGST = this.editData.data.igst_amt;
      this.TotalPrice = this.editData.data.total_amt_gst
      this.NonBillableRemarks = this.editData.data.nonbillableRemark;
      this.ReasonForSuppliesNW = this.editData.data.reasonForSuppliesNW;
      this.UnderWorNW = this.editData.data.underWorNW;
    }
  }

  BillSelect(val: any){
    this.billType = val;
  }


 createList()
  {
    debugger
    if(this.CGST == null)
    {
      this.CGST = ""
    }
    if(this.SGST == null)
    {
      this.SGST = ""
    }
    if(this.IGST == null)
    {
      this.IGST = ""
    }
    if((this.CGST != "") && (this.SGST != "") && (this.IGST != ""))
    {
      this.toast.error("Please Enter Either CGST and SGST Value or IGST Value")
      return
    }
    else if((this.CGST == "" || this.CGST == null || this.CGST == undefined) && (this.SGST == "" || this.SGST == null || this.SGST == undefined) && (this.IGST == "" || this.IGST == null || this.IGST == undefined))
    {
      this.toast.error("Value for CGST and SGST or IGST is required")
      return
    }
    else if ((this.CGST != "" || this.SGST != "") && (this.IGST != ""))
    {
      this.toast.error("Please Enter Either CGST and SGST Value or IGST Value")
      return
    }
    if(this.editData.btn == "Create")
    {
      if(this.CGST == null || this.CGST == "" || this.CGST == undefined)
    {
      this.CGST=0;
    }
    if(this.SGST == null || this.SGST == "" || this.SGST == undefined)
    {
      this.SGST=0;
    }
    if(this.TotalQuantity != "" || this.UnitPrice != "")
    {
      this.TotalAmount=this.TotalQuantity*this.UnitPrice
    }
    if(this.IGST != "" && this.IGST != undefined && this.IGST != null)
    {
      this.GST = this.IGST/100*this.TotalAmount;
      this.TotalPrice = (this.IGST/100*this.TotalAmount) + (this.TotalAmount)
    }
    else if((this.CGST != "" && this.CGST != undefined && this.CGST != null) || (this.SGST != null && this.SGST != "" && this.SGST != undefined))
    {
      this.GST = (this.CGST/100*this.TotalAmount) + (this.SGST/100*this.TotalAmount);
      this.TotalPrice = (this.CGST/100*this.TotalAmount) + (this.SGST/100*this.TotalAmount) + (this.TotalAmount)
    }
    let data={
      'da_id':this.editData.DA_ID,
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
      'bill_type':this.editData.BILL_TYPE,
      'total':this.Total =="" ? null : parseInt(this.Total),
      'gst_amt' : this.GST == "" ? null : parseInt(this.GST),
      "da_status":"saveAll"
    }
    console.log("data=",data)
      let url = "logistics_panel_wise_material/";
      this.api.postData(url,data).then(res => {
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
  if(this.CGST == null || this.CGST == "" || this.CGST == undefined)
  {
    this.CGST=0;
  }
  if(this.SGST == null || this.SGST == "" || this.SGST == undefined)
  {
    this.SGST=0;
  }
  if(this.TotalQuantity != "" || this.UnitPrice != "")
    {
      this.TotalAmount=this.TotalQuantity*this.UnitPrice
    }
    if(this.IGST != "" && this.IGST != undefined && this.IGST != null)
    {
      this.GST = parseFloat(this.IGST)/100*parseFloat(this.TotalAmount);
      this.TotalPrice = (parseFloat(this.IGST)/100*parseFloat(this.TotalAmount)) + parseFloat(this.TotalAmount)
    }
    else if((this.CGST != null && this.CGST !="" && this.CGST !=undefined) || (this.SGST != null && this.SGST != "" && this.SGST != undefined))
    {
      this.GST = (parseFloat(this.CGST)/100*parseFloat(this.TotalAmount)) + (parseFloat(this.SGST)/100*parseFloat(this.TotalAmount));
      this.TotalPrice = (parseFloat(this.CGST)/100*parseFloat(this.TotalAmount)) + (parseFloat(this.SGST)/100*parseFloat(this.TotalAmount)) + parseFloat(this.TotalAmount)
    }
    let data={
      'da_id':this.SAPDANo,
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
      'bill_type':this.editData.data.bill_type,
      'total':this.Total =="" ? null : parseInt(this.Total),
      'gst_amt' : this.GST == "" ? null : parseInt(this.GST),
      "da_status":"saveAll"
    }
    console.log("update data=",data)
      let url = "logistics_panel_wise_material/"+this.editData.data.id+"/";
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