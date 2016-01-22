var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * EmailConfig Model
 * ==========
 */

var EmailConfig = new keystone.List('EmailConfig', {
    map: {name: 'name'},
});

EmailConfig.add({
    name: {type: String, required: true, initial: true, index: true},
    user: {type: String, required: true, initial: true},
    senha: {type: String, required: true, initial: true, hidden: true, password: true},
    from: {type: String, required: true, initial: true},
    subjectCadastro: {type: String, required: true, initial: true, label: "Título do email de cadastro"},
    subjectAprovacao: {type: String, required: true, initial: true, label: "Título do email de aprovação"},
    subjectRejeicao: {type: String, required: true, initial: true, label: "Título do email de rejeição"},
    saudacao: {type: String, required: true, initial: true},
    corpoCadastro: {type: Types.Textarea, required: true, initial: true, label: "Corpo do email de cadastro"},
    corpoAprovacao: {type: Types.Textarea, required: true, initial: true, label: "Corpo do email de aprovação"},
    corpoRejeicao: {type: Types.Textarea, required: true, initial: true, label: "Corpo do email de rejeição"},
    isAtivo: {type: Types.Boolean},
    dataCriacao: {type: Types.Date, default: Date.now}
});

EmailConfig.defaultColumns = 'name, dataCriacao';
EmailConfig.defaultSort = 'dataCriacao';
EmailConfig.register();