var masternode = getURL(window.location.search.substring(1)).masternode;
localStorage.removeItem("masternode");
if(masternode) localStorage.setItem("masternode", masternode)


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

$('#buyAmount').hide();
$('#sellAmount').hide();

$('#buyInput').on('keyup change', function() {
  if (this.value.length > 0) {
      $('#buyAmount').show();
  }
});

$('#sellInput').on('keyup change', function() {
  if (this.value.length > 0) {
      $('#sellAmount').show();
  }
});

$('#sponsor').load("https://api.p3c.io/sponsor/");