const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const mongoURL = "mongodb://root:root@127.0.0.1:27017";
const client = new MongoClient(mongoURL);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// parser nécessaire pour récupérer les valeurs en mode POST
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

class User {
    constructor(prenom,nom, email, password, role) {
        this.prenom = prenom;
        this.nom = nom;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Méthode pour afficher les informations de l'utilisateur
    displayInfo() {
        console.log(`ID: ${this.id}, Prénom: ${this.prenom}, Nom: ${this.prenom}, Email: ${this.email}, Rôle: ${this.role}`);
    }
}

class Material {
    constructor(name, type, assigned_to, status, room) {
        this.name = name;
        this.type = type;
        this.assigned_to = assigned_to;
        this.status = status;
        this.room = room;
    }

    // Méthode pour afficher les informations du matériel
    displayInfo() {
        console.log(`ID: ${this.id}, Nom: ${this.name}, Type: ${this.type}, Statut: ${this.status}, Assigné à: ${this.assigned_to}, Pièce: ${this.room}`);
    }
}

// Fonction pour créer un token JWT
function createToken(user) {
    return jwt.sign({ id: user._id, email: user.email }, 'MALIK', { expiresIn: '1h' });
}

// Middleware pour vérifier le token JWT
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'MALIK', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
}

module.exports = { createToken, verifyToken };

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

connectToDatabase();

app.get('/users', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('user');
        const users = await collection.find({}).toArray();
        res.json(users); 
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
});

// Route pour ajouter un utilisateur (admin)
app.post('/user', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('user');
        
        console.log(req.query);
        const {prenom, nom, email, password, role } = req.query;
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({_id: collection._id, message: "User already exists" });
        }

        // Ajouter l'utilisateur à la base de données
        const result = await collection.insertOne({ prenom, nom, email, password, role });
        
        res.status(201).json({_id:result._id, message: "User created successfully"});
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({_id:result._id, message: "Error adding user" });
    }
});

// Route pour récupérer un utilisateur par son email
app.get('/user/:email', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('user');
        const userEmail = req.params.email;
        const user = await collection.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user" });
    }
});

// Route pour se connecter et obtenir un token JWT
app.post('/login', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('user');

        const { email, password } = req.query;

        // Rechercher l'utilisateur dans la base de données par son email
        const user = await collection.findOne({ email });
        console.log(email);

        // Si l'utilisateur n'est pas trouvé, renvoyer un message d'erreur
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Comparer les mots de passe
        if(user.password !== password){
            return res.status(401).json({ message: "Wrong password" });
        }

        // Générer un token JWT avec le rôle de l'utilisateur inclus
        const token = jwt.sign({ 
            email: user.email,
            role: user.role // Inclure le rôle de l'utilisateur dans le token
        }, "MALIK"); // Utilisez votre propre secret pour signer le token

        res.json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Error during login" });
    }
});

// Route pour supprimer un utilisateur (admin)
app.delete('/user/:email', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('user');
        const userId = req.params.email;

        var existingUser = await collection.findOne({ email: userId });
        if (!existingUser) {
            return res.status(400).json({ message: "User don't exists" });
        }

        const result = await collection.deleteOne({ email: userId });
        res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
});

// Route pour modifier un utilisateur (admin)
app.put('/users/:email', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('user');
        const userId = req.params.email;

        const { prenom, nom, email, password, role } = req.query;
        const updatedUser = new User(prenom, nom, email, password, role);

        const result = await collection.updateOne({email: userId }, { $set: updatedUser });
        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
});

app.get('/materials', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('materiel');
        const materials = await collection.find({}).toArray();
        res.json(materials); 
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des materiel" });
    }
});

app.get('/material/:_id', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('materiel');
        const materialId = req.params._id;
        const material = await collection.findOne({ _id: new ObjectId(materialId) });
        if (!material) {
            return res.status(404).json({ message: "Material not found" });
        }
        res.status(200).json(material);
    } catch (error) {
        console.error("Error fetching material:", error);
        res.status(500).json({ message: "Error fetching material" });
    }
});


// Route pour ajouter un matériel (admin)
app.post('/material', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('materiel');
        
        const { name, type, status, assigned_to, room } = req.query;

        // Ajouter le matériel à la base de données
        const result = await collection.insertOne({ name, type, status, assigned_to, room });
        res.status(201).json({ message: "Material created successfully" });
    } catch (error) {
        console.error("Error adding material:", error);
        res.status(500).json({ message: "Error adding material" });
    }
});




// Route pour supprimer un matériel (admin)
app.delete('/material/:_id', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('materiel');
        const materialId = req.params._id;

        var existingMaterial = await collection.findOne({ _id: new ObjectId(materialId)});
        if (!existingMaterial) {
            return res.status(400).json({ message: "Material don't exists" });
        }

        const result = await collection.deleteOne({ _id: new ObjectId(materialId) });
        res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting material:", error);
        res.status(500).json({ message: "Error deleting material" });
    }
});

// Route pour modifier un matériel (admin)
app.put('/materials/:_id', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('materiel');
        const materialId = req.params._id;

        const { name, type, assigned_to, status, room } = req.query;
        const updatedMaterial = new Material(name, type, assigned_to, status, room);
        
        console.log(updatedMaterial.type);
        const result = await collection.updateOne({ _id: new ObjectId(materialId) }, { $set: updatedMaterial });
        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating material:", error);
        res.status(500).json({ message: "Error updating material" });
    }
});

// Route pour récupérer le statut d'un matériel par son ID et l'email de l'utilisateur
app.post('/materials/status', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('materiel');
        
        const { email, _id } = req.query;

        // Vérifier que l'utilisateur est autorisé à accéder au statut du matériel
        const material = await collection.findOne({ _id: new ObjectId(_id), assigned_to: email });
        if (!material) {
            return res.status(200).json("false");
        }
        
        res.status(200).json(material.status);
    } catch (error) {
        console.error("Error fetching material status:", error);
        res.status(500).json({ message: "Error fetching material status" });
    }
});


// Route pour récupérer tous les matériaux avec le statut 'request' ou 'true'
app.get('/materials/requested', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('materiel');
        
        // Requête pour trouver tous les matériaux avec le statut 'request' ou 'true'
        const materials = await collection.find({ $or: [{ status: 'request' }, { status: 'true' }] }).toArray();
        
        res.status(200).json(materials);
    } catch (error) {
        console.error("Error fetching requested materials:", error);
        res.status(500).json({ message: "Error fetching requested materials" });
    }
});

app.post('/materials/request', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('materiel');
        
        // Extraire les données du corps de la requête
        const { materialId, userEmail } = req.query;

        // Créer un objet Material à mettre à jour avec l'utilisateur attribué
        const updatedMaterial = {
            assigned_to: userEmail, 
            status: 'requested' 
        };
        
        // Mettre à jour le document matériel dans la base de données
        const result = await collection.updateOne({ _id: ObjectId(materialId) }, { $set: updatedMaterial });
        
        res.status(200).json({ message: "Demande d'attribution envoyée avec succès" });
    } catch (error) {
        console.error("Error requesting material:", error);
        res.status(500).json({ message: "Error requesting material" });
    }
});

// Route pour demander à rendre un matériel 
app.post('/materials/return', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('materiel');

        // Extraire les données du corps de la requête
        const { materialId, userEmail } = req.body;
        const result = await collection.updateOne({ _id: ObjectId(materialId) }, { $set: { assigned_to: `${userEmail}`,status: 'return' } });
        
        res.status(200).json({ message: "Demande de retour envoyée avec succès" });
    } catch (error) {
        console.error("Error returning material:", error);
        res.status(500).json({ message: "Error returning material" });
    }
});

// Route pour accepter une demande d'attribution 
app.put('/materials/assign/:_id', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('materiel');
        const materialId = req.params.id;
        
        // Mettre à jour le statut du matériel avec l'ID correspondant
        const result = await collection.updateOne({ _id: ObjectId(materialId) }, { $set: { status: 'true' } });
        
        res.status(200).json({ message: "Demande d'attribution acceptée avec succès" });
    } catch (error) {
        console.error("Error accepting material assignment:", error);
        res.status(500).json({ message: "Error accepting material assignment" });
    }
});

// Route pour retour, refuser 
app.put('/materials/return/:_id', async (req, res) => {
    try {
        const database = client.db('ProjectDB');
        const collection = database.collection('materiel');
        const materialId = req.params.id;
        
        // Mettre à jour le statut du matériel avec l'ID correspondant
        const result = await collection.updateOne({ _id: ObjectId(materialId) }, { $set: { assigned_to: 'none',status: 'false' } });
        
        res.status(200).json({ message: "Retour de matériel accepté avec succès" });
    } catch (error) {
        console.error("Error accepting material return:", error);
        res.status(500).json({ message: "Error accepting material return" });
    }
});


const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
