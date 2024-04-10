import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().pipe(
      catchError(error => {
        console.log('Error fetching users:', error);
        return EMPTY;
      })
    ).subscribe(
      (data: User[]) => {
        this.users = data;
      }
    );
  }

  deleteUser(email: string){
    
    console.log(email);
    this.userService.deleteUser(email).pipe(
      catchError(error => {
        console.log('Error fetching users:', error);
        return EMPTY;
      })
    ).subscribe(
      () => {
        console.log(email);
        window.location.reload();
      }
    );
  }

  updateUser(email: string) {
    this.router.navigate(['/update-user', email]);
  }
}
