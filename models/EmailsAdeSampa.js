var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * EmailsAdeSampa Model
 * ==========
 */

var EmailsAdeSampa = new keystone.List('EmailsAdeSampa', {
    map: {name: 'email'},
});

EmailsAdeSampa.add({
    email: { type: Types.Email, initial: true, required: true, index: true },
});

EmailsAdeSampa.defaultColumns = 'email';
EmailsAdeSampa.register();