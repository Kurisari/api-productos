const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta al archivo JSON
const productosPath = path.join(__dirname, 'productos.json');

// Middleware para manejar JSON en las solicitudes
app.use(express.json());

// Leer datos del archivo JSON
const leerProductos = () => {
    const datos = fs.readFileSync(productosPath, 'utf-8');
    return JSON.parse(datos);
};

// Escribir datos al archivo JSON
const escribirProductos = (productos) => {
    fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2), 'utf-8');
};

// Rutas de la API
// Obtener todos los productos
app.get('/productos', (req, res) => {
    const productos = leerProductos();
    res.json(productos);
});

// Crear un nuevo producto
app.post('/productos', (req, res) => {
    const nuevoProducto = req.body;
    const productos = leerProductos();

    // Asignar un ID único al nuevo producto
    nuevoProducto.id = productos.length ? productos[productos.length - 1].id + 1 : 1;

    productos.push(nuevoProducto);
    escribirProductos(productos);

    res.status(201).json({ message: 'Producto añadido', producto: nuevoProducto });
});

// Eliminar un producto por ID
app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    let productos = leerProductos();

    const productosFiltrados = productos.filter((producto) => producto.id !== id);

    if (productos.length === productosFiltrados.length) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    escribirProductos(productosFiltrados);
    res.json({ message: 'Producto eliminado' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});