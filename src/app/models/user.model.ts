export class User {
    prenom: string;
    nom: string;
    email: string;
    password: string;
    role: string;
  
    constructor(prenom: string, nom:string, email: string, password: string, role: string) {
      this.prenom = prenom;
      this.nom = nom;
      this.email = email;
      this.password = password;
      this.role = role;
    }
  }