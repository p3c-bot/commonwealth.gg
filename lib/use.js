$('#sponsor').load("https://api.p3c.io/sponsor/");

// if saturn isn't installed 
if (typeof web3 == 'undefined') {
    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Issue', 'event_category': 'NoWeb3'});};
    displayError(
        `
        <div class="custom-computer only">To Use, Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://www.youtube.com/watch?v=tBbl_nbp8_k&feature=youtu.be">ETC Wallet</a></div>
        <div class="mobile only">To Use, Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://www.youtube.com/watch?v=PuQBHfKVF2I&feature=youtu.be">ETC Wallet</a></div>
        `
    )
}

getNetworkId(web3).then(function (res) {
    if (res !== "61") {
        if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Issue', 'event_category': 'EthereumWeb3'});};        
        displayError(
            `
            <div class="custom-computer only">To Use, Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://www.youtube.com/watch?v=tBbl_nbp8_k&feature=youtu.be">ETC Wallet</a></div>
            <div class="mobile only">To Use, Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://www.youtube.com/watch?v=PuQBHfKVF2I&feature=youtu.be">ETC Wallet</a></div>
            `
        )
    } else {
        // get the crop information initially and then every 2 seconds
        getCropInfo(true)
        setInterval(function () {
            getCropInfo(false)
        }, 2000);
    }
})

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
    if (web3.isAddress(destination) != true){
        displayError('Invalid Address')
    }
    if (amountToTransfer > parseInt(web3.fromWei(myCropTokens))){
        displayError('Not enough tokens.')
    } else {
        transferFromCrop(destination, amountToTransfer)
    }
})

$('#infoButton')
    .popup({
        content: "Allow bots to compound your prosperity in exchange for a referral bonus. This enables faster compounding, you can manually reinvest or withdraw at any time.",
        position: 'top center'
    });

$('#refillButton')
    .popup({
        content: "Use Coinbase Commerce to exchange other crypto for P3C. Generally takes 10 minutes to arrive after payment. Post in Discord if any issues.",
        position: 'bottom center'
    });

$('#transfer')
    .popup({
        content: "Send P3C to another crop. Make sure destination user has created a crop.",
        position: 'bottom center'
    });

$('#reinvest')
    .popup({
        content: "Use prosperity you have earned to get more P3C. Compound your growth.",
        position: 'bottom center'
    });

$('#withdraw')
    .popup({
        content: "Withdraws your prosperity directly as ETC. This can be traded or spent immediately.",
        position: 'bottom center'
    });

$('#portfolioButton').hide();

$( "#refillButton" ).click(function() {
    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'RefillLinkClick'});};
});

$( "#buyWithCoinbase" ).click(function() {
    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'BuyWithCoinbase'});};
});

function setPortfolio(cropAddress) {
    $.getJSON("https://api.p3c.io/price/crop/" + web3.toChecksumAddress(cropAddress), function (data) {
        if (data !== null){
            // (New Number - Original Number) ÷ Original Number × 100.
            $('#portfolioButton').show();
            performance = `
            My holdings:
            <br>
            <b>Change 1 Day</b>: {usd1}
            <br>
            <b>Change 7 Days</b>: {usd7}
            <br>
            <b>Change 30 Days</b>: {usd30}
            <br>
            <span class="ui text small eleven converted">Past growth is no guarantee of future results.</span>
            `
            $.each(data, function (key, val) {
                if (key.includes('usd')) {
                    change = (((myUSDValue - val) / val) * 100).toFixed(0)
                } else {
                    change = (((myETCValue - val) / val) * 100).toFixed(1)
                    change = String(change).replace('0.', '.')
                }
                color = (change >= 0) ? "green" : "red"
                performance = performance.replace('{' + key + '}', '<span class="' + color + '">' + change + '%</span>')
            });
            $('#portfolioButton').popup({
                html: performance,
                position: 'right center'
            });
        }
    });
}

function copyAddress() {
    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'CopyAddress'});};
    /* Get the text field */
    var copyText = document.getElementById("myCropAddress");

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("copy");
}