$.getJSON("https://api.commonwealth.gg/planet/coord/0xmeemawr3da7c782fB963D2e562cF7246bD5b6df", function (data) {
    alert(data)
    coord = "-7.1747,16.55594"
    url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBjN9bBBMOM3j33HZYkueaV7akl8IMciE0&q=" + coord + "&center=" + coord + "&zoom=5&maptype=roadmap"
    // alert('WTF')
    $("#map").attr("src",url); 
})

// alert('wtf')