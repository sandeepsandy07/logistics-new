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
  public checkedQty: any = {};
  public remarks:any={};
  public checked:any={};
  pendingQty:any;

  ListForm:boolean=true;
  Remarks:any;
  quantity:any;

  public dataSource = new MatTableDataSource<['']>();
  public displayedColumns: string[] = ['SLNo.','ItemID','Item Description','TotalQty','PendingQty','Checked Qty','Remarks','Verify'];

  public verifiedItems = new MatTableDataSource<['']>();
  public verifiedColumns: string[] = ['SLNo.','ItemID','Item Description','Status','Remarks','CreatedAt', 'CreatedBy'];

  status: any;
  ID: any;
  Status:boolean = true;
  EmpListData: any;
  itemList: any;
  PanelList: any;

  itemForm: UntypedFormGroup;
  resultList: unknown;

  itemsArr: any = [];
  updateArr: any = [];

  itemVerficationPage: Boolean = true;
  itemVerifiedPage: Boolean = false;

  constructor(public api: ApiserviceService,public toast:ToastrService, private formBuilder:UntypedFormBuilder) { }

  ngOnInit(){
    this.getPanelWiseList();
    this.getverifiedItems();
  }

  checkedQTY(element, index){
    if(element['qty'] < this.checkedQty[index]){
      this.toast.error('checked QTY should be lesser than or equal with pending QTY');
      this.checkedQty[index] = 0;
    }
  }

  setCheckbox(element, index, checkbox){
    if(this.checkedQty[index] != undefined && this.checkedQty[index] != null && this.checkedQty[index] != 0){

        if (checkbox == true){
          element['verify'] = checkbox;
          if (element['verify'] == true){
            if(element['pending_qty'] == null){
              element['pending_qty'] = parseInt(element['qty']);
            }
            element['pending_qty'] = (parseInt(element['pending_qty']) - parseInt(this.checkedQty[index]));

            let data = {
              'da_id': element['da_id'],
              'item_id': element['id'],
              'item_desc': element['item_desc'],
              'quantity': element['qty'],
              'remarks':this.remarks[index] == undefined || null ? '' : this.remarks[index],
              'status': element['pending_qty'] == 0 ? 'verified' : 'pending',
              'pending_qty': element['pending_qty']
            }
            this.itemsArr.push(data);

            let val = {
              'id': element['id'],
              'pending_qty': element['pending_qty']
            }
            this.updateArr.push(val);

          }
        } else {
          element['verify'] = checkbox;
          this.itemsArr = this.itemsArr.filter(val => val.item_id !== element['id']);
          this.updateArr = this.updateArr.filter(val => val.id !== element['id']);
          this.checkedQty[index] = 0;
        }

    } else {
      this.toast.error('Enter some qty value in the Checked QTY text box');
    }
    
  }

  changePage(){
    if(this.itemVerficationPage == true){
      this.itemVerficationPage = false;
      this.itemVerifiedPage = true;
    } else {
      this.itemVerficationPage = true;
      this.itemVerifiedPage = false;
    }
  }
  
  submitData(){
    if(this.itemsArr.length == 0){

      this.toast.error('Please select the item/items');

    } else {

      let url = "logistics_looseItems_verification/";
      this.api.postData(url, this.itemsArr).then(res => {
        this.resultList=res;
        this.updatePanelWise(this.updateArr);
      })
    }
  } 

  updatePanelWise(val){
    let url = "panel_wise/updatePanelItems/";
    this.api.postData(url, val).then(res => {
      this.checkedQty = {};
      this.remarks = {};
      this.checked = {};
      this.toast.success("Record Successfully Inserted!");
      this.getPanelWiseList();
      this.getverifiedItems();
    });
  }


  getverifiedItems(){
    let url = "logistics_looseItems_verification/";
    this.api.getData(url).then((res: any) => {
      this.verifiedItems = new MatTableDataSource(res);
      this.verifiedItems.data = res;
    }); 
  }

  getPanelWiseList(){
    let url = "panel_wise/getPanelLooseSupply/";
    this.api.getData(url).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;
      this.itemsArr = [];
      this.updateArr = [];
    }); 
  }
}
