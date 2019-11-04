disableUI()

var farmContract = web3.eth.contract(contracts.farm.abi).at(contracts.farm.address);
var p3cContract = web3.eth.contract(contracts.p3c.abi).at(contracts.p3c.address);
var cropAbi = web3.eth.contract(contracts.crop.abi)

var myCropAddress;
var myCropTokens;
var myCropDividends;
var myCropDisabled;


function getMyCrop() {
    setTimeout(function () {
        //checks if web3 is loaded, but not logged in on saturn
        if (web3.eth.accounts[0] === undefined) { 
            alertify.error('Not connected to P3C.')
        } else {
            alertify.success('Connected to P3C.')
        }
    }, 1000)
    myCropAddress = web3.toChecksumAddress(web3.eth.accounts[0])
    activateUI(myCropAddress)
}

function activateUI(cropAddress) {
    alertify.confirm().close();

    // Address and links 
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
            if (Number(myCropDividends) == 0){
                $("#myCropDividends").replaceWith("<b id='myCropDividends'>" + "0" + "</b>")
            }
            if (change) {
                amount = web3.fromWei(myCropDividends).toFixed(8)
                $("#myCropDividends").replaceWith("<b id='myCropDividends'>" + amount  + "</b>")
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

getMyCrop()
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
                alertify.success(amountToBuy + " ETC spent. Waiting for Blockchain.")
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
                alertify.success(amountToSell + " P3C Sold. Waiting for Blockchain.")
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
                alertify.success("Reinvested P3C. Waiting for Blockchain.")
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
                alertify.success("Withdrawing dividends to your ETC wallet.")
                console.log(result);
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
                alertify.success("Transferring " + amountToTransfer + " P3C to " + destination.substring(0, 7) + "...")
                console.log(result);
            } else {
                console.log(error);
            }
        }
    )
}