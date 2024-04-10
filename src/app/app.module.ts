import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { MaterialListComponent } from './components/material-list/material-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { UpdateMaterialComponent } from './components/update-material/update-material.component';
import { AddMaterialComponent } from './components/add-material/add-material.component';
import { AllRequestComponent } from './components/all-request/all-request.component';
import { AddRequestComponent } from './components/add-request/add-request.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    UserComponent,
    MaterialListComponent,
    UserListComponent,
    UpdateUserComponent,
    UpdateMaterialComponent,
    AddMaterialComponent,
    AllRequestComponent,
    AddRequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    JwtModule.forRoot({
      config: {}
    }),
  ],
  providers: [
    HttpClient,
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
