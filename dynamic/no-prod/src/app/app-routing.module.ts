import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewDashboardComponent } from './components/dashboard/view-dashboard/view-dashboard.component'
import { LoginComponent } from './components/client-login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/view-dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'view-dashboard',
    component: ViewDashboardComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
