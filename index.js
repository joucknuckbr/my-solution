const fs = require('fs');
const express = require('express');

var listP = new Array();
var listPQntd = new Array();
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
    
    Promise.all(promises).then(conteudoArquivos => {
        res
        .set({ 'Content-Type': 'text/plain' })
        .send(conteudoArquivos.join('\n'));
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
                    var productQntd = new Object();
                    var ind = new Array();
                    var pos = 0;
                    
                    while ( pos != -1 ) {
                        pos = el.indexOf(";", pos + 1);
                        ind.push(pos);
                    }
                    
                    product.codP = el.slice(0,-(el.length-5));
                    product.qntdEstIniP = el.slice(6,-(el.length-ind[1]));
                    product.qntdMinCo = el.slice(ind[1]+1);
                    listP.unshift(product);
                    
                    productQntd.codP = Number(el.slice(0,-(el.length-5)));
                    productQntd.qntV = Number(0);
                    productQntd.estV = Number(0);
                    productQntd.necCo = Number(0);
                    productQntd.transfCo = Number(0); 
                    listPQntd.unshift(productQntd);
                    
                });
                
                // listPQntd.forEach((el,index)=>{
                //     console.log("cod: "+el.codP);
                //     console.log("qntd est: "+el.qntdEstIniP);
                //     console.log("qntd min: "+el.qntdMinCo);
                // });
                
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
                    listV.unshift(sells);
                    
                });
            }
            
            err ? reject(err) : resolve(data);
            tranferencias();
            
        });
        
    });
    
}

function tranferencias(){
    
    var prodDTO = new String();
    var prodV = Number(0);
    var qntEst = Number(0);
    var i = 0;
    
    const header = 'Necessidade de Transferência Armazém para CO\n\n' + 
    'Produto \tQtCO\tQtMin\tQtVendas\tEstq.após\tNecess.\t\tTransf. de\n' +
    '\t\t\t\t\t\t\t\t\t\tVendas\t\t\t\t\tArm p/ CO\n';
    
    listV.forEach((el)=>{
        if(el.sitV == 100 || el.sitV == 102) {
            prodV = Number(el.codP);
            i=0;
            while(i<listPQntd.length){
                if(listPQntd[i].codP === prodV){
                    break;
                }
                i++;
            }
            if(i<listPQntd.length){
                listPQntd[i].qntV += Number(el.qntdV);
            }
        }
    });
    
    listPQntd.forEach((el,index)=>{
        el.estV = listP[index].qntdEstIniP - el.qntV;
        if(el.estV < listP[index].qntdMinCo){
            el.necCo = listP[index].qntdMinCo - el.estV;
            if(el.necCo > 1 && el.necCo < 10){
                el.transfCo = 10;
            }else{
                el.transfCo = el.necCo;
            }
        }else{
            el.necCo = 0;
        }
    });
    
    listP.forEach((el,index)=>{
        prodDTO = el.codP + '\t\t' + el.qntdEstIniP + ' \t' + el.qntdMinCo + ' \t' + listPQntd[index].qntV + ' \t\t' + listPQntd[index].estV + '  \t\t' 
        + listPQntd[index].necCo + '   \t\t' + listPQntd[index].transfCo + '\n' + prodDTO;
        
    });
    
    var data = header + prodDTO;
    
    fs.writeFile('transfere.txt', data, (err) => {
        if (err) throw err;
        console.log('O arquivo foi criado!');
    });
    
    return;
}

app.listen(3000);