disableUI()

var farmContract = web3.eth.contract(contracts.farm.abi).at(contracts.farm.address);
var p3cContract = web3.eth.contract(contracts.p3c.abi).at(contracts.p3c.address);
var cropAbi = web3.eth.contract(contracts.crop.abi)

var myCropAddress;
var myCropTokens;
var myCropDividends;
var myCropDisabled;

alertify.defaults.notifier.delay = 45

function getMyCrop(onboard) {
    var myCropAddress = localStorage.getItem(web3.eth.accounts[0])
    // if we don't have the crop in local storage
    if (myCropAddress === null) {
        farmContract.myCrop.call(function (err, result) {
            // if onboard is true and we don't have a crop address already.
            if (onboard && (err || (result == '0x0000000000000000000000000000000000000000'))) {
                setTimeout(function (){
                    alertify.confirm(
                    'Welcome to P3C!',
                    `
                    <p class="agreement">
                    P3C is a smart contract. Read it <a target="_blank" href="https://etherhub.io/addr/0xde6fb6a5adbe6415cdaf143f8d90eb01883e42ac#tab_addr_3">here</a>. By agreeing, you accept that the smart contract will run exactly as written, and that there is <b>no guarantee</b> of profit.
                    To accept you need <a target="_blank" href="https://chrome.google.com/webstore/detail/saturn-wallet/nkddgncdjgjfcddamfgcmfnlhccnimig">Ethereum Classic Wallet</a> with ETC in it.
                    </p>
                    <img src="img/etc-logo.png" class="ui image etc-logo" />
                    `,
                    //if ok deploy the crop
                    function () {
                        alertify.success("Please approve the transaction from your wallet to get started.")
                        deployCrop(0, '0x0000000000000000000000000000000000000000', false)
                    },
                    // if cancel disable everything
                    function () {
                        alertify.defaults.notifier.delay = 10000
                        alertify.error('P3C View Mode. Please accept agreement.')
                    }).set({
                        labels: {
                            ok: 'Accept',
                            cancel: 'Decline'
                        }
                    });
                // delay the onboarding modal by 1 second
                }, 1300)
            } else {
                // if we have already made an account but, it just failed to load.
                myCropAddress = result;
                if (result !== '0x0000000000000000000000000000000000000000') {
                    alertify.success('Connected to P3C')
                    localStorage.setItem(web3.eth.accounts[0], result)
                    activateUI(result)
                }
            }
        });
    } else {
        activateUI(myCropAddress)
    }
}

function activateUI(myCropAddress) {
    alertify.confirm().close();

    // Address and links 
    $( "#copyAddressButton" ).attr( "data-clipboard-text", myCropAddress );
    $("#myCropAddress").replaceWith("<b id='myCropAddress'>" + myCropAddress + "</b>")
    $("#masternodeLink").replaceWith('<a id="masternodeLink" href="/?ref=' + myCropAddress + '">https://p3c.io/index.html?ref=' + myCropAddress + '</a>')
    $( "#copyMNButton" ).attr( "data-clipboard-text", 'https://p3c.io/index.html?ref=' + myCropAddress  );
    
    // Disable buttons
    $('#buy').prop("disabled", false);
    $('#sell').prop("disabled", false);
    $('#reinvest').prop("disabled", false);
    $('#withdraw').prop("disabled", false);
    $('#transfer').prop("disabled", false);

    // Hide if on transition page
    $("#plant-new").hide()

}

function disableUI() {
    $('#buy').prop("disabled", true);
    $('#sell').prop("disabled", true);
    $('#reinvest').prop("disabled", true);
    $('#withdraw').prop("disabled", true);
    $('#transfer').prop("disabled", true);
}


function getMyCropDividends() {
    farmContract.myCropDividends.call(function (err, result) {
        if (!err) {
            change = (String(myCropDividends) !== String(result))
            myCropDividends = result;
            if (change) {
                $("#myCropDividends").replaceWith("<b id='myCropDividends'>" + web3.fromWei(myCropDividends).toFixed(13) + "</b>")
                $('#myCropDividends').transition({
                    animation: 'flash',
                    duration: '1s',
                });
            }
        }
    });
}

function getMyCropTokens() {
    farmContract.myCropTokens.call(function (err, result) {
        if (!err) {
            change = (String(myCropTokens) !== String(result))
            myCropTokens = result;
            if (change) {
                $("#myCropTokens").replaceWith("<b id='myCropTokens'>" + (web3.fromWei(myCropTokens) * .9999).toFixed(3) + "</b>")
                p3cContract.sellPrice(function (e, r) {
                    let sellPrice = web3.fromWei(r)
                    $('#myETCValue').text((sellPrice * web3.fromWei(myCropTokens)).toFixed(4))
                })
                $('#myCropTokens').transition({
                    animation: 'flash',
                    duration: '1s',
                });
            }

        }
    });
}

function getMyCropDisabled() {
    farmContract.myCropDisabled.call(function (err, result) {
        if (!err) {
            myCropDisabled = result;
            if (myCropDisabled == false) {
                $('#autoReinvest').checkbox('set checked');
            } else {
                $('#autoReinvest').checkbox('set unchecked');
            }
        }
    })
}

function getCropInfo(onboard) {
    getMyCrop(onboard)
    getMyCropTokens()
    getMyCropDividends()
    getMyCropDisabled()
}

function deployCrop(amountToBuy, referrer, selfBuy) {
    amount = web3.toWei(amountToBuy)
    farmContract.createCrop.sendTransaction(
        referrer,
        selfBuy,
        {
            from: web3.eth.accounts[0],
            value: amount,
            gas: 964521
        },
        function (error, result) { //get callback from function which is your transaction key
            if (!error) {
                alertify.success("Welcome to P3C! Please wait 30 seconds for your account to be created.")
                console.log(result);
            } else {
                alertify.error("New account declined. View mode.")
                console.log(error);
            }
        })
}

function transferAllP3CToCrop() {
    farmContract.myCrop.call(function (err, cropAddress) {
        alert('This is my crop ' + cropAddress)
        p3cContract.myTokens.call(function (err, myTokens) {
            tokens = myTokens.toNumber()
            alert('Move this many tokens' + web3.fromWei(tokens))
            p3cContract.transfer.sendTransaction(
                cropAddress,
                tokens, {
                    from: web3.eth.accounts[0],
                },
                function (error, result) { //get callback from function which is your transaction key
                    if (!error) {
                        console.log(result);
                    } else {
                        console.log(error);
                    }
                })
        });
    })
}

function autoReinvestDisableToggle(state) {
    farmContract.myCrop.call(function (err, cropAddress) {
        cropAbi.at(cropAddress).disable.sendTransaction(
            // you are the referer
            state, {
                from: web3.eth.accounts[0],
            },
            function (error, result) { //get callback from function which is your transaction key
                if (!error) {
                    console.log(result);
                    alertify.success("Auto-Reinvest: " + state)

                } else {
                    console.log(error);
                }
            })
    })
}
$('#autoReinvest').checkbox({
    onChecked: function () {
        autoReinvestDisableToggle(false)
    },
    onUnchecked: function () {
        autoReinvestDisableToggle(true)
    }
})

// This buys P3C from the crop, but with you as the referrer
function buyFromCrop(amountToBuy, referrer) {
    farmContract.myCrop.call(function (err, cropAddress) {
        amount = web3.toWei(amountToBuy)
        cropAbi.at(cropAddress).buy.sendTransaction(
            // your crop is the referrer
            referrer, {
                from: web3.eth.accounts[0],
                value: amount,
                gas: 120561
            },
            function (error, result) { //get callback from function which is your transaction key
                if (!error) {
                    alertify.success("P3C Purchased. Waiting for Blockchain.")
                    console.log(result);
                } else {
                    console.log(error);
                }
            })
    })
}

// This buys P3C from the crop, but with you as the referrer
function sellFromCrop(amountToSell) {
    farmContract.myCrop.call(function (err, cropAddress) {
        amount = web3.toWei(amountToSell)
        cropAbi.at(cropAddress).sell.sendTransaction(
            // you are the referer
            amount, {
                from: web3.eth.accounts[0],
                gas: 98012
            },
            function (error, result) { //get callback from function which is your transaction key
                if (!error) {
                    alertify.success(amountToSell + " P3C Sold. Waiting for Blockchain.")
                    console.log(result);
                } else {
                    console.log(error);
                }
            })
    })
}

function reinvestFromCrop(referrer) {
    farmContract.myCrop.call(function (err, cropAddress) {
        cropAbi.at(cropAddress).reinvest.sendTransaction(
            referrer, {
                from: web3.eth.accounts[0],
            },
            function (error, result) { //get callback from function which is your transaction key
                if (!error) {
                    alertify.success("Reinvested P3C. Waiting for Blockchain.")
                    console.log(result);
                } else {
                    console.log(error);
                }
            })
    })
}

function withdrawFromCrop() {
    farmContract.myCrop.call(function (err, cropAddress) {
        cropAbi.at(cropAddress).withdraw.sendTransaction({
                from: web3.eth.accounts[0],
            },
            function (error, result) { //get callback from function which is your transaction key
                if (!error) {
                    alertify.success("Withdrawing Dividends. Waiting for Blockchain.")
                    console.log(result);
                } else {
                    console.log(error);
                }
            })
    })
}

function transferFromCrop(destination, amountToTransfer) {
    amount = web3.toWei(amountToTransfer)
    farmContract.myCrop.call(function (err, cropAddress) {
        cropAbi.at(cropAddress).transfer.sendTransaction(
            destination,
            amount, {
                from: web3.eth.accounts[0],
            },
            function (error, result) { //get callback from function which is your transaction key
                if (!error) {
                    alertify.success("Transfering " + amountToTransfer + " P3C to " + destination.substring(0, 7) + "...")
                    console.log(result);
                } else {
                    console.log(error);
                }
            })
    })

}