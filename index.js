    window.userWalletAddress = null
    const BNBHERO_CONTRACT_ADDRESS = "0xde9fFb228C1789FEf3F08014498F2b16c57db855";
    const loginButton = document.getElementById('loginButton')

    window.onload = async () => {
        if (typeof window.ethereum !== 'undefined') {
            window.web3 = new Web3(window.ethereum);
            loginButton.addEventListener('click', loginWithMetaMask)
            window.ethereum.on('accountsChanged', function () {
                web3.eth.getAccounts(function(error, accounts) {
                    loginWithMetaMask();
                });
            });
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
                loginButton.setAttribute('disabled', 'disabled');
                loginButton.innerText = 'Address: ' + truncateAddress(window.userWalletAddress);
            } catch (error) {
                console.error(error);
            }
        } else {
            alert("MetaMask is NOT installed!");
        }
    }

    function truncateAddress(address) {
        if (!address) {
            return "";
        }
        return address.substr(0, 5) + '...' + address.substr(
            address.length - 5,
            address.length
        );
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
//            const balances = await contract.methods
//                .balances(window.userWalletAddress)
//                .call();
//                humanReadable = window.web3.utils.fromWei(balances, "ether")
//                alert(`Contract ${BNBHERO_CONTRACT_ADDRESS} Balances: ${humanReadable}`);
            const heros = await contract.methods
                .getHeroesByOwner(window.userWalletAddress, true)
                .call();
            var html = '<div class="card-group">';
            for (var i = 0; i < heros.length; i++) {
                exp = heros[i][2] % 1000;
                console.log(exp);
                html = html + '<div class="card" style="max-width: 230px;"><div class="card-body">';
                html = html + '<img style="width: 200px;" src="https://play.bnbheroes.io/cards/' + heros[i][0] + '.png" data-preview-src="https://play.bnbheroes.io/cards/' + heros[i][0] + '.png" class="rounded img-thumbnail card-img-top">';
                html = html + '<h5 class="card-title text-center">NFT #' + heros[i][7] + '</h5>';
                html = html + '<div class="progress"><div class="progress-bar bg-danger text-center text-dark" role="progressbar" style="width: ' + heros[i][6]/10 + '%;" aria-valuenow="' + heros[i][6] + '" aria-valuemin="0" aria-valuemax="100">' + heros[i][6] + '</div></div>';
                if (exp != 999 && heros[i][6] >= 200) {
                    html = html + '<button style="width: 100%;" type="button" onclick="fight(' + heros[i][7] + ')"class="btn btn-danger">Fight</button>';
                }
                
                if (exp == 999) {
                    html = html + '<button style="width: 100%;" type="button" onclick="unLockLevel(' + heros[i][7] + ')"class="btn btn-warning">Unlock Level</button>';
                }
                html = html + '</div></div>'

            }
            html = html + '</div>'
            document.getElementById("userHero").innerHTML = html;
        }
        else {
            alert("Your metamask network is wrong!");
        }

    }

    async function fight(heroId) {
        const contract = new window.web3.eth.Contract(
                window.ABI,
                BNBHERO_CONTRACT_ADDRESS
            );
        p1 = window.web3.eth.abi.encodeParameter('uint256', heroId);
        p2 = window.web3.eth.abi.encodeParameter('uint256', 5);
        const txHash = await contract.methods
                .fight()
                .sendTransaction({from: window.userWalletAddress,
                    maxPriorityFeePerGas: null,
                    maxFeePerGas: null,
                    _attackingHero: p1,
                    enemyType: p2,

                });
        alert(txHash);
    }

    async function unLockLevel(heroId) {
        const contract = new window.web3.eth.Contract(
                window.ABI,
                BNBHERO_CONTRACT_ADDRESS
            );
        p1 = window.web3.eth.abi.encodeParameter('uint256', heroId);
        const txHash = await contract.methods
                .unLockLevel(p1)
                .sendTransaction({from: window.userWalletAddress,
                    maxPriorityFeePerGas: null,
                    maxFeePerGas: null,
                });
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
        {
            inputs:[
                {
                    internalType:"uint256",
                    name:"_attackingHero",
                    type:"uint256"
                },
                {
                    internalType:"uint256",
                    name:"enemyType",
                    type:"uint256"
                }
            ],
            name:"fight",
            outputs:[
            ],
            stateMutability:"nonpayable",
            type:"function"
        },
        {
            anonymous:false,
            inputs:[
                {
                    indexed:false,
                    internalType:"address",
                    name:"player",
                    type:"address"
                },
                {
                    indexed:false,
                    internalType:"uint256",
                    name:"_attackingHero",
                    type:"uint256"
                },
                {
                    indexed:false,
                    internalType:"uint256",
                    name:"enemyType",
                    type:"uint256"
                },
                {
                    indexed:false,
                    internalType:"uint256",
                    name:"rewards",
                    type:"uint256"
                },
                {
                    indexed:false,
                    internalType:"uint256",
                    name:"xpGained",
                    type:"uint256"
                },
                {
                    indexed:false,
                    internalType:"uint256",
                    name:"hpLoss",
                    type:"uint256"
                }
            ],
            name:"Fight",
            type:"event"
        },
        {
            inputs:[
                {
                    internalType:"uint256",
                    name:"_heroId",
                    type:"uint256"
                }
            ],
            name:"unLockLevel",
            outputs:[
            ],
            stateMutability:"nonpayable",
            type:"function"
        },
    ]
