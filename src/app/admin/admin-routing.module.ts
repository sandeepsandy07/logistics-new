import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ModuleMasterComponent } from './module-master/module-master.component';
import { RoleMasterComponent } from './role-master/role-master.component';
import {UserRoleComponent} from './user-role/user-role.component';
import {UserAccessComponent} from './user-access/user-access.component';
import {UserListComponent} from './user-list/user-list.component';
import {ModuleWorkFlowComponent} from './module-work-flow/module-work-flow.component';
import {WorkFlowAccessComponent} from './work-flow-access/work-flow-access.component';
import {WorkFlowTypeComponent} from './work-flow-type/work-flow-type.component';
import {ModuleAccessToRoleComponent} from './module-access-to-role/module-access-to-role.component';


import { USERLOGINComponent } from '../userlogin/userlogin.component';
const routes: Routes = [
  {path:'',component:AdminComponent},
  {path:'rolemaster',component:RoleMasterComponent},
  {path:'modulemaster',component:ModuleMasterComponent},
  {path:'userrole',component:UserRoleComponent},
  {path:'useraccess',component:UserAccessComponent},
  {path:'userlist',component:UserListComponent},
  {path:'moduleworkflow',component:ModuleWorkFlowComponent},
  {path:'workflowtype',component:WorkFlowTypeComponent},
  {path:'workflowaccess',component:WorkFlowAccessComponent},
  {path:'module-role-access',component:ModuleAccessToRoleComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
