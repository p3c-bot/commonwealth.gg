
  
  function linkify(name, link) {
    return '<a href=' + link + ' target=_blank>' + name + '</a>'
  }
  
  function changeStatus(currentStatus){
    if (currentStatus == 'GREEN'){
      $('#status').addClass('green') 
    }
    if (currentStatus == 'YELLOW'){
      $('#status').addClass('yellow') 
    }
    if (currentStatus == 'ORANGE'){
      $('#status').addClass('orange') 
    }
    if (currentStatus == 'RED'){
      $('#status').addClass('red') 
    }
  }
  
  
  $.getJSON("/lib/dapps.json", function (json) {
    dapps = json;
    $.getJSON("https://api.p3c.io/dappdirect/etc/balance", function (balance) {
      $.getJSON("https://api.p3c.io/dappdirect/etc/digest", function (json) {
        digest = json
        changeStatus(digest['status'])
        $('#dapps').DataTable({
          responsive: true,
          pageLength: 10,
          order: [
            [0, 'desc']
          ],
          data: dapps,
          columns: [{
              data: 'users',
              render: function (data, type, row) {
                if (row.contract == "" || digest[row.contract.toLowerCase()] == undefined) {
                  return ""
                }
                return digest[row.contract.toLowerCase()].users
              }
            },
            {
              data: 'txs',
              render: function (data, type, row) {
                if (row.contract == "" || digest[row.contract.toLowerCase()] == undefined) {
                  return ""
                }
                return digest[row.contract.toLowerCase()].txs
              }
            },
            {
              data: 'dapp',
              render: function (data, type, row) {
                return linkify(data.name, data.link)
              }
            },
            {
              data: 'balance',
              render: function (data, type, row) {
                if (row.contract == "" || digest[row.contract.toLowerCase()] == undefined) {
                  return ""
                }
                return parseInt(balance[row.contract.toLowerCase()])
              }
            },
            {
              data: 'category'
            },
            {
              data: 'description'
            },
            {
              data: 'volume',
              render: function (data, type, row) {
                if (row.contract == "" || digest[row.contract.toLowerCase()] == undefined) {
                  return ""
                }
                return digest[row.contract.toLowerCase()].volume.toFixed(2)
              }
            },
            {
              data: 'contact',
              render: function (data, type, row) {
                return linkify(data.name, data.link)
              }
            },
            {
              data: 'contract',
              render: function (data, type, row) {
                if (row.contract == "" || digest[row.contract.toLowerCase()] == undefined) {
                  return "Unknown"
                }
                return linkify(row.contract.substring(0, 6)+ '...', "https://blockscout.com/etc/mainnet/address/" + data + "/transactions")
              }
            },
            {
              data: 'audit',
              render: function (data, type, row) {
                if (data != "") {
                  return linkify("Yes", data);
                } else {
                  return "No"
                }
              }
            },
          ]
        });
      });
    });
  })
  
  $('#sponsor').load("https://api.p3c.io/sponsor/")
  $('#global').load("https://api.p3c.io/dappdirect/etc/global");