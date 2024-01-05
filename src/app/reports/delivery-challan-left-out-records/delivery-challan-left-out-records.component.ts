import { Component,OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { MatAccordion } from '@angular/material/expansion';
import { NavigationExtras } from '@angular/router';
import { StorageServiceService } from '../../service-storage.service';
import { Subject } from 'rxjs';
import { ActivatedRoute ,Params} from '@angular/router';
import { DatePipe } from '@angular/common';
import {DataTableDirective} from 'angular-datatables';

import {
  UntypedFormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,  
} from "@angular/forms";

import { HttpClient, HttpHeaders } from "@angular/common/http";


import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery-challan-left-out-records',
  templateUrl: './delivery-challan-left-out-records.component.html',
  styleUrls: ['./delivery-challan-left-out-records.component.css']
})
export class DeliveryChallanLeftOutRecordsComponent implements OnInit {
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  public tablelist:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  dtInstance: Promise<DataTables.Api>;
  dtElement: DataTableDirective;

  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    public dialog: MatDialog,
    private fb:UntypedFormBuilder,
    public toast:ToastrService) { }

  ngOnInit(): void {
    this.getErrorList();
    this.dtOptions = {
      dom: 'Bfrtip',
      ordering: false,
      paging:false,
      processing: true,
      scrollX: true,
      retrieve: true,
    };
    this.rerender();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(void 0);
    });
}

ngAfterViewInit(): void {
  this.dtTrigger.next(void 0);
  this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.columns().every(function () {
      const that = this;
      $('input', this.footer()).on('keyup change', function () {
        if (that.search() !== this['value']) {
          that.search(this['value']).draw();
        }
      });
    });
  });
}

  daNavigation(id,nav_url,actions,readonly){
    const navigationExtras: NavigationExtras = {state: {dad_id: id,action: actions,readonly:readonly}};
    this.route.navigate([nav_url], navigationExtras);
  }

  getErrorList()
{
    this.api.getData("logistics_truck_delivery_challan/getErrorList/").then((response:any)=>{
      if(response.length != 0)
      {
        this.rerender();
            this.toast.success("Records Found!")
            this.tablelist=response;
            this.hideloader()
              this.dtTrigger.next(void 0);
            console.log("Error List values =", this.tablelist)
          }
          else
          {
            this.toast.error("No Records Found")
          } 
        },(error)=>{
          console.log("error");
      })
}


  hideloader() {
    document.getElementById('loading') .style.display = 'none';       
    }
  

}
