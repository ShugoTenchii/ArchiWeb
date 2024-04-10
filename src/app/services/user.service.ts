import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private baseUrl = 'http://localhost:8888'; // URL de base de votre API REST
  
  private token: string | null = null; // Stocker le token JWT

  constructor(private http: HttpClient) { 
  }

  // Récupérer tous les utilisateurs depuis l'API REST
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  // Récupérer tous les utilisateurs depuis l'API REST
  getUser(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${email}`); 
  }

  // Ajouter un utilisateur via l'API REST
  addUser(user: User): Observable<any> {
    const queryParams = new URLSearchParams({ 
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: user.password,
      role: user.role
    }).toString();
    const url = `${this.baseUrl}/user?${queryParams}`;
    return this.http.post<User>(url,{});
  }

  // Connecter un utilisateur via l'API REST
  loginUser(credentials: { email: string, password: string }): Observable<any> {
    const queryParams = new URLSearchParams({
      email: credentials.email,
      password: credentials.password,
    }).toString();
    const url = `${this.baseUrl}/login?${queryParams}`;
    console.log(url);
    return this.http.post<any>(url,{});
  }

  // Supprimer un utilisateur via l'API REST
  deleteUser(email: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/user/${email}`);
  }

  // Modifier un utilisateur via l'API REST
  updateUser(email: string, updatedUser: User): Observable<any> {
    const queryParams = new URLSearchParams({
      nom: updatedUser.nom,
      prenom: updatedUser.prenom,
      email: updatedUser.email,
      password: updatedUser.password,
      role: updatedUser.role
    }).toString();
    const url = `${this.baseUrl}/users/${email}?${queryParams}`;
    console.log(url);
    return this.http.put<any>(url,{});
  }
}
