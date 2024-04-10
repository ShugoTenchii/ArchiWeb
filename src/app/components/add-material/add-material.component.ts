import { Component } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-add-material',
  templateUrl: './add-material.component.html',
  styleUrl: './add-material.component.css'
})
export class AddMaterialComponent {

  material = {
    name: "",
    type: "",
    status: "false",
    assigned_to: "none",
    room: "none",
  };

  registeredMaterialId: string | undefined;

  constructor(private materialService: MaterialService, private router: Router) { }

  addM() {
    console.log("response._id");
    this.materialService.addMaterial(this.material).pipe(
      catchError(error => {
        console.log('Error registering user:', error);
        return EMPTY; // Retourne un Observable vide pour éviter de bloquer le flux
      })
    ).subscribe(
      (response: any) => {
        console.log(response._id);
        console.log(response.message);
        this.registeredMaterialId = response._id;
        this.router.navigateByUrl('/materials');
      }
    );
  }
}
