var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Usuario Model
 * ==========
 */

var Usuario = new keystone.List('Usuario');

Usuario.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true }
}, 'Permissions', { 
	isAdmin: { type: Types.Boolean, default:false, hidden:true, noedit:true,  index: true },
	empresa: {type: Boolean, label:'Manutenção de Empresa', index:true}
});

// Provide access to Keystone
Usuario.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

Usuario.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */

Usuario.defaultColumns = 'name, email, empresa';
Usuario.register();