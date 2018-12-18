$('#sponsor').load("https://api.p3c.io/sponsor/");

// function getNetworkId(web3) {
//     return new Promise((resolve, reject) => {
//         resolve(web3.currentProvider.publicConfigStore._state.networkVersion.toString())
//     });
// }

// if saturn isn't installed 
if (typeof web3 == 'undefined') {
    alertify.defaults.notifier.delay = 10000
    alertify.error(
        `<div class="custom-computer only">Please Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://chrome.google.com/webstore/detail/saturn-wallet/nkddgncdjgjfcddamfgcmfnlhccnimig">ETC Wallet</a></div>
        <div class="mobile only">Please Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://forum.saturn.network/t/how-to-setup-an-ethereum-classic-wallet-on-a-mobile-phone-using-trust-wallet/2593">ETC Wallet</a></div>`
    )
    $('#warning').transition({
        animation: 'shake',
        duration: '2s',
    });
    setInterval( function(){
        $('#warning').transition({
            animation: 'shake',
            duration: '2s',
        });
    }, 4000)

}

// getNetworkId(web3).then(function (res) {
//     if (res !== "61") {
//         alertify.error(
//             `<div class="custom-computer only">Turn off Metamask and install <a target="_blank" style="color: white; text-decoration: underline;" href="https://chrome.google.com/webstore/detail/saturn-wallet/nkddgncdjgjfcddamfgcmfnlhccnimig">Saturn Wallet</a> to use.</div>
//             <div class="mobile only">ETH detected. Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://forum.saturn.network/t/how-to-setup-an-ethereum-classic-wallet-on-a-mobile-phone-using-trust-wallet/2593">ETC Wallet</a></div>`
//         )
//     }
// })

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
        content: "Allow bots to compound your dividends in exchange for a referral bonus. This enables faster compounding, you can manually reinvest or withdraw at any time.",
        position: 'top center'
    });

$('#portfolioButton')
    .popup({
        html: `
        Performance against (USD/ETC)
        <br>
        <b>1 Day</b>: 4% / 23%
        <br>
        <b>7 Day</b>: 23% / -5%
        <br>
        <b>30 Day</b>: 15% / 23%
        `,
        position: 'right center'
    });

function get(){
$.getJSON( "http://api.p3c.io/price/crop/0x5136958e5D57fa1E282fA976a3985Ca5B395132A", function( data ) {
    // (New Number - Original Number) ÷ Original Number × 100.
    performance = `
    Performance in (USD/ETC)
    <br>
    <b>1 Day</b>: {usd1} / {etc1}
    <br>
    <b>7 Day</b>: {usd7} / {etc7}
    <br>
    <b>30 Day</b>: {usd30} / {etc30}
    `
    var items = [];
    $.each( data, function( key, val ) {
        console.log('KEY ' + key + ' VAL ' + change)
        change = ((val - myUSDValue) / myUSDValue) * 100
        performance = performance.replace(key, val)
    });

    // $('#portfolioButton')
    // .popup('change content', performance)
    // ;
    console.log(performance)
});
}

function copyAddress() {
    /* Get the text field */
    var copyText = document.getElementById("myCropAddress");

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
}