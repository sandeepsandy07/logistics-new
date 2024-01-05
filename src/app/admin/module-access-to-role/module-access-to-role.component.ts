import { Component, OnInit ,OnDestroy } from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, FormGroupDirective, NgForm, Validators, UntypedFormArray,UntypedFormBuilder } from '@angular/forms';
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
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { FileUploader } from "ng2-file-upload";
import { ToastrService } from 'ngx-toastr';



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-module-access-to-role',
  templateUrl: './module-access-to-role.component.html',
  styleUrls: ['./module-access-to-role.component.css']
})
export class ModuleAccessToRoleComponent implements OnInit {

  public form:UntypedFormGroup;
  matcher = new MyErrorStateMatcher();
  public rolelist:any;
  public modulelist:any;
  public submit_button:boolean=true;
  public current:any;
  public role_id:any;
  public action:any;
  public isread_only:any;
  public showdata:boolean=false;
  public rolemenulist:any;


  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    ) { 
      const navigation = this.route.getCurrentNavigation();
      const state = navigation.extras.state as {role_id: string,action: string,readonly:boolean};
      this.role_id=state.role_id;
     
      this.action = state.action;
      this.isread_only=state.readonly;   
      this.getRoleIdList();


        this.form = this.fb.group({
            role_id: new UntypedFormControl(this.role_id),
            module_details: this.fb.array([]),
        });

        if(state.action != 'add' ){
          this.edit_page_mod_list(this.role_id);
        }else{
  
          this.getmodules_list();
  
        }
    }

  ngOnInit(): void {
   
   
    // this.get_role();
  }
    getRoleIdList()
    {
      let url = "logistics_role_master/";
      this.api.getData(url).then(res => {
        this.rolelist=res;
      })
    }

    edit_page_mod_list(role_id){

      let url = "logistics_module_master/getRootList/";
      this.api.getData(url).then((res:any) => {
       
        
        let role_data={
          role_id:role_id
        }
    
        
        let url1 = "logistics_module_master/getRootList_for_roleId_based/";
        this.api.postData(url1,role_data).then((res1:any) => {
          this.rolemenulist=res1;    
          for(let i=0;i<res.length;i++){
            
            for(let j=0;j<res[i].root_module.length;j++){
              let main_mod='';
              if( j==0 ){
                main_mod=res[i].module_name;
              }
                    if(this.rolemenulist.find(e => e.module_id ===res[i].root_module[j].module_id))
                    {
                      let module_id_index=this.rolemenulist.indexOf(this.rolemenulist.find(e => e.module_id === res[i].root_module[j].module_id))
                      this.addmoduleDetails(main_mod,this.rolemenulist[module_id_index].user_module[0].module_name,
                                            this.rolemenulist[module_id_index].module_id,
                                            this.rolemenulist[module_id_index].add_access,
                                            this.rolemenulist[module_id_index].edit_access,
                                            this.rolemenulist[module_id_index].view_access,
                                            this.rolemenulist[module_id_index].delete_access)
                    }else{
                      this.addmoduleDetails(main_mod,res[i].root_module[j].module_name,res[i].root_module[j].module_id,false,false,false,false);
                    }
              
             
             
            }
           
          
          }
         
       
      })
      
      







  
      
       
      })
     
      
    

    }
    daNavigation(id,nav_url,action){
      const navigationExtras: NavigationExtras = {state: {dad_id: id}};
      this.route.navigate([nav_url], navigationExtras);
    }
    getmodules_list(){ 
      let url = "logistics_module_master/getRootList/";
      this.api.getData(url).then((res:any) => {
        this.modulelist=res;
        for(let i=0;i<res.length;i++){
          for(let j=0;j<res[i].root_module.length;j++){
            let main_mod='';
            if( j==0 ){
              main_mod=res[i].module_name;
            }
            this.addmoduleDetails(main_mod,res[i].root_module[j].module_name,res[i].root_module[j].module_id,false,false,false,false)
           
          }
          
        
        }
      
       
      })
    }
    moduleDetails() : UntypedFormArray {  
      return this.form.get("module_details") as UntypedFormArray  
    }
    newmoduleDetails(main_name,sub_name,id,add,edit,view,delete_a): UntypedFormGroup {  
      return this.fb.group({  
        main_name: main_name,
        id: id, 
        sub_name:sub_name,
        add:add,  
        edit: edit,  
        view: view, 
        delete:delete_a, 
       
      })  
    }  
    addmoduleDetails(main_name,sub_name,id,add,edit,view,delete_a) {  
      this.moduleDetails().push(this.newmoduleDetails(main_name,sub_name,id,add,edit,view,delete_a));    
    } 
    get_role(){
      let data={
        role_id:1
      }
      this.api.postData("logistics_module_master/getRootList_from_roleId_based/",data).then((response:any)=>{

      },(error)=>{
          console.log("error");
      })
    }
    onsubmit(){
      
        console.log(this.form.value);
        let obj={...this.form.value};
        this.api.postData("logistics_user_role/createMultipleUserRole/",obj).then((response:any)=>{
        this.form.reset();
        this.toastr.success("inserted")
      this.route.navigate(['/material/da']); 
      },(error)=>{
          console.log("error");
      })
    }

    updateadd(module_id,sub_module){
      
      
    }


}
