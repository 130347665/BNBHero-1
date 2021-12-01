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
                getHeros();
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

    async function getHeros() {
        if (window.chainId == 56) {
            const contract = new window.web3.eth.Contract(
                window.ABI,
                BNBHERO_CONTRACT_ADDRESS
            );
            const balances = await contract.methods
                .balances(window.userWalletAddress)
                .call();
                humanReadable = window.web3.utils.fromWei(balances, "ether")
                alert(`Contract ${BNBHERO_CONTRACT_ADDRESS} Balances: ${humanReadable}`);
            const heros = await contract.methods
                .getHeroesByOwner(window.userWalletAddress, true)
                .call();
            var html = "";
            for (var i = 0; i < heros.length; i++) {
                html = html + '<div class="card" style="width: 200px;"><div class="card-body">'
                html = html + '<img src="https://play.bnbheroes.io/cards/' + heros[i][0] + '.png" data-preview-src="https://play.bnbheroes.io/cards/' + heros[i][0] + '.png" class="float-left rounded img-thumbnail card-img-top">';
                html = html + '<h5 class="card-title text-center">NFT #' + heros[i][7] + '</h5>'
                html = html + '<div class="progress"><div class="progress-bar bg-danger" role="progressbar" style="width: ' + heros[i][6]/10 + ';" aria-valuenow="' + heros[i][6] + '" aria-valuemin="0" aria-valuemax="1000">' + heros[i][6] + '/1000</div></div>'
                html = html + '</div></div>'

            }
            document.getElementById("userHero").innerHTML = html;
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
        {
            inputs:[
                {
                internalType:"address",
                name:"account",
                type:"address"
                },
                {
                internalType:"bool",
                name:"calcTown",
                type:"bool"
                }
            ],
            name:"getHeroesByOwner",
            outputs:[
                {
                    components:[
                        {
                            internalType:"uint256",
                            name:name,
                            type:"uint256"
                        },
                        {
                            internalType:"uint256",
                            name:"heroType",
                            type:"uint256"
                        },
                        {
                            internalType:"uint256",
                            name:"xp",
                            type:"uint256"
                        },
                        {
                            internalType:"uint256",
                            name:"attack",
                            type:"uint256"
                        },
                        {
                            internalType:"uint256",
                            name:"armor",
                            type:"uint256"
                        },
                        {
                            internalType:"uint256",
                            name:"speed",
                            type:"uint256"
                        },
                        {
                            internalType:"uint256",
                            name:"hp",
                            type:"uint256"
                        },
                        {
                            internalType:"uint256",
                            name:"tokenId",
                            type:"uint256"
                        },
                        {
                            internalType:"uint256",
                            name:"arrivalTime",
                            type:"uint256"
                        },
                        {
                            internalType:"uint256",
                            name:"level",
                            type:"uint256"
                        },
                        {
                            internalType:"uint256",
                            name:"heroClass",
                            type:"uint256"
                        }
                    ],
                    internalType:"struct HeroLibrary.Hero[]",
                    name:"",
                    type:"tuple[]"
                }
            ],
            stateMutability:"view",
            type:"function"
        },
    ]
