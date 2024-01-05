
import { BnNgIdleService } from 'bn-ng-idle';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiserviceService } from 'src/app/apiservice.service';
import { ToastrService } from 'ngx-toastr';
import { StorageServiceService } from './service-storage.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  resultList: any;
  systemUser: any;
  valueInsert: any;

  public san_userRoleArr: any = [];

  EmpIdList: any = "";
  EmpIdValue: any = "";
  roleIdValue: any = "";
  Userrole: any = "";
  public modulelist: any;

  public mainpage:any;
  constructor(private bnIdle: BnNgIdleService,
    public api: ApiserviceService,
    public toast: ToastrService,
    public storage: StorageServiceService,
    private router: Router,
    public http: HttpClient,
    public sanitizer: DomSanitizer,
    private activatedroute: ActivatedRoute,
    ) {
   
  
    // this.bnIdle.startWatching(30).subscribe((res) => {
    //   if(res) {
    //       console.log("session expired");
    //   }
    // })
    
  }
  ngOnInit(): void {
    // this.mainpage=false;
    this.mainpage=this.storage.getuserLogin();
     console.log("sanpo_test",this.mainpage)
    if(this.mainpage == true && this.router.url == '/login'){
      this.router.navigateByUrl("material/Dashboard");
      // this.getClientSystemUsername();
      // this.login()
    }
    // console.log('root',this.router.url)
    // if(this.router.url == '/login'){
    //   localStorage.clear();
    //   this.storage.setuserLogin(false);
    //   location.reload();      
     
    // }
    //  console.log(this.router.url);
    // else{

    //   this.router.navigateByUrl("material/Dashboard");

    // }
    
    // let session = sessionStorage.getItem("accessToken");
    // if (session == null || session == undefined) {
    //   this.router.navigateByUrl("/login");
    // }
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
      this.storage.setuserLogin(true);

      
      
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
        this.mainpage=true
        // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        // this.router.onSameUrlNavigation = 'reload';
      //   this.router.navigateByUrl('main', { skipLocationChange: true }).then(() => {
      //     this.router.navigate(['material/Dashboard']);
      // }); 
        // this.router.navigateByUrl("main");
        this.router.navigateByUrl("material/Dashboard");


      })



    })

  }

}


