import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private baseUrl = 'http://localhost:8888'; // URL de base de votre API REST

  constructor(private http: HttpClient) { }

  // Récupérer tous les matériaux depuis l'API REST
  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.baseUrl}/materials`);
  }

  // Récupérer tous les utilisateurs depuis l'API REST
  getMaterial(_id: string): Observable<any> {
    return this.http.get<Material>(`${this.baseUrl}/material/${_id}`); 
  }

  // Récupérer le statut d'un matériel par son ID et l'email de l'utilisateur depuis l'API REST
  getStatus(_id: string, userEmail: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/materials/status?email=${userEmail}&_id=${_id}`,{});
  }

  // Ajouter un matériel via l'API REST
  addMaterial(material: any): Observable<any> {
    const queryParams = new URLSearchParams({ 
      name: material.name,
      type: material.type,
      assigned_to: material.assigned_to,
      room: material.room,
      status: material.status,
    }).toString();
    const url = `${this.baseUrl}/material?${queryParams}`;
    return this.http.post<any>(url, {});
  }

  // Supprimer un matériel via l'API REST
  deleteMaterial(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/material/${id}`);
  }

  // Modifier un matériel via l'API REST
  updateMaterial(id: string, updatedMaterial: Material): Observable<any> {
    const queryParams = new URLSearchParams({ 
      name: updatedMaterial.name,
      type: updatedMaterial.type,
      assigned_to: updatedMaterial.assigned_to,
      room: updatedMaterial.room,
      status: updatedMaterial.status,
    }).toString();
    const url = `${this.baseUrl}/materials/${id}?${queryParams}`;
    return this.http.put<any>(url, {});
  }

  getRequest(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.baseUrl}/materials/requested`);
  }

   // Demander à attribuer un matériel via l'API REST
   requestMaterial(material: Material, userEmail: string): Observable<any> {
    const queryParams = new URLSearchParams({ 
      name: material.name,
      type: material.type,
      assigned_to: userEmail,
      room: material.room,
      status: "requested",
    }).toString();
    const url = `${this.baseUrl}/materials/request/${material._id}?${queryParams}`;
    console.log(url);
    return this.http.put<any>(url, {});
  }

  stopMaterial(material: Material, userEmail: string): Observable<any> {
    const queryParams = new URLSearchParams({ 
      name: material.name,
      type: material.type,
      assigned_to: userEmail,
      room: material.room,
      status: "false",
    }).toString();
    const url = `${this.baseUrl}/materials/stop/${material._id}?${queryParams}`;
    return this.http.put<any>(url, {});
  }

  rendreMaterial(material: Material): Observable<any> {
    const queryParams = new URLSearchParams({ 
      name: material.name,
      type: material.type,
      assigned_to: material.assigned_to,
      room: material.room,
      status: "return",
    }).toString();
    const url = `${this.baseUrl}/materials/stop/${material._id}?${queryParams}`;
    return this.http.put<any>(url, {});
  }

  // Accepter une demande d'attribution via l'API REST
  acceptMaterialAssignment(material: Material): Observable<any> {
    const queryParams = new URLSearchParams({ 
      name: material.name,
      type: material.type,
      assigned_to:  material.assigned_to,
      room: material.room,
      status: "true",
    }).toString();
    const url = `${this.baseUrl}/materials/assign/${material._id}?${queryParams}`;
    return this.http.put<any>(url, {});
  }
}
