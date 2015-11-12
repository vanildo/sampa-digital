var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Empresa Model
 * ==========
 */

var Empresa = new keystone.List('Empresa', {
    autokey: {path: 'slug', from: 'codigo', unique: true},
    map: {name: 'codigo'}

});

Empresa.add({
    codigo: {type: Number, index: true, unique: true, autokey: true},
    nomeFantasia: {type: String},
    razaoSocial: {type: String, index: true},
    descricao: {type: String},
    contato: {type: String},
    contatoComercial: {type: String},
    telefone: {type: String},
    endereco: {type: Types.Location},
    cnpj: {type: String, index: true},
    logo: {type: Types.CloudinaryImage},
    twitter: {type: String},
    facebook: {type: String},
    linkedin: {type: String}
}, 'Permissions', {
    isAdmin: {type: Boolean, label: 'Can access Keystone', index: true}
});

// Provide access to Keystone
Empresa.schema.virtual('canAccessKeystone').get(function () {
    return this.isAdmin;
});


/**
 * Relationships
 */


/**
 * Registration
 */

Empresa.defaultColumns = 'nomeFantasia, razaoSocial';
Empresa.register();
