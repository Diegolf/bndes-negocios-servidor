$(document).ready(function(){
	
	let local = window.location.href.split('3000')[0]+'3000/';
	//let local = "https://servidor-bndes-negocios.com/";

    let tab_header = '<tr class="w3-border-bottom">'+
        '<th class="w3-center">Série</th><th class="w3-center">Sigla</th>'+
        '</tr>';
    
    let tab_coluna = '<tr class="w3-border-bottom" style="background-color: #COR">>'+
    '<td class="w3-center">#SERIE</td><td class="w3-center">#SIGLA</td>'+
    '</tr>';

	$.ajax({
		url: local+'servico-sigla-series',
		beforeSend: function(xhr){
    		if (xhr.overrideMimeType){
    			xhr.overrideMimeType("application/json");
    		}
  		},
		success: function (d) {
            let tabela1 = tab_header;
            let tabela2 = tab_header;
            let tabela3 = tab_header;

            console.log(d.listaSeriesSiglas);
            tam = parseInt(d.listaSeriesSiglas.length / 3) + 1;

            for (i = 0; i < tam ; i++){
                let col1 = tab_coluna;
                let col2 = tab_coluna;

                if (i % 2 == 0){
                    col1 = col1.replace('#COR','#EEE');
                    col2 = col1;
                }else{
                    col1 = col1.replace('#COR','#FCFCFC');
                    col2 = col1;
                }
                col1 = col1.replace('#SERIE', d.listaSeriesSiglas[i].serie).replace('#SIGLA', d.listaSeriesSiglas[i].sigla);
                col2 = col2.replace('#SERIE', d.listaSeriesSiglas[i+tam].serie).replace('#SIGLA', d.listaSeriesSiglas[i+tam].sigla);
                tabela1 += col1;
                tabela2 += col2;
            }

            for( i = tam*2; i < d.listaSeriesSiglas.length ; i++){
                let col3 = tab_coluna;

                if (i % 2 == 0){
                    col3 = col3.replace('#COR','#EEE');
                }else{
                    col3 = col3.replace('#COR','#FCFCFC');
                }
                col3 = col3.replace('#SERIE', d.listaSeriesSiglas[i].serie).replace('#SIGLA', d.listaSeriesSiglas[i].sigla);
                tabela3 += col3;
            }
            
            $('#tabela1').html(tabela1);
            $('#tabela2').html(tabela2);
            $('#tabela3').html(tabela3);
            
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
