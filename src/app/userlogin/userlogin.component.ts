import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { StorageServiceService } from '../service-storage.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css']
})

export class USERLOGINComponent implements OnInit {

  resultList: any;
  systemUser: any;
  valueInsert: any;

  public san_userRoleArr: any = [];

  EmpIdList: any = "";
  EmpIdValue: any = "";
  roleIdValue: any = "";
  Userrole: any = "";
  public modulelist: any;

  constructor(
    public api: ApiserviceService,
    public toast: ToastrService,
    public storage: StorageServiceService,
    private router: Router,
    public http: HttpClient,
    public sanitizer: DomSanitizer,
    private activatedroute: ActivatedRoute,
  ) {
    this.valueInsert = this.sanitizer.bypassSecurityTrustResourceUrl("http://10.14.29.18:45/username/");
    // this.linkToMailDaId()
    // debugger;
    // this.activatedroute.params.subscribe(
    //   (params: Params) => {
    //     console.log(params);
    //   });
  }

  ngOnInit() {
    console.log("sanpo_loggg")
    let session = sessionStorage.getItem("accessToken");
    if (session == null || session == undefined) {
      this.router.navigateByUrl("/login");
    } else {
      this.router.navigateByUrl("/material/Dashboard");
    }
    // this.getClientSystemUsername();
  }
  getClientSystemUsername()
  {
    // let url = "http://10.29.15.212:45/username/";
    // let url = "http://10.29.15.166:45/username/";
    // let url = "http://10.29.15.166:78/username/";
    let url = "http://10.14.29.18:45/username/";

    this.http.get<any>(url, { withCredentials: true }).subscribe((result: any) => {
      let username = result[0].username;
      this.systemUser = username.split("\\");
    });

  }

  // login()
  // {
  //     let url = 'user/login/';
  //     //  let data: any = { username: this.systemUser[1]}
  //     let data: any = { username: '464_0187'}
  //     this.api.postLoginData(url,data).then((res: any) => {
  //       this.storage.setBearerToken(res.data.access);
  //       this.storage.setActiveUser(res.data.is_active);
  //       this.storage.setSuperUser(res.data.is_superuser);
  //       this.storage.setUserID(res.data.access);
  //       this.toast.success("User Logged In Successfully!");
  //       this.resultList=res;
  //       this.router.navigateByUrl("admin/rolemaster");
  //     })
  // }

  login() {
    let url = 'user/login/';
    // let data: any = { username: this.systemUser[1] }

    // let data: any = { username: '464_0187' }
    // let data: any = { username: '464S0473' }
    let data: any = {username: 'YIL.Developer4'}

    this.api.postLoginData(url, data).then((res: any) => {

      this.storage.setBearerToken(res.data.access);
      this.storage.setActiveUser(res.data.is_active);
      this.storage.setSuperUser(res.data.is_superuser);
      this.storage.setUserID(res.data.access);
      this.storage.setuser_level(res.data.user_level);
      this.storage.setuser_data(res.data);
     

      let role_data = {
        role_id: res.data.role_id
      }
      let url = "logistics_module_master/getMenuList_from_roleId_based/";
      this.api.postData(url, role_data).then((res1: any) => {
        this.storage.setmodule_list(res1);



        let role_data_id = {
          role_id: res.data.role_id
        }
        let url12 = "logistics_module_master/getRootList_for_roleId_based/";
        this.api.postData(url12, role_data_id).then((res2: any) => {
          this.storage.setroot_list(res2);
        })



        this.storage.setUserRole(this.san_userRoleArr);
        this.toast.success("User Logged In Successfully!");
        this.resultList = res;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
      //   this.router.navigateByUrl('main', { skipLocationChange: true }).then(() => {
      //     this.router.navigate(['material/Dashboard']);
      // }); 
        this.router.navigateByUrl("main");
        // this.router.navigateByUrl("material/Dashboard");


      })



    })

  }

  linkToMailDaId() {
    let userName = '464P0453'
    console.log("UserName=", userName)
    //http://10.29.15.212:55/material/da?da_id=221,mail=fromMail/
    //http://localhost:4200/material/da?da_id=221,mail=fromMail/
  }

}


