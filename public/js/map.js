<script>
function initMap() {
  //create map
  var marcoZero = {lat: -23.548, lng: -46.633};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: marcoZero
  });
  //get all companies
  var allCompanies = $('.empresaListada');
  //add all in the map
  allCompanies.each(function(){
    //get info
    var currentLocation = $(this).attr('value');
    currentLocation = currentLocation.split(',');
    var location = {lat: parseFloat(currentLocation[1]), lng: parseFloat(currentLocation[0])};

    var currentName = $(this).attr('data-name');

    var currentDescription = $(this).attr('data-description');

    var currentTelefone = $(this).attr('data-telefone');
    var stringTelefone = '<b>Telefone: </b>'+currentTelefone+' ';

    var currentWebSite = $(this).attr('data-website');
    var stringWebsite = '<a href="'+currentWebSite+'">Website</a> |';

    var currentFace = $(this).attr('data-face');
    var stringFace = '<a href="'+currentFace+'">Facebook</a> |';

    var currentTwitter = $(this).attr('data-twitter');
    var stringTwitter = '<a href="'+currentTwitter+'">Twitter</a>';

    //create popup
    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h3>'+currentName+'</h3>'+
      '<div id="bodyContent">'+
      '<p>'+((currentDescription != "") ? currentDescription : "")+'</p>'+
      '<p>'+((currentTelefone != "") ? stringTelefone : "")+'</p>'+
      '<p>'+((currentWebSite != "") ? stringWebsite : "")+' '+((currentFace != "") ? stringFace : "")+' '+((currentTwitter != "") ? stringTwitter : "")+'</p>'+
      '</div>'+
      '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    // Create a marker and set its position.
    var marker = new google.maps.Marker({
      map: map,
      position: location,
      title: currentName+'\n'+currentDescription
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  });
}
function filterMap(filter, element) {
  $("#no-company").attr('style','').hide();
  filter = filter.substr(filter.indexOf("#") + 1)
  //change active link
  $(".filters .selected").removeClass('selected');
  $(element).addClass('selected');
  //filter
  if(filter == "VerTudo"){
    $('input.empresaNaoListada').addClass("empresaListada");
    $('input.empresaNaoListada').removeClass("empresaNaoListada");
  }else{
    $(':not(input.empresaListada[data-tipo="'+filter+'"])').addClass("empresaNaoListada").removeClass('empresaListada');
    $('input.empresaNaoListada[data-tipo="'+filter+'"]').addClass("empresaListada").removeClass('empresaNaoListada');
  }
  //remove current map
  $('#map').html("");
  //reload map
  initMap();
  //check if there isn't company to show
  if($(".empresaListada").length <= 0){
    $("#no-company").attr('style','').show();
  }
}
</script>
