const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

let productos = JSON.parse(fs.readFileSync('productos.json'));

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
    res.json(productos);
});

// Agregar un nuevo producto
app.post('/api/productos', (req, res) => {
    const nuevoProducto = req.body;
    nuevoProducto.id = productos.length + 1;  // Genera un nuevo ID
    productos.push(nuevoProducto);
    fs.writeFileSync('productos.json', JSON.stringify(productos, null, 2));
    res.status(201).send(nuevoProducto);
});

// Eliminar un producto por ID
app.delete('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    productos = productos.filter(prod => prod.id !== id);
    fs.writeFileSync('productos.json', JSON.stringify(productos, null, 2));
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`API corriendo en http://localhost:${port}`);
});
