    window.userWalletAddress = null
    const loginButton = document.getElementById('loginButton')
    const userWallet = document.getElementById('userWallet')

    window.userAddress = null;
    window.onload = async () => {
      // Init Web3 connected to ETH network
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
      } else {
        alert("No ETH brower extension detected.");
      }

    };