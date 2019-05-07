var express = require('express')
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');


var Medico = require('../models/medico');



// ======================================
// obtener todos los medicos
// ======================================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre img usuario hospital')
        .skip(desde)
        .limit(5)
        .populate('hospital')
        .populate('usuario', ['nombre', 'email'])
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error get de medicos',
                        errors: err
                    })
                }
                Medico.count({}, (err, contador) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: contador
                    })
                })
            })



});


// ======================================
// actualizar un medico
//===================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El medicos con el id ' + id + ' no existe',
                errors: { messsage: 'No existe el medico con ese id' }

            });
        }
        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.hospital = body.hospital;
        medico.usuario = req.usuario._id;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el medico',
                    errors: err
                })
            }
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});

// ======================================
// crear un nuevo medico
//=======================================


app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });
    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            })
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuariotoken: req.usuario
        });

    });





});


// ======================================
// borrar un medico
//=======================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndDelete(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el medico no existe',
                errors: { message: 'el medico no existe' }
            });
        }
        res.status(200).json({
            ok: true,
            message: 'medico eliminado',
            medico: medicoBorrado
        });
    });

});


module.exports = app;