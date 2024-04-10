import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  title = 'ArchiWeb';
  isLogin = false;
  isadmin = false;

  ngOnInit(): void {
    this.isLogin = this.isLoggedIn();
    this.isadmin = this.isAdmin();
  }

  constructor(private router: Router, private userService: UserService, private jwtHelper: JwtHelperService, private localStorage: LocalStorageService) { }

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

  login() {
    this.router.navigateByUrl('/login');
  }

  register() {
    this.router.navigateByUrl('/register');
  }

  logout(): void {
    this.localStorage.removeItem('token');
    this.reload();
  }

  reload(): void{
    window.location.reload();
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
