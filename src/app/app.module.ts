import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MaterialExampleModule} from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './common-components/header/header.component';
import { FooterComponent } from './common-components/footer/footer.component';
import { MainComponent } from './common-components/main/main.component';

import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ToastrModule} from 'ngx-toastr';
import { USERLOGINComponent } from './userlogin/userlogin.component';
import { DatePipe } from '@angular/common';
import { EventEmitterService } from './event-emitter.service';
import { OpenDialog } from './material/panel-wise-material/panel-wise-material.component';
import { OpenDialogView } from './material/panel-wise-material-view/panel-wise-material-view.component';
import { DataTablesModule } from 'angular-datatables';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DragDropModule} from '@angular/cdk/drag-drop';
import {OpenDialogBox} from './material/panel-item-verification/panel-item-verification.component'
import {PackingPanelComponent} from './packaging/packing-panel/packing-panel.component'
// import {MatInputModule} from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxBarcode6Module } from 'ngx-barcode6';
import {NgxPrintModule} from 'ngx-print';
import { MatBadgeModule } from '@angular/material/badge';
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service



import { SearchPipe } from './search.pipe';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { NgChartsModule} from 'ng2-charts'
// import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        MainComponent,
        USERLOGINComponent,
        OpenDialog,
        OpenDialogView,
        SearchPipe,
    ],
    imports: [
        MaterialExampleModule,
        NgxMatSelectSearchModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgbModule,
        DataTablesModule,
        ToastrModule.forRoot(),
        Ng2SearchPipeModule,
        DragDropModule,
        // FormsModule,
        MatInputModule,
        MatFormFieldModule,
        // FormsModule,
        ReactiveFormsModule,
        NgxBarcode6Module,
        NgxPrintModule,
        MatBadgeModule,
        NgxQRCodeModule,
        NgChartsModule
    ],
    exports: [],
    providers: [DatePipe, EventEmitterService, BnNgIdleService],
    bootstrap: [AppComponent]
})
export class AppModule { }
