//Requires
var express = require('express');
var mongoose = require('mongoose');

//inicializar variables

var app = express();

//conexión bbdd
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;
    console.log('base de datos \x1b[32m%s\x1b[0m', 'online')

})

//rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })
});


//escuchar peticiones

app.listen(3000, () => {
    console.log('express server corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online')
});