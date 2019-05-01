var express = require('express')
var app = express();
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion');


var Usuario = require('../models/usuario');



// ======================================
// obtener todos los usuarios
// ======================================

app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error get de usuarios',
                        errors: err
                    })
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                })
            })



});


// ======================================
// actualizar un nuevo usuario
//===================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El usuarios con el id ' + id + ' no existe',
                errors: { messsage: 'No existe el usuario con ese id' }

            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                })
            }
            usuarioGuardado.password = ';-)'
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});

// ======================================
// crear un nuevo usuario
//=======================================


app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
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





});


// ======================================
// borrar un usuario
//=======================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario no existe',
                errors: { message: 'el usuario no existe' }
            });
        }
        usuarioBorrado.password = ':-)'
        res.status(200).json({
            ok: true,
            message: 'usuario eliminado',
            usuario: usuarioBorrado
        });
    });

});


module.exports = app;