import { Component, OnInit, ViewChild, ElementRef,AfterViewInit   } from '@angular/core';
import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';


import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent;

  barcodeValue;
  barcode;
  constructor(
    public http: HttpClient,
  ) { }

  ngOnInit(): void {

console.log("hi",this.signin())


  }
  signin(){
    let headers = new HttpHeaders();
          headers = headers.append('Content-Type', 'text/xml');
          headers = headers.append('Accept', 'text/xml');
    let body =  '<request>'
    '<?xml version="1.0" encoding="utf-8"?>'
    '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'
      '<soap:Body>'
        '<getPincodeServiceableStatus xmlns="http://www.tciexpress.in/">'
          '<pPinCodes>122001</pPinCodes>'
         ' <pProfile>'
         '   <UserID>TCIEXP</UserID>'
           ' <Password>TCIEXP@123</Password>'
         ' </pProfile>'
      '  </getPincodeServiceableStatus>'
     ' </soap:Body>'
  '  </soap:Envelope>'
  '<request>';

     this.http.post('https://customerapitesting.tciexpress.in/ServiceEnquire.asmx?op=getPincodeServiceableStatus',body , { headers: headers, responseType: 'text' }).subscribe(response => {
          console.log(response)
   });;
}

  ngAfterViewInit() {
    this.barcodeScanner.start();
  }

  onValueChanges(result) {
    this.barcodeValue = result.codeResult.code;
  }
  onKey(event: any) {
    this.barcode=event.target.value;
}

  onStarted(started) {
    console.log(started);
  }
  // public downloadAsPDF() {
  //   const doc = new jsPDF();
   
  //   const pdfTable = this.pdfTable.nativeElement;
  //   const pdfTable_headere = this.pdfTable.nativeElement;
   
  //   var html = htmlToPdfmake(pdfTable.innerHTML);
  //   var html_headere = htmlToPdfmake(pdfTable_headere.innerHTML);
     
  //   const documentDefinition = {
  //     footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
  //       header: function(currentPage, pageCount, pageSize) {
  //   // you can apply any logic and return any valid pdfmake element
  //         return html_headere;
  //   // return [
  //   //   { text:'<h2>kudguiwegdiewgi</h2>', alignment: (currentPage % 2) ? 'left' : 'right' },
  //   //   { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
  //   // ]
  // },
  //     content: html 
  //   };
  //   pdfMake.createPdf(documentDefinition).open(); 
     
  // }

}
