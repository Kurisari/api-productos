const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Ruta donde está el archivo JSON
const productosPath = path.join(__dirname, 'public', 'productos.json');
let productos;

// Intentamos leer el archivo JSON, si no existe, inicializamos como un array vacío
try {
    productos = JSON.parse(fs.readFileSync(productosPath));
} catch (error) {
    console.error('Error al leer productos.json:', error);
    productos = [];  // Evita que la app se detenga si no encuentra el archivo
}

// Redirección al endpoint de productos
app.get('/', (req, res) => {
    res.redirect('/api/productos');
});

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
    res.json(productos);
});

app.post('/api/productos', (req, res) => {
    const nuevoProducto = req.body;

    // Asegúrate de que la estructura es correcta (ID, nombre, descripción, etc.)
    nuevoProducto.id = productos.length + 1;  // O usar un método adecuado para asignar el ID

    // Agrega el nuevo producto al array
    productos.push(nuevoProducto);

    // Actualiza el archivo JSON
    try {
        fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));
        res.status(201).json(nuevoProducto);  // Responde con el producto agregado
    } catch (error) {
        res.status(500).send("Error al guardar el producto");
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
