const express = require('express');
const fs = require('fs');
const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase
const serviceAccount = require('./config/firebase-credentials.json');  // Ruta al archivo de credenciales
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://api-dweb-default-rtdb.firebaseio.com/"  // URL de tu Realtime Database
});

// Crear una instancia de Express
const app = express();
const port = 3000;  // Puerto en el que se ejecutará el servidor

// Obtener la referencia a la base de datos
const db = admin.database();
const ref = db.ref("productos");  // La referencia a la colección de productos

// Redirección desde la ruta raíz ("/") a "/api/productos"
app.get('/', (req, res) => {
    res.redirect('/api/productos');
});

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

// Leer el archivo productos.json y cargar los datos en Firebase
app.get('/cargar-productos', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'productos.json'), 'utf8', (err, data) => {
        if (err) {
            console.error("Error al leer el archivo:", err);
            return res.status(500).send("Error al leer el archivo productos.json");
        }

        // Parsear los datos JSON del archivo
        const productos = JSON.parse(data);

        // Subir los productos a Firebase
        productos.forEach(producto => {
            const newProductRef = ref.push();  // Crea un nuevo nodo con ID único
            newProductRef.set(producto, (error) => {
                if (error) {
                    console.error("Error al guardar el producto:", error);
                } else {
                    console.log(`Producto ${producto.name} agregado exitosamente.`);
                }
            });
        });

        res.send("Productos cargados a Firebase exitosamente.");
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
