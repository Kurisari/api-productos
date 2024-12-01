const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

let productos = JSON.parse(fs.readFileSync('productos.json'));

app.get('/', (req, res) => {
    res.redirect('/api/productos');
});

// Endpoint para obtener todos los productos
app.get('/api/productos', (req, res) => {
    res.json(productos);
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
