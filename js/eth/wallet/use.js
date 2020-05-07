// $('#sponsor').load("https://api.commonwealth.gg/sponsor/");
ethereum.enable()
// if saturn isn't installed 
if (typeof web3 == 'undefined') {
    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Issue', 'event_category': 'NoWeb3'});};
    displayError(
        `
        <div class="custom-computer only">To Use, Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://chrome.google.com/webstore/detail/saturn-wallet/nkddgncdjgjfcddamfgcmfnlhccnimig?hl=en">ETH Wallet</a></div>
        <div class="mobile only">To Use, Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://chrome.google.com/webstore/detail/saturn-wallet/nkddgncdjgjfcddamfgcmfnlhccnimig?hl=en>ETH Wallet</a></div>
        `
    )
}

getNetworkId(web3).then(function (res) {
    if (res !== "42") {
        if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Issue', 'event_category': 'EthereumWeb3'});};        
        displayError(
            `
            <div class="custom-computer only">To Use, Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://chrome.google.com/webstore/detail/saturn-wallet/nkddgncdjgjfcddamfgcmfnlhccnimig?hl=en">ETH Wallet</a></div>
            <div class="mobile only">To Use, Install an <a target="_blank" style="color: white; text-decoration: underline;" href="https://chrome.google.com/webstore/detail/saturn-wallet/nkddgncdjgjfcddamfgcmfnlhccnimig?hl=en>ETH Wallet</a></div>
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

if ((/Mobi|Android/i.test(navigator.userAgent)) == false) {
    $( "#buy" ).hover(function() {
        $( this ).transition({
            animation: 'pulse',
            duration: '.5s',
        });
      });    
}

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
        content: "Allow bots to compound your dividends in exchange for a referral bonus. You can manually withdraw at any time, but this must be on to use Compound. For greater control, use the Pure Interface.",
        position: 'top center'
    });

$('#portfolioButton').hide();

$( "#refillButton" ).click(function() {
    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'RefillLinkClick'});};
});

function copyAddress() {
    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'CopyAddress'});};

    var copyText = document.getElementById("myCropAddress");
    copyText.select();
    document.execCommand("copy");
}

new ClipboardJS('.button');
$('.ui.primary.basic.button.copy').on('click', function (){
  alertify.success('<h3>Copied</h3>', 2)
})

$('#copyMNButton').on('click', function (){
    var address = document.getElementById("myCropAddress")
    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'GenerateReferral', 'value': address});};
    alertify.success('<h3>Referral Link Copied</h3>', 2)
})

$(".home").click(function(){
    window.location.href = "/";
});