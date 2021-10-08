const fs = require('fs');
const express = require('express');
var product = require('./models/Product');
var productDTO = new Array();
var vendasDTO = new Array();
var test;
var dt;

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
        
        // readFile(caminhoArquivo, (err, data) /* callback */ => {
        //     console.log(caminhoArquivo, 4, err ? 'Erro' : 'Sucesso');
        //     err ? reject(err) : resolve(data);
        // });
        fs.readFile(caminhoArquivo, 'utf-8', function(err, data){
            console.log(caminhoArquivo, 4, err ? 'Erro' : 'Sucesso');
            // productDTO=conteudoArquivos.split("\n");
            test=data.split("\n");
            if(test[0].split(";").length - 1 == 3){
                productDTO=data.split("\n");
                console.log(productDTO);
                console.log(productDTO.length);
            }else{
                vendasDTO=data.split("\n");
                console.log(vendasDTO);
                console.log(vendasDTO.length);
            }
            err ? reject(err) : resolve(data);
        })
    });
    
}

// function readTextFile(file)
// {
//     var rawFile = new XMLHttpRequest();
//     rawFile.open("GET", file, false);
//     rawFile.onreadystatechange = function ()
//     {
//         if(rawFile.readyState === 4)
//         {
//             if(rawFile.status === 200 || rawFile.status == 0)
//             {
//                 var allText = rawFile.responseText;
//                 console.log(allText);
//             }
//         }
//     }
//     rawFile.send(null);
// }

app.listen(3000);