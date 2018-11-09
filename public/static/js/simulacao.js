$(document).ready(function(){
	
	let local = window.location.href.split('3000')[0]+'3000/';
	//let local = "https://servidor-bndes-negocios.com/";

    let tab_header = '<tr class="w3-border-bottom">'+
    '<th>Mês</th> <th>Saldo Inicial</th> <th>Juros</th> <th>Amortização</th> <th>Prestação</th> <th>Saldo Final</th></tr>';
    
    let tab_coluna = '<tr class="w3-border-bottom" style="background-color: #COR">'+
    '<th>#MES</th> <th>#SALDOINICIAL</th> <th>#JUROS</th> <th>#AMORTIZACAO</th> <th>#PRESTACAO</th> <th>#SALDOFINAL</th></tr>';

	$.ajax({
		url: local+'simulacao',
		beforeSend: function(xhr){
    		if (xhr.overrideMimeType){
    			xhr.overrideMimeType("application/json");
    		}
  		},
		success: function (d) {
            console.log('ok');
            let tabela = tab_header;
            for (i = 0; i < d.tab_list.length; i ++) {
                let col = tab_coluna;
                if (i % 2 == 0){
                    col = col.replace('#COR','#EEE');
                }else{
                    col = col.replace('#COR','#FCFCFC');
                }
                col = col.replace('#MES',d.tab_list[i].mes).replace('#SALDOINICIAL',d.tab_list[i].tabelaSaldoInicial).replace('#JUROS',d.tab_list[i].tabelaJurosPagos).replace('#AMORTIZACAO',d.tab_list[i].tabelaAmortizacao).replace('#PRESTACAO',d.tab_list[i].tabelaPrestacao).replace('#SALDOFINAL',d.tab_list[i].tabelaSaldoFinal);
                tabela += col;
            }
            $('#tab_simulacao').html(tabela);
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
