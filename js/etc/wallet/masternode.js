// FOR ALL PURCHASED TO GO THROUGH SINGLE MASTERNODE - REPLACE THIS

// var masternode = "0x0000000000000000000000000000000000000000"

///////////// and comment this out otherwise leave it

var masternode = getURL(window.location.search.substring(1)).ref;

///////////////////////////////////////////////////

if (masternode){
  localStorage.setItem("ref", masternode)
}

if (localStorage.getItem('ref')){
  if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'UsingRefAddress', 'value': localStorage.getItem('ref')});};
}