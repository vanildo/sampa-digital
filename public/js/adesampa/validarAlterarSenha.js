function validaAlterarSenha(){
  //esconde mensagens de erro
  $('#erro_alterar_senha').html("");

  //get all fields content
  var form = $('#alterarSenha');
  var senhaAtual = form.find('input[name="senha"]').val();
  var novaSenha = form.find('input[name="nSenha"]').val();
  var novaSenhaConfirma = form.find('input[name="nSenhaConfirma"]').val();

  //mensagem de erro
  var err = new Array();
  err = [];
  var errCampoVazio = "*Por favor, todos campos são obrigatórios.";
  var errNovaSenhaDiferente = "*Campos Nova Senha e Confirmar Nova Senha devem ser iguais.";
  var errNovaSenhaIgualAtual = "*A Nova Senha deve ser diferente da Senha Atual";

  //valida formulario
  if(senhaAtual == "" || novaSenha == "" || novaSenhaConfirma == ""){
    err.push(errCampoVazio);
  }
  if(senhaAtual == novaSenha){
    err.push(errNovaSenhaIgualAtual);
  }
  if(novaSenha != novaSenhaConfirma){
    err.push(errNovaSenhaDiferente);
  }

  if(err.length > 0){
    for(i=0; i<err.length; i++){
       $('#erro_alterar_senha').append(err[i]);
       $('#erro_alterar_senha').append("<br>");
    }
  }else{
    form.submit();
  }
}
