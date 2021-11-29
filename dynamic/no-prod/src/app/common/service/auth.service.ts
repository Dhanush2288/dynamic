import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  baseURL = environment.SERVER_BASE_URL;

  constructor(
    private _http: HttpClient
  ) { }


  isClientLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
