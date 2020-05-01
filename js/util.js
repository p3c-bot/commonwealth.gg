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
        window.location.href="https://commonwealth.gg/use.html";
    }
    if($(this).val()=="ru"){
        window.location.href="https://ru.commonwealth.gg/use.html";
    }
    if($(this).val()=="id"){
        window.location.href="https://id.commonwealth.gg/use.html";
    }
    if($(this).val()=="en_home"){
        window.location.href="https://commonwealth.gg/";
    }
    if($(this).val()=="ru_home"){
        window.location.href="https://ru.commonwealth.gg/";
    }
    if($(this).val()=="id_home"){
        window.location.href="https://id.commonwealth.gg/";
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
        'Need to Buy or Sell ETC?',
        `
        <h2>Recommended</h2>
        <h4 style="line-height:35px; text-align: center;"> 
        <a target="_blank" href="https://changelly.com/?ref_id=5nyu40p1vkzlp7hr"> 🇪🇺 Changelly.com: Global</a>
        <br>
        <a target="_blank" href="https://www.coinbase.com/signup">🇺🇸 Coinbase.com: USA, EU</a>
        <br>
        <a target="_blank" href="https://www.binance.com/en/trade/ETC_USDT">🇨🇳 Binance.com: CN, Global</a>
        <br>
        <a target="_blank" href="https://www.bestchange.ru/qiwi-to-ethereum-classic.html"> 🇷🇺 Bestchange.com: RU, Asia</a>
        <br>
        <a target="_blank" href="https://www.coinspot.com.au/buy/etc">🇦🇺 Coinspot.com.au: AUS</a>
        </h4>
        <img id="loginLogo" src="img/logo/etc-title.jpg" class="ui image etc-logo center-larger" />
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

$( "#buyETCButton" ).click(function() {
    getETCMessage()
    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'PurchaseETCInfo'});};
});

/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
function showNav() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
}

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

function linkify(name, link) {
    return '<a href=' + link + '>' + name + '</a>'
}

function getURL(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
        // If third or later entry with this name
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return query_string;
}