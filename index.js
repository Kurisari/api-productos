const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = 3000;

// Leer las credenciales desde las variables de entorno
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Reemplazar \n por saltos de línea
};

// Inicializar Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://api-dweb-default-rtdb.firebaseio.com/"  // URL de tu Realtime Database
});

// Obtener la referencia a la base de datos
const db = admin.database();
const ref = db.ref("productos");

// Servir los productos desde Firebase a través de un endpoint
app.get('/api/productos', (req, res) => {
    ref.once("value", (snapshot) => {
        const productos = snapshot.val();  // Obtiene los datos de la base de datos
        if (productos) {
            res.json(productos);  // Responde con los productos en formato JSON
        } else {
            res.status(404).send("No se encontraron productos.");
        }
    });
});

// Redirección desde la ruta raíz ("/") a "/api/productos"
app.get('/', (req, res) => {
    res.redirect('/api/productos');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
