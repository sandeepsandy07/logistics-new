import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import {StorageServiceService} from '../service-storage.service' ;
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css']
})

export class USERLOGINComponent implements OnInit {

  resultList: unknown;
  systemUser: any;
  valueInsert: any;
  constructor(
    public api: ApiserviceService,
    public toast:ToastrService,
    public storage: StorageServiceService,
    private router: Router,
    public http: HttpClient,
    public sanitizer: DomSanitizer,
  ) {
    this.valueInsert = this.sanitizer.bypassSecurityTrustResourceUrl("http://10.29.15.212:45/username/");

   }

  ngOnInit()
  {
        // this.getClientSystemUsername();
  }
  getClientSystemUsername(){

    let url = "http://10.29.15.212:45/username/";
    this.http.get<any>(url, { withCredentials: true }).subscribe((result: any) => {

      let username = result[0].username;
      this.systemUser = username.split("\\");
      console.log(this.systemUser);

    });

  }
  login()
  {
      let url = 'user/login/';
      //  let data: any = { username: this.systemUser[1]}
      let data: any = { username: '464_0187'}
      this.api.postLoginData(url,data).then((res: any) => {
        this.storage.setBearerToken(res.data.access);
        this.storage.setActiveUser(res.data.is_active);
        this.storage.setSuperUser(res.data.is_superuser);
        this.storage.setUserID(res.data.access);
        this.toast.success("User Logged In Successfully!");
        this.resultList=res;
        this.router.navigateByUrl("admin/rolemaster");
      })
  }
}


