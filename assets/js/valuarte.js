// IIFE - Immediately Invoked Function Expression
(function(yourcode) {

	//The global jQuery object is passed as a parameter
	yourcode(window.jQuery, window, document);

}(function($, window, document){

	// The $ is now locally scoped
	$(function() {
		var max = 0;
		// The DOM importes ready!
		$("[contenteditable='true']").click(function() {
			$(this).focus()
			.select();
		}).focusout(evaluarEditable);
		updateTables();
		// tableImporte().done(function(response) {
		// 	$("#g").html(response);
		// });
		$("span.validation-signing").on('focusout',function() {
			var def = $(this).data("default");
			console.log($(this).text() != def);
			if ($(this).text() != def) {
				$(".to_bottom_center").removeClass("no_print");
				console.log("remove");
			}else{
				$(".to_bottom_center").addClass("no_print");
				console.log("put");
			}
		});
		fixTableFit($("#historailFacturaciones"));
		cantera =Morris.Bar({
			resize:true,
			element: 'importe',
			data: [{"nombre":"may-jun","consumo":0,"generacion_mensual":0}],
			xkey: 'mes',
			ykeys: ['consumo', 'generacion'],
			labels: ['Consumo', 'Generacion'],
			barColors: ['#89A54E','#B9CD96'],
			lineColors: ['red', 'blue']
		});


	});
	function fixTableFit(element) {
		var HeightDiv = $(element).parent().height();
		var HeightTable = $(element).height();
		if (HeightTable > HeightDiv) {
			var FontSizeTable = parseInt($(element).css("font-size"), 10);
			while (HeightTable > HeightDiv && FontSizeTable > 5) {
				FontSizeTable--;
				$(element).css("font-size", FontSizeTable);
				HeightTable = $(element).height();
			}
		}
	}
	function evaluarEditable(event) {
		var text = $(this).text();
		if(text.length<1){
			var aux = $(this).data("default");
			console.log(aux);
			$(this).text(aux);
			$(this).focus();
		}
	}
		// The rest of your code goes here!

		function fillImporte(response) {
			var totales = response.totales;
			var pm = totales.importe/totales.consumo;
			var cotizacion = response.cotizacion;
			var importeGeneracion =totales.generacion*pm;
			var importePercent = importeGeneracion/pm;
			var inversion = 0;
			$.each(cotizacion,function(index,value){
				inversion += Number(value.importe_real);
			});
			console.log("inversion",inversion);
			var tgeneracion = (totales.generacion).toFixed(2);
			$(".table-importe .consumo .actual").text((totales.consumo).toFixed(2));
			console.log(tgeneracion);
			$(".table-importe .consumo .generacion").text((totales.generacion).toFixed(2));
			$(".table-importe .consumo .percent").text(((totales.generacion/totales.consumo)*100).toFixed(2));

			$(".table-importe .importe .actual").text(totales.importe);
			$(".table-importe .importe .generacion").text((importeGeneracion).toFixed(2));
			var importePercent2=((importeGeneracion/totales.importe)*100).toFixed(2);
			$(".table-importe .importe .percent").text(importePercent2);
			$("span.importe.percent").text(importePercent2);
			$("span.importe.percent").data('default',(importePercent2));
			$(".table-importe .pm").text((pm).toFixed(2));

			$(".inversion").text((inversion).toFixed(2));
			$($('.table-importe .inversion')[0]).data('inversion',inversion);
			$("span.inversion").data('default',"$ "+(inversion).toFixed(2));

			var psr = (inversion/importeGeneracion).toFixed(2);
			$(".psr").text(psr);
			$("span.psr").data('default',psr);
		}
		function fillTbody(data) {
				//fix rapid
				$("#consumo tbody").empty();
				var row;
				var counter = 1;
				console.log(data);
				$("#consumo tfoot .total .consumo").text(data.totales.consumo);
				$("#consumo tfoot .total .importe").text(data.totales.importe);

				$("#consumo tfoot .promedio .consumo").text((data.promedios.consumo).toFixed(2));
				$("#consumo tfoot .promedio .importe").text((data.promedios.importe).toFixed(2));
				var pm = (data.promedios.importe/data.promedios.consumo).toFixed(2);
				$("#consumo tfoot .promedio .pm").text(pm);


				$.each(data.table,function(key,value){
					row = $("<tr>")
					.append($("<td>").text(value.mes))
					.append($("<td>").text(value.year))
					.append($("<td>").text((Number(value.consumo)).toFixed(2)))
					.append($("<td>").text((Number(value.importe)).toFixed(2)))
					.append($("<td>").text((Number(value.importe/value.consumo)).toFixed(2)))
					$("#consumo tbody").append(row);
					console.log("this is amuse");
					counter++;
				});
			}
			function fillGeneracionEstimada(build) {
				//fix rapid
				var generaciones = build.generaciones;
				var totales = build.totales;
				var promedios = build.promedios;

				$("#generacion tbody").empty();
				var row;
				var counter = 1;
				console.log('generacion',totales);

				$("#generacion tfoot .total .irradiacion").text(totales.irradiacion_solar
					);
				$("#generacion tfoot .total .generacion").text(totales.generacion);

				$("#generacion tfoot .promedio .irradiacion").text((promedios.irradiacion_solar).toFixed(2));
				$("#generacion tfoot .promedio .generacion").text((promedios.generacion).toFixed(2));

				$.each(generaciones,function(key,generacion){
					row = $("<tr>")
					.append($("<td>").text(generacion.mes))
					.append($("<td>").text(generacion.dias))
					.append($("<td>").text((Number(generacion.irradiacion_solar)).toFixed(2)))
					.append($("<td>").text((Number(generacion.generacion)).toFixed(2)))
					$("#generacion tbody").append(row);
					counter++;
				});
			}
			function updateTables() {
				var grafica=[];
				var table=[];
				var generaciones=[];
				getJsonTable().done(function(response) {
					var month = ['cerosto','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
					var inicio = $(".first").val();
					var year = response.year;
					var promedios = response.promedios;
					var totales = response.totales;

					var aportacion_requierida = (totales.generacion*100/totales.consumo).toFixed(2);
					$(".aportacion").data('default',aportacion_requierida);
					$(".aportacion").text(aportacion_requierida);

					var no_paneles = Number($(".num_paneles").text());
					var length = response.facturacionLength;
					var Cpanel = Number($(".capacidad_panel").text());
					var Cp = Cpanel/1000;
					var days =(response.mensual_bimestral&&response.facturacionLength==6)||(!response.mensual_bimestral&&response.facturacionLength==12)?365:response.days;
					var k = (1000/days);
					var pm = totales.importe/totales.consumo;
					var ef =((totales.consumo*1000)/(Cpanel*no_paneles*promedios.irradiacion_solar*days));
					console.log("Tconsumo",totales.consumo);
					console.log("Cp",Cpanel,"noP",no_paneles,"Avg_is",promedios.irradiacion_solar,"dias",days);
					var ahorroBimestral  = no_paneles*promedios.irradiacion_solar*Cp*pm*ef*days;
					var ahorroMensual  = no_paneles*promedios.irradiacion_solar*pm*ef*Cp*(length>6?30.4:61)*length;
					console.log('Np',no_paneles,'Avg_is',promedios.irradiacion_solar,'Ef',ef,'Cp',Cp,'pm',pm);
					console.log('Bimestral?',response.mensual_bimestral?'Bimestral':'Mensual','ahorroMensual',ahorroMensual,'ahorroBimestral',ahorroBimestral);
					var ahorro = response.mensual_bimestral?ahorroBimestral:ahorroMensual;
					$(".promedio .consumo").text(Number(promedios.consumo).toFixed(2));
					$(".total .consumo").text(Number(totales.consumo).toFixed(2))
					$(".promedio .importe").text(Number(promedios.importe).toFixed(2)).prepend("$");
					$(".total .importe").text(Number(totales.importe).toFixed(2)).prepend("$");
					$(".promedio .pm").text(Number(pm).toFixed(2));
					// $(".totales .pm").text(Number(totales.consumo).toFixed(2))
					$("span.pm").text(Number(totales.generacion*100/totales.consumo).toFixed(2)).append("%");
					$(".eficiencia").data('default',(ef*100).toFixed(2)).text((ef*100).toFixed(2)).append('%');

					$("td.pm").prepend("$")
					var element = null;
					var generacion = null;
					var maximo = 0;
					for(var i = response.mesInicio,counter =0 ;counter < 12; i==1?i=12:i--,counter++) {
						if(maximo<Number(year[month[i]].consumo) || maximo<Number(year[month[i]].generacion)){
							maximo = Number(year[month[i]].consumo)<year[month[i]].generacion?year[month[i]].generacion:Number(year[month[i]].consumo);
						}
						row = {mes:year[month[i]].mes,consumo:(year[month[i]].consumo).toFixed(2),importe:year[month[i]].importe};
						generacion = {mes:year[month[i]].mes,dias:year[month[i]].dias_real,irradiacion_solar:year[month[i]].irradiacion_solar,generacion:year[month[i]].generacion};
						element = {mes:year[month[i]].mes,consumo:(Number(year[month[i]].consumo)).toFixed(2),generacion:year[month[i]].generacion};
						grafica.push(element);
						table.push(row);
						generaciones.push(generacion);
					}


					cantera.setData(grafica);
					cantera.options["ymax"] = maximo-500;
					fillTbody({table:table,totales:totales,promedios:promedios});
					fillGeneracionEstimada({generaciones:generaciones,totales:totales,promedios:promedios});
					fillImporte(response);
					amortizacion(ahorro);
				});
			}
			function amortizacion(ahorro) {
				var ahorro = ahorro;
				var inversion = Number($($('.table-importe .inversion')[0]).data('inversion'))*-1;
				console.log('negado',inversion);
				var year = new Date().getFullYear();
				var amortizacion = []
				for (var i = 1; i <= 25; i++) {
					inversion+=ahorro;
					amortizacion.push({year:year+i,amortizado:(inversion).toFixed(2)});
				}
				console.log(amortizacion);
				Morris.Bar({
					resize:true,
					element: 'amortizado',
					data: amortizacion,
					xkey: 'year',
					ykeys: ['amortizado'],
					labels: ['Amortizado'],
					barColors: function(row,series,type){
						if(row!=undefined && row.y<0){
							return "red";
						} else {
							return "#B9CD96";
						}
					},
					lineColors: ['red', 'blue']
				});
			}
			// function tableImporte() {
			// 	return $.ajax({
			// 		url: urlbase +"Anteproyectos_control/importeTable/"+$("#id_anteproyecto").val(),
			// 		cache: false,
			// 		type: "post"
			// 	});
			// }
			// The rest of your code goes here!

			function getJsonTable() {
				return $.ajax({
					url: urlbase +"Anteproyectos_control/consumoJson/"+$("#id_anteproyecto").val(),
					cache: false,
					type: "post",
					dataType: 'json'
				});
			}
		}
		));
