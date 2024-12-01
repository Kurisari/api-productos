const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

let productos = JSON.parse(fs.readFileSync('productos.json'));

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
