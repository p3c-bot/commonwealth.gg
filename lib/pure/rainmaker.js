var rainMaker = web3.eth.contract(contracts.rainMaker.abi).at(contracts.rainMaker.address);
var divies = web3.eth.contract(contracts.divies.abi).at(contracts.divies.address);

rainMaker.myDividends.call(function (err, result) {
    divs = parseFloat(web3.fromWei(result.toNumber()))
    $("#rainMakerDividends").html(divs.toFixed(3));
});

rainMaker.myTokens.call(function (err, result) {
    tokens = parseFloat(web3.fromWei(result.toNumber())).toFixed(0)
    $("#rainMakerTokens").html(numberWithCommas(tokens));
});

$("#rainMaker").click(function () {
    rainMaker.reinvest.sendTransaction(
        // uses your account as ref address
        web3.eth.accounts[0], 
        {
            from: web3.eth.accounts[0],
            gasPrice: web3.toWei(1, 'gwei'),
            gas: 217570
        },
        function (error, result) {
            if (!error) {
                console.log(result);
                playSound('register');
                if (typeof gtag !== 'undefined'){gtag('event', 'Pure', {'event_label': 'Usage', 'event_category': 'Rainmaker'});};
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
        from: web3.eth.accounts[0],
        gasPrice: web3.toWei(1, 'gwei'),
        gas: 1320455
    }, function (error, result) {
        if (!error) {
            console.log(result);
            playSound('register');
            if (typeof gtag !== 'undefined'){gtag('event', 'Pure', {'event_label': 'Usage', 'event_category': 'Divies'});};
        } else {
            console.log(error);
        }
    })
})