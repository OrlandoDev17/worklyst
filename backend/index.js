const express = require('express');

const app = express();

const port = 3000;

app.get('/prueba', (req, res) => {
    res.send('¡Hola Mundo! Mi servidor con Express está funcionando');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});