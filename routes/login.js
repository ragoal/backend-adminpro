var express = require('express')
var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');



// ======================================
//  login de usuarios
// ======================================

app.post('/', (req, res) => {


    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuarios no existe',
                errors: { messsage: 'No existe el usuario' }

            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            res.status(200).json({
                ok: true,
                message: 'autenticacion incorrecta',

            })
        } else {

            //crear token
            usuarioDB.password = ':-)'
            var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

            res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                token: token,
                id: usuarioDB._id

            });
        }

    })


});








module.exports = app;