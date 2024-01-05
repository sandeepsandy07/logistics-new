import { Component, OnInit, OnDestroy } from '@angular/core';
import { Inject, ViewChild } from '@angular/core';

import { UntypedFormGroup, UntypedFormControl, FormGroupDirective, NgForm, Validators, UntypedFormArray, UntypedFormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute, Params } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StorageServiceService } from 'src/app/service-storage.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { FileUploader } from "ng2-file-upload";
import { MatRadioChange } from '@angular/material/radio';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';




export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-dispatch-advice',
  templateUrl: './dispatch-advice.component.html',
  styleUrls: ['./dispatch-advice.component.css']
})
export class DispatchAdviceComponent implements OnInit, OnDestroy {
  apiUrl = environment.apiUrl;
  public test1 = 1;
  public form: UntypedFormGroup;
  public edit: boolean = false;
  public dispatchList: any;
  public viewRecords: any;
  public userList: any;
  public soDetailList: any;
  public soList: any;
  public deliveryList: any;
  public insurencescopelist: any;
  public insurenceTypelist: any;
  public transportationlist: any;
  public freightModelist: any;
  public packingInstructionlist: any;
  public licensetyplist: any;
  public billtodynamic: any;
  public shiptodynamic: any;
  public soldtodynamic: any;
  public tablelist: any;
  public gstlist: any;
  public reponce_approval_list: any;
  public da_no: any;
  public headerDate: any;
  public subdeptlist: any;
  public fileTypes: any;
  uploadForm: UntypedFormGroup;
  public da_files: any;
  public user_data: any;
  public approverslist:any;
  public da_submit_button: boolean = true;
  public action: any;
  public file_select:any=[];
  public file_count:any=0;
  public edit_approval_flow:boolean=true;




  url = "module_work_flow/";
  public files: any;
  public allTypeFiles: any;
  matcher = new MyErrorStateMatcher();
  public success: boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  forma = new UntypedFormGroup({
    fruits: new UntypedFormControl([], Validators.required)
  });

  get fruits() {
    return this.forma.get('fruits');
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our 
    if ((value || '').trim()) {
      this.fruits.setValue([...this.fruits.value, value.trim()]);
      this.fruits.updateValueAndValidity();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: string): void {
    const index = this.fruits.value.indexOf(fruit);

    if (index >= 0) {
      this.fruits.value.splice(index, 1);
      this.fruits.updateValueAndValidity();
    }
  }





  emailFormControl = new UntypedFormControl('', [Validators.required, Validators.email]);

  constructor(public api: ApiserviceService,
    private activatedroute: ActivatedRoute,
    private route: Router,
    public datepipe: DatePipe,
    public storage: StorageServiceService,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    public toast: ToastrService,
    private http: HttpClient,
  ) {
    const navigation = this.route.getCurrentNavigation();
    const state = navigation.extras.state as { dad_id: string, action: string, readonly: boolean };

    this.action = state.action;
    if (this.action == 'edit') {

      this.da_no = state.dad_id;



    }
    this.user_data = this.storage.getuser_data();

    this.form = this.fb.group({

      da_to: new UntypedFormControl('Logistics'),
      da_cc: new UntypedFormControl(null),
      da_date: new UntypedFormControl(),
      non_billable_value: new UntypedFormControl(null),
      mode_of_payment: new UntypedFormControl(null),
      mode_of_dispatch: new UntypedFormControl(null, { validators: [Validators.required] }),
      mode_of_delivery: new UntypedFormControl(null, { validators: [Validators.required] }),
      ygs_proj_defi: new UntypedFormControl(null),
      da_from: new UntypedFormControl(this.user_data.sub_dept_id, { validators: [Validators.required] }),
      job_name: new UntypedFormControl(null),
      job_code: new UntypedFormControl(null, { validators: [Validators.required] }),
      po_no: new UntypedFormControl(null, { validators: [Validators.required] }),
      po_date: new UntypedFormControl(),
      so_no: new UntypedFormControl(null, { validators: [Validators.required] }),
      bill_to: new UntypedFormControl(null, { validators: [Validators.required] }),
      insurance_scope: new UntypedFormControl(null, { validators: [Validators.required] }),
      bill_type: new UntypedFormControl(null, { validators: [Validators.required] }),
      ship_to: new UntypedFormControl(null, { validators: [Validators.required] }),
      sold_to: new UntypedFormControl(null, { validators: [Validators.required] }),
      bom_dispatch: new UntypedFormControl(),
      pwb_material: new UntypedFormControl(),
      bill_to_gst: new UntypedFormControl(null),
      ship_to_gst: new UntypedFormControl(null),
      sold_to_gst: new UntypedFormControl(null),
      email: new UntypedFormControl(null, { validators: [Validators.email] }),
      telephone_no: new UntypedFormControl(null),
      mobile_no: new UntypedFormControl(null, { validators: [Validators.required] }),
      otr_person_name: new UntypedFormControl(null),
      insurance_amt: new UntypedFormControl(null, { validators: [Validators.pattern('[0-9 ]*')] }),
      insurance_type: new UntypedFormControl(),
      insurance_no: new UntypedFormControl(),
      insurance_address: new UntypedFormControl(),
      insurance_c_person: new UntypedFormControl(null, [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]),
      insurance_c_email: new UntypedFormControl(null, { validators: [Validators.email] }),
      customer_id: new UntypedFormControl(),
      insurance_c_mobile: new UntypedFormControl(null, { validators: [Validators.pattern('[0-9 ]{10}')] }),
      insurance_con_fax: new UntypedFormControl(null, { validators: [Validators.pattern('[0-9 ]*')] }),
      transportation_scope: new UntypedFormControl(),
      transporter_name: new UntypedFormControl(),
      freight_mode: new UntypedFormControl(),
      Fees_manager_name: new UntypedFormControl(null, [Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]),
      Fees_manager_mobile: new UntypedFormControl(null, { validators: [Validators.pattern('[0-9 ]{10}')] }),
      packing_instruction: new UntypedFormControl(),
      dispatch_clearance: new UntypedFormControl(),
      merit_duty_job: new UntypedFormControl(),
      license_type: new UntypedFormControl(),
      gst_type: new UntypedFormControl(null),
      bill_to_code: new UntypedFormControl(null, { validators: [Validators.required] }),
      location_unit: new UntypedFormControl(null, { validators: [Validators.required] }),
      ship_to_code: new UntypedFormControl(null, { validators: [Validators.required] }),
      sold_to_code: new UntypedFormControl(null, { validators: [Validators.required] }),
      ted_refund: new UntypedFormControl(),
      reimbursible: new UntypedFormControl(),
      time_critical_flag: new UntypedFormControl(),
      time_critical_date: new UntypedFormControl(),
      da_status: new UntypedFormControl(),
      remarks: new UntypedFormControl(),
      insurance_files: new UntypedFormArray([]),
      dispatch_clearance_files: new UntypedFormArray([]),
      check_by: new UntypedFormControl(),
      approve_by: new UntypedFormControl(),
      qa_test: new UntypedFormControl(),
      mqa_test: new UntypedFormControl(),
      bu_head: new UntypedFormControl(),
      contact_details: this.fb.array([]),
      da_files: this.fb.array([]),
      approverlist: this.fb.array([]),
      workflow_id: new UntypedFormControl(),
      region_no: new UntypedFormControl(),
      abc: new UntypedFormControl(123),
      notify_party_address: new UntypedFormControl(),
      notify_party_gst: new UntypedFormControl(),
      notify_party_code: new UntypedFormControl(),
      city: new UntypedFormControl(null),
      customer_name: new UntypedFormControl(null),
      street1: new UntypedFormControl(null),
      street2: new UntypedFormControl(null),
      country_name: new UntypedFormControl(null),
      postal_code: new UntypedFormControl(null),

      ship_to_city: new UntypedFormControl(null),
      ship_to_customer_name: new UntypedFormControl(null),
      ship_to_street1: new UntypedFormControl(null),
      ship_to_street2: new UntypedFormControl(null),
      ship_to_country_name: new UntypedFormControl(null),
      ship_to_postal_code: new UntypedFormControl(null),

      sold_to_city: new UntypedFormControl(null),
      sold_to_customer_name: new UntypedFormControl(null),
      sold_to_street1: new UntypedFormControl(null),
      sold_to_street2: new UntypedFormControl(null),
      sold_to_country_name: new UntypedFormControl(null),
      sold_to_postal_code: new UntypedFormControl(null),
      da_view_employees: new UntypedFormControl(null),
      da_project_employees: new UntypedFormControl(null),

      so_item_list: this.fb.array([]),

      warranty_type: new UntypedFormControl(null),
      repair_type: new UntypedFormControl(null),
      


    });



  }
  contactDetails(): UntypedFormArray {
    return this.form.get("contact_details") as UntypedFormArray
  }
  approvalform(): UntypedFormArray {
    return this.form.get("approverlist") as UntypedFormArray
  }
  daFiles(): UntypedFormArray {
    return this.form.get("da_files") as UntypedFormArray
  }
  newContactdetails(): UntypedFormGroup {
    return this.fb.group({
      name: '',
      email: '',
      mobile: '',
      fax_no: '',
      contact_type: '',

    })
  }
  editContactdetails(name, email, mobile, fax_no, contact_type): UntypedFormGroup {
    return this.fb.group({
      name: name,
      email: email,
      mobile: mobile,
      fax_no: fax_no,
      contact_type: contact_type,
    })
  }
  newapprovalform(approvalName, level, parallel, wf_id): UntypedFormGroup {
    return this.fb.group({
      approval: approvalName,
      level: level,
      parallel: parallel,
      wf_id: wf_id,
      emp_list: new UntypedFormArray([]),
      required_list: true,

    })
  }
  newDaFiles(): UntypedFormGroup {
    return this.fb.group({
      file_type: '',
      filelist: new UntypedFormArray([]),
    })
  }
  addnewapprovalform(approvalName, level, parallel, wf_id) {

    this.approvalform().push(this.newapprovalform(approvalName, level, parallel, wf_id));

  }
  addContactdetails() {
    this.contactDetails().push(this.newContactdetails());
  }
  edit_addContactdetails(name, email, mobile, fax_no, contact_type) {
    this.contactDetails().push(this.editContactdetails(name, email, mobile, fax_no, contact_type));
  }

  addDaFiles() {
    this.daFiles().push(this.newDaFiles());
    this.file_select[this.file_count]=false;
    this.file_count++;
    
  }
  removeContactdetails(i: number) {
    this.contactDetails().removeAt(i);
  }
  removeDaFiles(i: number) {
    this.daFiles().removeAt(i);
  }

  ngOnInit(): void {
    
    this.getListOfDispatchValues();
    if (this.action != 'edit') {
      this.addContactdetails();
      this.success = true;
    } else {
      this.showloader();
      this.edit_approval_flow=false;
    }
    this.addDaFiles();
  }



  daNavigation(id, nav_url) {
    const navigationExtras: NavigationExtras = { state: { dad_id: id } };
    this.route.navigate([nav_url], navigationExtras);
  }
  show_file_select(i){
    this.file_select[i]=true;
  }
  onEditMode(element: any) {

    this.showloader();
    if (element) {

      this.api.viewuser("logistics_dispatch_advice/", element).then((data: any) => {
        this.edit = true;
        this.viewRecords = data.records;
        this.da_no = this.viewRecords['da_id'];
        this.form.patchValue({

          da_to: this.viewRecords['da_to'] ? this.viewRecords['da_to'] : null,
          da_cc: this.viewRecords['da_cc'] ? this.viewRecords['da_cc'] : null,
          mode_of_dispatch: Number(this.viewRecords['mode_of_dispatch'] ? this.viewRecords['mode_of_dispatch'] : null),
          mode_of_payment: this.viewRecords['mode_of_payment'] ? this.viewRecords['mode_of_payment'] : null,
          gst_type: Number(this.viewRecords['gst_type'] ? this.viewRecords['gst_type'] : null),

          mode_of_delivery: Number(this.viewRecords['mode_of_delivery'] ? this.viewRecords['mode_of_delivery'] : null),
          ygs_proj_defi: this.viewRecords['ygs_proj_defi'] ? this.viewRecords['ygs_proj_defi'] : null,
          da_from: this.viewRecords['da_from'] ? this.viewRecords['da_from'] : null,
          job_name: this.viewRecords['job_name'] ? this.viewRecords['job_name'] : null,
          location_unit: this.viewRecords['location_unit'] ? this.viewRecords['location_unit'] : null,
          job_code: this.viewRecords['job_code'] ? this.viewRecords['job_code'] : null,
          po_no: this.viewRecords['po_no'] ? this.viewRecords['po_no'] : null,
          po_date: this.viewRecords['po_date'] ? this.viewRecords['po_date'] : null,
          so_no: this.viewRecords['so_no'] ? this.viewRecords['so_no'] : null,
          da_as: this.viewRecords['da_as'] ? this.viewRecords['da_as'] : null,
          bill_to: this.viewRecords['bill_to'] ? this.viewRecords['bill_to'] : null,
          insurance_scope: Number(this.viewRecords['insurance_scope'] ? this.viewRecords['insurance_scope'] : null),
          bill_type: this.viewRecords['bill_type'] ? this.viewRecords['bill_type'] : null,
          ship_to: this.viewRecords['ship_to'] ? this.viewRecords['ship_to'] : null,
          sold_to: this.viewRecords['sold_to'] ? this.viewRecords['sold_to'] : null,
          bom_dispatch: this.viewRecords['bom_dispatch'] ? this.viewRecords['bom_dispatch'] : null,
          pwb_material: this.viewRecords['pwb_material'] ? this.viewRecords['pwb_material'] : null,
          bill_to_gst: this.viewRecords['bill_to_gst'] ? this.viewRecords['bill_to_gst'] : null,
          ship_to_gst: this.viewRecords['ship_to_gst'] ? this.viewRecords['ship_to_gst'] : null,
          sold_to_gst: this.viewRecords['sold_to_gst'] ? this.viewRecords['sold_to_gst'] : null,
          email: this.viewRecords['email'] ? this.viewRecords['email'] : null,
          telephone_no: this.viewRecords['telephone_no'] ? this.viewRecords['telephone_no'] : null,
          mobile_no: this.viewRecords['mobile_no'] ? this.viewRecords['mobile_no'] : null,
          otr_person_name: this.viewRecords['otr_person_name'] ? this.viewRecords['otr_person_name'] : null,
          insurance_amt: this.viewRecords['insurance_amt'] ? this.viewRecords['insurance_amt'] : null,
          non_billable_value: this.viewRecords['non_billable_value'] ? this.viewRecords['non_billable_value'] : null,
          insurance_type: Number(this.viewRecords['insurance_type'] ? this.viewRecords['insurance_type'] : null),
          insurance_no: this.viewRecords['insurance_no'] ? this.viewRecords['insurance_no'] : null,
          insurance_address: this.viewRecords['insurance_address'] ? this.viewRecords['insurance_address'] : null,
          insurance_c_person: this.viewRecords['insurance_c_person'] ? this.viewRecords['insurance_c_person'] : null,
          insurance_c_email: this.viewRecords['insurance_c_email'] ? this.viewRecords['insurance_c_email'] : null,
          insurance_c_mobile: this.viewRecords['insurance_c_mobile'] ? this.viewRecords['insurance_c_mobile'] : null,
          insurance_con_fax: this.viewRecords['insurance_con_fax'] ? this.viewRecords['insurance_con_fax'] : null,
          transportation_scope: Number(this.viewRecords['transportation_scope'] ? this.viewRecords['transportation_scope'] : null),
          transporter_name: this.viewRecords['transporter_name'] ? this.viewRecords['transporter_name'] : null,
          freight_mode: Number(this.viewRecords['freight_mode'] ? this.viewRecords['freight_mode'] : null),
          Fees_manager_name: this.viewRecords['Fees_manager_name'] ? this.viewRecords['Fees_manager_name'] : null,
          Fees_manager_mobile: this.viewRecords['Fees_manager_mobile'] ? this.viewRecords['Fees_manager_mobile'] : null,
          packing_instruction: Number(this.viewRecords['packing_instruction'] ? this.viewRecords['packing_instruction'] : null),
          dispatch_clearance: this.viewRecords['dispatch_clearance'] ? this.viewRecords['dispatch_clearance'] : null,
          merit_duty_job: this.viewRecords['merit_duty_job'] ? this.viewRecords['merit_duty_job'] : null,
          license_type: Number(this.viewRecords['license_type'] ? this.viewRecords['license_type'] : null),
          ted_refund: this.viewRecords['ted_refund'] ? this.viewRecords['ted_refund'] : null,
          reimbursible: this.viewRecords['reimbursible'] ? this.viewRecords['reimbursible'] : null,
          time_critical_flag: this.viewRecords['time_critical_flag'] ? this.viewRecords['time_critical_flag'] : null,
          time_critical_date: this.viewRecords['time_critical_date'] ? this.viewRecords['time_critical_date'] : null,
          remarks: this.viewRecords['remarks'] ? this.viewRecords['remarks'] : null,
          ship_to_code: this.viewRecords['ship_to_code'] ? this.viewRecords['ship_to_code'] : null,
          sold_to_code: this.viewRecords['sold_to_code'] ? this.viewRecords['sold_to_code'] : null,
          bill_to_code: this.viewRecords['bill_to_code'] ? this.viewRecords['bill_to_code'] : null,
          notify_party_code: this.viewRecords['notify_party_code'] ? this.viewRecords['notify_party_code'] : null,
          notify_party_gst: this.viewRecords['notify_party_gst'] ? this.viewRecords['notify_party_gst'] : null,
          notify_party_address: this.viewRecords['notify_party_address'] ? this.viewRecords['notify_party_address'] : null,
          
          city: this.viewRecords['city']? this.viewRecords['city']: null,
          customer_name:  this.viewRecords['customer_name']? this.viewRecords['customer_name']: null,
          street1: this.viewRecords['street1']? this.viewRecords['street1']: null,
          street2:  this.viewRecords['street2']? this.viewRecords['street2']: null,
          country_name:  this.viewRecords['country_name']? this.viewRecords['country_name']: null,
          postal_code:  this.viewRecords['postal_code']? this.viewRecords['postal_code']: null,

          ship_to_city:  this.viewRecords['ship_to_city']? this.viewRecords['ship_to_city']: null,
          ship_to_customer_name:  this.viewRecords['ship_to_customer_name']? this.viewRecords['ship_to_customer_name']: null,
          ship_to_street1:  this.viewRecords['ship_to_street1']? this.viewRecords['ship_to_street1']: null,
          ship_to_street2:  this.viewRecords['ship_to_street2']? this.viewRecords['ship_to_street2']: null,
          ship_to_country_name:  this.viewRecords['ship_to_country_name']? this.viewRecords['ship_to_country_name']: null,
          ship_to_postal_code: this.viewRecords['ship_to_postal_code']? this.viewRecords['ship_to_postal_code']: null,
  
          sold_to_city: this.viewRecords['sold_to_city']? this.viewRecords['sold_to_city']: null,
          sold_to_customer_name:  this.viewRecords['sold_to_customer_name']? this.viewRecords['sold_to_customer_name']: null,
          sold_to_street1: this.viewRecords['sold_to_street1']? this.viewRecords['sold_to_street1']: null,
          sold_to_street2: this.viewRecords['sold_to_street2']? this.viewRecords['sold_to_street2']: null,
          sold_to_country_name:  this.viewRecords['sold_to_country_name']? this.viewRecords['sold_to_country_name']: null,
          sold_to_postal_code:  this.viewRecords['sold_to_postal_code']? this.viewRecords['sold_to_postal_code']: null,
          

          warranty_type:  this.viewRecords['warranty_type']? this.viewRecords['warranty_type']: null,
          repair_type:  this.viewRecords['repair_type']? this.viewRecords['repair_type']: null,

        });
        if (this.viewRecords['contact_details'].length > 0) {
          for (var i = 0; i < this.viewRecords['contact_details'].length; i++) {
            this.edit_addContactdetails(this.viewRecords['contact_details'][i].name, this.viewRecords['contact_details'][i].email,
              this.viewRecords['contact_details'][i].mobile, this.viewRecords['contact_details'][i].fax_no, this.viewRecords['contact_details'][i].contact_type);
          }
        } else {
          this.addContactdetails();
        }


        this.success = true;
        this.hideloader();




      })
      let threadData = {

        "da_id": element
  
      }
      this.api.postData("work_flow_da_approval/get_da_approvers/", threadData).then((threadresponce: any) => {

        this.approverslist = threadresponce;
       
      });
      
    }
  }
  myfunction(data: any) {
    this.storage.sethersertitle(data);
  }

  getListOfDispatchValues() {
    this.api.getData("logistics_dispatch_mode/").then((response) => {
      this.dispatchList = response;
      console.log("dispatch", this.dispatchList[1]);
    }, (error) => {
      console.log("error");
    })

    this.api.getData("logistics_DA_File_types/").then((response) => {
      this.fileTypes = response;
    }, (error) => {
      console.log("error");
    })
    // this.api.getData("user_sub_dept_list/").then((response:any) => {
    //   this.subdeptlist = response.filter(e => e.dept_id == this.user_data.dept_id);
    let data_sub_dept_id = {
      dept_id: this.user_data.dept_id
    }

    this.api.getData("user_sub_dept_list/").then((response: any) => {

      // this.api.postData("user_sub_dept_list/getSubDeptIdList/",data_sub_dept_id).then((response:any) => {
      this.subdeptlist = response

    }, (error) => {
      console.log("error");
    })

    this.api.getData("logistics_delivery_mode/").then((response) => {
      this.deliveryList = response;
    }, (error) => {
      console.log("error");
    })

    this.api.getData("logistics_insurance_scope/").then((response) => {
      this.insurencescopelist = response;
    }, (error) => {
      console.log("error");
    })

    this.api.getData("logistics_transportation_scope/").then((response) => {
      this.transportationlist = response;
    }, (error) => {
      console.log("error");
    });
    

    this.api.getData("logistics_insurance_type/").then((response) => {
      this.insurenceTypelist = response;
    }, (error) => {
      console.log("error");
    });

    this.api.getData("logistics_freight_mode/").then((response) => {
      this.freightModelist = response;
    }, (error) => {
      console.log("error");
    })
    this.api.getData("logistics_packing_instruction/").then((response) => {
      this.packingInstructionlist = response;
    }, (error) => {
      console.log("error");
    })
    this.api.getData("logistics_license_type/").then((response) => {
      this.licensetyplist = response;
    }, (error) => {
      console.log("error");
    })
    this.api.getData("logistics_gst_by/").then((response) => {
      this.gstlist = response;
    }, (error) => {
      console.log("error");
    })
    let bearer = this.storage.getBearerToken();
    let headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer' + ' ' + bearer
      })
    };
    this.http.get<any>('http://10.29.15.212/CreditApp/CreditApp_API/api/DCSExplorer/GetCustomerMasterData/200005958/undefined',headers).subscribe(
      (res: any) => {
      })

    this.api.getData("user_list/").then((response: any) => {
      this.userList = response.data;
      if (this.action == 'edit') {
        this.onEditMode(this.da_no);
      }

    }, (error) => {
      console.log("error");
    })

  }

  getSoDetails1231() {
    let data = {
      'so_no': this.form.value.so_no
    }
    this.api.postData("ngi_so_data/get_so_data/", data).then((response: any) => {

      console.log("sdfds", response);
      this.form.patchValue({

        bill_to: response.bill_to.customer_name + " " + response.bill_to.city + "  " + response.bill_to.street1 + response.bill_to.street2 + response.bill_to.country_name + response.bill_to.postal_code,
        bill_to_gst: response.bill_to.gstin,
        bill_to_code: response.bill_to_party,

        sold_to: response.sold_to.customer_name + " " + response.sold_to.city + "  " + response.sold_to.street1 + response.sold_to.street2 + response.sold_to.country_name + response.sold_to.postal_code,
        sold_to_gst: response.sold_to.gstin,
        sold_to_code: response.sold_to_party,

        ship_to: response.ship_to.customer_name + " " + response.ship_to.city + "  " + response.ship_to.street1 + response.ship_to.street2 + response.ship_to.country_name + response.ship_to.postal_code,
        ship_to_gst: response.ship_to.gstin,
        ship_to_code: response.ship_to_party,

        region_no: response.region_no,

        po_no: response.po_no ? response.po_no : null

      });
    }, (error) => {
      console.log("error");
    });
  }
  getSoDetails_by_p_id() {
    let data = {
      'so_no': this.form.value.so_no
    }

    this.api.postData("qtso_master/get_so_data/", data).then((response: any) => {
      this.form.value.so_item_list = response.item_wise;

      response = response.master
      console.log("sdfds", response);
      this.form.patchValue({

        bill_to: response.bill_to.customer_name + " " + response.bill_to.city + "  " + response.bill_to.street1 + response.bill_to.street2 + response.bill_to.country_name + response.bill_to.postal_code,
        bill_to_gst: response.bill_to.gstin,
        bill_to_code: response.bill_to_party,


        sold_to: response.sold_to.customer_name + " " + response.sold_to.city + "  " + response.sold_to.street1 + response.sold_to.street2 + response.sold_to.country_name + response.sold_to.postal_code,
        sold_to_gst: response.sold_to.gstin,
        sold_to_code: response.sold_to_party,

        ship_to: response.ship_to.customer_name + " " + response.ship_to.city + "  " + response.ship_to.street1 + response.ship_to.street2 + response.ship_to.country_name + response.ship_to.postal_code,
        ship_to_gst: response.ship_to.gstin,
        ship_to_code: response.ship_to_party,
        region_no: response.bill_to.region_no,

        city: response.bill_to.city ? response.bill_to.city : null,
        customer_name: response.bill_to.customer_name ? response.bill_to.customer_name : null,
        street1: response.bill_to.street1 ? response.bill_to.street1 : null,
        street2: response.bill_to.street2 ? response.bill_to.street2 : null,
        country_name: response.bill_to.country_name ? response.bill_to.country_name : null,
        postal_code: response.bill_to.postal_code ? response.bill_to.postal_code : null,

        ship_to_city: response.ship_to.city ? response.ship_to.city : null,
        ship_to_customer_name: response.ship_to.customer_name ? response.ship_to.customer_name : null,
        ship_to_street1: response.ship_to.street1 ? response.ship_to.street1 : null,
        ship_to_street2: response.ship_to.street2 ? response.ship_to.street2 : null,
        ship_to_country_name: response.ship_to.country_name ? response.ship_to.country_name : null,
        ship_to_postal_code: response.ship_to.postal_code ? response.ship_to.postal_code : null,

        sold_to_city: response.sold_to.city ? response.sold_to.city : null,
        sold_to_customer_name: response.sold_to.customer_name ? response.sold_to.customer_name : null,
        sold_to_street1: response.sold_to.street1 ? response.sold_to.street1 : null,
        sold_to_street2: response.sold_to.street2 ? response.sold_to.street2 : null,
        sold_to_country_name: response.sold_to.country_name ? response.sold_to.country_name : null,
        sold_to_postal_code: response.sold_to.postal_code ? response.sold_to.postal_code : null,



        po_no: response.po_number ? response.po_number : null,
        po_date: response.po_date ? response.po_date : null,


      });

     



    }, (error) => {
      this.toast.error("So details No Found,please take QTSO (ZGSDR00006) report from SAP and click on Upload SO button in top right and upload the qtso report) ")
      console.log("error");
    });
  }

  getJobDetails() {

    let data_details = {
      'job_code': this.form.value.job_code
    }
    this.api.postData("job_intimation_data/get_job_code_data/", data_details).then((data: any) => {
      this.soDetailList = data[0];
      this.soList = this.soDetailList.sale_order_no;
      this.form.patchValue({
        job_name: this.soDetailList.job_name,
        ygs_proj_defi: this.soDetailList.ygs_project_id,
        Fees_manager_name: this.soDetailList.fes_manager_name
      });
    }, (error) => {
      this.toast.error("No Found")
      console.log("error");
    });
  }
  getJobDetails_p_id() {

    let data_details = {
      'project_id': this.form.value.ygs_proj_defi
    }
    this.api.postData("qtso_master/get_so_code/", data_details).then((data: any) => {
      this.soDetailList = data;
      this.toast.error(data.message)
      this.soList = this.soDetailList.sale_order_no;
      this.form.patchValue({
        // job_name:this.soDetailList.job_name,
        po_no: this.soDetailList.po_number[0],
        // po_date:this.soDetailList.so_no[0].po_number
      });
    }, (error) => {
      this.toast.error("No Found")
      console.log("error");
    });
  }
  get f() { return this.form.controls; }

  removefile(index: number) {
    let temp = [];
    for (let i = 0; i < this.files.length; i++) {
      if (i != index) {
        temp.push(this.files[i]);
      }
    }
    this.files = temp;
  }

  onSelectFiles(event: any, columnindex: any) {
   
   
    let file = event.target.files;
    this.allTypeFiles = file;
    for (let obj of this.allTypeFiles) {
      this.form.value.da_files[columnindex].filelist.push(obj);
    }
    console.log("files",this.form.value.da_files)
  }

  onImagePicked(event: any, columnName: any) {
    let file = event.target.files;
    this.files = file;
    if (columnName == 'insurance') {
      for (let obj of this.files) {
        this.form.value.insurance_files.push(obj);
      }
    } else {
      for (let obj of this.files) {
        this.form.value.dispatch_clearance_files.push(obj);
      }
    }
  }

  getCustomerDetails(columnName: any) {
    if (columnName == 'sold_to_code') {
      let soldtodata = {
        "customer_no": this.form.value.sold_to_code
      }
      this.api.postData("customer_details_data/get_customer_data/", soldtodata).then((soldtores: any) => {
        this.form.patchValue({
          sold_to: soldtores.customer_name + " " + soldtores.city + "  " + soldtores.street1 + soldtores.street2 + soldtores.country_name + soldtores.postal_code,
          sold_to_gst: soldtores.gstin,

          
              sold_to_city: soldtores.city ? soldtores.city : null,
              sold_to_customer_name: soldtores.customer_name ? soldtores.customer_name : null,
              sold_to_street1: soldtores.street1 ? soldtores.street1 : null,
              sold_to_street2: soldtores.street2 ? soldtores.street2 : null,
              sold_to_country_name: soldtores.country_name ? soldtores.country_name : null,
              sold_to_postal_code: soldtores.postal_code ? soldtores.postal_code : null,



        });
      });

    } else if (columnName == 'bill_to_code') {
      let billtodata = {
        "customer_no": this.form.value.bill_to_code
      }
      this.api.postData("customer_details_data/get_customer_data/", billtodata).then((billtores: any) => {
        
        this.form.patchValue({
          bill_to: billtores.customer_name + " " + billtores.city + "  " + billtores.street1 + billtores.street2 + billtores.country_name + billtores.postal_code,
          bill_to_gst: billtores.gstin,
          customer_id: billtores.customer_no,

          city: billtores.city ? billtores.city : null,
          customer_name: billtores.customer_name ? billtores.customer_name : null,
          street1: billtores.street1 ? billtores.street1 : null,
          street2: billtores.street2 ? billtores.street2 : null,
          country_name: billtores.country_name ? billtores.country_name : null,
          postal_code: billtores.postal_code ? billtores.postal_code : null,
        });
      });

    } else if (columnName == 'ship_to_code') {
      let shiptodata = {
        "customer_no": this.form.value.ship_to_code
      }
      this.api.postData("customer_details_data/get_customer_data/", shiptodata).then((shiptores: any) => {
        this.form.patchValue({
          ship_to: shiptores.customer_name + " " + shiptores.city + "  " + shiptores.street1 + shiptores.street2 + shiptores.country_name + shiptores.postal_code,
          ship_to_gst: shiptores.gstin,
          ship_to_city: shiptores.city ? shiptores.city : null,
          ship_to_customer_name: shiptores.customer_name ? shiptores.customer_name : null,
          ship_to_street1: shiptores.street1 ? shiptores.street1 : null,
          ship_to_street2: shiptores.street2 ? shiptores.street2 : null,
          ship_to_country_name: shiptores.country_name ? shiptores.country_name : null,
          ship_to_postal_code: shiptores.postal_code ? shiptores.postal_code : null,
        })
      });
    
    } else {
      let shiptodata = {
        "customer_no": this.form.value.ship_to_code
      }
      this.api.postData("customer_details_data/get_customer_data/", shiptodata).then((shiptores: any) => {
        this.form.patchValue({
          notify_party_address: shiptores.customer_name + " " + shiptores.city + "  " + shiptores.street1 + shiptores.street2 + shiptores.country_name + shiptores.postal_code,
          notify_party_gst: shiptores.gstin

          
          
        })
      });
    }
  }

  onSubmitPost() {


    if (this.form.invalid) {

      this.toast.error("Please enter valid details");
      return;

    }
    this.da_submit_button = false;




    this.showloader();

    if (!this.edit) {
      let approve_len = this.reponce_approval_list.length;
      for (let i = 0; i < approve_len; i++) {

        if (this.form.value.approverlist[i].emp_list.length == 0) {
          this.toast.error("Please select all the approvers");
          return;
        }
      }
      this.form.value.da_status = "saveAll";
      this.form.value.workflow_id = this.reponce_approval_list[0].wf_id;
      this.form.value.time_critical_date = this.datepipe.transform(this.form.value.time_critical_date, 'dd-MM-yyyy');
      this.form.value.po_date = this.datepipe.transform(this.form.value.po_date, 'dd-MM-yyyy');
      const formData: FormData = new FormData();
      const formData_multi: FormData = new FormData();

      let obj = { ...this.form.value };
      console.log("obj", obj)

      let bearer = this.storage.getBearerToken();
      let headers = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer' + ' ' + bearer
        })
      };




      for (var i = 0; i < this.form.value.da_files.length; i++) {
        for (var j = 0; j < this.form.value.da_files[i].filelist.length; j++) {
          formData_multi.append(this.form.value.da_files[i].file_type, this.form.value.da_files[i].filelist[j]);
        }
      }
      for (var i = 0; i < this.form.value.dispatch_clearance_files.length; i++) {
        formData.append('dispatch_clearence', this.form.value.dispatch_clearance_files[i]);
      }


      for (var i = 0; i < this.form.value.insurance_files.length; i++) {

        formData.append('insurance_files', this.form.value.insurance_files[i]);

      }

      this.api.postData("logistics_dispatch_advice/", obj).then((response: any) => {

        this.form.reset();
        formData.append('da_id', JSON.stringify(response.da_id));
        this.http.post<any>(this.apiUrl + "logistics_dispatch_advice/file_attachement/", formData, headers).subscribe(
          (res: any) => {

          });

        formData_multi.append('da_id', JSON.stringify(response.da_id));
        formData_multi.append("module_id", JSON.stringify(response.da_id));
        formData_multi.append("module_name", "DA");
        this.http.post<any>(this.apiUrl + "logistics_dispatch_advice/multifile_attachement/", formData_multi, headers).subscribe(
          (res: any) => {

          });

        if (Response) {
          this.hideloader();
        }
        this.daNavigation(response.da_id, '/material/billableform');
      }, (error) => {
        this.hideloader();
        this.toast.error(error)
        console.log("error");
      })
    }
    else {
      this.form.value.da_status = "saveAll";
      this.form.value.po_date = this.datepipe.transform(this.form.value.po_date, 'dd-MM-yyyy');
      this.form.value.time_critical_date = this.datepipe.transform(this.form.value.time_critical_date, 'dd-MM-yyyy');

      console.log(this.form.value);
      let obj = { ...this.form.value };
      this.api.updateData("logistics_dispatch_advice/" + this.da_no + "/", obj).then((response: any) => {
        this.form.reset();
        this.route.navigate(['/material/da']);

      }, (error) => {
        console.log("error");
      })

    }


  }
  showapperslistedit(e){
   
    this.edit_approval_flow=!this.edit_approval_flow;
  
  }
  showloader() {
    document.getElementById('loadingform').style.display = 'block';
  }
  hideloader() {
    document.getElementById('loadingform').style.display = 'none';
  }

  upload_single_file(da_id) {



  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  getapprovellist_type(event: MatRadioChange) {
    let bill_type = event.value;

    this.getapprovellist(this.form.value.da_from, bill_type)
  }
  getapprovellist_dept() {
    // let dep_id = event.target.value;
    this.getapprovellist(this.form.value.da_from, this.form.value.bill_type)
  }
  
  getapprovellist(dept_id, bill_type) {

    if (dept_id != null && bill_type != null) {

      let data = {
        "dept_code": dept_id,
        "bill_type": bill_type
      }
      this.api.postData("work_flow_access/workflow_filter/", data).then((responce: any) => {
        this.reponce_approval_list = responce;
        if(this.form.value.approverlist.length > 0){
          (this.form.controls['approverlist'] as UntypedFormArray).clear();
        }
       
        for (let listapp of responce) {
          this.addnewapprovalform(listapp.approver, listapp.level, listapp.parallel, listapp.wf_id)
        }
        console.log("msg",this.form.value);
      }, (error) => {
        console.log("error");
      });

    }



  }
  onChangeapproaver(deviceValue, approvar_send, i) {

    // let module_id_index=this.form.value.approverlist.indexOf(this.form.value.approverlist[i].find(e => e.approval === approvar_send))
    this.form.value.approverlist[i].emp_list = deviceValue;
  }

  onChangeapproaver_checkbox(deviceValue, approvar_send, i) {
    this.form.value.approverlist[i].required_list = deviceValue.checked;
    console.log(deviceValue.checked);

  }
  qtso_upload()
  {
    const dialogRef = this.dialog.open(OpenQTSOFileUploadPage, {
      height: '200px',
      width: '600px', 
      maxWidth:'100%', 
    }); 
  }
  Syncc_customer()
  {
    const dialogRef = this.dialog.open(OpenSynccCustomer, {
      height: '400px',
      width: '900px', 
      maxWidth:'100%', 
    }); 
  }


}

@Component({
  selector: 'open-dialog-panel',
  templateUrl: 'qtso-file-upload.html'
  , styles: [`
:host {

 flex-direction: column;
 height: 89%;
 max-width:100% !important;

}

 mat-dialog-content {
flex-grow: 1;

 }
 mat-dialog-container{
 background-color:#62b8f56e !important;
 }
 `]
})
export class OpenQTSOFileUploadPage {

  truck_list_id: any = "";
  truckList: any = "";
  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  viewBtn: any = "upload";
  public onupload_button: boolean = true;

  uploadForm: UntypedFormGroup;

  tableShow: boolean = false;
  displayedColumns = ['slno', 'DateTime', 'Status', 'Location'];


  constructor(
    private formBuilder: UntypedFormBuilder,
    private toaster: ToastrService,
    public storage: StorageServiceService,
    public toast: ToastrService,
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<OpenQTSOFileUploadPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.uploadForm = this.formBuilder.group({
      qtso_file: new UntypedFormControl("", Validators.required),
    });
  }
  

  OnFileSelect(event, name) {
    let file = event.target.files[0];
    this.uploadForm.get(name).setValue(file);
  }

  fileUpload() {
    let bearer = this.storage.getBearerToken();
    let headers = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer' + ' ' + bearer
      })
    };
    const formData: FormData = new FormData();
    if (this.uploadForm.status == "INVALID") {
      this.toaster.error("Please upload file")
    }
    else {
      this.onupload_button = false;
      formData.append("qtso_file", this.uploadForm.get("qtso_file").value);
      this.http.post<any>(this.url + "qtsofile/", formData, headers).subscribe(
        (res: any) => {
          this.toaster.success("QTSO Data Uploaded successfully");
          if (res == true) {
            let data = {
            }
            this.http.post<any>(this.url + "qtso/", data).subscribe(
              (res: any) => {
                this.toaster.success("QTSO file called successfully");
              });
          }
          this.onupload_button = true;
        });
    }
  }

  dialogClose() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'open-syncc-customer',
  templateUrl: 'syncc-customer-sap.html'
  , styles: [`
:host {

 flex-direction: column;
 height: 89%;
 max-width:100% !important;

}

 mat-dialog-content {
flex-grow: 1;

 }
 mat-dialog-container{
 background-color:#62b8f56e !important;
 }
 `]
})
export class OpenSynccCustomer {

  truck_list_id: any = "";
  truckList: any = "";
  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  viewBtn: any = "upload";
  public onupload_button: boolean = true;

  form: UntypedFormGroup;

  tableShow: boolean = false;
  displayedColumns = ['slno', 'DateTime', 'Status', 'Location'];


  constructor(
    private formBuilder: UntypedFormBuilder,
    private toaster: ToastrService,
    public storage: StorageServiceService,
    public toast: ToastrService,
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<OpenSynccCustomer>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
      customer_no: new UntypedFormControl("", Validators.required),
      customer_name: new UntypedFormControl("", Validators.required),
      country_name: new UntypedFormControl("", Validators.required),
      postal_code: new UntypedFormControl("", Validators.required),
      city: new UntypedFormControl("", Validators.required),
      street1: new UntypedFormControl("", Validators.required),
      street2: new UntypedFormControl(""),
      street3: new UntypedFormControl(""),
      gstin: new UntypedFormControl(""),
      region_no: new UntypedFormControl(""),
    });
  }
  
  getCustomerDetailsSyncc() {
    
      let soldtodata = {
        "customer_no": this.form.value.customer_no
      }
      this.apiService.postData("customer_details_data/get_customer_data/",soldtodata).then((soldtores: any) => {
      
      this.form.patchValue({
         
            gstin: soldtores.gstin,
            customer_no: soldtores.gstin,
              city: soldtores.city ? soldtores.city : '',
              customer_name: soldtores.customer_name ? soldtores.customer_name : '',
              street1: soldtores.street1 ? soldtores.street1 : '',
              street2: soldtores.street2 ? soldtores.street2 : '',
              street3: soldtores.street2 ? soldtores.street3 :'' ,
              country_name: soldtores.country_name ? soldtores.country_name : '',
              postal_code: soldtores.postal_code ? soldtores.postal_code : '',

          
  


        });
      }, (error) => {

        this.http.get<any>('http://10.29.15.166:56/api/customer/GetCustomerDetails?customercode='+this.form.value.customer_no).subscribe(
          (soldtores: any) => {
            soldtores=soldtores[0]
              this.form.patchValue({
                
                gstin: soldtores.GSTNo,
                customer_no: soldtores.YGSSAPCustomerCode,
                city: soldtores.City ? soldtores.City : '',
                customer_name: soldtores.CustomerName1 ? soldtores.CustomerName1 : '',
                street1: soldtores.Address1 ? soldtores.Address1 : '',
                street2: soldtores.Address2 ? soldtores.Address2 : '',
                street3: soldtores.Address3 ? soldtores.Address3 :'' ,
                country_name: soldtores.CustomerCountry ? soldtores.CustomerCountry : '',
                postal_code: soldtores.PostalCode ? soldtores.PostalCode : '',
                region_no: soldtores.StateCode ? soldtores.StateCode : '',

                  });
        this.toast.error(error)
        console.log("error");
      })
    })
    
    }
  onSubmit(){

    if (this.form.invalid) {

      this.toast.error("Please enter valid details");
      return;

    }
    let obj = { ...this.form.value };
    this.apiService.postData("customer_details_data/update_customer_details/", obj).then((response: any) => {

      this.form.reset();
      this.toast.success("Data Added successfully")
      this.dialogClose();
   
    }, (error) => {
     
      this.toast.error(error)
      console.log("error");
    })

  }

  dialogClose() {
    this.dialogRef.close();
  }
}



