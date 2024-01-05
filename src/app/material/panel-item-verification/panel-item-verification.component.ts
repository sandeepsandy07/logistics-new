import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ApiserviceService } from 'src/app/apiservice.service';
import { UntypedFormGroup, UntypedFormControl, FormGroupDirective, NgForm, Validators, UntypedFormArray, UntypedFormBuilder } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { ErrorStateMatcher } from '@angular/material/core';
import { NavigationExtras } from '@angular/router';



import { MatTableDataSource } from '@angular/material/table';
import { StorageServiceService } from '../../service-storage.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-panel-item-verification',
  templateUrl: './panel-item-verification.component.html',
  styleUrls: ['./panel-item-verification.component.css']
})
export class PanelItemVerificationComponent implements OnInit {
  list: any;
  isListView: boolean = true;

  expandbtn: boolean = true;

  toggle: boolean = false;
  da_id: any;

  url = environment.apiUrl;
  panel_serial_no: any = 0;
  shipping_clearance_no: any = 0;
  public viewRecords: any;

  front: any = {};
  rear: any = {};
  remarks: any = {};

  itemsArr: any = [];
  matcher = new MyErrorStateMatcher();

  balanceQty: any = 0;
  public showtab:boolean=false;

  approver: any = '';

  @ViewChild('accordion') accordion: MatAccordion
  userList: any;

  mountCheckbox: any;

  constructor(
    public api: ApiserviceService,
    public toast: ToastrService,
    public dialog: MatDialog,
    public storage: StorageServiceService,
    private router: Router,
  ) {

    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as { dad_id: string };
    this.da_id = state.dad_id;
  }

  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;

  ngOnInit(): void {
    this.getList();
    this.getApprover();
    this.viewData(this.da_id)
  }
  viewData(element: any) {
    this.api.viewuser("logistics_dispatch_advice/", element).then((data: any) => {
      this.viewRecords = data.records;
    });
  }
  daNavigation(id, nav_url) {
    const navigationExtras: NavigationExtras = { state: { dad_id: id } };
    this.router.navigate([nav_url], navigationExtras);
  }
  getList_old() {
    let url = "panel_wise/get_panel_items/"
    let data = {
      da_id: this.da_id
    }
    this.api.postData(url, data).then((res: any) => {
      this.list = res.data;
      

    })
  }
  getList(){
    let url = "panel_wise_master/get_status_wise_panels_merged/"
    let data = {
      da_id : this.da_id,
      status :'all'
    }
    this.api.postData(url, data).then((res: any) => {
    this.list = res.data;  
    console.log("list",this.list);
    })
  }

  openAllPanels() {
    this.expandbtn = false;
    this.accordion.openAll();
  }
  closeAllPanels() {
    this.expandbtn = true;
    this.accordion.closeAll();
  }

  clearData() {
    this.front = {};
    this.rear = {};
  }

  generateSinglePanelWisePdf(panel_name) {
    let url = "panel_wise/getPanel_List/";
    let data = {
      da_id: this.da_id,
      panel_name: panel_name
    }
    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    });

  }
  qtyFront(data, i, panel_name) {

    alert("HI");
    if (this.front[i] <= data['qty']) {
      this.rear[i] = parseInt(data['qty']) - parseInt(this.front[i]);
      if (this.front[i] == '') {
        this.rear[i] = 0;
      }
    } else {
      alert('No qty !');
      this.front[i] = data['qty'];
      this.rear[i] = 0;
    }

    this.mountItems(data, i, true, panel_name);
  }

  qtyRear(data, i, panel_name) {
    if (this.rear[i] <= data['qty']) {
      this.front[i] = parseInt(data['qty']) - parseInt(this.rear[i]);
      if (this.rear[i] == '') {
        this.front[i] = 0;
      }
    } else {
      alert('No qty !');
      this.front[i] = 0;
      this.rear[i] = data['qty'];
    }

    this.mountItems(data, i, true, panel_name);
  }
  add_remarks(data, i, panel_name){
    this.mountItems(data, i, true, panel_name);
  }

  mountItems(data, i, check, panel_name) {

    this.itemsArr[i] = {
      'id': data['id'],
      'panel_name': panel_name,
      'front': parseInt(this.front[i] == undefined ? 0 : this.front[i]),
      'rear': parseInt(this.rear[i] == undefined ? 0 : this.rear[i]),
      'remark': this.remarks[i] == undefined || '' ? null : this.remarks[i],
      'mount_flag': check
    }

  }

  setCheckbox(data, i, check, panel_name) {
    if (check == false) {
      // this.itemsArr = this.itemsArr.filter(val => val.id !== data['id']);
      // this.front[i] = undefined;
      // this.rear[i] = undefined;
      // this.remarks[i] = undefined;

      this.itemsArr[i] = {
        'id': data['id'],
        'panel_name': panel_name,
        'front': parseInt(this.front[i] == undefined ? 0 : this.front[i]),
        'rear': parseInt(this.rear[i] == undefined ? 0 : this.rear[i]),
        'remark': this.remarks[i] == undefined || '' ? null : this.remarks[i],
        'mount_flag': check
      }

    }
  }
  getFilterListPanel(panel: any, section: any,panel_details){

    let data = {
        da_id: this.da_id,
        panel_name: panel,
        section: section
      }

    let url = "panel_wise/get_panel_filter_merged/"

    this.api.postData(url, data).then((res: any) => {

      this.openDialogPanel(res,panel_details);      

    })

  }
  openDialogPanel(list: any,panel_details:any){
    const dialogRef = this.dialog.open(VerifyOpenDialogPanel, {
      height: '500px',
      width: '1354px',
      maxWidth:'100%',
      
      data: {
        panel_item: list,
            da_id:this.da_id,
            da_details:this.viewRecords,
            panel_details:panel_details
            }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getList();
      
    });
  }

  // setCheckbox(data, i, check){
  //   if(this.front[i] != undefined || this.rear[i] != undefined){
  //     if(check == true){
  //       data['mount_flag'] = check;
  //       if(data['mount_flag'] == true){
  //         let val = {
  //           'id': data['id'],
  //           'front': parseInt(this.front[i] == undefined ? 0 : this.front[i]),
  //           'rear': parseInt(this.rear[i] == undefined ? 0 : this.rear[i]),
  //           'remark': this.remarks[i] == undefined ? null : this.remarks[i],
  //           'mount_flag': data['mount_flag'],
  //         }
  //         this.itemsArr.push(val);
  //       }

  //     } else {
  //       data['mount_flag'] = check;
  //       this.itemsArr = this.itemsArr.filter(val => val.id !== data['id']);
  //     }
  //   } else {
  //     this.toast.error('Front or Rear input has empty');
  //   }
  // } 


  SaveonSubmit(arr) {

    let arrayLength = 1;
    console.log("123", this.itemsArr)
    console.log("123", arr)
    debugger;
    

      

        arr.forEach((element, index) => {
          if (element.mount_flag != true) {
            arrayLength += index;
          }
        });

        let url = 'panel_wise/DraftupdateVerifiedPanelItems/';

        let data = {
          da_id: this.da_id,
          data: this.itemsArr,
          approver: this.approver,
          panel_serial_no: this.panel_serial_no,
          shipping_clearance_no: this.shipping_clearance_no
        }

        this.api.postData(url, data).then((res: any) => {

         
          this.front = {};
          this.rear = {};
          this.remarks = {};
          this.itemsArr = [];

          this.toast.success("Verified Successfully");

          this.getList();
        })


      


    
  }
  onSubmit(arr) {

    let arrayLength = 1;
   
    
    if (this.approver != '' && (this.itemsArr.length != 0 || arr[0].panel_name == 'LOOSE SUPPLY')) {

      if (arr.length == this.itemsArr.length || arr[0].panel_name == 'LOOSE SUPPLY') {

        arr.forEach((element, index) => {
          if (element.mount_flag != true) {
            arrayLength += index;
          }
        });

        let url = 'panel_wise/updateVerifiedPanelItems/';

        let data = {
          da_id: this.da_id,
          data: this.itemsArr,
          approver: this.approver,
          panel_serial_no: this.panel_serial_no,
          shipping_clearance_no: this.shipping_clearance_no
        }

        this.api.postData(url, data).then((res: any) => {

          this.api.postData('logistics_dispatch_advice/alert_mail/', res.mail).then((mailres: any) => {
            
          })
          this.front = {};
          this.rear = {};
          this.remarks = {};
          this.itemsArr = [];

          this.toast.success("Verified Successfully");

          this.getList();
        })


      } else {
        alert('Enter all the item details of panel correctly');
        this.front = {};
        this.rear = {};
        this.remarks = {};
        this.itemsArr = [];

      }


    } else {

      this.front = {};
      this.rear = {};
      this.remarks = {};
      this.itemsArr = [];

      alert('please mount items and select approver');

    }
  }

  getApprover() {
    let data = {
      "data_approver":
      {
        "sub_dept_id": 18
      }
    }
    let url = 'user_list/getUsersBasedOnFilterValue/'
    this.api.postData(url, data).then((res: any) => {
       
        this.userList = res;
      });
    }

    openDialog(id){
      const dialogRef = this.dialog.open(OpenDialogBox, {
        height: '500px',
        width: '1000px',
        data: {
          id: id
        }
      });
    }
  }


  @Component({
    selector: 'open-dialog',
    templateUrl: './open-dialog.html'
    , styles: [`
    :host {
      display:flex;
      flex-direction: column;
      height: 100%;
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
  })
  export class OpenDialogBox {

  hideBtn: boolean = false;

  values = [];

  itemDescription: any = '';
  itemQty: any = 0;

  displayedColumns = ['item_id', 'item_name', 'item_qty'];
  dataSource = new MatTableDataSource<['']>();

  constructor(
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<PanelItemVerificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.addvalue();
    this.getPanelAccessories(this.data.id);
  }

  // removevalue(i){
  //   this.values.splice(i,1);
  //   if(this.values.length == 0){
  //     this.dialogRef.close();
  //   }
  // }

  // addvalue(){
  //   this.values.push({item_id: this.data.id, item_description: "", item_qty: ""});
  // }

  onSubmit(){
    if (this.itemDescription != "" && this.itemQty != 0) {

      let url = 'panel_accessories/'

      let data = {
        panel_flag: true,
        item_id: this.data.id,
        item_description: this.itemDescription,
        item_qty: parseInt(this.itemQty)
      }

      this.apiService.postData(url, data).then(res => {
        this.getPanelAccessories(this.data.id);
      })
    } else {

      alert('please enter some values in the inputs');

    }
  }

  getPanelAccessories(id){

    let url = "panel_accessories/get_panel_accessories/";

    let data = {
      "flag_name": 'panel',
      item_id: id
    }

    this.apiService.postData(url, data).then((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.data = res;

      this.itemDescription = '';
      this.itemQty = 0;
    })

  }

  dialogClose(){
    this.dialogRef.close();
  }

}

@Component({
  selector: 'open-dialog-panel-verify',
  templateUrl: 'open-dialog-verify.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 100%;
      max-width:100% !important;
    }

    mat-dialog-content {
      flex-grow: 1;
    }
  `]
})
export class VerifyOpenDialogPanel {

  values = [];  
  form: UntypedFormGroup; 
  empForm:UntypedFormGroup;
  itemDescription: any = '';
  public panelName:any;
  public sectionName:any;
  public component_no:any;
  public front:any = {};
  public rear:any = {};
  public remarks:any = {};
  public itemsArr:any = [];
  public data_list:any = {};
  public panel_details:any;

  itemQty: any = 0;
  userList:any;
  sanaccessories:Array<any>=[];
  repeatAccessories:boolean=true;

  displayedColumns = ['sl_no', 'item_name', 'qty','uom','remarks'];
  dataSource = new MatTableDataSource<['']>();

  constructor(
    private fb:UntypedFormBuilder,
    public toast:ToastrService,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<VerifyOpenDialogPanel>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.data_list=data.panel_item;
  this.form=this.fb.group({
  
    da_id: this.data.da_id,
    data: this.fb.array([]),
    approver: new UntypedFormControl(),
    panel_serial_no: new UntypedFormControl(this.data.panel_details.panel_serial_no),
    shipping_clearance_no: new UntypedFormControl(this.data.panel_details.shipping_clearance_no)
  })
  
  this.panelName=this.data.panel_details.panel_name;
  this.sectionName=this.data.panel_details.section;
  this.component_no=this.data.panel_details.component_no;
  this.panel_details=this.data.panel_details;



  this.displaytabledata();
  this.getApprover();

}

    displaytabledata(){
      
      for (let i = 0; i < this.data.panel_item.length; i++) {
        this.front[i]=this.data.panel_item[i].front;
        this.rear[i]=this.data.panel_item[i].rear;
        this.remarks[i]=this.data.panel_item[i].remark;
      }
   

    }
    newstartaccessories(id,panel_name,make,model,front,rear,remark,qty,panel_remarks,mount_flag): UntypedFormGroup {
      return this.fb.group({
        id: id,
        item_desc: panel_name,
        make: make,
        model: model,
        front: front,
        rear:rear,
        remark:remark,
        qty:qty,
        panel_remarks:panel_remarks,
        mount_flag:true 
      })
    }
    addstartaccessories(id,panel_name,make,model,front,rear,remark,qty,panel_remarks,mount_flag) {

      this.panelitems().push(this.newstartaccessories(id,panel_name,make,model,front,rear,remark,qty,panel_remarks,mount_flag));
    }

    panelitems(): UntypedFormArray {
      return this.form.get("data") as UntypedFormArray
    }
    dialogClose(){
      this.dialogRef.close();
    }
    // qtyFront( i) {
    //   if (this.front[i] <= this.form.value.data[i].qty) {
    //     this.rear[i] = parseInt(this.form.value.data[i].qty) - parseInt(this.front[i]);
    //     if (this.front[i] == '') {
    //       this.rear[i] = 0;
    //     }
    //   } else {
    //     alert('No qty !');
    //     this.front[i] = this.form.value.data[i].qty;
    //     this.rear[i] = 0;
    //   }


    // }
    qtyFront_old(i) {
      if (this.form.value.data[i].front <= this.form.value.data[i].qty) {
        this.form.value.data[i].rear = parseInt(this.form.value.data[i].qty) - parseInt(this.form.value.data[i].front);
        if (this.form.value.data[i].front == '') {
          this.form.value.data[i].rear = 0;
        }
      } else {
        alert('No qty !');
        this.form.value.data[i].front = this.form.value.data[i].qty;
        this.form.value.data[i].rear = 0;

       let list_data= this.form.get("data") as UntypedFormArray
       console.log("asd",this.panelitems()[i])

      }
    }
    // qtyRear(i) {
    //   if (this.rear[i] <= this.form.value.data[i].qty) {
    //     this.front[i] = parseInt(this.form.value.data[i].qty) - parseInt(this.rear[i]);
    //     if (this.rear[i] == '') {
    //       this.front[i] = 0;
    //     }
    //   } else {
    //     alert('No qty !');
    //     this.front[i] = 0;
    //     this.rear[i] = this.form.value.data[i].qty;
    //   }
    // }
    qtyFront(data, i, panel_name) {      
      if (this.front[i] <= this.data_list[i].qty) {
        this.rear[i] = parseInt(this.data_list[i].qty) - parseInt(this.front[i]);
        if (this.front[i] == '') {
          this.rear[i] = 0;
        }
      } else   {
        alert('No qty !');
        this.front[i] = this.data_list[i].qty;
        this.rear[i] = 0;
      }
  
     
    }
  
    qtyRear(data, i, panel_name) {
      if (this.rear[i] <= this.data_list[i].qty) {
        this.front[i] = parseInt(this.data_list[i].qty) - parseInt(this.rear[i]);
        if (this.rear[i] == '') {
          this.front[i] = 0;
        }
      } else {
        alert('No qty !');
        this.front[i] = 0;
        this.rear[i] = this.data_list[i].qty;
      }
  
     
    }
   

      
  
    
    qtyRear_old(i) {
      if ( this.form.value.data[i].rear<= this.form.value.data[i].qty) {
        this.form.value.data[i].front   = parseInt(this.form.value.data[i].qty) - parseInt( this.form.value.data[i].rear);
        if ( this.form.value.data[i].rear== '') {
          this.form.value.data[i].front   = 0;
          
        }
      } else {
        alert('No qty !');
        this.form.value.data[i].front  = 0;
        this.form.value.data[i].rear = this.form.value.data[i].qty;
      }
    }
    openDialog(id){
      const dialogRef = this.dialog.open(OpenDialogBox, {
        height: '500px',
        width: '1000px',
        data: {
          id: id
        }
      });
    }
    
    getApprover() {
      let data = {
        "data_approver":
        {
          "sub_dept_id": 18
        }
      }
      let url = 'user_list/getUsersBasedOnFilterValue/'
      this.apiService.postData(url, data).then((res: any) => {
         
          this.userList = res;
        });
      }
      add_remarks(data, i, panel_name){
        
      }
      onSubmit_draft(){

        for(let i=0;i<this.data_list.length;i++)
        this.itemsArr[i] = {
          'id': parseInt(this.data_list[i].id),
          'panel_name': this.panelName,
          'front': parseInt(this.front[i] == undefined ? 0 : this.front[i]),
          'rear': parseInt(this.rear[i] == undefined ? 0 : this.rear[i]),
          'remark': this.remarks[i] == undefined || '' ? null : this.remarks[i],
          'mount_flag': true
        }
        this.form.value.data=this.itemsArr;
       
        let url = 'panel_wise/DraftupdateVerifiedPanelItems/';
        this.apiService.postData(url, this.form.value).then((res: any) => {

          this.toast.success("Saved Successfully");
         

          this.apiService.postData('logistics_dispatch_advice/alert_mail/', res.mail).then((mailres: any) => {
            
          })
         

         

         
        })

    }
    onSubmit(){
     
      for(let i=0;i<this.data_list.length;i++)
        this.itemsArr[i] = {
          'id': parseInt(this.data_list[i].id),
          'panel_name': this.panelName,
          'front': parseInt(this.front[i] == undefined ? 0 : this.front[i]),
          'rear': parseInt(this.rear[i] == undefined ? 0 : this.rear[i]),
          'remark': this.remarks[i] == undefined || '' ? null : this.remarks[i],
          'mount_flag': true
        }
        
        this.form.value.data=this.itemsArr;
   
     
       let url = 'panel_wise/updateVerifiedPanelItems/';
      this.apiService.postData(url, this.form.value).then((res: any) => {
        this.toast.success("Verified Successfully");

        this.dialogClose();
        this.apiService.postData('logistics_dispatch_advice/alert_mail/', res.mail).then((mailres: any) => {
          
        })
       

       
       
      })

  }

}