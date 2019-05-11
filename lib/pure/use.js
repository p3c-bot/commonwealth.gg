// if saturn isn't installed 
if (typeof web3 == 'undefined') {
    displayError(
        `
        <div class="custom-computer only">To Use, Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://www.youtube.com/watch?v=tBbl_nbp8_k&feature=youtu.be">ETC Wallet</a></div>
        <div class="mobile only">To Use, Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://www.youtube.com/watch?v=PuQBHfKVF2I&feature=youtu.be">ETC Wallet</a></div>
        `
    )
} else {
    getCropInfo()
    getRainMakerInfo()
    setInterval(function () {
        getCropInfo()
        getRainMakerInfo()
    }, 2000);
}


masternode = localStorage.getItem("ref")
if (masternode == null) {
    masternode = "0x0000000000000000000000000000000000000000";
}

$("#buy").click(function () {
    amountToBuy = $("#buyInput").val()
    buyFromCrop(amountToBuy, masternode)
})

$("#sell").click(function () {
    amountToSell = $("#sellInput").val()
    sellFromCrop(amountToSell)
})

$("#reinvest").click(function () {
    reinvestFromCrop(masternode)
})

$("#withdraw").click(function () {
    withdrawFromCrop()
})

$("#transfer").click(function () {
    destination = $("#transferAddress").val()
    amountToTransfer = $("#transferTokenCount").val()
    if (web3.isAddress(destination) != true) {
        displayError('Invalid Address')
    }
    if (amountToTransfer > parseInt(web3.fromWei(myCropTokens))) {
        displayError('Not enough tokens.')
    } else {
        transferFromCrop(destination, amountToTransfer)
    }
})

$('#buyInput').on('input change', function () {
    var value = parseFloat($(this).val())
    if (value > 0) {
        buyAmount = numberWithCommas((value / buyPrice).toFixed(1))
        $('#buyAmount').text("Approx. " + buyAmount + " P3C")
    } else {
        $('#buyAmount').hide()
    }
})

$('#sellInput').on('input change', function () {
    var value = parseFloat($(this).val())
    if (value > 0) {
        sellAmount = numberWithCommas((value * sellPrice).toFixed(2))
        $('#sellAmount').text("Approx. " + sellAmount + " ETC")
    } else {
        $('#sellAmount').hide()
    }
})

$('#buyAmount').hide();
$('#sellAmount').hide();

$('#buyInput').on('keyup change', function () {
    if (this.value.length > 0) {
        $('#buyAmount').show();
    }
});

$('#sellInput').on('keyup change', function () {
    if (this.value.length > 0) {
        $('#sellAmount').show();
    }
});

// TODO Fix this 
var amount;
function setMarketCap(){
    p3cContract.totalEthereumBalance.call(function (err, result) {
        if (!err) {
            amount = web3.fromWei(result).toFixed(0)
            $("#etcInContract").text(numberWithCommas(amount) + " ETC")
        }
    })
}

var sellPrice;
function setSellPrice() {
    p3cContract.sellPrice(function (e, r) {
        sellPrice = web3.fromWei(r)
        $('#tokenSellGet').text(sellPrice.toFixed(4) + ' ETC')
    })
}
setSellPrice()

var buyPrice;
function setBuyPrice() {
    p3cContract.buyPrice(function (e, r) {
        buyPrice = web3.fromWei(r)
        $('#tokenBuyGet').text(buyPrice.toFixed(4) + ' ETC')
    })
}
setBuyPrice()

function copyAddress() {
    var copyText = document.getElementById("myCropAddress");
    copyText.select();
    document.execCommand("copy");
}