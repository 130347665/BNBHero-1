window.onload = function() {
  alert('aaa');
      if (typeof web3 !== 'undefined') {
        alert('bb');
        web3 = new Web3(web3.currentProvider);
        alert('cc');
      } else {
        alert('dd');
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io"));
        alert('rr');
      }
    }