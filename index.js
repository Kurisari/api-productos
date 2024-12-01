const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
const path = require('path');
const productosPath = path.join(__dirname, 'productos.json');

app.use(express.json());

let productos;

try {
    productos = JSON.parse(fs.readFileSync(productosPath));
} catch (error) {
    console.error('Error al leer productos.json:', error);
    productos = [];
}


app.get('/', (req, res) => {
    res.redirect('/api/productos');
});

app.get('/api/productos', (req, res) => {
    try {
        res.json(productos);
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
