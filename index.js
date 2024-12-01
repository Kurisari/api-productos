const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const productosPath = path.join(__dirname, 'public', 'productos.json');
let productos;

try {
    productos = JSON.parse(fs.readFileSync(productosPath));
} catch (error) {
    console.error('Error al leer productos.json:', error);
    productos = [];  // Evita que la app se detenga si no encuentra el archivo
}

app.get('/', (req, res) => {
    res.redirect('/api/productos');
});

app.get('/api/productos', (req, res) => {
    res.json(productos);
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
