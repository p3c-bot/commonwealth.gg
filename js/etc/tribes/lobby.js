
$('.ui.dropdown')
    .dropdown({
        action: 'activate',
        onChange: function(value, text, $selectedItem) {
          $('#tribes').DataTable().clear().destroy();
          if (value == '0'){
            buildLobby('https://api.p3c.io/tribes/list')
            $('#title').text('Active Tribes')
          }
    
          if (value == '1'){
            address = web3.eth.accounts[0]
            buildLobby('https://api.p3c.io/tribes/member/' + address)
            $('#numDays').text(value + ' Days')
            $('#title').text('My Tribes')
          }
    
          if (value == '2'){
            buildLobby('https://api.p3c.io/tribes/completed')
            $('#title').text('Completed Tribes')
          }
        }
    });
;

buildLobby('https://api.p3c.io/tribes/list')

function buildLobby(url){
  $.getJSON(url, function (json) {
    $('#tribes').DataTable({
      responsive: true,
      pageLength: 15,
      order: [[3, 'desc']],
      data: json,
      columns: [
        {
          data: 'tribe',
          render: function (data, type, row) {
            return linkify(data, "/tribe.html?id=" + data + "#")
          }
        },
        {
          data: 'name',
          render: function (data, type, row) {
            return linkify(data, "/tribe.html?id=" + row.tribe + "#")
          }
        },
        {
          data: 'players',
          render: function (data, type, row) {
            if (data.includes(playerAddress)){
              return "✅"
            } else {
              return "⭕"
            }
          }
        },
        {
          data: 'power',
          render: function (data, type, row) {
            power = row.cost * row.waiting * 20000
            if (row.location && row.tribe){
              generatePoint(row.location, power, row.name, row.tribe)
            }
            return numberWithCommas(power.toFixed(0))
          }
        },
        {
        data: 'cost',
        render: function (data, type, row) {
          return data + ' ETC'
        }
        },
        {
          data: 'size',
          render: function (data, type, row) {
            return row.waiting + " / " + data
          }
        },
        {
          data: 'age',
          render: function (data, type, row) {
            return timeSince(Number(data * 1000))
          }
        },
        {
          data: 'reward',
          render: function (data, type, row) {
            return data + ' Points'
          }
        },
        {
          data: 'creator',
          render: function (data, type, row) {
            return data.substring(0,8) + "...";
          }
        }
      ]
    });
    $('#tribes_length').hide()
  });
}

var mymap = L.map('map').setView([45,75], 2);

function generatePoint(location, power,name,id){
  // var marker = L.marker(location).addTo(mymap);
  var circle = L.circle(location, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.1,
      radius: power
  }).addTo(mymap);
  // marker.bindPopup("<h5><a>" + linkify(name, "/tribe.html?id=" + id + "#") + "</a></h5>");
  // circle.bindPopup("<a>" +  "https://commonwealth.gg/tribe.html?id=4" + "</a>");
  // marker.bindPopup("TRIBE");

  
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW50c2Fua292IiwiYSI6ImNrYWQwOWQxYzF6NTAyem96OWd5d2V1N2wifQ.IheYsirwEr5e_Sr06guSRQ', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiYW50c2Fua292IiwiYSI6ImNrYWQwOWQxYzF6NTAyem96OWd5d2V1N2wifQ.IheYsirwEr5e_Sr06guSRQ'
  }).addTo(mymap);  
}