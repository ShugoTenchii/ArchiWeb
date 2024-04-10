import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user = {
    prenom: "",
    nom: "",
    email: "",
    password: "",
    role: "utilisateur",
  };
  registeredUserId: string | undefined;
  registered: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  register() {
    this.user.email = this.user.email.toLowerCase();
    console.log("response._id");
    this.userService.addUser(this.user).pipe(
      catchError(error => {
        console.log('Error registering user:', error);
        return EMPTY; // Retourne un Observable vide pour éviter de bloquer le flux
      })
    ).subscribe(
      (response: any) => {
        console.log(response._id);
        console.log(response.message);
        this.registeredUserId = response._id;
        this.registered = true;
        this.router.navigateByUrl('/login');
      }
    );
  }
}
