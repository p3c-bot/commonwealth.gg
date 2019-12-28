const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function playSound(filename) {
    var mp3Source = '<source src="' + 'doc-assets/' + filename + '.mp3" type="audio/mpeg">';
    var embedSource = '<embed hidden="true" autostart="true" loop="false" src="doc-assets/' + filename + '.mp3">';
    document.getElementById("sound").innerHTML = '<audio autoplay="autoplay">' + mp3Source + embedSource + '</audio>';
}

$("#language").change(function(){
    if($(this).val()=="en"){
        window.location.href="/use.html";
    }
    if($(this).val()=="ru"){
        window.location.href="/use_ru.html";
    }
    if($(this).val()=="es"){
        window.location.href="/use_es.html";
    }
    if($(this).val()=="en_home"){
        window.location.href="/index.html";
    }
    if($(this).val()=="ru_home"){
        window.location.href="/ru.html";
    }
});
function displayError(errorString){
    alertify.defaults.notifier.delay = 10000
    alertify.error(errorString)
    $('#warning').transition({
        animation: 'shake',
        duration: '2s',
    });
    setInterval(function () {
        $('#warning').transition({
            animation: 'shake',
            duration: '2s',
        });
    }, 4000)
}

function getNetworkId(web3) {
    return new Promise((resolve, reject) => {
        // trust wallet doesnt allow accessing this variable.
        if (web3.currentProvider.publicConfigStore == undefined){
            resolve('61')
        }
        version = web3.currentProvider.publicConfigStore._state.networkVersion.toString();
        resolve(version)
    });
}

function getETCMessage(){
    alertify.confirm(
        'Need to Buy or Sell Ethereum Classic?',
        `
        <ul id="agreement">
        <h2>ETC Conversion Services</h2>
        <h4 style="line-height:30px;"> 
        <li>Moonpay: <a target="_blank" href=https://www.moonpay.io/">Buy or Sell ETC for Fiat (USD/EUR) - No Account</a></li>
        <li>Changelly: <a target="_blank" href=https://buy.changelly.com/?defaultCurrencyCode=etc&baseCurrencyCode=usd&baseCurrencyAmount=50"> Buy ETC with Fiat (USD/EUR) - No Account</a></li>
        <li>Coinbase: <a target="_blank" href=https://www.coinbase.com/signup"> Buy or Sell ETC for Fiat (USD/EUR) - Login</a></li>
        <li>Binance: <a target="_blank" href=https://www.binance.com/en/trade/ETC_BTC">Buy or Sell ETC for Crypto (BTC/USDC) - Login</a></li>
        </h4>
        </ul>
        <img id="loginLogo" src="img/etc-logo.png" class="ui image etc-logo center-larger" />
        `,
        //if ok deploy the crop
        function () {},
        // if cancel disable everything
        function () {}).set({
        labels: {
            ok: 'Accept',
            cancel: 'Cancel'
        }
    });
}

// $( "#buyETCButton" ).click(function() {
//     getETCMessage()
// });
