import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {MaterialListComponent} from './components/material-list/material-list.component';
import {RegisterComponent} from './components/register/register.component';
import {UserComponent} from './components/user/user.component';
import {UserListComponent} from './components/user-list/user-list.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { UpdateMaterialComponent } from './components/update-material/update-material.component';
import { AddMaterialComponent } from './components/add-material/add-material.component';
import { AllRequestComponent } from './components/all-request/all-request.component';
import  {MyComponentComponent } from './components/my-component/my-component.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserComponent },
  { path: 'users', component: UserListComponent },
  { path: 'update-user/:email', component: UpdateUserComponent },
  { path: 'materials', component: MaterialListComponent },
  { path: 'add-material', component: AddMaterialComponent },
  { path: 'update-material/:_id', component: UpdateMaterialComponent },
  { path: 'all-request', component: AllRequestComponent },
  { path: 'my-request', component: MyComponentComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
