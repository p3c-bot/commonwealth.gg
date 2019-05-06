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
    setTimeout(function () {
        //checks if web3 is loaded, but not logged in on saturn
        if (web3.eth.accounts[0] === undefined) { 
            if (typeof gtag !== 'undefined'){gtag('event', 'Pure', {'event_label': 'Issue', 'event_category': 'SaturnLoggedOut'});};
            $("#loginLogo").attr("src", "img/areugood.png");
            $("#loginWarning").show();
            $("#agreement").hide();
            $('#loginLogo').transition({
                animation: 'flash',
                duration: '2s',
            });
        } else {
            alertify.success('Connected to P3C.')
        }
    }, 1000)
    myCropAddress = web3.eth.accounts[0]
    activateUI(myCropAddress)
}

function activateUI(cropAddress) {
    alertify.confirm().close();

    // Address and links 
    var myCropAddress = web3.toChecksumAddress(cropAddress)
    $("#copyAddressButton").attr("data-clipboard-text", myCropAddress);
    $("#myCropAddress").replaceWith("<b id='myCropAddress' class='cropAddress'>" + myCropAddress + "</b>")
    $("#masternodeLink").replaceWith('<a id="masternodeLink" href="/?ref=' + myCropAddress + '">https://p3c.io/index.html?ref=' + myCropAddress + '</a>')
    $("#copyMNButton").attr("data-clipboard-text", 'https://p3c.io/index.html?ref=' + myCropAddress);

    // Enable buttons
    $('#buy').prop("disabled", false);
    $('#sell').prop("disabled", false);
    $('#reinvest').prop("disabled", false);
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

var myCropDividends = 0;

function getMyCropDividends() {
    p3cContract.myDividends.call(
        true, 
        function (err, result) {
        if (!err) {
            change = (String(myCropDividends) !== String(result))
            myCropDividends = result;
            if (change) {
                $("#myCropDividends").replaceWith("<b id='myCropDividends'>" + web3.fromWei(myCropDividends).toFixed(8) + "</b>")
                $('#myCropDividends').transition({
                    animation: 'flash',
                    duration: '1s',
                });
            }
        }
    });
}

var myETCValue = 0

function getMyCropTokens() {
    p3cContract.myTokens.call(function (err, result) {
        if (!err) {
            change = (String(myCropTokens) !== String(result))
            myCropTokens = result;
            if (change) {
                $("#myCropTokens").replaceWith("<b id='myCropTokens'>" + numberWithCommas((web3.fromWei(myCropTokens)).toFixed(2)) + "</b>")
                p3cContract.sellPrice(function (e, r) {
                    let sellPrice = web3.fromWei(r)
                    myETCValue = (sellPrice * web3.fromWei(myCropTokens))
                    $('#myETCValue').text(numberWithCommas(myETCValue.toFixed(1)))
                })
                $('#myCropTokens').transition({
                    animation: 'flash',
                    duration: '1s',
                });
            }
        }
    });
}

getMyCrop(true)
function getCropInfo() {
    getMyCropTokens()
    getMyCropDividends()
}

// This buys P3C from the crop, but with you as the referrer
function buyFromCrop(amountToBuy, referrer) {
    amount = web3.toWei(amountToBuy)
    p3cContract.buy.sendTransaction(
        // your crop is the referrer
        referrer, {
            from: web3.eth.accounts[0],
            value: amount,
            gas: 123287,
            gasPrice: web3.toWei(1, 'gwei')
        },
        function (error, result) { //get callback from function which is your transaction key
            if (!error) {
                if (typeof gtag !== 'undefined'){gtag('event', 'Pure', {'event_label': 'Usage', 'event_category': 'BuyP3C', 'value': amountToBuy});};
                alertify.success(amountToBuy + " ETC spent. Waiting for Blockchain.")
                playSound('register');
            } else {
                console.log(error);
            }
        }
    )
}

// This buys P3C from the crop, but with you as the referrer
function sellFromCrop(amountToSell) {
    amount = web3.toWei(amountToSell)
    p3cContract.sell.sendTransaction(
        // you are the referer
        amount, 
        {
            from: web3.eth.accounts[0],
            gas: 123287,
            gasPrice: web3.toWei(1, 'gwei')
        },
        function (error, result) { //get callback from function which is your transaction key
            if (!error) {
                if (typeof gtag !== 'undefined'){gtag('event', 'Pure', {'event_label': 'Usage', 'event_category': 'SellP3C', 'value': amountToSell});};
                alertify.success(amountToSell + " P3C Sold. Waiting for Blockchain.")
                playSound('register');
                console.log(result);
            } else {
                console.log(error);
            }
        }
    )
}

function reinvestFromCrop(referrer) {
    p3cContract.reinvest.sendTransaction(
        {
            from: web3.eth.accounts[0],
            gas: 128000,
            gasPrice: web3.toWei(1, 'gwei')
        },
        function (error, result) { //get callback from function which is your transaction key
            if (!error) {
                if (typeof gtag !== 'undefined'){gtag('event', 'Pure', {'event_label': 'Usage', 'event_category': 'Reinvest'});};
                alertify.success("Reinvested P3C. Waiting for Blockchain.")
                playSound('register');
                console.log(result);
            } else {
                console.log(error);
            }
    })
}

function withdrawFromCrop() {
    p3cContract.withdraw.sendTransaction({
            from: web3.eth.accounts[0],
            gas: 120000,
            gasPrice: web3.toWei(1, 'gwei')
        },
        function (error, result) { //get callback from function which is your transaction key
            if (!error) {
                if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'Withdraw'});};
                alertify.success("Withdrawing dividends. Waiting for Blockchain.")
                console.log(result);
                playSound('register');
            } else {
                console.log(error);
            }
        }
    )
}


function transferFromCrop(destination, amountToTransfer) {
    amount = web3.toWei(amountToTransfer)
    p3cContract.transfer.sendTransaction(
        destination,
        amount, {
            from: web3.eth.accounts[0],
            gas: 150000,
            gasPrice: web3.toWei(1, 'gwei')
        },
        function (error, result) { //get callback from function which is your transaction key
            if (!error) {
                if (typeof gtag !== 'undefined'){gtag('event', 'Pure', {'event_label': 'Usage', 'event_category': 'Transfer'});};
                alertify.success("Transfering " + amountToTransfer + " P3C to " + destination.substring(0, 7) + "...")
                playSound('register');
                console.log(result);
            } else {
                console.log(error);
            }
        }
    )
}