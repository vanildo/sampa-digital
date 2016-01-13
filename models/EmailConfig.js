var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * EmailConfig Model
 * ==========
 */

var EmailConfig = new keystone.List('EmailConfig', {
    nocreate: true,
});

EmailConfig.add({
    name: {type: String, required: true, initial: true, index: true},
    user: {type: String, required: true, initial: true},
    from: {type: String, required: true, initial: true},
    subject: {type: String, required: true, initial: true},
    texto1: {type: String, required: true, initial: true, index: true},
    texto2: {type: String, required: true, initial: true, index: true},
    texto3: {type: String},
    texto4: {type: String},
    texto5: {type: String},
    texto6: {type: String},
    texto7: {type: String},
    texto8: {type: String},
    texto9: {type: String},
    texto0: {type: String},
    html: {type: String},
    isAtivo: {type: Types.Boolean}
});

EmailConfig.defaultColumns = 'name';
EmailConfig.register();