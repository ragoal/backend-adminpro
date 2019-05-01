var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ======================================
// verificar token
//=======================================


exports.verificaToken = function(req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token no valido',
                errors: err
            })
        }
        // return res.status(200).json({
        //         ok: true,
        //         decoded: decoded
        //     })

        req.usuario = decoded.usuario
        next();
    });
};