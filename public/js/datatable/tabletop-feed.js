var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function(){

    initializeTabletopObject("https://docs.google.com/spreadsheets/d/1aGr6LpiqmMNOyeJSjTWF7gGaOKLZzDAqGH1bC5uUDRg/pubhtml");

});

// pull data from google spreadsheet
function initializeTabletopObject(dataSpreadsheet){
    Tabletop.init({
        key: dataSpreadsheet,
        callback: writeTableWith,
        simpleSheet: true,
        debug: false
    });
}

// create table headers
function createTableColumns(){

    /* swap out the properties of mDataProp & sTitle to reflect
    the names of columns or keys you want to display.
    Remember, tabletop.js strips out spaces from column titles, which
    is what happens with the More Info column header */

    var tableColumns =   [		
		{"mDataProp": "processo", "sTitle": "Processo", "sClass": "left"},
		{"mDataProp": "datadeabertura", "sTitle": "Data de Abertura", "sClass": "left"},
		{"mDataProp": "área", "sTitle": "Área", "sClass": "left"},
		{"mDataProp": "órgão", "sTitle": "Órgão", "sClass": "left"},
		{"mDataProp": "objeto", "sTitle": "Objeto", "sClass": "left"}
	];
    return tableColumns;
}

// create the table container and object
function writeTableWith(dataSource){

    jqueryNoConflict("#demo").html("<table cellpadding='0' cellspacing='0' border='0' class='display table table-bordered table-striped' id='data-table-container'></table>");

    var oTable = jqueryNoConflict("#data-table-container").dataTable({
        "sPaginationType": "bootstrap",
        "iDisplayLength": 10,
        "aaData": dataSource,
        "aoColumns": createTableColumns(),
        "fnRowCallback": function(nRow, aData, iDisplayIndex) {
            //console.log(aData);
            $("td:eq(0)", nRow).html("<a href='http://" + aData.link + "'>"+$("td:eq(0)", nRow).html()+"</a>");
            return nRow;
        },
        "oLanguage": {
            "sLengthMenu": "_MENU_ itens por página",
            "sZeroRecords": "Nenhum item encontrado",
            "sInfo": "Mostrando de _START_ a _END_ do total de _TOTAL_ entradas",
            "sInfoEmpty": "Nenhum item disponível",
            "sInfoFiltered": "(filtrado dos _MAX_ itens totais)",
			"sSearch": "Busca: "
        }
    });

};

//define two custom functions (asc and desc) for string sorting
jQuery.fn.dataTableExt.oSort["string-case-asc"]  = function(x,y) {
	return ((x < y) ? -1 : ((x > y) ?  0 : 0));
};

jQuery.fn.dataTableExt.oSort["string-case-desc"] = function(x,y) {
	return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};