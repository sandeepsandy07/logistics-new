import { Component, OnInit ,OnDestroy ,ViewChild, Inject} from '@angular/core';
import {UntypedFormGroup,UntypedFormControl, FormGroupDirective, NgForm, Validators, FormArray,UntypedFormBuilder } from '@angular/forms';
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
import {DataTableDirective} from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FileUploader } from "ng2-file-upload";
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-packing-price',
  templateUrl: './packing-price.component.html',
  styleUrls: ['./packing-price.component.css']
})
export class PackingPriceComponent implements OnInit {
  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  public tablelist:any;
  matcher = new MyErrorStateMatcher();
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public form:UntypedFormGroup;

  dtInstance: Promise<DataTables.Api>;
  dtElement: DataTableDirective;

  MainForm:boolean=true;
  EditForm:boolean=false;
  BoxTypeIdList:any="";
  BoxSizeIdList:any="";
  packingPriceId:any="";


  constructor(public api: ApiserviceService,
    private activatedroute:ActivatedRoute,
    private route:Router,
    public datepipe: DatePipe,
    public storage:StorageServiceService ,
    private fb:UntypedFormBuilder,
    public dialog: MatDialog,
    //addd
    public toast:ToastrService,
    private http: HttpClient,) {
      this.form=this.fb.group({
        boxId:new UntypedFormControl(null),
        boxTypeId:new UntypedFormControl(null),
        exports_price:new UntypedFormControl(null,{validators:[Validators.required]}),
        domestic_price:new UntypedFormControl(null,{validators:[Validators.required]}),
        validFrom:new UntypedFormControl(null),
        validTo:new UntypedFormControl(null),
      })
     }

  ngOnInit()
  {
    this.BoxTypeIdlist();
    this.getPackingPriceDetails();
    this.BoxSizeIdlist();

    this.dtOptions = {
      dom: 'Bfrtip',
      ordering: false,
      retrieve: true,
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true
    };
    this.rerender();
  }

  download_packing_price_upload_format()
  {
    let url = "logistics_packing_price/download_packing_price_upload_format/"
    this.api.download(url).subscribe((response)=>{
      let blob = new Blob([response], {type: response.type})
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'packing_price_upload_format');
      link.click();
    })
  }

  get f() { return this.form.controls; }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(void 0);
    });
}

ngAfterViewInit(): void {
  this.dtTrigger.next(void 0);
  this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.columns().every(function () {
      const that = this;
      $('input', this.footer()).on('keyup change', function () {
        if (that.search() !== this['value']) {
          that.search(this['value']).draw();
        }
      });
    });
  });
}

  getPackingPriceDetails()
    {
      let url = "logistics_packing_price/";
      this.api.getData(url).then((response: any) => {
      if(response.length != 0)
    {
      this.rerender();
      this.toast.success("Records Found")
          this.dtTrigger.next(void 0);
          this.tablelist=response;
          console.log("Packing Price Values =", this.tablelist)
    }
    else
        {
          this.rerender();
          this.toast.error("No Records Found")
          this.tablelist=response;
        } 
      console.log("Packing Price Values =", this.tablelist)
      this.dtTrigger.next(void 0);
    },(error)=>{
        console.log("error");
})
}

back()
  {
    this.EditForm=false;
    this.MainForm=true;
    location.reload();
  }

  BoxTypeIdlist()
  {
    let url = "logistics_box_type/";
    this.api.getData(url).then(res => {
      this.BoxTypeIdList=res;
      console.log("box type list=",this.BoxTypeIdList)
    })
  }

  BoxSizeIdlist()
  {
    let url = "logistics_box_size/";
    this.api.getData(url).then(res => {
      this.BoxSizeIdList=res;
      console.log("box size list=",this.BoxSizeIdList)
  })
 }

editData(val)
{
  this.MainForm=false;
  this.EditForm=true;
  this.packingPriceId=val.packingPriceId
  this.form.patchValue({
    boxId:val.boxID,
    boxTypeId:val.boxTypeID,
    exports_price:val.exports_price,
    domestic_price:val.domestic_price,
    validFrom:val.validFrom,
    validTo:val.validTo,
    //da_id:this.truck_channel['da_id']?this.truck_channel['da_id']:null,
})
}

DeteteData(id)
{
  let url = "logistics_packing_price/";
  console.log(id);
  this.api.deleteUser(id,url).subscribe((response:any) =>
   {
    if(response.length != 0)
    {
      this.rerender();
      this.toast.success("Records Found")
          this.dtTrigger.next(void 0);
          this.tablelist=response;
          console.log("Packing Price Values =", this.tablelist)
    }
    else
        {
          this.rerender();
          this.toast.error("No Records Found")
          this.tablelist=response;
        } 
      console.log("Packing Price Values =", this.tablelist)
      this.dtTrigger.next(void 0);
    },(error)=>{
        console.log("error");
})
}

onSubmit()
{
  const dialogRef = this.dialog.open(OpenPackingPriceFileUploadPage, {
    height: '200px',
    width: '600px',
    maxWidth:'100%',
  });
  dialogRef.afterClosed().subscribe(result => {
   //this.getPackingPriceDetails();
  location.reload();
  });
}

onSubmitPost()
{
  this.form.value.validTo=this.datepipe.transform(this.form.value.validTo,'dd-MM-yyyy')
  this.form.value.validFrom=this.datepipe.transform(this.form.value.validFrom,'dd-MM-yyyy')
  let obj={...this.form.value};

  this.api.updateData("logistics_packing_price/"+this.packingPriceId+"/",obj).then((response:any)=>{
    if(response != false)
    {
      this.form.reset();
      this.toast.success("Record Updated Successfully!")
      location.reload(); 
      console.log("Packing Price Values =", this.tablelist)
    }
    else
        {
          this.MainForm=true;
          this.EditForm=false;
        } 
      console.log("Packing Price Values =", this.tablelist)
    },(error)=>{
        console.log("error");
})
}
}

@Component({
  selector: 'upload-packing-price',
  templateUrl: 'upload-packing-price.html'
  , styles: [`
    :host {
      
      flex-direction: column;
      height: 89%;
      max-width:100% !important;
      
    }

    mat-dialog-content {
      flex-grow: 1;
      
    }
    mat-dialog-container{
      background-color:#62b8f56e !important;
    }
  `]
})
export class OpenPackingPriceFileUploadPage {

  public uploader: FileUploader = new FileUploader({});
  url = environment.apiUrl;

  viewBtn: any = "upload";
  public onupload_button: boolean = true;
  returnVal:any="";


  uploadForm: UntypedFormGroup;
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private toaster:ToastrService,
    public storage:StorageServiceService ,
    public toast:ToastrService, 
    public fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public apiService: ApiserviceService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<OpenPackingPriceFileUploadPage>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
    {
      this.uploadForm = this.formBuilder.group({
        data_file: new UntypedFormControl("", Validators.required),});
    }

    OnFileSelect(event, name) {
      let file = event.target.files[0];
      this.uploadForm.get(name).setValue(file);
    }

    showloader() {
      document.getElementById('loadingform').style.display = 'block';       
      }
    hideloader() {
      document.getElementById('loadingform').style.display = 'none';       
      }

  

      fileUpload() {
        let bearer = this.storage.getBearerToken();
        let headers = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer' + ' ' + bearer
          })
        };
        const formData: FormData = new FormData();
        if (this.uploadForm.status == "INVALID") {
          this.toaster.error("Please upload file")
        }
        else {
          this.showloader();
          this.onupload_button = false;
                formData.append("data_file", this.uploadForm.get("data_file").value);
                this.http.post<any>(this.url + "packing_price_data/", formData, headers).subscribe(
                  (res: any) => {
                    if (res == true)
                    {
                      this.toaster.success("Packing Price Uploaded Successfully");
                      this.onupload_button = true;
                      this.hideloader();
                    }
                    else
                    {
                      this.returnVal = res;
                      this.toaster.error(this.returnVal);
                      //this.toaster.error("Valid From/Valid is not given please check and upload file again");
                    }
                  })
              }
      }

    dialogClose(){
      this.dialogRef.close();
    }
  }









  // applyFilter(event : Event)
  // {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  // BoxSizeIdlist()
  // {
  //   let url = "logistics_box_size/";
  //   this.api.getData(url).then(res => {
  //     this.BoxSizeIdList=res;
  //     console.log("box size list=",this.BoxSizeIdList)
   
  //   this.BoxSizeIdList?.forEach((elm:any)=>{
  //     this.BoxTypeIdList?.forEach((val: any) => {
  //       if(elm.boxTypeId == val.boxTypeId)
  //       {
  //         elm['boxSizeAndType'] = elm.boxSize + "-" + val.boxType
  //       }
  //     })
  //   })
  // })
  // this.getPackingPricelist();
 // }

  // BoxTypeIdlist()
  // {
  //   let url = "logistics_box_type/";
  //   this.api.getData(url).then(res => {
  //     this.BoxTypeIdList=res;
  //     this.getPackingPricelist();
  //   })
  // }

  // EmpName(){
  //   let url = "user_list/";
  //   this.api.getData(url).then((res: any) => {
  //     this.EmpListData = res.data;
  //     console.log(this.EmpListData);
  //   });
  // }

  // validFromPickerChange()
  // {
  //   this.ValidFrom = this.datePipe.transform(this.validFrom.value, 'dd-MM-yyyy');
  //   console.log(this.ValidFrom)
  // }

  // validToPickerChange()
  // {
  //   this.ValidTo = this.datePipe.transform(this.validTo.value, 'dd-MM-yyyy');
  //   console.log(this.ValidTo)
  // }

  // validFromPickerChange()
  // {
  //   this.fromDate = this.ValidFromDate
  //   this.ValidFrom = this.datePipe.transform(this.fromDate, 'dd-MM-yyyy');
  //   console.log(this.ValidFrom)
  //   this.fromdate = this.datePipe.transform(this.fromdate, 'yyyy-MM-dd');
  // }

  // validToPickerChange()
  // {
  //   this.toDate = this.ValidToDate
  //   this.ValidTo = this.datePipe.transform(this.toDate, 'dd-MM-yyyy');
  //   console.log(this.ValidTo)
  //   this.todate = this.datePipe.transform(this.todate, 'yyyy-MM-dd');
  // }

  // CreateList()
  // {
  //   if(this.BoxId == ""){
  //     this.toast.error("Please Select Box Size");
  //     }
  //   else if(this.ValidFromDate == "")
  //   {
  //     this.toast.error("Please Select Valid From");
  //   }
  //   else if(this.ValidToDate == "")
  //   {
  //     this.toast.error("Please Select Valid To");
  //   }
  //   if(this.Domestic != "" && this.Domestic != undefined)
  //   {
  //     debugger;

  //     if(this.ValidFromDate < this.ValidToDate)
  //     {
  //     let data={
  //       'boxID':this.BoxId,
  //       'location':"Domestic",
  //       'price':this.Domestic,
  //       'validFrom':this.ValidFrom,
  //       'validTo':this.ValidTo
  //     }
  //     console.log("Inserted value=",data)
  //     let url = "logistics_packing_price/";
  //     this.api.postData(url,data).then(res => {
  //       console.log(res)
  //       this.getPackingPricelist();
  //     })
  //   }
  //   else
  //   {
  //     this.toast.error("ValidTo Date Cannot be less than ValidFrom Date")
  //   }
  // }

  //   if(this.Exports != "" && this.Exports != undefined)
  //   {
  //     if(this.ValidFromDate < this.ValidToDate)
  //     {
  //       let data={
  //         'boxID':this.BoxId,
  //         'location':"Exports",
  //         'price':this.Exports,
  //         'validFrom':this.ValidFrom,
  //         'validTo':this.ValidTo
  //       }
  //       console.log("Inserted value=",data)
  //       let url = "logistics_packing_price/";
  //       this.api.postData(url,data).then(res => {
  //         console.log(res)
  //         this.toast.success("Record Inserted Successfully!")
  //         this.getPackingPricelist();
  //       })
  //     }
  //   }
  // }

  // getPackingPricelist()
  // {
  //   let url = "logistics_packing_price/";
  //   this.api.getData(url).then((res: any) => {
  //     this.dataSource = new MatTableDataSource(res);
  //     this.dataSource.data = res;
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //     this.resultsLength=res.length;
  //     console.log("ResultLength =",this.resultsLength)

  //     this.PackingPriceList=res;
  //     console.log(this.PackingPriceList);

  //     this.PackingPriceList?.forEach((element: any) => {
  //       this.EmpListData?.forEach((val: any) => {
  //         if(element.created_by == val.id){
  //           element['created_by'] = val.employee_name;
  //         }
  //         if(element.updated_by == val.id){
  //           element['updated_by']=val.employee_name;
  //         }
  //       });
  //     });

  //     this.PackingPriceList?.forEach((element: any) => {
  //       this.BoxSizeIdList?.forEach((val: any) => {
  //         if(element.boxID == val.boxId){
  //           element['boxSize'] = val.boxSize;
  //         }
  //         if(element.boxID == val.boxId)
  //         {
  //           element['boxDescription'] = val.boxDescription
  //         }
  //       });
  //     });
  // });
  // }

  // setEditForm()
  // {
  //   this.EditForm=false;
  //   this.CreateForm=true;
  //   this.ListForm=true;
  //   this.editPageHeader = false;
  //   this. getPackingPricelist();
  // }

  // update(element:any)
  // {
  //   debugger;
  //   if(element.location == "Domestic") 
  //   {
  //     this.EditDomesticForm=true;
  //     this.ListForm=false;
  //     this.CreateForm=false;
  //     this.EditExportsForm=false;
  //     this.mainPageHeader=false;
  //     this.editPageHeader=true;
  //     this.boxID=element.boxID
  //     this.domestic=element.price
  //     this.fromdate =element.validFrom
  //     console.log("fromdate =",this.fromdate)
  //     this.todate =element.validTo
  //     console.log("todate =",this.todate)
  //     this.PackingPriceId=element.packingPriceId
  //   }
  //   else
  //   {
  //     this.EditDomesticForm=false;
  //     this.ListForm=false;
  //     this.CreateForm=false;
  //     this.EditExportsForm=true;
  //     this.mainPageHeader=false;
  //     this.editPageHeader=true;
  //     this.BoxID=element.boxID
  //     this.exports=element.price
  //     this.fromdate =element.validFrom
  //     this.todate =element.validTo
  //     this.PackingPriceId=element.packingPriceId
  //   }
  // }

//   UpdateDomesticList()
//   {
//     if(this.boxID == "")
//   {
//     this.toast.error("Please Select Box Size");
//   }
//   else if(this.domestic == "")
//   {
//     this.toast.error("Please Enter Domestic Value");
//   }

//   else if(this.fromdate == null)
//   {
//     this.toast.error("Please Select Valid From Date")
//   }
//   else if(this.todate == null)
//   {
//     this.toast.error("Please Select Valid To Date")
//   }
//   else
//   {
//     if(this.fromdate < this.todate)
//     {
//       this.fromdate = this.datePipe.transform(this.fromdate, 'dd-MM-yyyy');
//       this.todate = this.datePipe.transform(this.todate, 'dd-MM-yyyy');

//     let data={
//       'boxID':this.boxID,
//       'location':"Domestic",
//       'price':this.domestic,
//       'validFrom':this.fromdate,
//       'validTo':this.todate,
//     }
//       console.log(data)
//       let url = "logistics_packing_price/"+this.PackingPriceId+"/";
//       this.api.updateData(url,data).then(res => {
//         console.log(res)
//         this.toast.success("Record Updated Successfully!");
//         this.getPackingPricelist();
//       })

//       this.editPageHeader=false;
//       this.mainPageHeader=true;
//       this.EditDomesticForm=false;
//       this.ListForm=true;
//       this.CreateForm=true;
//       this.EditExportsForm=false;
//     }
//     else
//     {
//       this.toast.error("ValidToDate Cannot be less then ValidFromDate")
//     }
//   }
//   }

//   setDomesticEditForm()
//   {
//     this.EditDomesticForm=false;
//     this.EditExportsForm=false;
//     this.ListForm=true;
//     this.CreateForm=true;
//     this.editPageHeader = false;
//     this.mainPageHeader = true;
//     this. getPackingPricelist();

//   }

//   UpdateExportsList()
//   {
//     if(this.BoxID == "")
//   {
//     this.toast.error("Please Select Box Size");
//   }

//   else if(this.domestic == "")
//   {
//     this.toast.error("Please Enter Domestic Value");
//   }
//   else if(this.fromdate == null)
//   {
//     this.toast.error("Please Select Valid From Date")
//   }
//   else if(this.todate == null)
//   {
//     this.toast.error("Please Select Valid To Date")
//   }
//   else
//   {
//     this.fromdate = this.datePipe.transform(this.fromdate, 'dd-MM-yyyy');
//     this.todate = this.datePipe.transform(this.todate, 'dd-MM-yyyy');

//     if(this.fromdate < this.todate)
//     {
//     let data={
//       'boxID':this.BoxID,
//       'location':"Exports",
//       'price':this.exports,
//       'validFrom':this.fromdate,
//       'validTo':this.todate,
//     }
//       console.log(data)
//       let url = "logistics_packing_price/"+this.PackingPriceId+"/";
//       this.api.updateData(url,data).then(res => {
//         console.log(res)
//         this.toast.success("Record Updated Successfully!");
//         this.getPackingPricelist();
//       })

//       this.editPageHeader=false;
//       this.mainPageHeader=true;
//       this.EditDomesticForm=false;
//       this.ListForm=true;
//       this.CreateForm=true;
//       this.EditExportsForm=false;
//     }
//     else
//     {
//       this.toast.error("ValidTo Date Cannot be Less then ValidFrom Date")
//     }
//   }
//   }

//   setExportsEditForm()
//   {
//     this.EditDomesticForm=false;
//     this.EditExportsForm=false;
//     this.ListForm=true;
//     this.CreateForm=true;
//     this.editPageHeader=false;
//     this.mainPageHeader = true;
//     this. getPackingPricelist();
//   }

// UpdateList()
//   {
//     if(this.boxid == "")
//   {
//     this.toast.error("Please Select Box Size");
//   }
 
//   else if(this.domestic == "")
//   {
//     this.toast.error("Please Enter Domestic Value");
//   }
//   else if(this.exports == "")
//   {
//     this.toast.error("Please Enter Exports Value");
//   }
//   else if(this.ValidFromDate =="")
//   {
//     this.toast.error("Please Select Valid From Date")
//   }
//   else if(this.ValidToDate=="")
//   {
//     this.toast.error("Please Select Valid To Date")
//   }
//   else
//   {
//     if(this.ValidFromDate < this.ValidToDate)
//     {
//     let data={
//       'boxID':this.boxid,
//       'location':"Domestic",
//       'price':this.domestic,
//       'validFrom':this.ValidFrom,
//       'validTo':this.ValidTo,
//     }
//       console.log(data)
//   }
// else
// {
//   this.toast.error("ValidTo Date Cannot be Less then ValidFrom Date")
// }
// }
// } 

//   deleteData(id)
//   {
//     let url = "logistics_packing_price/";
//     console.log(id);
//     this.api.deleteUser(id,url).subscribe((data:any) =>
//      {
//       this.toast.success("Deleted");
//       console.log(data);
//       this.getPackingPricelist();
//      })
//   }
// }



// else
//     {
//       let data={
//         'boxID':this.BoxId,
//         'boxTypeID':this.BoxTypeId,
//         'location1':"Domestic",
//         'price1':this.Domestic,
//         'location2':"Exports",
//         'price2':this.Exports,
//         'validFrom':this.ValidFrom,
//         'validTo':this.ValidTo
//       }
//       console.log("Inserted value=",data)
//       let url = "logistics_packing_price/";
      // this.api.postData(url,data).then(res => {
      //   console.log(res)
      //   this.toast.success("Record Successfully Inserted!");
      //   this.resultList=res;
      //   this.getTransportationList();
      // })
    //}


    // CreateList()
    // {
    //   if(this.BoxId == ""){
    //     this.toast.error("Please Select Box Size");
    //     }
    //   else if(this.BoxTypeId == "")
    //   {
    //     this.toast.error("Please Select Box Type");
    //   }
    //   else if(this.ValidFrom == "")
    //   {
    //     this.toast.error("Please Select Valid From");
    //   }
    //   else if(this.ValidTo == "")
    //   {
    //     this.toast.error("Please Select Valid To");
    //   }
    //   if(this.Domestic != "" && this.Domestic != undefined)
    //   {
    //     let data={
    //       'boxID':this.BoxId,
    //       'boxTypeID':this.BoxTypeId,
    //       'location':"Domestic",
    //       'price':this.Domestic,
    //       'validFrom':this.ValidFrom,
    //       'validTo':this.ValidTo
    //     }
    //     console.log("Inserted value=",data)
    //     let url = "logistics_packing_price/";
    //     this.api.postData(url,data).then(res => {
    //       console.log(res)
    //       this.getPackingPricelist();
    //     })
    //   }
  
    //   if(this.Exports != "" && this.Exports != undefined)
    //   {
    //     debugger;
    //     // moment('2021-02-12').isBefore('2021-02-12'); // false
       
    //     var DateFrom = new Date(this.ValidFrom)
    //     var DateTo = new Date(this.ValidTo)
        // moment(DateFrom).isBefore(DateTo);
  
        // let FromDate=this.datePipe.transform(this.ValidFrom, 'dd-MM-yyyy')
        // let ToDate = this.datePipe.transform(this.ValidTo,'dd-MM-yyyy')
        //if(this.ValidTo.getTime() > this.ValidFrom.getTime())
        // if(DateTo > DateFrom)
    //     if( moment(DateFrom).isBefore(DateTo))
    //     {
    //       let data={
    //         'boxID':this.BoxId,
    //         'boxTypeID':this.BoxTypeId,
    //         'location':"Exports",
    //         'price':this.Exports,
    //         'validFrom':this.ValidFrom,
    //         'validTo':this.ValidTo
    //       }
    //       console.log("Inserted value=",data)
    //       let url = "logistics_packing_price/";
    //       this.api.postData(url,data).then(res => {
    //         console.log(res)
    //         this.toast.success("Record Inserted Successfully!")
    //         this.getPackingPricelist();
    //       })
    //     }
    //     else
    //     {
    //       this.toast.error("ValidTo Date Cannot be Less than ValidFrom Date")
    //     }
    //   }
    // }

     // var DateFrom = new Date(this.ValidFrom)
      // var DateTo = new Date(this.ValidTo)
      //if( moment(this.ValidFrom).isBefore(this.ValidTo))
      //if(moment(this.ValidFrom).startOf('day').isBefore(moment(this.ValidTo).startOf('day')) || moment(this.ValidFrom).startOf('month').isSameOrBefore(moment(this.ValidTo).startOf('month'))

      // let FromDate=this.datePipe.transform(this.ValidFromDate, 'MM-dd-yyyy')
      // let ToDate = this.datePipe.transform(this.ValidToDate,'MM-dd-yyyy')

       // let url = "logistics_packing_price/"+this.PackingPriceId+"/";
      // this.api.updateData(url,data).then(res => {
      //   console.log(res)
      //   this.toast.success("Record Updated Successfully!");
        
      //   this.getPackingPricelist();
      // })

      // let FromDate=this.datePipe.transform(this.validFromDate, 'dd-MM-yyyy')
    // let ToDate = this.datePipe.transform(this.validToDate,'dd-MM-yyyy')
    // if(ToDate > FromDate)

    // let FromDate=this.datePipe.transform(this.validFromDate, 'dd-MM-yyyy')
    // let ToDate = this.datePipe.transform(this.validToDate,'dd-MM-yyyy')
    // if(ToDate > FromDate)

     // 'validFrom':FromDate,
      // 'validTo':ToDate,