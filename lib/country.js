if(web3){
    account = web3.eth.accounts[0]
    checksum = web3.toChecksumAddress(account)
    $("#address").text(checksum)
    $.getJSON("https://api.commonwealth.gg/planet/coord/"+checksum, function (data) {
        coord = data;
        url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBjN9bBBMOM3j33HZYkueaV7akl8IMciE0&q=" + coord + "&center=" + coord + "&zoom=5&maptype=roadmap"
        // alert('WTF')
        $("#map").attr("src",url); 
    })
} else {
    alert('Please turn on Web3 to work.')
}


var mymap = L.map('mapid').setView([51.505, -0.09], 13);