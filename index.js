const fs = require('fs');
const express = require('express');

var listP = new Array();
var listV = new Array();
var listT = new Array();
var listC = new Array();
var listD = new Array();

const app = express();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/arquivos', (req, res) => {
    const caminhoArquivos = [
        '/home/joucknuckbr/Área de trabalho/Braners/Intelitrader/quero-ser/Desafio/Caso de teste 2/c2_produtos.txt',
        '/home/joucknuckbr/Área de trabalho/Braners/Intelitrader/quero-ser/Desafio/Caso de teste 2/c2_vendas.txt'
    ];
    
    const promises = [];
    for (const caminhoArquivo of caminhoArquivos) {
        promises.push(lerArquivo(caminhoArquivo));
    }
    
    // readTextFile("file://home/joucknuckbr/Área de trabalho/Braners/Intelitrader/quero-ser/Desafio/Caso de teste 2/c2_vendas.txt");
    
    Promise.all(promises).then(conteudoArquivos => {
        res
        .set({ 'Content-Type': 'text/plain' })
        .send(conteudoArquivos.join('\n'));
        // productDTO.forEach((el, index)=>{
        //     console.log(el+' indice: '+index);
        //     console.log('fic');
        // });
    }).catch(err => {
        res.status(500).send(err);
    });

}); /* Final do GET /arquivos */

function lerArquivo(caminhoArquivo) {
    console.log(caminhoArquivo, 1);
    
    return new Promise((resolve, reject) => {
        console.log(caminhoArquivo, 3);
        
        fs.readFile(caminhoArquivo, 'utf-8', function(err, data){
            console.log(caminhoArquivo, 4, err ? 'Erro' : 'Sucesso');
            var test = data.split("\n");
            
            if(test[0].split(";").length - 1 == 2){

                var productDTO = new Array();
                productDTO=data.split("\n");

                productDTO.forEach((el)=>{

                    var product = new Object();
                    var ind = new Array();
                    var pos = 0;
                    
                    while ( pos != -1 ) {
                        pos = el.indexOf(";", pos + 1);
                        ind.push(pos);
                    }
                    
                    product.codP = el.slice(0,-(el.length-5));
                    product.qntdEstIniP = el.slice(6,-(el.length-ind[1]));
                    product.qntdMinCo = el.slice(ind[1]+1);
                    listP.push(product);
                    
                });
                
                listP.forEach((el,index)=>{
                    console.log("cod: "+el.codP);
                    console.log("qntd est: "+el.qntdEstIniP);
                    console.log("qntd min: "+el.qntdMinCo);
                });
                
            }else{
                
                var vendasDTO = new Array();
                vendasDTO=data.split("\n");

                vendasDTO.forEach((el,index)=>{
                    
                    var sells = new Object();
                    var ind = new Array();
                    var pos = 0;
                    
                    while ( pos != -1 ) {
                        pos = el.indexOf(";", pos + 1);
                        ind.push(pos);
                    }
                    
                    sells.codP = el.slice(0,-(el.length-5));
                    sells.qntdV = el.slice(6,-(el.length-ind[1]));
                    sells.sitV = el.slice(ind[1]+1,-(el.length-ind[2]));
                    sells.qntdMinCo = el.slice(ind[2]+1);
                    listV.push(sells);
                    
                });
            }
            err ? reject(err) : resolve(data);
        })
    });
    
}

function tranferencias(){
    
}

app.listen(3000);