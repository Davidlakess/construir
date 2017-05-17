
function getDatos(urlpart, container) {
    console.log("get datos from: " + urlbase + urlpart);
    $.ajax({url: urlbase + urlpart,
        success: function (data) {
            $(container).hide().html(data).fadeIn('slow');
            if ($(".datepicker").length > 0) {
                $(".datepicker").datepicker({'dateFormat': 'yy-mm-dd'});
            }
            ;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //$(container).html(XMLHttpRequest.responseText);
            console.log(XMLHttpRequest.responseText);
        }
    });
}

function getDatosBase(urlpart, container) {
    $.ajax({url: urlpart, success: function (data) {
            $(container).hide().html(data).fadeIn('slow');
        }});
}

function sendDatos(urlpart, datacont, container) {
    $.ajax({
        type: "POST",
        url: urlbase + urlpart,
        data: $(datacont).serialize(),
        success: function (data) {
            $(container).html(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $(container).html(XMLHttpRequest.responseText);
        }
    });
}

function sendDatosBase(urlpart, datacont, container) {
    $.ajax({
        type: "POST",
        url: urlpart,
        data: $(datacont).serialize(),
        success: function (data) {
            console.log(data);
            $(container).html(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $(container).html(XMLHttpRequest.responseText);
        }
    });
}

//Envía dato vía post, los recupera y los descarga en un contenedor
function send_datos_array(urlpart, datacont, container){
    $.ajax({
        //Indicamos el tipo de envío
        type: "POST",
        //Indicamos la url que va a utilizar
        url: urlbase + urlpart,
        data: datacont,
        success: function(data){$(container).hide().html(data).slideDown();},
        
        error: function(XMLHttpRequest, textStatus, errorThrown){
            $(container).html(XMLHttpRequest.responseText);
        }
    });
}

$(function () {
    setTimeout(function () {
        $('.label').fadeOut()
    }, 2500);
});

var notification;
function render_notification(response, time) {
    if (typeof (notification) !== 'undefined')
        notification.dismiss();
    notification = new NotificationFx({
        // element to which the notification will be appended
        // defaults to the document.body
        wrapper: document.body,
        // the message
        message: response.text,
        // layout type: growl|attached|bar|other
        layout: 'attached',
        // effects for the specified layout:
        // for growl layout: scale|slide|genie|jelly
        // for attached layout: flip|bouncyflip
        // for other layout: boxspinner|cornerexpand|loadingcircle|thumbslider
        // ...
        effect: 'bouncyflip',
        // notice, warning, error, success
        // will add class ns-type-warning, ns-type-error or ns-type-success
        type: response.type,
        // if the user doesn´t close the notification then we remove it 
        // after the following time
        ttl: time,
        // callbacks
        onClose: function () {
            return false;
        },
        onOpen: function () {
            return false;
        }
    });
    notification.show();
}

/**
 * [send_post_get_json envia una peticion via post  y de ella recibe un json]
 * @param  {[string]} urlpart   [cadena con el nombre del controlador y de la funcion  hacia donde
 * va la peticion]
 * @param  {[mixed(array/html form)]} datos     [elemento que contiene los valores  que se vana enviar 
 * via post, puede ser un array o puede ser un elemento de formulario]
 * @param  {[string]} call_fn   [nombre de la funcion a ejecutar con la respuesta del servidor]
 * @return {[type]}           [description]
 */
function send_post_get_json(urlpart, datos, call_fn) {
    $.ajax({
        url: urlbase + urlpart,
        type: "POST",
        dataType: 'json',
        data: datos
    })
            .done(function (response) {
                call_fn(response);
            })
            .fail(function (XMLHttpRequest, textStatus, errorThrown) {
                call_fn(XMLHttpRequest);
            });

}



/**
 * [send_datos_formdata envia una peticion via post
 * a la url que se le ponga como parametro]
 * @param  {[string]} urlpart   [puede ser parte de la url a donde se manda la peticion p puede ser la
 * url completa]
 * @param  {[string]} id_form   [id del formulario desde donde se van a obtener los datos]
 * @param  {[function]} call_fn   [nombre de la funcion que va a procesar la respuesta]
 * @param  {Boolean} use_base_url [indica si usar la url que se le envio como parametro por default es false]
 * @param  {String} data_type [por default json, puede ser otra]
 * @return {[type]}           [no regresa nada manda a llamar la funcion que se le mande como parametro]
 */
function send_datos_formdata(urlpart, id_form, call_fn, use_base_url, data_type) {
    use_base_url = typeof use_base_url !== 'undefined' ? use_base_url : false;
    data_type = typeof data_type !== 'undefined' ? data_type : 'json';
    $form = document.getElementById(id_form);
    data = new FormData($form);
    var url = '';
    if (use_base_url) {
        url = urlbase + urlpart;
    } else {
        url = urlpart;
    }
    ;
    $.ajax({
        url: url,
        type: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        data: data,
        dataType: data_type
    }).done(function (respuesta) {
        call_fn(respuesta);
    }).fail(function (respuesta) {
        call_fn(respuesta);
    });

}

 function loadElement() {
    if (arguments.length > 0) {
        var block = "";
        if (arguments.length === 1) {
            block = arguments[0];
        } else if (arguments.length === 2) {
            block = (arguments[0]).closest('.' + arguments[1]);
        }

        var mess = '<i class="fa fa-cog fa-spin fa-3x fa-fw" style="color: rgba(0,0,0,0.3);"></i><br /><span class="" style="z-index: 9999 !important;color: rgba(0,0,0,0.3);font-size: 15px;"><b>Cargando...</b></span>';

        if (arguments.length > 1) {
            mess = '';
        }

        $(block).block({
            message: mess,
            overlayCSS: {
                backgroundColor: '#fff',
                opacity: 0.8,
                cursor: 'wait'
            },
            css: {
                border: 0,
                padding: 0,
                backgroundColor: 'none'
            }
        });
        return block;
    }
    return false;
 }

  $.fn.extend({
    animateCss: function (animation) {
        try {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            if ($.type(animation) === "string") {
                this.addClass('animated ' + animation).one(animationEnd, function () {
                    $(this).removeClass('animated ' + animation);
                });
            } else if ($.type(animation) === "object") {
                animateData = {
                    animation: "" || animation.animation,
                    callback: animation.callback || function () {}
                };
                this.addClass('animated ' + animateData.animation).one(animationEnd, function () {
                    $(this).removeClass('animated ' + animateData.animation);
                    animateData.callback();
                });
            } else {
                throw new MyCustomError("Error por tipo de variable funcion animateCss", "El tipo de variable que se recivio es '" + $.type(animation) + "' los admitidos son object y string");
            }
        } catch (errorData) {
            console.error(errorData.name + "\n", errorData.message);
        }
    }
 });