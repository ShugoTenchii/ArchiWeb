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
   requestMaterial(materialId: string, userEmail: string): Observable<any> {
    const queryParams = new URLSearchParams({ 
      email: userEmail,
      _id: materialId,
    }).toString();
    const url = `${this.baseUrl}/materials/request?${queryParams}`;
    return this.http.post<any>(url, {});
  }

  // Demander à rendre un matériel via l'API REST
  returnMaterial(materialId: string, userEmail: string): Observable<any> {
    const queryParams = new URLSearchParams({ 
      email: userEmail,
      _id: materialId,
    }).toString();
    const url = `${this.baseUrl}/materials/return?${queryParams}`;
    return this.http.post<any>(url, {});
  }

  // Accepter une demande d'attribution via l'API REST
  acceptMaterialAssignment(materialId: string): Observable<any> {
    const queryParams = new URLSearchParams({ 
      _id: materialId,
    }).toString();
    const url = `${this.baseUrl}/materials/assign?${queryParams}`;
    return this.http.put<any>(url, {});
  }

  // Accepter le retour d'un matériel via l'API REST
  acceptMaterialReturn(materialId: string): Observable<any> {
    const queryParams = new URLSearchParams({ 
      _id: materialId,
    }).toString();
    const url = `${this.baseUrl}/materials/return?${queryParams}`;
    return this.http.put<any>(url, {});
  }
}
