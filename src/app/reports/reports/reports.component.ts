import { Component, OnInit ,OnDestroy } from '@angular/core';
import {UntypedFormGroup,FormControl, FormGroupDirective, NgForm, Validators, FormArray,UntypedFormBuilder } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ActivatedRoute ,Params} from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import {Router} from '@angular/router'; 
import { NavigationExtras } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StorageServiceService } from 'src/app/service-storage.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public test1=1;
  public form:UntypedFormGroup;
  public edit:boolean=false;
  public dispatchList:any;
  public viewRecords:any;
  public userList:any;
  public soDetailList:any;
  public soList:any;
  public deliveryList:any;
  public insurencescopelist:any;
  public insurenceTypelist:any;
  public transportationlist:any;
  public freightModelist:any;
  public packingInstructionlist:any;
  public licensetyplist:any;
  public billtodynamic:any;
  public shiptodynamic:any;
  public soldtodynamic:any;
  public tablelist:any;
  public gstlist:any;
  public da_no:any;
  public headerDate:any;
  public fileTypes:any;

  

  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder) { }

  ngOnInit(): void {
  }

  getListOfDispatchValues(){
   
    this.api.getData("logistics_dispatch_mode/").then((response)=>{
        this.dispatchList=response;
        
    },(error)=>{
        console.log("error");
    })
    this.api.getData("logistics_DA_File_types/").then((response)=>{
      this.fileTypes=response;
      
  },(error)=>{
      console.log("error");
  })
   
    this.api.getData("logistics_delivery_mode/").then((response)=>{
        this.deliveryList=response;
    },(error)=>{
        console.log("error");
    })
    this.api.getData("logistics_insurance_scope/").then((response)=>{
      this.insurencescopelist=response;
    },(error)=>{
      console.log("error");
    })
 
    this.api.getData("logistics_transportation_scope/").then((response)=>{
        this.transportationlist=response;
    },(error)=>{
        console.log("error");
    })
    this.api.getData("logistics_insurance_type/").then((response)=>{
      this.insurenceTypelist=response;
  },(error)=>{
      console.log("error");
  })
   this.api.getData("logistics_freight_mode/").then((response)=>{
      this.freightModelist=response;
  },(error)=>{
      console.log("error");
  })
    this.api.getData("logistics_packing_instruction/").then((response)=>{
        this.packingInstructionlist=response;
    },(error)=>{
        console.log("error");
    })
    this.api.getData("logistics_license_type/").then((response)=>{
        this.licensetyplist=response;
    },(error)=>{
        console.log("error");
    })
    this.api.getData("logistics_gst_by/").then((response)=>{
      this.gstlist=response;
    
  },(error)=>{
      console.log("error");
  })
    this.api.getData("user_list/").then((response: any)=>{
      this.userList=response.data;
    
  },(error)=>{
      console.log("error");
  })
  this.api.getData("logistics_dispatch_advice/").then((response)=>{
   
    this.tablelist=response;
    // this.dtTrigger.next(void 0);
    console.log(this.tablelist);
   
},(error)=>{
    console.log("error");
})


}




}
