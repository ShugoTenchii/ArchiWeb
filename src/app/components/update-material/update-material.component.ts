import { Component } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-material',
  templateUrl: './update-material.component.html',
  styleUrl: './update-material.component.css'
})
export class UpdateMaterialComponent {
  users: User[] = [];
  material: Material = {
    _id: '',
    name: '',
    type: '',
    assigned_to: 'none',
    status: 'false',
    room: 'none'
  };

  id: string | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService ,private materialService: MaterialService) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("_id");
    console.log(idParam);
    if(idParam != null){
      this.id = idParam;
      console.log(this.id);
      this.materialService.getMaterial(this.id).subscribe(m => {
        this.material = m;
      });
    }
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  updateMaterial() {
    
    if(this.id == null){
      console.log('Id null');
      return EMPTY;
    }

    console.log(this.material.name);
    this.materialService.updateMaterial(this.id, this.material).pipe(
      catchError(error => {
        console.log('Error updating user:', error);
        return EMPTY;
      })
    ).subscribe(() => {
      console.log('User updated successfully!');
      this.router.navigate(['/materials']); // Rediriger vers la liste des utilisateurs après la mise à jour
    });
    return EMPTY;
  }
}
