import { Component, OnInit, Inject, ViewChild, ElementRef ,ViewChildren ,QueryList} from '@angular/core';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';
import { Subject } from 'rxjs';
import { Moveingitem } from '../interfacetypecreate';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
  UntypedFormArray,

} from "@angular/forms";


import {DataTableDirective} from 'angular-datatables';
import { DatePipe } from '@angular/common';


import { HttpClient, HttpHeaders } from "@angular/common/http";


import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';



@Component({
  selector: 'app-da-panel-wise-approval',
  templateUrl: './da-panel-wise-approval.component.html',
  styleUrls: ['./da-panel-wise-approval.component.css']
})
export class DaPanelWiseApprovalComponent implements OnInit {

  public tablelist: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public tablelist2: any;
  dtOptions2: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject<any>();

  

  public showfilter:boolean=false
  public form_filter: UntypedFormGroup;


  public viewRecords: any;
  list: any;
  success: boolean = false;
  isListView: boolean = true;
  expandbtn: boolean = true;
  form: UntypedFormGroup;
  displayedColumns = ['slno.', 'qty', 'item_desc', 'make', 'model', 'remarks'];
  dataSource = new MatTableDataSource<['']>();
  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;
  uploadForm: UntypedFormGroup;

  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>; 

  @ViewChild('accordion') accordion: MatAccordion
  SAPDADetails: any;
  SAPDANo: any = 1;
  da_id: string;
  checkallbox: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient,
    public api: ApiserviceService,
    public toast: ToastrService,
    public dialog: MatDialog,
    public storage: StorageServiceService,
    private toastr: ToastrService,
    private router: Router,
    public datepipe: DatePipe
    
  ) {

    this.form = new UntypedFormGroup({
      da_id: new UntypedFormControl(),
      panel_wise_list: new UntypedFormArray([]),

    })
    this.form_filter = this.formBuilder.group({
      //add

      fromdate: new UntypedFormControl(),
      todate: new UntypedFormControl(),
      da_no: new UntypedFormControl(),
      so_no: new UntypedFormControl(),
      ygs_proj_defi: new UntypedFormControl(),
      job_code: new UntypedFormControl()
    })


  }

  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef;

  ngOnInit(): void {

    this.getListOfDispatchValues();
    this.dtOptions = {
      retrieve: true,
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };
    this.dtOptions2 = {
      dom: 'Bfrtip',
      retrieve: true,
      ordering: false,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };

  }

  getRecordsBasedOnFilterData() {

    let data = {
      status: 'all',
      col_name: 'is_active',
      col_value: true,
      da_user_req_status: 'approved',
      approve_status: 'Approver',
      from_date:'',
      to_date:'',
      filter_date:false,
      filter_data: false,
      filter_fields: {
      }
    }

    if (this.form.value.so_no != null) {
      data.filter_fields["so_no"] = this.form.value.so_no
      data.filter_data = true
    }
   
    if (this.form.value.da_no != null) {
      data.filter_fields["jobcode_da_no"] = this.form.value.da_no
      data.filter_data = true
    }
    if (this.form.value.job_code != null) {
      data.filter_fields["job_code"] = this.form.value.job_code
      data.filter_data = true
    }
    if (this.form.value.ygs_proj_defi != null) {
      data.filter_fields["ygs_proj_defi"] = this.form.value.ygs_proj_defi
      data.filter_data = true
    }
    if (this.form.value.fromdate != null && this.form.value.todate != null) {
      data.from_date = this.datepipe.transform(this.form.value.fromdate, 'yyyy-MM-dd');
      data.to_date = this.datepipe.transform(this.form.value.todate, 'yyyy-MM-dd');
      data.filter_date = true
    }
    this.api.postData("panel_wise/get_da_list_for_user_mqa_approved_with_filter/", data).then((response: any) => {
     
      this.dtTrigger2 = response;
      
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger2.next(void 0);
          this.dtTrigger.next(void 0);       
        });
      });
      
    }, (error) => {
      console.log("error");
    })


  }

  clearAllFilterDataFields() {
    this.form.reset();
   
    
      this.api.getData("panel_wise/get_da_list_for_user_mqa_approved/").then((response:any) => {
      this.dtTrigger2 = response;
      this.datatableElement.forEach((dtElement: DataTableDirective) => {
        dtElement.dtInstance.then((dtInstance: DataTables.Api) => {   
          dtInstance.destroy();
          this.dtTrigger2.next(void 0);
          this.dtTrigger.next(void 0);       
        });
      });
    
      
    }, (error) => {
      console.log("error");
    })

  }


ngOnDestroy(): void {
    this.dtTrigger2.unsubscribe();
  }

  getListOfDispatchValues() {
    this.api.getData("panel_wise/get_da_list_for_user/").then((response) => {
      this.tablelist = response;
      this.dtTrigger.next(void 0);
    }, (error) => {
      console.log("error");
    })
    this.api.getData("panel_wise/get_da_list_for_user_mqa_approved/").then((response) => {
      this.tablelist2 = response;
      this.dtTrigger2.next(void 0);
    }, (error) => {
      console.log("error");
    })

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
  getList(daid) {
    this.da_id = daid;
    this.success = true;
    this.viewData(daid);
    let url = "panel_wise_master/get_panel_wise_with_user/";
    let data = {
      da_id: daid
    }
    this.api.postData(url, data).then((res: any) => {
      this.list = res.data;
      let panel_tablearray: any = [];
      this.list[0].panel.map((products, index) => {
        let productObject = { ...products };
        productObject.checked_flag = false;
        productObject.single_checked_flag = false;
        panel_tablearray.push(productObject)
      })
      this.list[0].panel = panel_tablearray;
      console.log("approve list", res.data);
    })
  }

  onSubmit() {

    let bearer = this.storage.getBearerToken();
    let headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer' + ' ' + bearer
      })
    };

    const formData: FormData = new FormData();
    if (this.uploadForm.status == "INVALID") {
      this.toastr.error("Please upload file")
    } else {
      formData.append("panel_wise_material", this.uploadForm.get("panel_wise_material").value);
      formData.append('da_id', JSON.stringify(this.da_id));
      this.http.post<any>(this.url + "data/", formData, headers).subscribe(
        (res: any) => {
          this.toastr.success(res.message);
        });
    }
  }

  OnFileSelect(event, name) {
    let file = event.target.files[0];
    this.uploadForm.get(name).setValue(file);
  }


  getFilterList(panel: any, section: any) {

    let data = {

      da_id: this.da_id,

      panel_name: panel,

      section: section

    }

    let url = "panel_wise/get_panel_filter/"

    this.api.postData(url, data).then((res: any) => {

      this.openDialog(res);

    })

  }


  generateSinglePanelWisePdf(panel_name)
  {
    let url = "panel_wise/getPanel_List/";
    let data = {
      da_id : this.da_id,
      panel_name: panel_name
    }
    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    });

  }
  clickofallcheckbox(element) {

    let isChecked: boolean = element.checked;
    const cartoons = (this.form.controls.panel_wise_list as UntypedFormArray);
    if (isChecked) {

      for (let i = 0; i < this.list[0].panel.length; i++) {
        if(this.list[0].panel[i].status == 'verified'){
          if (cartoons.controls.filter(x => x.value.id === this.list[0].panel[i].id).length) {

          } else {
            cartoons.push(new UntypedFormControl(this.list[0].panel[i]));
            this.list[0].panel[i].checked_flag = true
  
          }
        }

        

      }
      this.checkallbox = true;


    } else {

      for (let i = 0; i < this.list[0].panel.length; i++) {

        const index = cartoons.controls.findIndex(x => x.value.id === this.list[0].panel[i].id);
        this.list[0].panel[i].checked_flag = false
        cartoons.removeAt(index);

      }
      this.checkallbox = true;



    }
  }

  isAllSelected(panel_length) {
    const cartoons = this.form.controls.panel_wise_list as UntypedFormArray;


    const numSelected = cartoons.controls.length

    if (numSelected == this.list[0].panel.filter(x => x.status == 'verified').length) {
      this.checkallbox = true;

    } else {
      this.checkallbox = false;
    }



    // this.itemList_box=this.data.panels.filter(row => row.qty != row.packed_qty);


    return numSelected === panel_length;
  }
  clickofcheckbox(panel_index, ele, element, panel_length) {

    let isChecked: boolean = element.checked;
    const cartoons = (this.form.controls.panel_wise_list as UntypedFormArray);
    if (isChecked) {
      cartoons.push(new UntypedFormControl(ele));
      this.list[0].panel[panel_index].checked_flag = true;


    } else {

      const index = cartoons.controls.findIndex(x => x.value.id === ele.id);
      this.list[0].panel[panel_index].checked_flag = false;
      cartoons.removeAt(index);

    }

    this.isAllSelected(panel_length);


  }

  multiplepanelapprove() {

    this.form.value.da_id = this.da_id;
    this.form.value.panel_wise_list
    let obj = { ...this.form.value };
    
    console.log("the",obj);

    this.api.postData('/panel_wise/updateMultipleApprovedPanelItems/',obj).then((res: any) => {

      this.toast.success("Approved successfully")
      const cartoons = (this.form.controls.panel_wise_list as UntypedFormArray);
      cartoons.controls = [];
      this.getList(this.da_id);

    });

  }


  openAllPanels() {
    this.expandbtn = false;
    this.accordion.openAll();
  }

  closeAllPanels() {
    this.expandbtn = true;
    this.accordion.closeAll();
  }


  getDAnoDetails() {
    let url = "logistics_dispatch_advice/" + 1
    this.api.getData(url).then((res: any) => {
      this.SAPDADetails = res;
    })
  }

  generatePDF(panel: any, section: any) {
    let url = "panel_wise/getPanelWise_List/";
    console.log("sapdetails", this.SAPDADetails);
    let data = {
      panel_name: panel,
      section: section,
      records: this.SAPDADetails
    }
    this.api.downloadPDF(url, data).then((data) => {
      var downloadURL = window.URL.createObjectURL(data);
      let tab = window.open();
      tab.location.href = downloadURL;
    });
  }

  openDialog(list: any) {
    const dialogRef = this.dialog.open(OpenDialogPanelApproval, {
      height: '90%',
      width: '100%',
      maxWidth: '100%',

      data: {
        panels: list
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      
      const cartoons = (this.form.controls.panel_wise_list as UntypedFormArray);
      cartoons.controls = [];
      this.getList(this.da_id);

    })
  }


} 

@Component({
  selector: 'open-dialog',
  templateUrl: 'panel-approve-dialog.html'
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
export class OpenDialogPanelApproval {

  displayedColumns = ['slno', 'item_desc', 'qty', 'front', 'rear', 'make', 'model', 'remarks', 'check_by'];
  displayedColumnsbox = ['slno', 'item_desc', 'qty', 'remarks'];
  dataSource = new MatTableDataSource<['']>();
  dataSourcebox = new MatTableDataSource<['']>();

  list: any;
  smallBox: any;
  sectionName: any;
  panelName: any;
  box_entered = [];
  box_types: any;
  form: UntypedFormGroup;
  boxform: UntypedFormGroup;
  showinvalidqty = [];
  panel_remarks: any;
  status: any;
  packing_flag:any;
  public description:any;

  tableShow: boolean = false;

  constructor(
    public toast: ToastrService,
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    public dialogRef: MatDialogRef<OpenDialogPanelApproval>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getFilterList();
    this.form = this.fb.group({

      data: new UntypedFormArray([]),

    });






  }



  getFilterList() {
    this.list = this.data.panels;
    this.sectionName = this.data.panels[0].section;
    this.panelName = this.data.panels[0].panel_name;
    this.status = this.data.panels[0].status;
    this.description=this.data.panels[0].description;
    this.packing_flag = this.data.panels[0].packing_flag;
    this.dataSource = new MatTableDataSource(this.data.panels);
    console.log("abc", this.data)

  }

  dialogClose() {
    this.dialogRef.close();
  }



  onSubmitPost(panelname,status) {
    let data = {
      da_id: this.data.panels[0].da_id,
      panel_name: panelname,
      remarks: this.panel_remarks,
      status:status
    }

    this.apiService.postData("panel_wise/updateApprovedPanelItems/", data).then((response: any) => {
      this.toast.success("Panel Approved Successfully");
      this.form.reset();
      let mail_data=response.mail;
      this.apiService.postData('logistics_dispatch_advice/alert_mail/', mail_data).then((mailres: any) => {
            
      })

    }, (error) => {

      console.log("error");

    })

  }
  onSubmitBoxToMain() {

    if (this.boxform.invalid || (this.boxform.value.box_list.length <= 0)) {
      alert("Please enter required details / atleast one item as to push to box");
      return;
    }

    let obj = { ...this.boxform.value };
    this.toast.success("Box Created Successfully");
    console.log(obj);
    this.boxform.reset();

  }
  onChangeQty(i) {

    if (this.box_entered[i] > this.data.panels[i].qty) {
      debugger;
      this.box_entered[i] = '';
      this.toast.error("Enter quantity is more than actual quantity");
    }
  }
  removeItemFromBox(item_id: any, item: any) {

    console.log(this.data.panels);
    this.form.value.item_list.splice(item, 1);
    console.log(this.data.panels.find(e => e.id === item_id['id']));
    let module_id_index = this.data.panels.indexOf(this.data.panels.find(e => e.id === item_id['id']))

    if (module_id_index >= 0) {
      this.data.panels.splice(module_id_index, 1);
    }

    this.data.panels.push(item_id);
    console.log(this.form.value.item_list);
    this.dataSource = new MatTableDataSource(this.data.panels);
    this.dataSourcebox = new MatTableDataSource(this.data.panels);

  }

}



