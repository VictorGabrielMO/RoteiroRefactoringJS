const { readFileSync } = require('fs');

class ServicoCalculoFatura {

  calcularCredito(pecas,apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(pecas,apre).tipo === "comedia")
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;
  }
  
  calcularTotalCreditos(pecas, apresentacoes) {
    let acumulator = 0;
    for (let ap of apresentacoes){
      acumulator += this.calcularCredito(pecas,ap);
    }
    return acumulator;
  }

  calcularTotalApresentacao(pecas,apre) {
    let total = 0;
    switch (getPeca(pecas,apre).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
          total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecia: ${getPeca(pecas,apre).tipo}`);
    }
    return total;
  }

  calcularTotalFatura(pecas,apresentacoes) {
    let acumulator = 0;
    for (let ap of apresentacoes){
      acumulator += this.calcularTotalApresentacao(pecas,ap);
    }
    return acumulator;
  }
}



function getPeca(pecas,apresentacao) {
  return pecas[apresentacao.id];
}


function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format(valor/100);
}


function gerarFaturaStr(fatura, pecas, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(pecas,apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(pecas,apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
  return faturaStr;
}

// function gerarFaturaHTML(fatura, pecas) {
//   return `
//     <html>
//     <p> Fatura ${fatura.cliente} </p>
//     <ul>
//     ${fatura.apresentacoes.map(
//       apre => `<li> ${getPeca(pecas,apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas,apre))} (${apre.audiencia} assentos) </li>`
//     ).join('\n')}
//     </ul>
//     <p> Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))} </p>
//     <p> Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} </p>
//     </html>
//   `;
// }

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const calc = new ServicoCalculoFatura();

const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log(faturaStr);

// const faturalHTML = gerarFaturaHTML(faturas, pecas);
// console.log(faturalHTML);

