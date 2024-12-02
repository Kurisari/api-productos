module.exports = (req, res) => {
    // Redirigir la raíz ("/") a "/api/productos"
    if (req.url === '/') {
        res.writeHead(302, { 'Location': '/api/productos' });
        res.end();
    } else {
        res.status(404).send('Ruta no encontrada');
    }
};
