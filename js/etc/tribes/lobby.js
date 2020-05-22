
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
            return numberWithCommas((row.cost * row.waiting * 1000).toFixed(0))
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


