import { Component } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrl: './material-list.component.css'
})
export class MaterialListComponent {
  materials: Material[] = [];
  status: string[] = [];

  constructor(private materialService: MaterialService, private router: Router, private jwtHelper: JwtHelperService, private localStorage: LocalStorageService) { }

  email: string | undefined;

  ngOnInit(): void {
    this.loadMaterials();
    this.email = this.getId();
    for (const m of this.materials) {
      this.status.push(this.getStatus(m._id));
    }
  }

  getId(): string {
    const token = this.localStorage.getItem('token');
    if (token) {
      try {
        // Utiliser JwtHelperService pour décoder le token JWT
        const tokenInfo = this.jwtHelper.decodeToken(token);
        return tokenInfo.email;
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return ""; 
      }
    }
    return ""; 
  }

  addMaterial() {
    this.router.navigate(['/add-material']);
  }

  loadMaterials() {
    this.materialService.getMaterials().pipe(
      catchError(error => {
        console.log('Error fetching users:', error);
        return EMPTY;
      })
    ).subscribe(
      (data: Material[]) => {
        this.materials = data;
      }
    );
  }

  deleteMaterial(id: string) {
    this.materialService.deleteMaterial(id).pipe(
      catchError(error => {
        console.log('Error fetching users:', error);
        return EMPTY;
      })
    ).subscribe(
      () => {
        console.log(id);
        window.location.reload();
      }
    );
  }

  updateMaterial(_id: string) {
    this.router.navigate(['/update-material', _id]);
  }


  isLoggedIn(): boolean {
    const token = this.localStorage.getItem('token');
    if (token) {
      try {
        // Utiliser JwtHelperService pour décoder le token JWT
        const tokenInfo = this.jwtHelper.decodeToken(token);

        // Vérifier si la date d'expiration du token est passée
        if (tokenInfo && !this.jwtHelper.isTokenExpired(token)) {
          return true; // Si le token est valide et la date d'expiration n'est pas encore passée, retourner true
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return false; // En cas d'erreur lors du décodage, retourner false
      }
    }
    return false; // Si le token est absent ou invalide, retourner false
  }

  getStatus(_id: string): string {
    if(this.email){
      console.log(this.email + " " + _id)
      this.materialService.getStatus(_id, this.email).pipe(
        catchError(error => {
          console.log('Error fetching users:', error);
          return "false";
        })
      ).subscribe(
        (data) => {
          return data;
        }
      );
    }
    return "false";
  }

  // Fonction pour vérifier si l'utilisateur est administrateur
  isAdmin(): boolean {
    const token = this.localStorage.getItem('token');
    if (token) {
      try {
        // Utiliser JwtHelperService pour décoder le token JWT
        const tokenInfo = this.jwtHelper.decodeToken(token);

        // Vérifier si l'utilisateur a le rôle d'administrateur
        if (tokenInfo && tokenInfo.role === 'admin') {
          return true; // Si l'utilisateur est administrateur, retourner true
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return false; // En cas d'erreur lors du décodage, retourner false
      }
    }

    return false; // Si le token est absent, invalide ou si l'utilisateur n'est pas administrateur, retourner false
  }
}