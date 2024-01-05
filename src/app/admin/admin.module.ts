import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import {MaterialExampleModule} from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { RoleMasterComponent } from './role-master/role-master.component';
import { ModuleMasterComponent } from './module-master/module-master.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { UserAccessComponent } from './user-access/user-access.component';
import { UserListComponent } from './user-list/user-list.component';
import { ModuleWorkFlowComponent } from './module-work-flow/module-work-flow.component';
import { WorkFlowAccessComponent } from './work-flow-access/work-flow-access.component';
import { WorkFlowTypeComponent } from './work-flow-type/work-flow-type.component';
import {CreateNewPage } from './user-list/user-list.component';
import {CreateNewRecord} from './module-master/module-master.component';
import { ModuleAccessToRoleComponent } from './module-access-to-role/module-access-to-role.component';



@NgModule({
  declarations: [
    AdminComponent,
    RoleMasterComponent,
    ModuleMasterComponent,
    UserRoleComponent,
    UserAccessComponent,
    UserListComponent,
    ModuleWorkFlowComponent,
    WorkFlowAccessComponent,
    WorkFlowTypeComponent,
    CreateNewPage,
    CreateNewRecord,
    ModuleAccessToRoleComponent
  ],
  imports: [
    CommonModule,
    MaterialExampleModule,
    HttpClientModule,
    AdminRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    DataTablesModule
  ]
})
export class AdminModule { }
