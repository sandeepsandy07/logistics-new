import { D } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { param } from 'jquery';

import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import {StorageServiceService} from '../service-storage.service' ;
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { NavigationExtras } from '@angular/router';


@Injectable()
export class AuthGuard implements CanActivate {

    url: any = "";
    val:any="";
    var = "?";
    systemUser: any;
    valueInsert: any;

constructor(
    private router: Router,
    public api: ApiserviceService,
    public toast:ToastrService,
    public storage: StorageServiceService,
    public http: HttpClient,
    public sanitizer: DomSanitizer,
    ) { 
        this.valueInsert = this.sanitizer.bypassSecurityTrustResourceUrl("http://10.29.15.212:45/username/");
      }

canActivate() {
  debugger;
 let session = sessionStorage.getItem("active")
 this.url = window.location.href;
 let arr = this.url.match(/\S[^?]*(?:\?+|$)/g)
 if (arr[0] && session != null || session != undefined)
  { 
    return true
  } 
 else
{     
    let split1 = arr[1].split(',')
    let da_split = split1[0].split('=')[1]
    let mail_split = split1[1].split('=')[1]
    this.val = mail_split;
    if (this.val == "approval"){
        this.login(da_split, this.val);
    }
    // else{
    //   this.router.navigateByUrl("/login");

    // }
} 
if (session == null || session == undefined) {
 this.router.navigateByUrl('');
 }
 return true;
}

login(da_id, status){
   this.getClientSystemUsername();
    let url = 'user/login/';
    let data: any = { username: this.systemUser[1]}
    // let data: any = { username: '464_0187'}
    this.api.postLoginData(url,data).then((res: any) => {
      this.storage.setBearerToken(res.data.access);
      this.storage.setActiveUser(res.data.is_active);
      this.storage.setSuperUser(res.data.is_superuser);
      this.storage.setUserID(res.data.access);

      if(status == "approval"){
        
        const navigationExtras: NavigationExtras = {state: {dad_id: da_id}};
        this.router.navigate(['material/DaApprovalPage'], navigationExtras);

      } 
    })
}

getClientSystemUsername(){
    let url = "http://10.29.15.212:45/username/";
    this.http.get<any>(url, { withCredentials: true }).subscribe((result: any) => {

      let username = result[0].username;
      this.systemUser = username.split("\\");
      return this.systemUser[1]
    });
  }

}




