var express = require('express')
var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');



//google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// ======================================
//  login de usuarios google
// ======================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        img: payload.picture,
        email: payload.email,
        goole: true
    }
}


app.post('/google', async(req, res) => {
    var token = req.body.token;
    var googleUser = await verify(token)
        .catch(error => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no válido'

            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (usuarioDB) {
            if (usuarioDB.goole === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar autenticación normal',
                    errors: err
                });
            } else {
                usuarioDB.password = ':-)'
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id

                });
            }


        } else {
            //el usuario no existe

            var usuario = new Usuario()
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.password = ';-)';
            usuario.img = googleUser.picture;
            usuario.google = true;

            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al crear usuario',
                        errors: err
                    })
                }
                res.status(201).json({
                    ok: true,
                    usuario: usuarioGuardado,
                    usuariotoken: req.usuario
                });

            });

        }
    });


    // return res.status(200).json({
    //     ok: true,
    //     mensaje: 'Solicitud google sign in realizada',
    //     googleUser: googleUser

    // });


});


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