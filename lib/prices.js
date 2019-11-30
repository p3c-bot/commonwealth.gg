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
    $('#tokenSellGet').text(sellPrice.toFixed(4) + ' ETC')
    $('#tokenUSDSellPrice').text('$' + Number((sellPrice * usdPrice).toFixed(2)))
  })
}
setSellPrice(0)

var buyPrice;
function setBuyPrice(usdPrice) {
  p3cContract.buyPrice(function (e, r) {
    buyPrice = web3.fromWei(r)
    $('#tokenBuyGet').text(buyPrice.toFixed(4) + ' ETC')
    $('#tokenUSDBuyPrice').text('$' + Number((buyPrice * usdPrice).toFixed(2)))
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

function updateEtcPrice(portfolio) {
  $.getJSON('https://min-api.cryptocompare.com/data/price?fsym=ETC&tsyms=USD', function (result) {
    if (result !== null){
      var usd = result.USD
      usdPrice = parseFloat(usd)
      setBuyPrice(usdPrice)
      setSellPrice(usdPrice)
      setMarketCap(usdPrice)

      setTokensPrice(usdPrice)
      setDividendsPrice(usdPrice)
      if (portfolio === true){
        setPortfolio(myCropAddress)
      }
    }
  })
}

// get the etc price after 1.5s, and then every 10s
setTimeout(function(){
  updateEtcPrice(true)
}, 1700);
setInterval(function(){
  updateEtcPrice(false)
}, 10000);

$('#buyInput').on('input change', function () {
  var value = parseFloat($(this).val())
  if (value > 0) {
    buyAmount = numberWithCommas((value / buyPrice).toFixed(1))
    $('#buyAmount').text("Approx. " + buyAmount + " Points")
  } else {
    $('#buyAmount').hide()
  }
})

$('#sellInput').on('input change', function () {
  var value = parseFloat($(this).val())
  if (value > 0) {
    sellAmount = numberWithCommas((value * sellPrice * usdPrice).toFixed(2))
    $('#sellAmount').text("Get: $" + sellAmount + " USD")
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