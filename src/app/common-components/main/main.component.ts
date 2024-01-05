import { Component, OnInit,HostListener,ViewChild   } from '@angular/core';
import { StorageServiceService } from 'src/app/service-storage.service';
import {ApiserviceService } from 'src/app/apiservice.service';
import { NavigationExtras } from '@angular/router';
import {Router} from '@angular/router'; 
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as $ from 'jquery';





@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public material:boolean=false;
  public packaging:boolean=false;
  public admin:boolean=false;
  public master:boolean=false;
  public loading:boolean=false;
  public revision:boolean=false;
  public headername:any;
  public tracking:any;
  public isCollapsed:boolean=false;
  public empinfo:boolean=false;
  public modulelist:any;
  public current_menu:any;
  public notification_count:any=0;
  public notification_list:any;
  constructor(public storage:StorageServiceService,
    public api: ApiserviceService,
    public dialog:MatDialog,
    private route:Router) { }

  ngOnInit(): void {

    // this.route.navigateByUrl("material/Dashboard");

    // setInterval(() => {
    //   this.setheader(); 
    //   this.modulelist=this.storage.getmodule_list();
    // }, 500);

   
    this.modulelist=this.storage.getmodule_list();
    console.log("menu",this.storage.getmodule_list())
    this.getApprovalDa();
    // this.route.navigateByUrl("material/Dashboard");
    
  }

  setmenu(){
    // debugger;
    this.modulelist=this.storage.getmodule_list();

  }
  setheader(){

    this.headername=this.storage.gethersertitle();
  }
  daNavigation_da(id,nav_url,actions){
    const navigationExtras: NavigationExtras = {state: {dad_id: id,action: actions}};
    this.route.navigate([nav_url], navigationExtras);
  }
  daNavigation_da_report(nav_url){
    const navigationExtras: NavigationExtras = {state: {filter_data: false,business_unit_list: 1}};
    this.route.navigate([nav_url], navigationExtras);
  }
  onMaterialHander(cur_menu){
    if(this.current_menu != cur_menu){
      this.current_menu=cur_menu;
    }else{
      this.current_menu='';
    }
    
  }
  onAdminHander(){
    this.admin=this.admin?false:true;
  }
  onPackagingHander(){
    this.packaging=this.packaging?false:true;
  }
  onAMasterHander(){
    this.master=this.master?false:true;
  }
  onTrackingHander(){
    this.tracking=this.tracking?false:true;
  }
  onRevisionHander(){
    this.revision=this.revision?false:true;
  }
  onLoadingHander(){
    this.loading=this.loading?false:true;
    
  }
  getApprovalDa(){
    this.api.getData("dispatch_user_allocation/user_based_da_list/").then((response:any)=>{
 
      this.notification_count=response.length;
      console.log("ABC",response)
     
      this.notification_list=response;
      
     
      },(error)=>{
        this.logout();
          console.log("error");
  })

  }
  
  // @HostListener('document:click', ['$event'])
  // documentClick(event: MouseEvent) {
   
  //    if(this.isCollapsed){
  //     this.isCollapsed=false;
  //    }
  //    if(this.empinfo){
  //     this.empinfo=false;
  //    }
  // }

  daNavigation(id,nav_url){
    this.isCollapsed=false;
    this.isCollapsed=false;
    const navigationExtras: NavigationExtras = {state: {dad_id: id}};
    this.route.navigate(['material/da'], navigationExtras);
    this.route.navigate([nav_url], navigationExtras);
  }
  openNotification(){
    this.isCollapsed = !this.isCollapsed;
    this.empinfo=false;
  }
  emp_profile(){
    this.empinfo = !this.empinfo;
    this.isCollapsed=false;
  }
  logout(){
    this.empinfo = false;
    this.isCollapsed=false;
    sessionStorage.clear();
    localStorage.clear();
    this.storage.setuserLogin(false);
   console.log("sanndnnsj")
   this.route.navigateByUrl("login");

    // this.route.navigate(['login']); 
  }
  
  

}
