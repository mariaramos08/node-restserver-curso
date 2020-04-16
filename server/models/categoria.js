const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


let categoriaSchema = mongoose.Schema({
    descripcion: {
        type: String,
        require: [true, 'La descripción es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: [true, 'El usuario es necesario']
    }
});

categoriaSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    return userObject;
}

categoriaSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });


module.exports = mongoose.model('Categoria', categoriaSchema)