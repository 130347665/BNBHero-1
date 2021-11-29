window.onload = function() {
  alert('aaa');
      if (typeof web3 !== 'undefined') {
        alert('bb');
        web3 = new Web3(web3.currentProvider);
        
var message = "Some string"
var hash = web3.utils.sha3(message)
var accounts = await web3.eth.getAccounts()
alert(accounts[0]);
var signature = await web3.eth.personal.sign(hash, accounts[0])
      } else {
        alert('dd');
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io"));
        alert('rr');
      }
    }