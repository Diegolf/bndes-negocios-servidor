$(document).ready(function(){
	
	//const local = window.location.href.split('3000')[0]+'3000/';
	const local = "https://bndes-negocios-servidor.herokuapp.com/";

    const pagina = '<h1 class="w3-center w3-margin"> #DESCRICAO </h1>'+
        '<div class="w3-container w3-margin-left w3-margin-right w3-padding w3-white w3-card">'+
            '<table class="w3-table" id="tab_simulacao">#TABLE'+
            '</table>'+
    '</div>';

    const tab_header = '<tr class="w3-border-bottom">'+
        '<th class="w3-center">Identificador</th> <th class="w3-center">Descrição</th>'+
    '</tr>';
    
    const tab_coluna = '<tr class="w3-border-bottom" style="background-color: #COR">'+
        '<td class="w3-center">#IDENTIFICADOR</td> <td class="w3-center">#DESCRICAO</td>'+
    '</tr>';

	$.ajax({
		url: local+'lista-dominios',
		beforeSend: function(xhr){
    		if (xhr.overrideMimeType){
    			xhr.overrideMimeType("application/json");
    		}
  		},
		success: function (d) {         
            d = d.ldominios;
            let pg = '';   
            for (i = 0; i < d.length; i ++) {
                let tbl = tab_header;
                
                for (c = 0 ; c < d[i].valores.valor.length; c++){
                    let col = tab_coluna;
                    if (c % 2 == 0){
                        col = col.replace('#COR','#EEE');
                    }else{
                        col = col.replace('#COR','#FCFCFC');                        
                    }
                    tbl += col.replace('#IDENTIFICADOR', d[i].valores.valor[c].identificador).replace('#DESCRICAO',d[i].valores.valor[c].descricao);
                }

                pg = pg += pagina.replace('#DESCRICAO',d[i].descricao).replace('#TABLE',tbl);
            }
            $('#pagina').html(pg);
		},
		error: function (e) {
            alert('Ocorreu um erro ao carregar os dados. Tente novamente mais tarde');
            console.log(e);
		},
		type: 'POST',
		contentType: 'application/json;charset=UTF-8',
		cache: false,
		processData: false
	});

});
