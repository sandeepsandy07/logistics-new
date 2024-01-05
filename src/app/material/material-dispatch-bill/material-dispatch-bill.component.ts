import { Component, OnInit } from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators, UntypedFormArray } from '@angular/forms';

@Component({
  selector: 'app-material-dispatch-bill',
  templateUrl: './material-dispatch-bill.component.html',
  styleUrls: ['./material-dispatch-bill.component.css']
})
export class MaterialDispatchBillComponent implements OnInit {
  CreateForm:boolean=true;
  BillableReviewForm:boolean=false;
  NonBillableReviewForm:boolean=false;
  BillableForm:boolean=false;
  NonBillableForm:boolean=false;
  MainForm:boolean=true;
  ResultDataList:any;
  EditForm:boolean=false;
  HeaderForBillableForm:boolean=false;
  HeaderForNonBillableForm:boolean=false;
  ViewForm:boolean=false;
  val: any = [];
  DANO:any;


  dataItems: any;
  freightModeName:any="";
  JobName:any="";
  JobCode:any="";
  SONo:any="";
  DANo:any="";
  PM:any="";
  PONo:any="";
  PODate:any="";
  DADate:any="";
  GM:any="";

  SAPDANo:any="";
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
  TotalPrice:any="";
  BillableRemarks:any="";
  NonBillableRemarks:any="";
  url = "logistics_panel_wise_material/";
  resultList: unknown;
  EmpListData: any;
  billType: any="";
  UnderWorNW:any="";
  ReasonForSuppliesNW:any="";
  arrayList:any;
  array: any = [];
  array2: any = [];
  res:any=[];
  i=0;
  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['SAP.DA.No','CustomerPoRefNo','ItemDescription','ModelNo','TotalQuantity','UOM','Total','BalanceQuantity','UnitPrice','SGST','CGST','IGST','Remarks','delete','view'];

  public dataSource2 = new MatTableDataSource<['']>();
  public displayedColumns2: string[] = ['SAP.DA.No','CustomerPoRefNo','ItemDescription','ModelNo','TotalQuantity','UOM','UnitPrice','UnderWorNW','SGST','CGST','IGST','ReasonForSuppliesNW'];

  public usersForm!: UntypedFormGroup;
  public NonBillableFormArray!: UntypedFormGroup;
  constructor(public api: ApiserviceService,public toast:ToastrService,private fb: UntypedFormBuilder) { }

  ngOnInit() :void {
    this.usersForm = this.fb.group({
      users: this.fb.array([
        this.fb.group({
          //SAPDANo: [''],
          //ItemDescription: [''],
          //ModelNo: [''],
          //TotalQuantity: [''],
          //UnitPrice: [''],
          //TotalAmount:[''],
          // SGST:[''],
          //CGST:[''],
          //IGST:[''],
          //TotalPrice:[''],
          //BillableRemarks:[''],
          //NonBillableRemarks:[''],
          //UnderWorNW:[''],
          //ReasonForSuppliesNW:[''],
          //UOM:[''],
          //CustomerPoRefNo:[''],
          //Total:[''],
          // BalanceQuantity:['']
          da_no:[''],
          item_desc:[''],
          model:[''],
          total_qty:[''],
          unit_price:[''],
          total_amt:[''],
          sgst_amt:[''],
          cgst_amt:[''],
          igst_amt:[''],
          total_amt_gst:[''],
          billableRemark:[''],
          nonbillableRemark:[''],
          underWorNW:[''],
          reasonForSuppliesNW:[''],
          uom:[''],
          customerPoRefNo:[''],
          total:[''],
          balance_qty:['']
        })
      ])
    })

    this.NonBillableFormArray = this.fb.group({
      nonBill: this.fb.array([
        this.fb.group({
          da_no:[''],
          item_desc:[''],
          model:[''],
          total_qty:[''],
          unit_price:[''],
          total_amt:[''],
          sgst_amt:[''],
          cgst_amt:[''],
          igst_amt:[''],
          total_amt_gst:[''],
          billableRemark:[''],
          nonbillableRemark:[''],
          underWorNW:[''],
          reasonForSuppliesNW:[''],
          uom:[''],
          customerPoRefNo:[''],
          total:[''],
          balance_qty:['']

          // SAPDANo: [''],
          // ItemDescription: [''],
          // ModelNo: [''],
          // TotalQuantity: [''],
          // UnitPrice: [''],
          // TotalAmount:[''],
          // SGST:[''],
          // CGST:[''],
          // IGST:[''],
          // TotalPrice:[''],
          // BillableRemarks:[''],
          // NonBillableRemarks:[''],
          // UnderWorNW:[''],
          // ReasonForSuppliesNW:[''],
          // UOM:[''],
          // CustomerPoRefNo:[''],
          // Total:[''],
          // BalanceQuantity:['']
        })
      ])
    })
  }

  get userFormGroups () {
    return this.usersForm.get('users') as UntypedFormArray
  }

  get nonBillFormGroups () {
    return this.NonBillableFormArray.get('nonBill') as UntypedFormArray
  }

  removeFormControl(i: number) {
    let usersArray = this.usersForm.get('users') as UntypedFormArray;
    usersArray.removeAt(i);
  }

  removeitem(i: number) {
    let nonBillArrayValues = this.NonBillableFormArray.get('nonBill') as UntypedFormArray;
    nonBillArrayValues.removeAt(i);
  }

  addFormControl() {
    let usersArray = this.usersForm.get('users') as UntypedFormArray;
    let arraylen = usersArray.length;

    let newUsergroup: UntypedFormGroup = this.fb.group({
          da_no:[''],
          item_desc:[''],
          model:[''],
          total_qty:[''],
          unit_price:[''],
          total_amt:[''],
          sgst_amt:[''],
          cgst_amt:[''],
          igst_amt:[''],
          total_amt_gst:[''],
          billableRemark:[''],
          nonbillableRemark:[''],
          underWorNW:[''],
          reasonForSuppliesNW:[''],
          uom:[''],
          customerPoRefNo:[''],
          total:[''],
          balance_qty:['']
    })

    usersArray.insert(arraylen, newUsergroup);
  }


  additem() {
    let nonBillArrayValues = this.NonBillableFormArray.get('nonBill') as UntypedFormArray;
    let arraylen = nonBillArrayValues.length;

    let newUsergroup: UntypedFormGroup = this.fb.group({
          da_no:[''],
          item_desc:[''],
          model:[''],
          total_qty:[''],
          unit_price:[''],
          total_amt:[''],
          sgst_amt:[''],
          cgst_amt:[''],
          igst_amt:[''],
          total_amt_gst:[''],
          billableRemark:[''],
          nonbillableRemark:[''],
          underWorNW:[''],
          reasonForSuppliesNW:[''],
          uom:[''],
          customerPoRefNo:[''],
          total:[''],
          balance_qty:['']
    })

    nonBillArrayValues.insert(arraylen, newUsergroup);
  }


  onSubmit()
  {
    alert("Please review/confirm information first,then hit Submit again");
    console.log("values of array",this.usersForm.value);
    let url = "logistics_panel_wise_material/";
    //debugger;this.TotalQuantity == "" ? null : parseInt(this.TotalQuantity),
    let val = this.usersForm.value['users'];
    val.forEach((element: any, index: any) => {
      console.log(element.total)
      element.total_amt =="" ? 0 : parseInt(element.total_amt);
      element.cgst_amt =="" ? 0 : parseInt(element.cgst_amt);
      console.log(element.cgst_amt);
      element.sgst_amt== "" ? 0 : parseInt(element.sgst_amt);
      element.igst_amt== "" ? 0 : parseInt(element.igst_amt);
      element.balance_qty== "" ? 0 : parseInt(element.balance_qty);
      element.total_amt_gst== ""? 0 : parseInt(element.total_amt_gst);
      element.total_qty=="" ? 0 : parseInt(element.total_qty);
      element.total =="" ? 0 : parseInt(element.total);
      element.total_amt=element.total*element.unit_price;
      if(element.igst_amt != "")
      {
        element.total_amt_gst = element.igst_amt/100*element.total_amt;
      }
      if(element.cgst_amt != "" || element.sgst_amt != "")
      {
        element.total_amt_gst = (element.cgst_amt/100*element.total_amt) + (element.sgst_amt/100*element.total_amt) + (element.total_amt)
      }
      
    });
    console.log(this.usersForm.value);
    console.log(this.userFormGroups.value);
    this.api.PostData(url,this.usersForm.value).then(res => {
      console.log(res)
      this.toast.success("Record Successfully Inserted!");
    })
  }

  viewData(id:any)
  {
    this.BillableForm=false;
    this.HeaderForBillableForm=false;
    this.MainForm=false;
    this.ViewForm=true;
    let val = this.usersForm.value['users'];
    console.log("val=",val);
    this.SAPDANo=val[id].da_no;
    this.CustomerPoRefNo=val[id].customerPoRefNo;
    this.ItemDescription = val[id].item_desc;
    this.ModelNo = val[id].model;
    this.TotalQuantity = val[id].total_qty;
    this.TotalAmount = val[id].total_amt;
    this.UOM = val[id].uom;
    this.Total = val[id].total;
    this.BalanceQuantity = val[id].balance_qty;
    this.UnitPrice = val[id].unit_price;
    this.SGST = val[id].sgst_amt;
    this.CGST = val[id].cgst_amt;
    this.IGST = val[id].igst_amt;
    this.TotalPrice = val[id].total_amt_gst;
    this.BillableRemarks = val[id].billableRemark;
    console.log("id=",val[id].customerPoRefNo);
  }

  setViewForm()
  {
    this.BillableForm=true;
    this.HeaderForBillableForm=true;
    this.ViewForm=false;
    this.MainForm=true;
  }
  onNonBillSubmit()
  {
    console.log("values of array",this.NonBillableFormArray.value);
    let url = "logistics_panel_wise_material/";
    console.log(this.NonBillableFormArray.value);
    console.log(this.nonBillFormGroups.value);
    this.api.PostData(url,this.NonBillableFormArray.value).then(res => {
      console.log(res)
      this.toast.success("Record Successfully Inserted!");
    })
  }

  SelectBillType(val: any){
    this.billType = val;
    console.log(this.billType);
    if(this.billType == "Billable")
    {
      this.HeaderForBillableForm=true;
      this.HeaderForNonBillableForm=false;
      this.BillableForm=true;
      this.NonBillableForm=false;
    }
    if(this.billType == "NonBillable")
    {
      this.HeaderForNonBillableForm=true;
      this.HeaderForBillableForm=false;
      this.BillableForm=false;
      this.NonBillableForm=true;
      this.clearInputFields();
    }
  }

 

  // createList()
  // {
  //   this.usersArray.forEach((element:any)=>{
  //  console.log(element);
  //   let url = "logistics_panel_wise_material/";
  //   this.api.PostData(url,element).then(res => {
  //     console.log(res)
  //     this.toast.success("Record Successfully Inserted!");
  //     this.resultList=res;
  //   })
  // });
  // }






  getNewRow()
  {

    let data: any = {'da_no':this.SAPDANo,
    'item_desc':this.ItemDescription,
    'model':this.ModelNo,
    'total_qty':this.TotalQuantity == "" ? null : parseInt(this.TotalQuantity),
    'unit_price':this.UnitPrice == "" ? null : parseInt(this.UnitPrice),
    'total_amt':this.TotalAmount == "" ? null : parseInt(this.TotalAmount),
    'sgst_amt':this.SGST == "" ? null : parseInt(this.SGST),
    'cgst_amt':this.CGST == "" ? null : parseInt(this.CGST),
    'igst_amt':this.IGST == "" ? null : parseInt(this.IGST),
    'total_amt_gst':this.TotalPrice == "" ? null : parseInt(this.TotalPrice),
    'billableRemark':this.BillableRemarks,
    'nonbillableRemark':this.NonBillableRemarks,
    'underWorNW':this.UnderWorNW,
    'reasonForSuppliesNW':this.ReasonForSuppliesNW,
    'uom':this.UOM,
    'customerPoRefNo':this.CustomerPoRefNo}

    this.sample(data);
    this.array.push(data);
   this.dataSource = new MatTableDataSource(this.array);
  }








































  sample(data: any){
    this.array2 = this.array;
    
    if(data.da_no != "") //check if row is empty before storing into database
    {
      console.log("rows to insert into db",this.array);
    }
    //this.array = [];
  //this.dataSource = new MatTableDataSource(this.array2);
  }

  



  
  setBillableReviewForm()
  {
    this.dataItems = [];
    this.BillableForm = false;
    this.BillableReviewForm = true;
    this.MainForm=false;//1st
    this.api.ViewData(this.url).subscribe((data:any) =>{
    this.ResultDataList=data;
    console.log(data);
    })
  }
  
  setNonBillableReviewForm()
  {
    this.NonBillableReviewForm=true;
    this.NonBillableForm=false;
  }
  setBackButton()
  {
    this.BillableForm = true;
    this.BillableReviewForm = false;
    this.MainForm=true;//2nd
    
  }


  
  
  clearInputFields()
  {
    this.SAPDANo="";
    this.CustomerPoRefNo="";
    this.ItemDescription="";
    this.ModelNo="";
    this.TotalQuantity="";
    this.UOM="";
    this.UnitPrice="";
    this.TotalAmount="";
    this.SGST="";
    this.CGST="";
    this.IGST="";
    this.TotalPrice="";
    this.UnderWorNW="";
    this.ReasonForSuppliesNW="";
    this.BalanceQuantity="";
    this.BalanceQuantity="";
    this.BillableRemarks="";
    this.NonBillableRemarks="";
    this.Total="";
  }

  createNewList()
{ 
  if(this.TotalQuantity != "" || this.UnitPrice != "")
  {
    this.TotalAmount=this.TotalQuantity*this.UnitPrice
  }
  if(this.IGST != "")
  {
    this.TotalPrice = this.IGST/100*this.TotalAmount
  }
  if(this.CGST != "" || this.SGST != "")
  {
    this.TotalPrice = (this.CGST/100*this.TotalAmount) + (this.SGST/100*this.TotalAmount) + (this.TotalAmount)
  }
    let data={
      'da_no':this.DANo,
      'item_desc':this.ItemDescription,
      'model':this.ModelNo,
      'total_qty':this.TotalQuantity == "" ? null : parseInt(this.TotalQuantity),
      'unit_price':this.UnitPrice == "" ? null : parseInt(this.UnitPrice),
      'total_amt':this.TotalAmount == "" ? null : parseInt(this.TotalAmount),
      'sgst_amt':this.SGST == "" ? null : parseInt(this.SGST),
      'cgst_amt':this.CGST == "" ? null : parseInt(this.CGST),
      'igst_amt':this.IGST == "" ? null : parseInt(this.IGST),
      'total_amt_gst':this.TotalPrice == "" ? null : parseInt(this.TotalPrice),
      'billableRemark':this.BillableRemarks,
      'nonbillableRemark':this.NonBillableRemarks,
      'underWorNW':this.UnderWorNW,
      'reasonForSuppliesNW':this.ReasonForSuppliesNW,
      'uom':this.UOM,
      'customerPoRefNo':this.CustomerPoRefNo,
    }
    console.log(data)
    let url = "logistics_panel_wise_material/";
    this.api.PostData(url,data).then(res => {
      console.log(res)
      this.toast.success("Record Successfully Inserted!");
      this.resultList=res;
    })
  }

  
  getNewRow1()
  {
    let data: any = {'da_no':"",
    'item_desc':"",
    'model':"",
    'total_qty':"",
    'unit_price':"",
    'total_amt':"",
    'sgst_amt':"",
    'cgst_amt':"",
    'igst_amt':"",
    'total_amt_gst':"",
    'billableRemark':"",
    'nonbillableRemark':"",
    'underWorNW':"",
    'reasonForSuppliesNW':"",
    'uom':"",
    'customerPoRefNo':""}

    this.sample(data);

    this.dataSource = new MatTableDataSource(this.array);
  }


}





  // https://www.w3schools.com/jsref/event_onkeyup.asp
 // https://www.itsolutionstuff.com/post/how-to-dynamically-add-and-remove-form-fields-in-angularexample.html

  
  
  


