disableUI()

var farmContract = web3.eth.contract(contracts.farm.abi).at(contracts.farm.address);
var p3cContract = web3.eth.contract(contracts.p3c.abi).at(contracts.p3c.address);
var cropAbi = web3.eth.contract(contracts.crop.abi)

var myCropAddress;
var myCropTokens;
var myCropDividends;
var myCropDisabled;

var getETCWallet = false;

alertify.defaults.notifier.delay = 45

function getMyCrop(onboard) {
    myCropAddress = localStorage.getItem(web3.eth.accounts[0])
    // if we don't have the crop in local storage
    if (myCropAddress == 'null' || myCropAddress == null || myCropAddress == "0x") {
        farmContract.myCrop.call(function (err, result) {
            // if onboard is true and we don't have a crop address already.
            if (onboard == true && (result == '0x0000000000000000000000000000000000000000')) {
                setTimeout(function () {
                    alertify.confirm(
                        'Welcome to Commonwealth.gg!',
                        `
                        <h1 id="loginWarning" class="login-warning">Login to Saturn wallet, and refresh!</h1>
                        <p id="agreement" class="agreement">
                        Commonwealth is an Ethereum Classic app. Read it <a target="_blank" href="https://blockscout.com/etc/mainnet/address/0xde6fb6a5adbe6415cdaf143f8d90eb01883e42ac/contracts">here</a>. By continuing, you accept that the code will run as written, without guarantee of profit.
                        To begin, click "Accept" and complete the transaction.
                        </p>
                        <img id="loginLogo" src="img/logo/etc-title.jpg" class="ui image etc-logo center-larger" />
                        `,
                        //if ok deploy the crop
                        function () {
                            if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'NewFarmAgree'});};
                            deployCrop(0, '0x0000000000000000000000000000000000000000', false)
                        },
                        // if cancel disable everything
                        function () {
                            if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'NewFarmDisagree'});};
                            alertify.defaults.notifier.delay = 10000
                            alertify.error('<h3>View Mode.</h3>')
                    }).set({
                        labels: {
                            ok: 'Accept',
                            cancel: 'Cancel'
                        }
                    });
                    //checks if web3 is loaded, but not logged in on saturn
                    if (web3.eth.accounts[0] === undefined) { 
                        if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Issue', 'event_category': 'SaturnLoggedOut'});};
                        $("#loginLogo").attr("src", "img/wallet/saturn-login.png");
                        $("#loginWarning").show();
                        $("#agreement").hide();
                        $('#loginLogo').transition({
                            animation: 'flash',
                            duration: '2s',
                        });
                    }
                }, 1000)
            } else {
                // if we have already made an account but, it just failed to load.
                if (result !== '0x0000000000000000000000000000000000000000') {
                    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'RemoteFarmConnect'});};
                    myCropAddress = result;
                    if (getETCWallet == false){
                        alertify.success('<h3>Turn on ETC Mode</h3>')
                        getETCWallet = true;
                    }
                    localStorage.setItem(web3.eth.accounts[0], result)
                    activateUI(result)
                }
            }
        });
    } else {
        if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'LocalFarmConnect'});};
        activateUI(myCropAddress)
    }
}

function activateUI(cropAddress) {
    alertify.confirm().close();

    // Address and links 
    var myCropAddress = web3.toChecksumAddress(cropAddress)
    $("#copyAddressButton").attr("data-clipboard-text", myCropAddress);
    $("#myCropAddress").replaceWith("<b id='myCropAddress' class='cropAddress'>" + myCropAddress + "</b>")

    // This is where MN link is defined.
    $("#masternodeLink").replaceWith('<a id="masternodeLink" href="/?ref=' + myCropAddress + '"https://commonwealth.gg/index.html?ref=' + myCropAddress + '</a>')
    // This definnes the clipboard button event for the referral link
    $("#copyMNButton").attr("data-clipboard-text", 'https://commonwealth.gg/index.html?ref=' + myCropAddress);

    // Enable buttons
    $('#buy').prop("disabled", false);
    $('#sell').prop("disabled", false);
    $('#withdraw').prop("disabled", false);
    $('#transfer').prop("disabled", false);
    $('#warning').hide();
}

function disableUI() {
    $('#buy').prop("disabled", true);
    $('#sell').prop("disabled", true);
    $('#reinvest').prop("disabled", true);
    $('#withdraw').prop("disabled", true);
    $('#transfer').prop("disabled", true);
}


function getMyCropDividends() {
    farmContract.myCrop.call(function (err, cropAddress) {
        crop = (cropAbi.at(cropAddress))
        crop.cropDividends.call(true, function (err, result) {
            if (!err) {
                change = (String(myCropDividends) !== String(result))
                myCropDividends = result;
                myCropDividendsPoints = (web3.fromWei(myCropDividends) / buyPrice)
                if (change) {
                    $("#myCropDividendsPoints").replaceWith("<b id='myCropDividendsPoints'>" + myCropDividendsPoints.toFixed(2) + " </b>")
                    $("#myCropDividends").replaceWith("<b id='myCropDividends'>" + web3.fromWei(myCropDividends).toFixed(8) + "</b>")
                    $('#myCropDividends').transition({
                        animation: 'flash',
                        duration: '1s',
                    });
                    $('#myCropDividendsPoints').transition({
                        animation: 'flash',
                        duration: '1s',
                    });
                }
                crop.cropDividends.call(false, function (err, result) {
                    if (!err) {
                        myRefDividends = myCropDividends - result;
                        if (!Number(myRefDividends)){
                            // $("#refDivs").hide();
                            $("#myRefDividends").replaceWith("<b id='myRefDividends'>" + "0 ETC" + "</b>")
                        } else {
                            if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'ReferralDividendsUp'});};
                            $("#myRefDividends").replaceWith("<b id='myRefDividends'>" + Number(web3.fromWei(myRefDividends)).toFixed(8) + " ETC</b>")
                        }
                    }
                });
            }
        });
    })
}

var myETCValue = 0

function getMyCropTokens() {
    farmContract.myCropTokens.call(function (err, result) {
        if (!err) {
            change = (String(myCropTokens) !== String(result))
            myCropTokens = result;
            if (change) {
                $("#myCropTokens").replaceWith("<b id='myCropTokens'>" + numberWithCommas((web3.fromWei(myCropTokens)).toFixed(2)) + "</b>")
                p3cContract.buyPrice(function (e, r) {
                    let buyPrice = web3.fromWei(r)
                    myETCValue = (buyPrice * web3.fromWei(myCropTokens))
                    $('#myETCValue').text(numberWithCommas(myETCValue.toFixed(2)))
                })
                $('#myCropTokens').transition({
                    animation: 'flash',
                    duration: '1s',
                });
                $('#myETCValue').transition({
                    animation: 'flash',
                    duration: '1s',
                });
            }
            p3cContract.totalSupply(function(e, r){
                percentOwned = (myCropTokens / r) * 100 
                if (percentOwned > .05){
                    $("#supplyControlled").text(" | " + percentOwned.toFixed(2) + "% of Supply")
                }
            })


        }
    });
}

function getMyCropDisabled() {
    farmContract.myCropDisabled.call(function (err, result) {
        if (!err) {
            myCropDisabled = result;
            if (myCropDisabled == false) {
                $('#autoReinvest').checkbox('set checked');
                $('#reinvest').prop("disabled", false);
            } else {
                $('#autoReinvest').checkbox('set unchecked');
            }
        }
    })
}

function getCropInfo(onboard) {
    getMyCrop(onboard)

    setTimeout(function(){ 
        getMyCropTokens()
        getMyCropDisabled()
        getMyCropDividends()
     }, 300);

}

function deployCrop(amountToBuy, referrer, selfBuy) {
    amount = web3.toWei(amountToBuy)
    farmContract.createCrop.sendTransaction(
        referrer,
        selfBuy, {
            from: web3.eth.accounts[0],
            value: amount,
            gas: 1200011,
            gasPrice: web3.toWei(1, 'gwei')
        },
        function (error, result) { //get callback from function which is your transaction key
            if (!error) {
                if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'NewFarmDeploy'});};
                alertify.success("Welcome to Commonwealth! Please wait 30 seconds for your crop to be created.")
                // playSound('register');
            } else {
                alertify.error("New account declined. View mode.")
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
                    gas: 1200011,
                    gasPrice: web3.toWei(1, 'gwei')
                },
                function (error, result) { //get callback from function which is your transaction key
                    if (!error) {
                        console.log(result);
                        // playSound('register');
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
                gas: 99987,
                gasPrice: web3.toWei(1, 'gwei')
            },
            function (error, result) { //get callback from function which is your transaction key
                if (!error) {
                    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'AutoInvestToggle'});};
                    alertify.success("Auto-Reinvest turned to " + !(state))
                    // playSound('register');
                    $('#reinvest').prop("disabled", true);
                } else {
                    console.log(error);
                }
            })
    })
}
$('#autoReinvest').checkbox({
    onChecked: function () {
        autoReinvestDisableToggle(false)
        $('#reinvest').prop("disabled", true);
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
                gas: 223287,
                gasPrice: web3.toWei(1, 'gwei')
            },
            function (error, result) { //get callback from function which is your transaction key
                if (!error) {
                    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'BuyP3C', 'value': Number(amountToBuy)});};
                    alertify.success('<h3>' + amountToBuy + " ETC spent. Waiting for Blockchain.</h3>")
                    // playSound('register');
                    $("#buy").transition({
                        animation: 'tada',
                        duration: '1s',
                    });
                    $('#buyAmount').hide();
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
                gas: 223287,
                gasPrice: web3.toWei(1, 'gwei')
            },
            function (error, result) { //get callback from function which is your transaction key
                if (!error) {
                    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'SellP3C', 'value': amountToSell});};
                    alertify.success('<h3>' + amountToSell + " Points Sold. Funds are sent to wallet as ETC.</h3>")
                    // playSound('register');
                    $('#sellAmount').hide();
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
                gas: 233287,
                gasPrice: web3.toWei(1, 'gwei')
            },
            function (error, result) { //get callback from function which is your transaction key
                if (!error) {
                    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'Reinvest'});};
                    alertify.success("<h3>Compounded Points. Waiting for Blockchain.</h3>")
                    // playSound('register');
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
                gas: 298287,
                gasPrice: web3.toWei(1, 'gwei')
            },
            function (error, result) { //get callback from function which is your transaction key
                if (!error) {
                    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'Withdraw'});};
                    alertify.success("<h3>Withdrawing dividends to your ETC wallet.</h3>")
                    console.log(result);
                    // playSound('register');
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
                gas: 250623,
                gasPrice: web3.toWei(1, 'gwei')
            },
            function (error, result) { //get callback from function which is your transaction key
                if (!error) {
                    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'Transfer'});};
                    alertify.success("<h3>Transfering " + amountToTransfer + " Points to " + destination.substring(0, 7) + "...</h3>")
                    // playSound('register');
                    console.log(result);
                } else {
                    console.log(error);
                }
            })
    })
}