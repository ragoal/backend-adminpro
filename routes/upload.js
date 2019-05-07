var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();


var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;


    //tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo no valida',
            errors: { message: 'Los tipos válidos son: ' + tiposValidos.join(', ') }
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha subido un fichero.',
            errors: { message: 'Debe seleccionar un fichero' }
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //extensiones validas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no valida',
            errors: { message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ') }
        });
    }

    //nombre de imagen personalizadas

    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extensionArchivo }`;

    //mover el archivo a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR al mover el archivo.',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // });
    })



    // Use the mv() method to place the file somewhere on your server
    // archivo.mv('/somewhere/on/your/server/filename.jpg', function(err) {
    //     if (err)
    //         return res.status(500).send(err);

    //     res.status(200).json({
    //         ok: true,
    //         mensaje: 'Fichero subido correctamente'
    //     })
    // });



});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'usuario no existe',
                    errors: { message: ' el usuario no existe' }
                })
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;
            console.log(pathViejo)
                //si existe elimina imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo, (err) => {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error borrando foto antigua',
                        error: err
                    })
                });
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ';-)'
                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            })

        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'medico no existe',
                    errors: { message: ' el medico no existe' }
                })
            }
            var pathViejo = './uploads/medicos/' + medico.img;
            console.log(pathViejo)
                //si existe elimina imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo, (err) => {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error borrando foto antigua',
                        error: err
                    })
                });
            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de medico actualizada',
                    medico: medicoActualizado
                });

            })

        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'hospital no existe',
                    errors: { message: ' el hospital no existe' }
                })
            }
            var pathViejo = './uploads/hospitales/' + hospital.img;
            console.log(pathViejo)
                //si existe elimini imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo, (err) => {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error borrando foto antigua',
                        error: err
                    })
                });
            }
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de hospital actualizada',
                    hospital: usuarioActualizado
                });

            })

        });
    }

}

module.exports = app;