import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

//Bearer Token

  setBearerToken(data: any) {
    localStorage.setItem('accessToken', JSON.stringify(data));
  }

  getBearerToken() {
    return JSON.parse(localStorage.getItem('accessToken') || '{}');
  }


// Active User

  setActiveUser(data: any){
    localStorage.setItem('active', JSON.stringify(data));
  }

  getActiveUser() {
    return JSON.parse(localStorage.getItem('active') || '{}');
  }

  setuserLogin(data: any){
    localStorage.setItem('user_login', JSON.stringify(data));
  }
  setda_id(data: any){
    localStorage.setItem('da_id', JSON.stringify(data));
  }
  getda_id(){
   
    return JSON.parse(localStorage.getItem('da_id') || 'false');
  }
  settruck_id(data: any){
    localStorage.setItem('truck_id', JSON.stringify(data));
  }
  gettruck_id(){
   
    return JSON.parse(localStorage.getItem('truck_id') || 'false');
  }

  getuserLogin() {
    return JSON.parse(localStorage.getItem('user_login') || 'false');
  }
// Super User

  setSuperUser(data: any){
    localStorage.setItem('suser', JSON.stringify(data));
  }

  getSuperUser() {
    return JSON.parse(localStorage.getItem('suser')  || '{}');
  }


// User ID

  setUserID(data: any){
    var decoded: any = jwt_decode(data);
    localStorage.setItem("user_id", JSON.stringify(decoded.user_id));
  }

  getUserID(){
    return JSON.parse(localStorage.getItem('user_id')  || '{}');
  }


  // Username

  setUser(data: any){
    localStorage.setItem('username', JSON.stringify(data));
  }

  getUser(){
    return JSON.parse(localStorage.getItem('username')  || '{}');
  }
  sethersertitle(data: any){
    localStorage.setItem('headername', data);
  }
  gethersertitle(){
     return localStorage.getItem('headername');
  }
  
  setUserRole(data:any){

    localStorage.setItem('userRole',JSON.stringify(data))

  }



  getUserRole()

  {

    return JSON.parse(localStorage.getItem('userRole') || '{}');

  }

  setmodule_list(data:any){

    localStorage.setItem('module_list',JSON.stringify(data))

  }

  getmodule_list(){

    return JSON.parse(localStorage.getItem('module_list') || '{}');

  }
  setroot_list(data:any){

    localStorage.setItem('root_list',JSON.stringify(data))

  }

  getuser_level(){

    return JSON.parse(localStorage.getItem('user_level') || '{}');

  }
  setuser_level(data:any){

    localStorage.setItem('user_level',JSON.stringify(data))

  }

  getroot_list(){

    return JSON.parse(localStorage.getItem('root_list') || '{}');

  }
  getroot_list_single(module_id){

    let root_data=JSON.parse(localStorage.getItem('root_list') || '{}');
    let single_data=root_data.find( e => e.module_id == module_id );
    return single_data;

  }

  setuser_data(data:any){

    localStorage.setItem('user_data',JSON.stringify(data))

  }

  getuser_data(){

    return JSON.parse(localStorage.getItem('user_data') || '{}');

  }

}





