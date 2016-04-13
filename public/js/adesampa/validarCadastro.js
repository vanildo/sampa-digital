function validarCadastro(){
   //esconde mensagens de erro
   $('#cadastro-instituicao-1-error').html("");

  //get all fields content
  var form = $('#cadastro-instituicao-1');
  var tipoInstituicao = form.find('select[name="empresaType"]').val();
  var cnpj = form.find("input[name='cnpj']").val();

  //mensagem de erro
  var err = new Array();
  err = [];
  var errMsgCNPJ = "*Por favor, use um CNPJ válido.";
  var errMsgTipoEmpresa = "*Por favor, seleciona um Tipo de Empresa.";

  //valida formulário
  if(tipoInstituicao == ""){
    err.push(errMsgTipoEmpresa);
  }
  if(!validarCNPJ(cnpj)){
    err.push(errMsgCNPJ);
  }

  if(err.length > 0){
    for(i=0; i<err.length; i++){
       $('#cadastro-instituicao-1-error').append(err[i]);
       $('#cadastro-instituicao-1-error').append("<br>");
    }
  }else{
    form.submit();
  }
}

function validaDadosCadastrais(){
  //esconde mensagens de erro
  $('#cadastro-instituicao-2-error').html("");

  //get all fields content
  var form = $('#frmConta');
  var razaoSocial = form.find('input[name="razaoSocial"]').val();
  var telefone = form.find("input[name='telefone']").val();
  var email = form.find("input[name='email']").val();
  var endNumero = form.find("input[name='endereco.number']").val();
  var cep = form.find("input[name='endereco.postcode']").val();
  cep = cep.replace(/[^0-9]|\s/g ,'');
  var cpf = form.find("input[name='cpf']").val();
  var termosDeUso = form.find("input[name='termos']").is(':checked');

  //mensagem de erro
  var err = new Array();
  err = [];
  var errRazaoSocial = "*Por favor, entre com uma Razão Social.";
  var errEmail = "*Por favor, coloque um Email válido.";
  var errCEP = "*Por favor, coloque um CEP válido.";
  var errEstado = "*Por favor, coloque um Estado válido.";
  var errCPF = "*Por favor, coloque um CPF válido.";
  var errTermosDeUso = "*Por favor, leia os Termos de Uso, e se aceitá-los, marque o campo.";

  //validação
  if(razaoSocial == ""){
    err.push(errRazaoSocial);
  }
  if(telefone != ""){
    telefone = telefone.replace(/[^0-9]|\s/g, "");
    //mudar o campo
  }
  if(email == "" || !validarEmail(email)){
    err.push(errEmail);
  }
  if(endNumero != ""){
    endNumero = endNumero.replace(/[^0-9]|\s/g, "");
  }
  if(cep != "" && !validarCEP(cep)){
    err.push(errCEP);
  }
  if(cpf != "" && !validarCPF(cpf)){
    err.push(errCPF);
  }
  if(!termosDeUso){
    err.push(errTermosDeUso);
  }

  if(err.length > 0){
    for(i=0; i<err.length; i++){
       $('#cadastro-instituicao-2-error').append(err[i]);
       $('#cadastro-instituicao-2-error').append("<br>");
    }
    //go to errors
    $('html, body').animate({
      scrollTop: $("#cadastro-instituicao-2-error").offset().top - $(".navbar.navbar-fixed-top").height()
    }, 300);
  }else{
    form.find("input[name='telefone']").val(telefone);
    form.find("input[name='endereco.number']").val(endNumero);
    form.find("input[name='endereco.postcode']").val(cep);
    form.submit();
  }
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,'');
    if(cpf == '') return false;
    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
            return false;
    // Valida 1o digito
    add = 0;
    for (i=0; i < 9; i ++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(9)))
            return false;
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i ++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

function validarCEP(strCEP){
  var objER = /^[0-9]{2}[0-9]{3}[0-9]{3}$/;

  //remove espaço em branco
  strCEP = strCEP.replace(/^s+|s+$/g, '');

  //valida
  if(objER.test(strCEP))
      return true;
  else
      return false;
}

function validarEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function validarCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g,'');

    if(cnpj == '') return false;

    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;

    return true;
}
