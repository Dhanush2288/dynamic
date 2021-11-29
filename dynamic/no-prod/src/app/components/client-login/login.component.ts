import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginDetails: FormGroup;
  _custom_validation: any;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router
  ) {

    this.loginDetails = _formBuilder.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginDetails.value.userId == 'admin' && this.loginDetails.value.password == 'admin@sense') {
      localStorage.setItem('token', 'bearer hhjghjhhjkhghb4jhkhb7h65vhvgvb');
      localStorage.setItem('projectName', 'HSENS ');
      this.router.navigateByUrl('/oxygen/home')
    }
    else if (this.loginDetails.value.userId == 'admin' && this.loginDetails.value.password == 'admin@vnai') {
      localStorage.setItem('token', 'bearer hhjghjhhjkhghb4jhkhb7h65vhvgvb');
      localStorage.setItem('projectName', 'HSENS ');
      this.router.navigateByUrl('/Hense/home')
    } else {
      localStorage.clear();
      alert('Wrong credentials, please try again')
    }
  }


}
