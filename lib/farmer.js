var rainMaker = web3.eth.contract(contracts.rainMaker.abi).at(contracts.rainMaker.address);
var divies = web3.eth.contract(contracts.divies.abi).at(contracts.divies.address);
var p3cContract = web3.eth.contract(contracts.p3c.abi).at(contracts.p3c.address);

p3cContract.totalEthereumBalance.call(function (err, result) {
    if (!err) {
        amount = web3.fromWei(result).toFixed(1)
        $("#etcInContract").replaceWith(amount + " ETC")

    }
})


p3cContract.totalSupply.call(function (err, result) {
    if (!err) {
        $("#tokensInCirculation").replaceWith(web3.fromWei(result).toFixed(0))
    }
});

p3cContract.totalEthereumBalance.call(function (err, result) {
    if (!err) {
        amount = web3.fromWei(result).toFixed(1)
        $("#etcInContract").replaceWith(amount + " ETC")

    }
})

p3cContract.myTokens.call(
    function (err, result) {
        if (!err) {
            amount = web3.fromWei(result).toFixed()
            $("#myTokens").replaceWith(amount)
        }
    }
)



p3cContract.myDividends.call(
    true,
    function (err, result) {
        if (!err) {
            amount = web3.fromWei(result).toFixed()
            $("#myDividends").replaceWith(amount)
        }
    }
)

rainMaker.myDividends.call(function (err, result) {
    divs = parseFloat(web3.fromWei(result.toNumber()))
    $("#rainMakerDividends").html(divs.toFixed(3));
});

rainMaker.myTokens.call(function (err, result) {
    tokens = parseFloat(web3.fromWei(result.toNumber()))
    $("#rainMakerTokens").html(tokens.toFixed(1));
});


$("#makeItRain").click(function () {
    rainMaker.reinvest.sendTransaction(
        web3.eth.accounts[0], {
            from: web3.eth.accounts[0],
            gas: 1000000
        },
        function (error, result) { //get callback from function which is your transaction key
            if (!error) {
                console.log(result);
            } else {
                console.log(error);
            }
        })
})


divies.balances.call(function (err, result) {
    balance = parseFloat(web3.fromWei(result.toNumber()))
    $("#diviesBalance").html(balance.toFixed(3));
});

$("#distribute").click(function () {
    divies.distribute.sendTransaction({
        from: web3.eth.accounts[0]
    }, function (error, result) { //get callback from function which is your transaction key
        if (!error) {
            console.log(result);
        } else {
            console.log(error);
        }
    })
})


$('.selector').qtip({
    style: {
        classes: 'qtip'
    }
});

$('#makeItRain').qtip({ // Grab some elements to apply the tooltip to
    content: {
        text: 'Cause the RainMaker to use its dividends to purchase tokens and distribute gains to all players!'
    }
})

$('#rainMaker').qtip({ // Grab some elements to apply the tooltip to
    content: {
        text: 'The amount of dividends the RainMaker contract currently holds. It can only ever reinvest them!'
    }
})


$('#distribute').qtip({ // Grab some elements to apply the tooltip to
    content: {
        text: 'Distribute global dividends to P3C. This is shared with all holders proportionally.'
    }
})

$('#divies').qtip({ // Grab some elements to apply the tooltip to
    content: {
        text: 'The amount of global dividends currently awating distribution.'
    }
})