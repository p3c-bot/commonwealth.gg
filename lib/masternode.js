// FOR ALL PURCHASED TO GO THROUGH SINGLE MASTERNODE - REPLACE THIS
// var permanentMasternode = "0xab338675a137bcf3dd1830eb2ab48797fdf0bdca"

var permanentMasternode = "0x0000000000000000000000000000000000000000"

///////////////////////////////
///////////////////////////////


localStorage.removeItem("ref");
if (permanentMasternode == "0x0000000000000000000000000000000000000000"){
  var masternode = getURL(window.location.search.substring(1)).ref;
  if (masternode){
    localStorage.setItem("ref", masternode)
  }
} else {
  $('#masternode').hide()
  localStorage.setItem("ref", permanentMasternode)
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