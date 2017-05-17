/*********************************************************************
** App.js                                                           **
** Creador: Luis Daniel Gonzalez Orozco <Daniel@canteradigital.mx>  **
** Fecha: 14/07/15                                                  **
** Finalidad: Colleccion de funciones utiles,                       **
** capaces de cambiar el futuro de la web.....                      **
*********************************************************************/

// Variables
  var tester, status, success, error;
  var
    device, section,
    modalVisible = false,
    keepOpenModal = false;

//Classes
  function Device( options ) {
    extend( this._defaultOptions, options );
    extend( this, this._defaultOptions );
    this._init();
  }
  Device.prototype._defaultOptions = {
    type: $( 'body' ).attr( 'data-device' ) ? $( 'body' ).attr( 'data-device' ) : "desktop",
    width: window.innerWidth,
    height: window.innerHeight
  };
  Device.prototype._init = function() {
    this._bindClientEvents();
    this.update();
  }
  Device.prototype._bindClientEvents = function() {
    window.addEventListener( 'resize', onResize );
  }
  Device.prototype.update = function() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

// Event Handlers
  function onResize() {
    device.update();
    console.log( device.width +" x " +device.height );
  }

// HELPERS
  /* info
    @params[ object, object ]
    @return object
    Extiende las propiedades del object b sobre el object a,
    sin sobreescribir las ya existentes */
  function extend( a, b ) {
    for ( var key in b ) {
      if ( b.hasOwnProperty( key ) ) {
        a[key] = b[key];
      }
    }
    return a;
  }

  function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  }

  function buildNode( html ) {
    var root = document.createElement( 'div' );
    root.innerHTML = html;
    return root.childNodes[0];
  }

  function noAction( event ) {
    event.preventDefault();
    event.stopPropagation();
  }

  String.prototype.isEmpty = function() {
    return this.trim().length === 0;
  }

  // returns the closest element to 'e' that has class "classname"
  function closest( e, classname ) {
    if( classie.has( e, classname ) ) {
      return e;
    }
    return e.parentNode && closest( e.parentNode, classname );
  }

  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  /* info
    permite realizar interpolacion de variables similar a la de php,
    ejemplo "la {a} hace {b}".supplant({a: 'cow', b: 'muuuuu'}) */
  String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
      function (a, b) {
        var r = o[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
  }

  Array.prototype.remove = function( idx ) {
    return this.splice( idx, 1 );
  }

  /* info
    @params[ JqueryNode ]
    @return object
    Regresa un Objeto js con los nombres y valores de los data- attributes
    del nodo dado.  */
  function getDataAttributes( node ) {
    var d = {},
    re_dataAttr = /^data\-(.+)$/;

    $.each(node.get(0).attributes, function(index, attr) {
      if (re_dataAttr.test(attr.nodeName)) {
        var key = attr.nodeName.match(re_dataAttr)[1];
        d[key] = attr.nodeValue;
      }
    });

    return d;
  }

  /* info
    @params[ JqueryNode ]
    @return FormData
    Regresa un Objeto FormData con los nombres y valores de los data-formdata-* attributes
    del nodo dado.  */
  function getFormData( node ) {
    var t = {},
    data = new FormData(),
    re_dataAttr = /^data\-formdata\-(.+)$/;

    $.each(node.get(0).attributes, function(index, attr) {
      if (re_dataAttr.test(attr.nodeName)) {
        var key = attr.nodeName.match(re_dataAttr)[1];
        t[key.replace( '-', '_' )] = attr.nodeValue;
        data.append( key.replace( '-', '_' ), attr.nodeValue );
      }
    });

    return data;
  }

  /* info
    @Params[ String, formData, boolean ]
    @Resolve[ JSON object ]
    Realiza una peticion hacia la direccion url proporcionada
    y devuelve la respuesta en un objeto promise, si el parametro data esta definido
    envia esa información al servidor, si fullPath es verdadero significa que la direccion
    proporcionada es absoluta. */
  function sendRequest( path, data, fullPath ) {
    return new Promise( function ( resolve ) {
      $( "body" ).addClass( "loading" );

      data = typeof data === 'undefined' ? false : data;
      fullPath = typeof fullPath === 'undefined' ? false : fullPath;
      path = fullPath ? path : siteURL+path;

      var request = new XMLHttpRequest();
      request.overrideMimeType( 'application/json' );

      request.onload = function() {
        $( "body" ).removeClass( "loading" );        
        if( request.status >= 200 && request.status < 400 ) {
          var response = JSON.parse( request.responseText );
          if( response.hasOwnProperty('fail') ) {
            console.log( "FALLO LA PETICION check tester" ); tester = response;
          } else {
            resolve( response );
          }
        }
      }

      if( data ) {
        request.open( 'POST', path );
        request.send( data );
      } else {
        request.open( 'GET', path );
        request.send();
      }
    });
  }

  $.fn.extend({
    animateCss: function (animationName, callback) {
      var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);
        if( typeof callback === "function" ) {
          callback();
        }
      });
    }
  });

  function redirect( url, fullPath ) {
    fullPath = typeof fullPath === 'undefined' ? false : fullPath;
    url = fullPath ? url : siteURL+url;

    var anchor = document.createElement( 'a' );
    anchor.className = "hidden";
    anchor.href = url;
    $( 'body' ).append( anchor );
    anchor.click();
  }

  /**
   * [not_copy muestra alerta avizando que no
   * se puede copiar, pegar o cortar]
   * @param  {miexed (object jquery or string)} $item [puede ser un selector valido de jquery o on objeto creado
   * por el pluging]
   * @return {nada}       [solo muestra una alerta]
   * obtenido de http://www.vicabreu.com/tecnologia/seguridad/evitar-cortar-copias-y-pegar-usanto-jquery/
   * @author Manuel MT<manuel@canteradigital.mx>
   */
  function not_copy( $item ) {
    if (jQuery.type($item) === 'string') {
      $object = $($item);
    } else {
      $object = $item;
    }
    $($object).unbind('cut copy paste drag');
    $($object).bind('cut copy paste drag', function (event) {
      event.preventDefault();
      $(this).attr({
        "onselectstart" : "return false;",
        "ondragstart" : "return false;",
        "ondragend" : "return false;"
      });
      toastr.error( "Se han deshabilitado las funciones de copiar, cortar y pegar" );
    });
  }

  // MODALS
    function renderModal( action, options ) {
      options = typeof options === 'undefined' ? false : options;
      var caller = document.getElementById( 'ModalCaller' );
      caller.setAttribute( "data-toggle", "modal" );
      caller.setAttribute( "data-target", "#CustomModal" );
      caller.setAttribute( "data-action", action );
      if( options ) {
        [].forEach.call( Object.keys( options ), function( attr ) {
          caller.setAttribute( attr, options[attr] );
        });
      }

      caller.click();
    }

    /* info
     Esta funcion es para limpiar la informacion y estilos
     que se le hallan agregado al modal con el fin de dejarlo limpio
     para su posterior uso. */
    function cleanModal() {
      // clean the modal caller
      var caller = document.querySelector( '#ModalCaller' );
      var attributes = getDataAttributes( $(caller) );
      [].forEach.call( Object.keys( attributes ), function( attr ) {
        caller.removeAttribute( 'data-'+attr );
      });

      //borrar la info
      $( '#CustomModal' ).find( '.modal-title' ).empty();
      $( '#CustomModal' ).find( '.modal-body' ).empty();
      $( '#CustomModal' ).find( '.modal-footer' ).empty();

      //borrar la action
      $( '#CustomModal' ).attr( 'data-action', "" );

      //limpiar inline styles
      document.querySelector( '#CustomModal .modal-dialog' ).style.minWidth = "";

      //limpiar las clases
      document.querySelector( '#CustomModal .modal-dialog' ).className = "modal-dialog";
      document.querySelector( '#CustomModal .modal-header' ).className = "modal-header";
      document.querySelector( '#CustomModal .modal-title' ).className = "modal-title";
      document.querySelector( '#CustomModal .modal-body' ).className = "modal-body";
      document.querySelector( '#CustomModal .modal-footer' ).className = "modal-footer";
    }

    /* Info
      This event fires immediately when the show instance method is called.
      If caused by a click, the clicked element is available as
      the relatedTarget property of the event.*/
    $('#CustomModal').on('show.bs.modal', function(event) {
      $( '#CustomModal' ).addClass( 'active' );
      initIcheckElements()
      initBootstrapTooltips();
      initAutosizeOnTextareas();

      var modal = this;
      var source = $(event.relatedTarget); // Button that triggered the modal

      switch( source.attr( 'data-action' ) ) {
      }
    });

    /* info
      This event is fired when the modal has been made visible to the user
      (will wait for CSS transitions to complete). If caused by a click,
      the clicked element is available as the relatedTarget
      property of the event. */
    $('#CustomModal').on('shown.bs.modal', function(event) {
      modalVisible = true;
      $( '#CustomModal' ).find( "[data-focus='true']" ).focus();

    });

    /* info
      This event is fired immediately when the hide
      instance method has been called. */
    $('#CustomModal').on('hide.bs.modal', function(event) {
      if( keepOpenModal ) {
        event.preventDefault();
      }
    });

    /* info
      This event is fired when the modal has finished being hidden
      from the user (will wait for CSS transitions to complete). */
    $('#CustomModal').on('hidden.bs.modal', function(event) {
      cleanModal();

      $( '#CustomModal' ).removeClass( 'active' );
      modalVisible = false;
    });

  // FORMS
    /* info
      @params[  ]
      */
    function buildFormControl( config ) {
      config = typeof config === 'undefined' ? {} : config;
      extend( formControlDefaultConfig, config );
      extend( config, formControlDefaultConfig );

      var formGroup = document.createElement( 'div' );
      formGroup.className = "form-group";
      formGroup.classList.add( config.name );
      [].forEach.call( config.containerClassList, function( className ) {
        formGroup.classList.add( className );
      });

      if( config.controlLabel ) {
        var text = config.customLabelText ? config.customLabelText : config.name.capitalize();
        var controlLabel = document.createElement( 'label' );
        controlLabel.className = "control-label";
        controlLabel.appendChild( document.createTextNode( text ) );
        if( config.labelFocus ) { controlLabel.setAttribute( 'for', config.id ) }

        formGroup.appendChild( controlLabel );
      }


      var inputContainer = document.createElement( 'div' );
      switch( config.inputType ) {
        case 'select':
          inputContainer.className = "selectInput";
          var selectInput = document.createElement( 'select' );
          selectInput.id = config.id;
          selectInput.className = "form-control";
          selectInput.name = config.name;

          if( config.required ) { $( selectInput ).prop( 'required', true ) }
          if( config.readonly ) { $( selectInput ).prop( 'readonly', true ) }
          if( config.blocked ) { $( selectInput ).addClass( 'blocked' ) }

          var defaultOption = document.createElement( 'option' );
          defaultOption.value = "";
          defaultOption.appendChild( document.createTextNode( 'Seleccione una Opción' ) );
          selectInput.appendChild( defaultOption );

          if( config.hasOwnProperty( 'values' ) ) {
            [].forEach.call( Object.keys( config.values ), function( key ) {
              var option = document.createElement( 'option' );
              option.value = key;
              option.appendChild( document.createTextNode( config.values[key] ) );

              selectInput.appendChild( option );
            });
          }

          inputContainer.appendChild( selectInput );
        break;

        case 'radio':
          inputContainer.className = "radioInput";
          if( config.hasOwnProperty( 'values' ) ) {
            [].forEach.call( Object.keys( config.values ), function( key ) {
              var radioContainer = document.createElement( 'label' );
              radioContainer.className = "radio-inline";

              var radioInput = document.createElement( 'input' );
              radioInput.type = "radio";
              radioInput.name = config.name+"[]";
              radioInput.value = key;

              if( config.required ) { $( radioInput ).prop( 'required', true ) }
              if( config.readonly ) { $( radioInput ).prop( 'readonly', true ) }
              if( config.blocked ) { $( radioInput ).addClass( 'blocked' ) }

              radioContainer.appendChild( radioInput );
              radioContainer.appendChild( document.createTextNode( config.values[key] ) );

              inputContainer.appendChild( radioContainer );
            });
          }
        break;

        case 'checkbox':
          inputContainer.className = "checkboxInput";
          if( config.hasOwnProperty( 'values' ) ) {
            [].forEach.call( Object.keys( config.values ), function( key ) {
              var checkboxContainer = document.createElement( 'label' );
              checkboxContainer.className = "checkbox-inline";

              var checkboxInput = document.createElement( 'input' );
              checkboxInput.type = "checkbox";
              checkboxInput.name = config.name+"[]";
              checkboxInput.value = key;

              if( config.required ) { $( checkboxInput ).prop( 'required', true ) }
              if( config.readonly ) { $( checkboxInput ).prop( 'readonly', true ) }
              if( config.blocked ) { $( checkboxInput ).addClass( 'blocked' ) }

              checkboxContainer.appendChild( checkboxInput );
              checkboxContainer.appendChild( document.createTextNode( config.values[key] ) );

              inputContainer.appendChild( checkboxContainer );
            });
          }
        break;

        case 'date':

        break;

        default: inputContainer.className = "no-child";
      }
      [].forEach.call( config.inputContainerClassList, function( className ) {
        inputContainer.classList.add( className );
      });

      formGroup.appendChild( inputContainer );

      return formGroup;
    }
    var formControlDefaultConfig = {
      inputType: "text",
      name: "default-name",
      id: 'default-id',

      required: false,
      readonly: false,
      blocked: false,
      labelFocus: true,

      controlLabel: true,
      customLabelText: false,

      containerClassList: [],
      containerDataAttr: {},

      inputContainerClassList: [],
      inputContainerDataAttr: {},

      inputElementClassList: [],
      inputElementDataAttr: {},

      //values: { value: text }
    }

    /* info
      Params[ String, DOMElement, String, String ]
      Funcion para agregar los correspondientes feedbacks al form-group
      proporcionado para saber el estado de los datos mandados. */
    function addFeedback( type, formGroup, icon, text ) {
      removeFeedback( formGroup );

      var span = document.createElement( 'span' );
      span.classList.add( 'glyphicon' );
      span.classList.add( 'form-control-feedback' );
      span.classList.add( 'glyphicon-'+icon );

      var helpBlock = document.createElement( 'span' );
      helpBlock.classList.add( 'help-block' );
      helpBlock.innerHTML = text;

      formGroup.appendChild( span );
      formGroup.appendChild( helpBlock );

      setTimeout( function() {
        formGroup.classList.add( 'has-feedback' );
        formGroup.classList.add( 'has-'+type );
      }, 100);
    }

    /* info
      @params [ Node ]
      Removes all the elements and classes added
      for the addFeedback function. */
    function removeFeedback( formGroup ) {
      $( formGroup ).find( ".form-control-feedback" ).remove();
      $( formGroup ).find( ".help-block" ).remove();
      $( formGroup ).removeClass( "has-feedback" );
      $( formGroup ).removeClass( "has-error" );
      $( formGroup ).removeClass( "has-success" );
      $( formGroup ).removeClass( "has-warning" );
    }

    function cleanForm( form ) {
      var inputs = form.querySelectorAll( 'input' );
      var textAreas = form.querySelectorAll( 'textarea' );
      var selects = form.querySelectorAll( 'select' );

      [].forEach.call( inputs, function( input ) {
        if( input.type !== 'radio'  && input.type !== 'hidden' && !$( input ).hasClass( 'hidden' ) ) {
          input.value = "";
        }
      });

      [].forEach.call( textAreas, function( textarea ) {
        if( !$(textarea).hasClass('hidden') ) {
          textarea.value = "";
        }
      });

      [].forEach.call( selects, function( select ) {
        if( !$(select).hasClass('hidden') ) {
          $(select).val("");
        }
      });
    }

    /* info
      params [ onsubmit event ]
      Maneja el evento de enviar formularios de forma genereica
      con la particularidad de agregar feedbacks a los inputs
      en base a restricciones sobre la data enviada */
    function submitForm( event ) {
      event.preventDefault();
      $( 'body' ).addClass( 'working' );

      var form = event.target,
      textareas = form.querySelectorAll( 'textarea' );
      selects = form.querySelectorAll( 'select' );
       request = new XMLHttpRequest();
        inputs = form.querySelectorAll( 'input' ),
          data = new FormData();

      // removes previous feedbacks on the inputs
      [].forEach.call( form.querySelectorAll( '.form-group' ), function ( formGroup ) {
        removeFeedback( formGroup );
      });

      // serialize data for inputs
      [].forEach.call( inputs, function ( input ) {
        if( input.name.length && ( !$( input ).hasClass( 'hidden' ) && !$( input ).hasClass( 'invisible' ) ) ) {
          if( input.type === "radio" || input.type === "checkbox" ) {
            if( $( input ).is( ':checked' ) ) {
              data.append( input.name, input.value );
            }
          } else {
            data.append( input.name, input.value );
          }
        }
      });

      // serialize data for textareas
      [].forEach.call( textareas, function ( textarea ) {
        if( textarea.name.length ) {
          data.append( textarea.name, textarea.value );
        }
      });

      // serialize data for selects
      [].forEach.call( selects, function ( select ) {
        if( select.name.length ) {
          var value = $( select ).find( 'option:selected' ).val();
          data.append( select.name, value );
        }
      });

      //config ajax
      request.overrideMimeType( 'application/json' );
      request.open( form.method, form.action );

      request.onload = function() {
        if( request.status >= 200 && request.status < 400 ) {
          var response = JSON.parse( request.responseText );

          if( response.hasOwnProperty( 'errors' ) ) {
            [].forEach.call( Object.keys( response.errors ), function ( inputName ) {
              var errorText = response.errors[inputName];
              var formGroup = form.querySelector( '.form-group.'+inputName );

              if( formGroup ) {
                if( errorText ) {
                  addFeedback( 'error', formGroup, "remove", errorText );
                } else {
                  addFeedback( 'success', formGroup, "ok", "" );
                }
              }
            });
          }

          if( response.hasOwnProperty( 'relatedAction' ) ) {
            console.log( "relatedAction" );
            switch( response.relatedAction ) {
              case 'redirect':
                var anchor = document.createElement( 'a' );
                anchor.className = "hidden";
                anchor.href = baseURL+response.url;
                $( 'body' ).append( anchor );
                anchor.click();
              break;

              case 'reload':
                window.location.reload();
              break;            
            }
          }


          if( !response.hasOwnProperty( 'errors' ) && modalVisible ) {
            $( '#CustomModal' ).modal( 'hide' );
          }

          $( 'body' ).removeClass( 'working' );
        }
      }

      request.send( data );
    }

  // upload files
    function triggerFileUploader() {
      $( '#fileUploader' ).find( 'input[type=file]' ).click();
    }
    function selectedFile( inputFile ) {
      var file = inputFile.files[0];
      if( typeof file !== 'undefined' ) {
        $( inputFile ).closest( 'form' ).submit();
      }   
    }
    function uploadTemporalFile( event ) {
      event.preventDefault();
      var form = event.target;
      var container = document.querySelector( form.getAttribute( 'data-upload-container' ) );
      var relatedAction = form.getAttribute( 'data-related-action' );
      var file = form.querySelector( 'input[type=file]' ).files[0];

      var data = new FormData( form );
      var request = new XMLHttpRequest();
      request.open( form.method, form.action );

      request.upload.onloadstart = function( event ) {
        switch( relatedAction ) {
          case 'selectImgToUpload':
          case 'changeImgToUpload':
            $( container ).find( '.icon.add' ).addClass( 'hidden' );
            $( container ).find( '.icon.change' ).addClass( 'hidden' );
            $( container ).find( 'img' ).remove();
          break;
        }

        if( container ) {
          container.appendChild( addProgressbar() );
        }      
      }
      request.upload.onprogress = function( event ) {
        var progress = Math.floor( (event.loaded / event.total) * 100);
        if( container ) {
          updateProgressbar( progress, container );
        }      
      }
      request.upload.onloadend = function( event ) {
        if( container ) {
          $( container ).find( '.icon.change' ).removeClass( 'hidden' );
        }        
      }

      request.onload = function() {
        if( request.status >= 200 && request.status < 400 ) {
          var response = JSON.parse( request.responseText );

          switch( relatedAction ) {
            case 'selectImgToUpload':
            case 'changeImgToUpload':     
              var imageType = /^image\//;
              if( imageType.test( file.type ) ) {
                var reader = new FileReader();
                reader.onload = function() {
                  $( container ).find( '.progress' ).remove();

                  var dataURL = reader.result;
                  var img = document.createElement( 'img' );
                  img.className = 'nice-shadow';
                  img.src = dataURL;                          
                  container.appendChild( img );
                  $( '#CustomModal form' ).find( 'input[name="img"]' ).val( response.filename );              

                  $( form ).find( 'input' ).val( "" );
                  $( form ).removeAttr( 'data-upload-container' );
                  $( form ).removeAttr( 'data-related-action' );                
                }
                reader.readAsDataURL( file );
              } else {
                $( container ).find( '.progress' ).remove();

                var img = document.createElement( 'img' );
                img.className = 'nice-shadow';
                img.src = baseURL+"assets/images/file.png"; 
                $( img ).attr( 'data-toggle', 'tooltip' );
                $( img ).attr( 'data-placement', 'right' );
                $( img ).attr( 'title', response.filename );
                container.appendChild( img );

                initBootstrapTooltips();

                $( '#CustomModal form' ).find( 'input[name="img"]' ).val( response.filename );              

                $( form ).find( 'input' ).val( "" );
                $( form ).removeAttr( 'data-upload-container' );
                $( form ).removeAttr( 'data-related-action' );                
              }         
            break;
          }
        }
      }
      request.send( data );
    }
    function addProgressbar() {
      var porcent = 0;
      var container = document.createElement( 'div' );
      container.className = "progress";
      container.classList.add( 'uploading' );

      var progressBar = document.createElement( 'div' );
      progressBar.className = "progress-bar";
      progressBar.classList.add( "progress-bar-striped" );
      progressBar.classList.add( "active" );
      progressBar.setAttribute( "role", "progressbar" );
      progressBar.setAttribute( "aria-valuenow", porcent );
      progressBar.setAttribute( "aria-valuemin", "0" );
      progressBar.setAttribute( "aria-valuemax", "100" );

      progressBar.style.width = porcent+"%";

      var textInfo = document.createElement( 'span' );
      textInfo.appendChild( document.createTextNode( porcent+"%" ) );
      textInfo.className = "text";

      progressBar.appendChild( textInfo );
      
      container.appendChild( progressBar );

      return container;
    }
    function updateProgressbar( val, container ) {    
      var content = container.querySelector( ".progress.uploading" );
      if( content ) {
        var progressBar = content.querySelector( ".progress-bar" );
        progressBar.style.width = val +"%";

        var text = progressBar.querySelector( '.text' );

        if( text ) {
          $( text ).text( val+"%" );
        }
      }
    }

  // Inspinia events
    function collapseIboxContent( btn ) {
      var ibox = $( btn ).closest( 'div.ibox' );
      var button = $( btn ).closest( 'i' );
      var content = ibox.find( 'div.ibox-content' );
      content.slideToggle( 200 );
      button.toggleClass( 'fa-chevron-up' ).toggleClass( 'fa-chevron-down' );
      ibox.toggleClass( '' ).toggleClass( 'border-bottom' );
      setTimeout(function () {
          ibox.resize();
          ibox.find( '[id^=map-]' ).resize();
      }, 50);
    }

    function destroyIbox( btn ) {
      var content = $( btn ).closest( 'div.ibox' );
      content.remove();
    }

// INITIALIZERS
  function initApp( location ) {
    section = typeof location == 'undefined' ? 'login' : location;
    console.log( "initApp section:", section );    
    
    device = new Device();
    initAutosizeOnTextareas();
    initBootstrapTooltips();
    initIcheckElements();

    switch( section ) {
    }

    $( window ).unload(function() {
      console.log("leaving");
    });
  }

  function initBootstrapTooltips() { $('[data-toggle="tooltip"]').tooltip(); }

  function initIcheckElements() {
    $( '.i-checks' ).iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green',
    });
  }

  function initToastrNotifications() {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "onclick": null,
      "showDuration": "400",
      "hideDuration": "1000",
      "timeOut": "7000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "slideUp"
    };
  }

  function initAutosizeOnTextareas() { autosize( document.querySelectorAll( 'textarea' ) ); }