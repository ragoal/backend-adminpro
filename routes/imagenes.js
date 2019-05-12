var express = require('express')
var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            mensaje: 'error, tipo no valido',
            error: { message: 'tipo invalido, los tipos validos son hospitales, medicos y usuarios' }
        })
    } else {

        var pathImage = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

        if (fs.existsSync(pathImage)) {
            res.sendFile(pathImage);
        } else {
            var pathNoimage = path.resolve(__dirname, '../assets/no-img.jpg');
            res.sendFile(pathNoimage);
        }


    }

    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Petición realizada correctamente',
    //     datos: { tipo: tipo, img: img }
    // })
});

module.exports = app;