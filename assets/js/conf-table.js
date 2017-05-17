function getThead(theads) {
    $html = "<tr>";
    for (var i in theads) {
        $html += "<th>" + theads[i] + "</th>";
    }
    $html += "<th>Action</th>";
    $html += "</tr>";
    return $html;
}


//función general para generar nuevos tipos de botones en el sistema
function getTBody(tbody, local, buttons) {
    $html = "<tr>";
    for (var i in tbody) {
        $html += "<td>" + tbody[i] + "</td>";
    }
    $html += '<td>';

    //Botón para agregar nuevo
    if(buttons[0]==1){
		  $html += '<a data-toggle="modal" data-tooltip="tooltip" title="Nuevo" class="btn btn-primary btn-modal new"  href="' + base_url + 'index.php/' + $.cookie('location-name')+'_control/'+local+'_new/'+ tbody['ID'] + '" data-target="#myModal5" ><i class="fa fa-plus"></i></a> ';
    }
    //Botón para editar
    if(buttons[1]==1){
      $html += '<a data-toggle="modal" data-tooltip="tooltip" title="Editar" class="btn btn-primary btn-modal edit"  href="' + base_url + 'index.php/' + $.cookie('location-name')+'_control/'+local+'_modify/'+ tbody['ID'] + '" data-target="#myModal5" ><i class="fa fa-pencil"></i></a> ';
    }
    //Botón para eliminar
    if(buttons[2]==1){
      $html += '<a data-toggle="modal" data-tooltip="tooltip" title="Eliminar"  class="btn btn-danger btn-modal delete" href="' + base_url + 'index.php/' + $.cookie('location-name')+'_control/'+local+'_delete/'+ tbody['ID'] + '" data-target="#myModal5" ><i class="fa fa-times"></i></a>';  
    }
    //Botón para seguimiento
    if(buttons[3]==1){
      $html += '<a data-toggle="modal" data-tooltip="tooltip" title="Dar Seguimiento"  class="btn btn-info btn-modal follow" href="' + base_url + 'index.php/' + $.cookie("location-name")+'_control/'+local+'_follow/'+ tbody['ID'] + '" data-target="#myModal5" ><i class="fa fa-steam"></i></a>';  
    }
    //Botón para descartar
    if(buttons[4]==1){
      $html += '<a data-toggle="modal" data-tooltip="tooltip" title="Descartar o Archivar"  class="btn btn-default btn-modal follow" href="' + base_url + 'index.php/' + $.cookie("location-name")+'_control/'+local+'_discard/'+ tbody['ID'] + '" data-target="#myModal5" ><i class="fa fa-trash"></i></a>'; 
    }
    //Botón para activar
    if(buttons[5]==1){
      $html += '<a data-toggle="modal" data-tooltip="tooltip" title="Activar"  class="btn btn-info btn-modal reactive" href="' + base_url + 'index.php/' + $.cookie('location-name')+'_control/'+local+'_reactive/'+ tbody['ID'] + '" data-target="#myModal5" ><i class="fa fa-circle-o-notch"></i>Activar</a>'; 
    }
    //Botón para Mostrar detalles
    if(buttons[6]==1){
      $html += '<a data-toggle="modal" data-tooltip="tooltip" title="Mostrar Detalles"  class="btn btn-info btn-modal details" href="' + base_url + 'index.php/' + $.cookie('location-name')+'_control/'+local+'_detalles/'+ tbody['ID'] + '" data-target="#myModal5" ><i class="fa fa-file-text"></i></a>'; 
    }
    //Botón para Autorizar un descuento especial
    if(buttons[7]==1){
      $html += '<a data-toggle="modal" data-tooltip="tooltip" title="Autorizar descuento"  class="btn btn-primary btn-modal details" href="' + base_url + 'index.php/' + $.cookie('location-name')+'_control/'+local+'_autorizar/'+ tbody['ID'] + '" data-target="#myModal5" ><i class="fa fa-thumbs-up"></i></a>';
    }
    //Botón para Descartar un descuento especial
    if(buttons[8]==1){
      $html += '<a data-toggle="modal" data-tooltip="tooltip" title="Descartar descuento"  class="btn btn-danger btn-modal details" href="' + base_url + 'index.php/' + $.cookie('location-name')+'_control/'+local+'_descartar/'+ tbody['ID'] + '" data-target="#myModal5" ><i class="fa fa-thumbs-down"></i></a>';
    }
    $html += "</td></tr>";
    return $html;
}

function fillTable(base_url, tblname, param, table, buttons) {
    $.ajax({
        url: base_url,
        type: 'POST',
        async: true,
        data: {param: param, table: table},
        success: function (response) {
            $data = jQuery.parseJSON(response);
            $('#' + tblname + ' thead').html(getThead($data.sColumns));
            $html = "";
            for (var x in $data.aaData) {
                $html += getTBody($data.aaData[x],table,buttons);
            }
            $('#' + tblname + ' tbody').html($html);
            console.log($data);
            $('#' + tblname).dataTable();
        }
    });
}
