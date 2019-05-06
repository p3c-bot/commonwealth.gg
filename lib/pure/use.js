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
        getCropInfo()
        setInterval(function () {
            getCropInfo()
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
        content: "Allow bots to replay your dividends in exchange for a referral bonus. This enables faster compounding. You can manually withdraw at any time, but this must be on to use replay.",
        position: 'top center'
    });

$('#portfolioButton').hide();

$( "#refillButton" ).click(function() {
    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'RefillLinkClick'});};
});

$( "#buyWithCoinbase" ).click(function() {
    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'BuyWithCoinbase'});};
});

function setPortfolio(cropAddress) {
    return
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