var p3cContract = web3.eth.contract(contracts.p3c.abi).at(contracts.p3c.address);

function setMarketCap(usdPrice) {
  p3cContract.totalEthereumBalance.call(function (err, result) {
    if (!err) {
      amount = web3.fromWei(result).toFixed(0)
      $("#etcInContract").replaceWith(numberWithCommas(amount) + " ETC")
      $('#etcInContractUSDPrice').text('($' + numberWithCommas(Number((amount * usdPrice).toFixed(0)))+ ')')

    }
  })
};
setMarketCap(0)

p3cContract.totalSupply.call(function (err, result) {
  if (!err) {
    $("#tokensInCirculation").replaceWith(numberWithCommas(web3.fromWei(result).toFixed(0)))
  }
});

var sellPrice;
function setSellPrice(usdPrice) {
  p3cContract.sellPrice(function (e, r) {
    sellPrice = web3.fromWei(r)
    $('#tokenSellGet').text(sellPrice.toFixed(3) + ' ETC')
    $('#tokenUSDSellPrice').text('$' + (sellPrice * usdPrice).toFixed(2))
  })
}
setSellPrice(0)

var buyPrice;
function setBuyPrice(usdPrice) {
  p3cContract.buyPrice(function (e, r) {
    buyPrice = web3.fromWei(r)
    // alert((buyPrice * usdPrice).toFixed(2))
    $('#tokenBuyGet').text(buyPrice.toFixed(3) + ' ETC')
    $('#tokenUSDBuyPrice').text('$' + (buyPrice * usdPrice).toFixed(2))
  })
}
setBuyPrice(0)


var myUSDValue = 0
function setTokensPrice(usdPrice){
  value =  Number(myETCValue) * usdPrice
  $('#myTokensValue').text('$' + numberWithCommas(value.toFixed(2)))
  myUSDValue = Number(value.toFixed(2))
}

var myDividendUSDValue = 0
function setDividendsPrice(usdPrice){
  value =  Number($('#myCropDividends').text()) * usdPrice
  $('#myDividendsValue').text('$' + value.toFixed(5))
  myDividendUSDValue = value.toFixed(5)
}

function updateEtcPrice() {
  $.getJSON('https://api.commonwealth.gg/chart/info', function (result) {
    if (result !== null){
      var usd = result.ETCPriceUSD
      usdPrice = parseFloat(usd)
      setBuyPrice(usdPrice)
      setSellPrice(usdPrice)
      setMarketCap(usdPrice)

      setTokensPrice(usdPrice)
      setDividendsPrice(usdPrice)
    }
  })
}

// get the etc price after 1.5s, and then every 10s
setTimeout(function(){
  updateEtcPrice()
}, 1000);
setInterval(function(){
  updateEtcPrice()
}, 2000);

$('#buyInput').on('input change', function () {
  var value = parseFloat($(this).val())
  if (value > 0) {
    buyAmount = numberWithCommas((value / buyPrice).toFixed(1))
    $('#buyAmount').text("Approx. " + buyAmount + " WLTH")
  } else {
    $('#buyAmount').hide()
  }
})

$('#sellInput').on('input change', function () {
  var value = parseFloat($(this).val())
  if (value > 0) {
    sellAmountUSD = numberWithCommas((value * sellPrice * usdPrice).toFixed(2))
    sellAmount = numberWithCommas((value * sellPrice).toFixed(2))
    $('#sellAmount').text("$" + sellAmountUSD + "/" + sellAmount + " ETC")
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