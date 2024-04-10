import { Component } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material.model';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from '../../services/local-storage.service';


@Component({
  selector: 'app-all-request',
  templateUrl: './all-request.component.html',
  styleUrl: './all-request.component.css'
})
export class AllRequestComponent {
  materials: Material[] = [];
  isLogin = false;
  isadmin = false;
  email: string | undefined;

  constructor(private materialService: MaterialService, private router: Router, private jwtHelper: JwtHelperService, private localStorage: LocalStorageService) { }

  ngOnInit(): void {
    this.loadMaterials();
    this.email = this.getId();
    this.isLogin = this.isLoggedIn();
    this.isadmin = this.isAdmin();
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
  
  loadMaterials() {
    this.materialService.getRequest().pipe(
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

  agreeMaterial(m: Material){
    if(this.email && m){
      this.materialService.acceptMaterialAssignment(m).pipe(
        catchError(error => {
          console.log('Error return:', error);
          return EMPTY;
        })
      ).subscribe(() => {
        console.log('User return successfully!');
        window.location.reload();
      });
      }
  }
  

  desagreeMaterial(m: Material) {
    if(this.email && m){
      this.materialService.stopMaterial(m, this.email).pipe(
        catchError(error => {
          console.log('Error return:', error);
          return EMPTY;
        })
      ).subscribe(() => {
        console.log('User return successfully!');
        window.location.reload();
      });
      }
  }

  aRendre(m: Material){
    if(this.email && m){
      this.materialService.rendreMaterial(m).pipe(
        catchError(error => {
          console.log('Error return:', error);
          return EMPTY;
        })
      ).subscribe(() => {
        console.log('User return successfully!');
        window.location.reload();
      });
      }
  }
}
