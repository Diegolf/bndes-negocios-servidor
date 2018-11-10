const express = require('express');
const axios = require('axios');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;

var tabela = {};
var listaSeriesSiglas = {};
var ldominios = {};

// TODO gerar nova chave quando necessário (depois que tudo estiver funcionando para evitar fadiga de cada execução)
const CHAVE = 'Bearer 836fb5f3-3558-3435-a227-aa7aa329cbe4';

app.use(express.static(__dirname + '/public'));

function ping(callback,error){
    axios.get('https://api-labs.bndes.gov.br/simular/v1/ping', 
        {headers: {Authorization : CHAVE}}).then(callback).catch(error);
}

function simulacao(codProduto, valorBem, percentualFinanciado, prazoFinanciamento, prazoCarencia, spreadAgente, projecaoInflacaoAnual, callback,error){

    axios.get('https://api-labs.bndes.gov.br/simular/v1/simulacao/'+codProduto,{ 
        params: {valorBem:valorBem, percentualFinanciado:percentualFinanciado, prazoFinanciamento:prazoFinanciamento, prazoCarencia:prazoCarencia, spreadAgente:spreadAgente, projecaoInflacaoAnual:projecaoInflacaoAnual }, 
        headers: {Authorization : CHAVE}})
            .then(callback).catch(error);

}

function servicoListaCotacoes(serie, singla, limite, dataInicio, dataFim, callback, error){
    axios.get('https://api-labs.bndes.gov.br/moedascontratuais/v1/ServicoListaCotacoes.jsp',{ 
        params: { serie:serie, singla:singla, limite:limite, dataInicio:dataInicio, dataFim:dataFim}, 
        headers: {Authorization : CHAVE}})
            .then(callback).catch(error);
}

function servicoSiglaSeries(callback, error){
    axios.get('https://api-labs.bndes.gov.br/moedascontratuais/v1/ServicoSiglaSeries.jsp',{ 
        headers: {Authorization : CHAVE}})
            .then(callback).catch(error);
}

// tipoPessoa = 'pessoafisica' || 'pessoajuridica' || 'porte' > valores da consulta de listaDominios com esses valores
function consulta(pessoafisica, pessoajuridica, porte, parcelas, valorfinanciar, callback, error){
    axios.get('https://api-labs.bndes.gov.br/opcoesfinanciamento/v1/consulta',{ 
        params: { pessoafisica:pessoafisica, pessoajuridica:pessoajuridica, porte:porte, parcelas:parcelas, valorfinanciar:valorfinanciar},
        headers: {Authorization : CHAVE}})
            .then(callback).catch(error);
}

function listaDominios(callback, error){
    axios.get('https://api-labs.bndes.gov.br/opcoesfinanciamento/v1/listadominios',{ 
        headers: {Authorization : CHAVE}})
            .then(callback).catch(error);
}

/* TODO
    funções disponíveis:
        Simulador Financiamento:
        https://api-labs.bndes.gov.br/simular/v1/ping/
        https://api-labs.bndes.gov.br/simular/v1/simulacao/
            AOI_001?valorBem=20000000&percentualFinanciado=1&prazoFinanciamento=60&prazoCarencia=24&spreadAgente=3&projecaoInflacaoAnual=5

        Moedas contratuais:
        https://api-labs.bndes.gov.br/moedascontratuais/v1/ServicoListaCotacoes.jsp
        https://api-labs.bndes.gov.br/moedascontratuais/v1/ServicoSiglaSeries.jsp'

        Opções financiamento:
        https://api-labs.bndes.gov.br/opcoesfinanciamento/v1/consulta
        https://api-labs.bndes.gov.br/opcoesfinanciamento/v1/listadominios
*/

app.get('/simulacao/dados', function(req, res){
    let codProduto = req.query.codProduto;
    let valorBem = req.query.valorBem;
    let percentualFinanciado = req.query.percentualFinanciado;
    let prazoFinanciamento = req.query.prazoFinanciamento;
    let prazoCarencia = req.query.prazoCarencia
    let spreadAgente = req.query.spreadAgente;

    // codProduto, valorBem, percentualFinanciado, prazoCarencia, spreadAgente, projecaoInflacaoAnual
    simulacao( codProduto, valorBem, percentualFinanciado, prazoFinanciamento, prazoCarencia, spreadAgente, '1', 
        function (response){
            if(response != ' '){
                tabela = response.data.tabela;
                res.end(JSON.stringify({"erro":false, "tabela":tabela}));
            }
        },
        function (error){
            console.log('Ocorreu um erro: \n > '+error.response.status+': '+error.response.data.error);
            res.end(JSON.stringify({"erro":true, "tabela": []}));
        }
    );
});

app.get('/simulacao', function(req, res){
    res.sendFile(__dirname + '/views/simulacao.html');
});

app.post('/simulacao', function(req, res){
   res.end(JSON.stringify({"erro":false,"tab_list":tabela}));
});

app.get('/servico-sigla-series', function(req, res){
    servicoSiglaSeries( 
        function(response){
            listaSeriesSiglas = response.data.listaSeriesSiglas;
            res.sendFile(__dirname + '/views/servicoSiglaSeries.html');
        },
        function(error){
            console.log(error);
            res.sendFile(__dirname + '/views/servicoSiglaSeries.html');
        }
    );
});

app.post('/servico-sigla-series', function(req, res){
    res.end(JSON.stringify({"erro":false, "listaSeriesSiglas": listaSeriesSiglas }));
});

app.get('/lista-dominios',function(req, res){
    listaDominios(
        function(response){
            ldominios = response.data.result.dominios;
            res.sendFile(__dirname + '/views/listadominios.html');
        },
        function(error){
            console.log(error);
            res.sendFile(__dirname + '/views/listadominios.html');
        }
    );
});

app.post('/lista-dominios', function(req, res){
    res.end(JSON.stringify({"erro":false, ldominios : ldominios }));
});

http.listen(port, function(){
    console.log('listening on *:' + port);
    console.log('Testando a conexão com a API ...');
    
    ping( 
        function(response) {
            if ( response.status == 200){
                console.log('API BNDES Ok.');
            }else{
                console.log(response);
            }
        }, 
        function (error) {
            console.log(error);
            return;
        }
    ); 
    
});

/*
var SimuladorFinanciamento = require('simulador_financiamento');
var api = new SimuladorFinanciamento.ServicoRESTParaExecutarUmaSimulacaoDeFinanciamentoNoBNDESApi()
var codProduto = codProduto_example; // {String} Codigo do Produto
var valorBem = 1.2; // {Double} Valor do Bem ou Projeto
var percentualFinanciado = 1.2; // {Double} Percentual a ser Financiado
var prazoFinanciamento = 56; // {Integer} Prazo do Financiamento em meses
var prazoCarencia = 56; // {Integer} Prazo de Carencia do Financiamento em meses
var spreadAgente = 1.2; // {Double} Percentual de Spread do Agente Financeiro

var opts = {
  'projecaoInflacaoAnual': 1.2 // {Double} Percentual da Projeção de Inflação Anual (Opcional)
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
api.simulaFinanciamento(codProduto, valorBem, percentualFinanciado, prazoFinanciamento, prazoCarencia, spreadAgente, opts, callback);
*/