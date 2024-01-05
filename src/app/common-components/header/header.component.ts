import { Component, OnInit } from '@angular/core';
import { StorageServiceService } from 'src/app/service-storage.service';
import {ApiserviceService } from 'src/app/apiservice.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public notification_count:any=0;
  public notification_list:any;

  constructor(public storage:StorageServiceService,public api: ApiserviceService) { 
  
    
  }

  public headername:any;

  ngOnInit(): void {



    setInterval(() => {
      this.setheader(); 
    }, 1000);

    
   
    ;
  }
  setheader(){

    this.headername=this.storage.gethersertitle();
  }
  getApprovalDa(){
    this.api.getData("dispatch_user_allocation/user_based_da_list/").then((response:any)=>{
 
      this.notification_count=response;
      console.log("header",response);
      this.notification_list=response;
      
     
      },(error)=>{
          console.log("error");
  })

  }

}
