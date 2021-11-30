    window.userWalletAddress = null
    const BNBHERO_CONTRACT_ADDRESS = "0xde9fFb228C1789FEf3F08014498F2b16c57db855";
    const loginButton = document.getElementById('loginButton')
    const userWallet = document.getElementById('userWallet')

    window.onload = async () => {
        if (typeof window.ethereum !== 'undefined') {
            window.web3 = new Web3(window.ethereum);
            loginButton.addEventListener('click', loginWithMetaMask)
        } else {
            alert("MetaMask is NOT installed!");
            loginButton.setAttribute('disabled', 'disabled');
        }
    };

    // Login with Web3 via Metamasks window.ethereum library
    async function loginWithMetaMask() {
        if (window.web3) {
            try {
                // We use this since ethereum.enable() is deprecated. This method is not
                // available in Web3JS - so we call it directly from metamasks' library
                const selectedAccount = await window.ethereum
                    .request({
                      method: "eth_requestAccounts",
                    })
                    .then((accounts) => accounts[0])
                    .catch(() => {
                      throw Error("No account selected!");
                    });
                window.userWalletAddress = selectedAccount;
                window.localStorage.setItem("userWalletAddress", selectedAccount);
                window.chainId = await window.web3.eth.net.getId();
                getContractSymbol();
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("MetaMask is NOT installed!");
        }
    }

    function logout() {
        window.userWalletAddress = null;
        window.localStorage.removeItem("userWalletAddress");
    }

    async function getContractSymbol() {
        if (window.chainId == 56) {
            const contract = new window.web3.eth.Contract(
                window.ABI,
                BNBHERO_CONTRACT_ADDRESS
            );
            const balances = await contract.methods
              .balances()
              .call({ from: window.userWalletAddress });
              humanReadable = window.web3.fromWei(balances, "ether")
            alert(`Contract ${BNBHERO_CONTRACT_ADDRESS} Balances: ${humanReadable}`);
        }
        else {
            alert("Your metamask network is wrong!");
        }

    }



    window.ABI = [
        {
            inputs:[
                {
                    internalType:"address",
                    name:"",
                    type:"address"
                }
            ],
            name:"balances",
            outputs:[
                {
                    internalType:"uint256",
                    name:"",
                    type:"uint256"
                }
            ],
            stateMutability:"view",
            type:"function"
        },
    ]
