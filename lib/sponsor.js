var ad = web3.eth.contract(contracts.sponsor.abi).at(contracts.sponsor.address);

function clean(input) {
	res = input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return res;
  }
  
var price;
ad.calculatePrice.call(function (err, result) {
	price = parseFloat(web3.fromWei(result.toNumber()))
	$("#price").html(price + 'ETC');
});

ad.globalAd.call(function (err, result) {
	$("#currentImg").html(clean(result[0]));
	$("#currentText").html(clean(result[1]));
	$("#currentLinkText").html(clean(result[2]));
	$("#currentLink").html(clean(result[3]));
	$( "#current" ).html('<img src="' + clean(result[0]) + '" height="30" width="30"> ' + clean(result[1]) + ' <a target="_blank" href="' + clean(result[3]) + '" rel="nofollow" title="Links to an External Advertiser site" target="_blank"> <b>' + clean(result[2]) + '</b></a><div id="beacon_2a55ce0186" style="position: absolute; left: 0px; top: 0px; visibility: hidden;"><img src="https://gen.etherscan.io/www/d/lg.php?ebannerid=5&amp;campaignid=5&amp;zoneid=2&amp;loc=https%3A%2F%2Fetherscan.io%2F&amp;cb=2a55ce0186" width="0" height="0" alt="" style="width: 0px; height: 0px;"></div>');
});

ad.owner.call(function (err, result) {
	$("#owner").html("<b>Address:</b> " + result);
});

ad.purchasePrice.call(function (err, result) {
	price = parseFloat(web3.fromWei(result.toNumber()))
	$("#purchasePrice").html("<br><b>Paid:</b> " + price + " ETC");
});

ad.purchaseTime.call(function (err, result) {
	d = moment.unix(result).format('dddd, MMMM Do, YYYY h:mm:ss A');
	$("#time").html("<br><b>Bought:</b> " + d);
});

$("#purchase").click(function () {
	var imgLink= $("#imgLink").val();
	var text= $("#text").val();
	var hyperlinkText= $("#hyperlinkText").val();
	var hyperlink= $("#hyperlink").val();

	ad.calculatePrice.call(function (err, result) {
		ad.purchaseAd.sendTransaction(
		imgLink,
		text,
		hyperlinkText,
		hyperlink,
		{
			from: web3.eth.accounts[0],
			value: result
		}, function (error, result) { //get callback from function which is your transaction key
			if (!error) {
				console.log(result);
			} else {
				console.log(error);
			}
		})
	});
})

$("#sample").click(function () {
	var imgLink= $("#imgLink").val();
	var text= $("#text").val();
	var hyperlinkText= $("#hyperlinkText").val();
	var hyperlink= $("#hyperlink").val();

	$( "#sampleAd" ).html('<img src="' + imgLink + '" height="30" width="30"> ' + text + ' <a target="_blank" href="' + hyperlink + '" rel="nofollow" title="Links to an External Advertiser site" target="_blank"> <b>' + hyperlinkText + '</b></a><div id="beacon_2a55ce0186" style="position: absolute; left: 0px; top: 0px; visibility: hidden;"><img src="https://gen.etherscan.io/www/d/lg.php?ebannerid=5&amp;campaignid=5&amp;zoneid=2&amp;loc=https%3A%2F%2Fetherscan.io%2F&amp;cb=2a55ce0186" width="0" height="0" alt="" style="width: 0px; height: 0px;"></div>');

})