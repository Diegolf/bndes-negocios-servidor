$(document).ready(function(){
	
	//const local = window.location.href.split('3000')[0]+'3000/';
	const local = "https://bndes-negocios-servidor.herokuapp.com/";

    const tab_header = '<tr class="w3-border-bottom">'+
    '<th class="w3-center">Mês</th> <th class="w3-center">Saldo Inicial</th> <th class="w3-center">Juros</th> <th class="w3-center">Amortização</th> <th class="w3-center">Prestação</th> <th class="w3-center">Saldo Final</th></tr>';
    
    const tab_coluna = '<tr class="w3-border-bottom" style="background-color: #COR">'+
    '<td class="w3-center">#MES</td> <td class="w3-center">#SALDOINICIAL</td> <td class="w3-center">#JUROS</td> <td class="w3-center">#AMORTIZACAO</td> <td class="w3-center">#PRESTACAO</td> <td class="w3-center">#SALDOFINAL</td></tr>';

	$.ajax({
		url: local+'simulacao',
		beforeSend: function(xhr){
    		if (xhr.overrideMimeType){
    			xhr.overrideMimeType("application/json");
    		}
  		},
		success: function (d) {
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
