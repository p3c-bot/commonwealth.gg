var p3cContract = web3.eth.contract(contracts.p3c.abi).at(contracts.p3c.address);

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function setMarketCap(usdPrice) {
  p3cContract.totalEthereumBalance.call(function (err, result) {
    if (!err) {
      amount = web3.fromWei(result).toFixed(1)
      $("#etcInContract").replaceWith(amount + " ETC")
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
    $('#tokenSellGet').text(sellPrice.toFixed(4) + ' ')
    $('#tokenUSDSellPrice').text('$' + Number((sellPrice * usdPrice).toFixed(4)))
  })
}
setSellPrice(0)

var buyPrice;
function setBuyPrice(usdPrice) {
  p3cContract.buyPrice(function (e, r) {
    buyPrice = web3.fromWei(r)
    $('#tokenBuyGet').text(buyPrice.toFixed(4) + ' ')
    $('#tokenUSDBuyPrice').text('$' + Number((buyPrice * usdPrice).toFixed(4)))
  })
}
setBuyPrice(0)

function setTokensPrice(usdPrice){
  value =  Number($('#myETCValue').text()) * usdPrice
  $('#myTokensValue').text('($' + numberWithCommas(value.toFixed(2)) + ')')
}

function setDividendsPrice(usdPrice){
  value =  Number($('#myCropDividends').text()) * usdPrice
  $('#myDividendsValue').text('($' + numberWithCommas(value.toFixed(2)) + ')')
  
}

function updateEtcPrice() {
  $.getJSON('https://min-api.cryptocompare.com/data/price?fsym=ETC&tsyms=USD', function (result) {
    var usd = result.USD
    usdPrice = parseFloat(usd)

    setBuyPrice(usdPrice)
    setSellPrice(usdPrice)
    setMarketCap(usdPrice)

    setTokensPrice(usdPrice)
    setDividendsPrice(usdPrice)
  })
}

setTimeout(function(){
  updateEtcPrice()
}, 1000);

// get the crop information initially and then every 2 seconds
getCropInfo(true)
setInterval(function(){
  getCropInfo(false)
}, 2000);

new ClipboardJS('.button');
$('.ui.primary.basic.button.copy').on('click', function (){
  alertify.success('Copied', 2)
})

$('#buyInput').on('input change', function () {
  var value = parseFloat($(this).val())
  if (value > 0) {
    buyAmount = (value / buyPrice).toFixed(2)
    $('#buyAmount').text("Approximately " + buyAmount + " P3C")
  } else {
    $('#buyAmount').hide()
  }
})

$('#sellInput').on('input change', function () {
  var value = parseFloat($(this).val())
  if (value > 0) {
    sellAmount = (value * sellPrice).toFixed(2)
    $('#sellAmount').text("Approximately " + sellAmount + " ETC")
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