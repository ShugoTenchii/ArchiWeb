import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  constructor(private userService: UserService, private localStorage: LocalStorageService, private router: Router, private app: AppComponent) { }

  login() {
    this.loginData.email = this.loginData.email.toLowerCase();
    console.log(this.loginData.email);
    this.userService.loginUser(this.loginData).subscribe((response => {
        console.log("token");
        if (response.token) {
          console.log(response.token);
          this.localStorage.setItem('token', response.token);
          this.router.navigateByUrl('/');
          window.location.reload();
        }
      })
    );
  }
}
