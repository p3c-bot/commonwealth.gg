$.getJSON("https://api.p3c.io/tribes/list", function (json) {
  console.log(json)
  $('#tribes').DataTable({
    responsive: true,
    pageLength: 10,
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
          return (row.cost * row.waiting * 1000).toFixed(0)
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
          return data + ' P3C'
        }
      },
      {
        data: 'creator',
        render: function (data, type, row) {
          return data.substring(0,8) + "...";
        }
      },
  //     // {
  //     //   data: 'contract',
  //     //   render: function (data, type, row) {
  //     //     if (row.contract == "" || digest[row.contract.toLowerCase()] == undefined) {
  //     //       return "Unknown"
  //     //     }
  //     //     return linkify(row.contract.substring(0, 6)+ '...', "https://blockscout.com/etc/mainnet/address/" + data + "/transactions")
  //     //   }
  //     // },
  //     // {
  //     //   data: 'audit',
  //     //   render: function (data, type, row) {
  //     //     if (data != "") {
  //     //       return linkify("Yes", data);
  //     //     } else {
  //     //       return "No"
  //     //     }
  //     //   }
  //     // },
    ]
  });
});