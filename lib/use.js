$('#sponsor').load("https://api.p3c.io/sponsor/");

// if saturn isn't installed 
if (typeof web3 == 'undefined') {
    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Issue', 'event_category': 'NoWeb3'});};
    setTimeout(function () {
        alertify.confirm(
            'Welcome to P3C!',
            `
            <h3 class="custom-computer only alert-text">To use P3C, install <a target="_blank" href="https://chrome.google.com/webstore/detail/saturn-wallet/nkddgncdjgjfcddamfgcmfnlhccnimig">Saturn wallet</a> and follow along.</h3>
            <h3 class="mobile only alert-text">Mobile is still in beta. Follow Tutorial <a target="_blank" href="https://forum.saturn.network/t/how-to-setup-an-ethereum-classic-wallet-on-a-mobile-phone-using-trust-wallet/2593">here</a> or Connect from a Computer.</h3>
            
            <img id="loginLogo" src="img/diamond.gif" class="ui image etc-logo center-larger mobile only" />
            <div class="custom-computer only"><iframe width="520" height="352" src="https://www.youtube-nocookie.com/embed/tBbl_nbp8_k" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
            `,
            function () {},
            function () {});
    }, 1000)
    displayError(
        `
        <div class="custom-computer only">To Use, Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://chrome.google.com/webstore/detail/saturn-wallet/nkddgncdjgjfcddamfgcmfnlhccnimig">ETC Wallet</a></div>
        <div class="mobile only">To Use, Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://forum.saturn.network/t/how-to-setup-an-ethereum-classic-wallet-on-a-mobile-phone-using-trust-wallet/2593">ETC Wallet</a> or </div><a href="https://commerce.coinbase.com/checkout/80e5f38c-8210-416e-b73f-e1c84a2833cb" target="_blank" style="color: white; text-decoration: underline;">Buy</a> with BTC or ETH.
        `
    )
}

getNetworkId(web3).then(function (res) {
    if (res !== "61") {
        if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Issue', 'event_category': 'EthereumWeb3'});};        
        setTimeout(function () {
            alertify.confirm(
                'Welcome to P3C!',
                `
                <h3 class="custom-computer only alert-text">Metamask detected. To use, install <a target="_blank" href="https://chrome.google.com/webstore/detail/saturn-wallet/nkddgncdjgjfcddamfgcmfnlhccnimig">Saturn wallet</a> and follow the video.</h3>
                <h3 class="mobile only alert-text">Mobile is still in beta. Follow Tutorial <a target="_blank" href="https://forum.saturn.network/t/how-to-setup-an-ethereum-classic-wallet-on-a-mobile-phone-using-trust-wallet/2593">here</a> or Connect from a Computer.</h3>
                
                <img id="loginLogo" src="img/diamond.gif" class="ui image etc-logo center-larger mobile only" />
                <div class="custom-computer only"><iframe width="520" height="352" src="https://www.youtube-nocookie.com/embed/tBbl_nbp8_k" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                `,
                function () {},
                function () {});
        }, 1000)
        displayError(
            `<div class="custom-computer only">Install <a target="_blank" style="color: white; text-decoration: underline;" href="https://chrome.google.com/webstore/detail/saturn-wallet/nkddgncdjgjfcddamfgcmfnlhccnimig">Saturn Wallet</a> and turn off Metamask.</div>
            <div class="mobile only">ETH detected. Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://forum.saturn.network/t/how-to-setup-an-ethereum-classic-wallet-on-a-mobile-phone-using-trust-wallet/2593">ETC Wallet</a>.`
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
    transferFromCrop(destination, amountToTransfer)
})

$('#infoButton')
    .popup({
        content: "Allow bots to compound your prosperity in exchange for a referral bonus. This enables faster compounding, you can manually reinvest or withdraw at any time.",
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
    $.getJSON("https://api.p3c.io/price/crop/" + web3.toChecksumAddress(cropAddress), function (data) {
        if (data !== null){
            // (New Number - Original Number) ÷ Original Number × 100.
            $('#portfolioButton').show();
            performance = `
            My portfolio growth in (USD/ETC) over:
            <br>
            <b>1 Day</b>: {usd1} / {etc1}
            <br>
            <b>7 Days</b>: {usd7} / {etc7}
            <br>
            <b>30 Days</b>: {usd30} / {etc30}
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