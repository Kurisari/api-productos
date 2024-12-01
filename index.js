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

// Agregar un nuevo producto (Método POST)
app.post('/api/productos', (req, res) => {
    const nuevoProducto = req.body;
    
    // Asignar un nuevo ID (puedes mejorarlo para que sea más dinámico)
    nuevoProducto.id = productos.length + 1;

    // Agregar el nuevo producto al array
    productos.push(nuevoProducto);

    // Guardar el archivo actualizado
    fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));

    // Responder con el producto agregado
    res.status(201).json(nuevoProducto);
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
