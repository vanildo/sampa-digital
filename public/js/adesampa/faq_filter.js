$( "#filtros a" ).click(function() {
  var filter = this.href;
  filter = filter.substr(filter.indexOf("#") + 1);

  var selector = "";

  if(filter == ''){
    selector = "#faq .panel";
  }else{
    selector = "#faq .panel[data-category='"+filter+"']";
  }

  $( "#faq .panel" ).fadeOut( "fast", function() {
    $( selector ).fadeIn( "fast", function() {
      // Animation complete.
    });
  });
  //alert( filter );

  return false;
});
