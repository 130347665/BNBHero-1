// 引入模組
const Web3 = require('web3');

// HTTP provider
const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));

const address = '0xb91d555597dF16583F614b37874F40f5ECF150C9';
window.alert("彈跳視窗想要顯示的文字");
// 設定 css inject
const css = csjs `
  .box {
  }
  .input {
    margin: 10px;
    width: 500px;
    font-size: 20px;
  }
  .button {
    margin-top: 10px;
    font-size: 20px;
    width: 180px;
    background-color: #4CAF50;
    color: white;
  }
  .result {
    margin: 10px;
  }
  img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    width: 150px;
  }
`

// ==== DOM element ===

const inputAccount = html `<input class=${css.input} type="text" value=${address} placeholder="輸入你要查詢的帳戶"/>`;
const resultElement = html `<div></div>`

// ===== Event =====

function queryBalance(event) {
  web3.eth.getBalance(inputAccount.value, (err, balance) => {
    let number = Math.round(web3.utils.fromWei(balance, 'ether') * 100) / 100;
    const newElement = html `<div class="${css.result}">結果：${number} Ether</div>`
    morphdom(resultElement, newElement);
  });
}

// ===== render ===== 

function render() {
  document.body.appendChild(html `
  <div class=${css.box} id="app">
    ${inputAccount}
    <button class=${css.button} onclick=${queryBalance}>查詢 Ether 金額</button>
    ${resultElement}
  </div>
 `)
}

render();