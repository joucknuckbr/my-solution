import { readFile } from 'fs';

readFile('/home/joucknuckbr/Área de trabalho/Braners/Intelitrader/quero-ser/Desafio/Caso de teste 1/c1_produtos.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});