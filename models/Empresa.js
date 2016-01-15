var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Empresa Model
 * =============
 */

var Empresa = new keystone.List('Empresa', {
    map: {name: 'razaoSocial'},
    nocreate: true,
});

Empresa.add({
    controlData: {type: String, hidden: true, noedit: true},
    nomeFantasia: {type: String, required: true, index: true, label: "Razão Social"},
    razaoSocial: {type: String, unique: true, required: true, initial: true, index: true},
    descricao: {type: String, index: true},
    responsavelLegal: {type: Types.Relationship, ref: 'Pessoa', label: "Responsável Legal"},
    contato: {type: String},
    contatoComercial: {type: String},
    telefone: {type: String, label: "Telefone de contato"},
    cep: {type: String, required: true, initial: true},
    bairro: {type: String, required: true, initial: true},
    cidade: {type: String, required: true, initial: true},
    estado: {type: String, required: true, initial: true},
    endereco: {type: String, required: true, initial: true},
    enderecoNumero: {type: String, required: true, initial: true},
    latitude: {type: String},
    longitude: {type: String},
    cnpj: {type: String, unique: true, required: true, initial: true, label: "CNPJ"},
    cnae: {type: Types.Relationship, ref: 'CNAE'},
    logo: {type: Types.Url},
    twitter: {type: String},
    facebook: {type: String},
    linkedin: {type: String},
    webSite: {type: String},
    oportunidades: {type: Types.Relationship, ref: 'Oportunidade', many: true},
    usuario: {type: Types.Relationship, ref: 'Usuario'},
    empresaType: {type: Types.Select, options: [
            {value: 'instituicao', label: "Instituição"},
            {value: 'startup', label: "Start-up"},
            {value: 'workplace', label: "Workplace"},
            {value: 'incubadora', label: "Incubadora"},
            {value: 'universidade', label: "Universidade"},
        ], required: true}
}
, 'Situação da Empresa no Sistema', {
    empresaSituacaoSistema: {type: Types.Select, options: [
            {value: 'aprovado', label: "Aprovado"},
            {value: 'rejeitado', label: "Rejeitado"},
            {value: 'pendente', label: "Aguardando aprovação"},
        ], required: true, label: 'Status'},
});

/**
 * Relationships
 */

Empresa.relationship({ref: 'Oportunidade', path: 'oportunidades', refPath: 'oportunidade'});
Empresa.relationship({ref: 'CNAE', path: 'codigos', refPath: 'codigo'});
Empresa.relationship({ref: 'Pessoa', path: 'nomes', refPath: 'nome'});
Empresa.relationship({ref: 'Usuario', path: 'usuarios', refPath: 'usuario'});



/**
 * Registration
 */

Empresa.defaultColumns = 'razaoSocial, cnpj, empresaSituacaoSistema';
Empresa.defaultSort = '-createdAt';
Empresa.register();
