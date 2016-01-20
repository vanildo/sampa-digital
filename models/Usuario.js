var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Usuario Model
 * ==========
 */

var Usuario = new keystone.List('Usuario', {    
    nocreate: true,
});

Usuario.add({
    controlData: {type: String, hidden: true, noedit: true},
    email: {type: Types.Email, initial: true, required: true, index: true, unique: true},
    password: {type: Types.Password, initial: true, required: true},
    isAdmin: {type: Types.Boolean, default: true, index: true},
    sampaAdmin: {type: Boolean, default: false, index: true},
    responsavel: {type: Types.Boolean, default: false},
    name: {type: Types.Name, index: true},
});

// Provide access to Keystone
Usuario.schema.virtual('canAccessKeystone').get(function () {
    return this.isAdmin;
});


/**
 * Relationships
 */

Usuario.relationship({ref: 'Post', path: 'posts', refPath: 'author'});

/**
 * Registration
 */

Usuario.defaultColumns = 'email';
Usuario.register();