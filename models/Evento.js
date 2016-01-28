var keystone = require('keystone');
var Types = keystone.Field.Types;

var Evento = new keystone.List('Evento', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 'Noticias',
});

Evento.add({
	name: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	publishedDate: { type: Types.Date, index: true },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
});

Evento.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});


Evento.track = true;
Evento.defaultColumns = 'name, state|20%';
Evento.register();
