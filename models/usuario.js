var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var usuarioSchema = new Schema({


    "nombre": { type: String, required: [true, 'el nombre es necesario'] },
    "email": { type: String, unique: true, required: [true, 'el mail es necesario'] },
    "password": { type: String, required: [true, 'el password es necesario'] },
    "img": { type: String, required: false },
    "role": { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    "google": { type: Boolean, default: false }

});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = mongoose.model('usuario', usuarioSchema);