import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  user: User = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: ''
  };

  email: string | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    const emailParam = this.route.snapshot.paramMap.get("email");
    console.log(emailParam);
    if(emailParam != null){
      this.email = emailParam;
      console.log(this.email);
      this.userService.getUser(this.email).subscribe(user => {
        this.user = user;
      });
    }
  }

  updateUser() {
    
    if(this.email == null){
      console.log('Mail null');
      return EMPTY;
    }

    this.userService.updateUser(this.email, this.user).pipe(
      catchError(error => {
        console.log('Error updating user:', error);
        return EMPTY;
      })
    ).subscribe(() => {
      console.log('User updated successfully!');
      this.router.navigate(['/users']); // Rediriger vers la liste des utilisateurs après la mise à jour
    });
    return EMPTY;
  }
}
