import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    private http: HttpClient
  ) { }

  // baseurl = "http://3.109.152.127:4000"

  baseurl = environment.SERVER_BASE_URL;


  getapidetails(name, limit,c) {
    return this.http.get<any>(this.baseurl + '/r/dynamicapi?projectID=' + name + '&Date=' + limit + '&EndDate='+c)
  }
  getprojectID1() {
    return this.http.get<any>(this.baseurl + '/r/id/audio');
  }
    getprojectID() {
    return this.http.get<any>(this.baseurl + '/r/id/dynamicapi');
  }
  getaudio(name, limit) {
    return this.http.get<any>(this.baseurl + '/r/audioapi?projectID=' + name + '&Date=' + limit + '');
  }
  deleteProjectID(a){
    return this.http.get<any>(this.baseurl + `/deleteprojectID/${a}`);
  }



}
