var express = require('express')
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');


var Hospital = require('../models/hospital');



// ======================================
// obtener todos los hospitales
// ======================================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', ['nombre', 'email'])
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error get de hospitales',
                        errors: err
                    })
                }
                Hospital.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo

                    })
                })
            })



});


// ======================================
// actualizar un hospital
//===================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El hospitals con el id ' + id + ' no existe',
                errors: { messsage: 'No existe el hospital con ese id' }

            });
        }
        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario._id

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    errors: err
                })
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});

// ======================================
// crear un nuevo hospital
//=======================================


app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });
    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            })
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuariotoken: req.usuario
        });

    });





});


// ======================================
// borrar un hospital
//=======================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el hospital no existe',
                errors: { message: 'el hospital no existe' }
            });
        }
        res.status(200).json({
            ok: true,
            message: 'hospital eliminado',
            hospital: hospitalBorrado
        });
    });

});


module.exports = app;