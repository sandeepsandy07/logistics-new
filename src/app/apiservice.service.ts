import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { StorageServiceService } from './service-storage.service';
import {observable, Subject} from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class ApiserviceService {
  apiUrl = environment.apiUrl;
  constructor(
  public http: HttpClient,
  public router: Router,
  public storage:StorageServiceService,
  ) { }

  private subject = new Subject<any>();
  sendClickEvent(value:any)
  {
    this.subject.next(value);
  }

  getEvent():Observable<any>
  {
    return this.subject.asObservable();
  }

  PostData(url: any,data: any) {
    // let bearer = this.storage.getBearerToken();
    // let headers =  {
    //   headers: new HttpHeaders({ 
    //     'Content-Type': 'application/json', 
    //     'Authorization': 'Bearer'+' '+bearer
    //   })};
    //debugger;
    return new Promise((resolve, reject) => {
    this.http.post(this.apiUrl + url,data).subscribe(res => {
    resolve(res);
    }, (err) => {
      reject(err)
    });
    });
  }

  public download(url:any): Observable<any> {
    let bearer = this.storage.getBearerToken();
    let headers =  {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({ 
        'Content-Type': 'application/vnd.openxmlformats-ficedocument.spreadsheetml.sheet', 
        'Authorization': 'Bearer'+' '+bearer,
      })};
    return this.http.get(this.apiUrl + url, headers)
  }
 


  postData(url: any,data: any) {
    let bearer = this.storage.getBearerToken();
    let headers =  {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer'+' '+bearer
      })};
    return new Promise((resolve, reject) => {
     
    this.http.post(this.apiUrl + url,data,headers).subscribe(res => {
    resolve(res);
   
    }, (err) => {
      reject(err)
     
    });
    });
  }
  getData_barcode(url: any,data: any) {
    let headers =  {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
       
      })};
    return new Promise((resolve, reject) => {
     
    this.http.post(url,data,headers).subscribe(res => {
    resolve(res);
   
    }, (err) => {
      reject(err)
     
    });
    });
  }


  getData(url: any) {
    let bearer = this.storage.getBearerToken();
    let headers =  {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer'+' '+bearer
      })};
    //debugger;
    return new Promise((resolve, reject) => {
    this.http.get(this.apiUrl + url, headers).subscribe(res => {
    resolve(res);
    }, (err) => {
      reject(err)
    });
    });
  }

  deleteUser(id:string,url:any)
  {
    let bearer = this.storage.getBearerToken();
    let headers =  {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer'+' '+bearer
      })};
    return this.http.delete(this.apiUrl + url + id,headers)
  }

  viewuser(url:any,id:string)
  {
    let bearer = this.storage.getBearerToken();
    let headers =  {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer'+' '+bearer
      })};
    // return this.http.get(this.apiUrl + url + id,headers);

    return new Promise((resolve, reject) => {
    this.http.get(this.apiUrl + url+ id, headers).subscribe(res => {
    resolve(res);
    }, (err) => {
      reject(err)
    });
    });
  }

  ViewData(url:any)
  {
    return this.http.get(this.apiUrl + url);
  }

  updateData(url: any,data: any) {
    //debugger;
    let bearer = this.storage.getBearerToken();
    let headers =  {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer'+' '+bearer
      })};
    return new Promise((resolve, reject) => {
    this.http.put(this.apiUrl + url,JSON.stringify(data),headers).subscribe((res: any) => {
    resolve(res);
    }, (err) => {
      reject(err)
    });
    });
  }

  postLoginData(url:any, data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + url, data)
        .subscribe((res: any) => {
          resolve(res);
        }, (err) => {
          //this.logout(err);
          // reject(err);
        });
    });
  }
  public downloadPDF(url, data): any {

    let bearer = this.storage.getBearerToken();

    let headers =  {

      responseType: 'blob' as 'json',

      headers: new HttpHeaders({

        'Content-Type': 'application/json',

        'Authorization': 'Bearer'+' '+bearer,

      })};

      return new Promise((resolve, reject) => {

        this.http.post(this.apiUrl + url, data, headers).subscribe(

        (res) => {

          resolve(res);

        },  (err) => {

          reject(err);



        });

      });



  }
  public download_excel(url, data): any {

    let bearer = this.storage.getBearerToken();
    let headers =  {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Authorization': 'Bearer'+' '+bearer,
      })};
      return new Promise((resolve, reject) => {
        this.http.post(this.apiUrl + url, data, headers).subscribe(
        (res) => {
          resolve(res);

        },  (err) => {

          reject(err);



        });

      });



  }

}
