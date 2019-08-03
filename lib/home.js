$('#statsContainer').hide();
setStats()
function setStats() {
    $.getJSON("https://api.p3c.io/chart/info", function (data) {
		if (data !== null){
			// (New Number - Original Number) ÷ Original Number × 100.
			$('#statsContainer').show();
			P3CSupply = numberWithCommas(Number(data.P3CSupply).toFixed(0))
			// SupplyPercentage = (data.P3CSupply / 204939005.8).toFixed(4) * 100 + "%"

			$("#tokenSupply").replaceWith(P3CSupply)
			// $("#tokenSupplyPercentage").replaceWith(SupplyPercentage)
			
			PriceETC = data.PriceETC.toFixed(4) + " ETC"
			PriceUSD = "$" + data.PriceUSD.toFixed(4)

			$("#priceETC").replaceWith(PriceETC)
			$("#priceUSD").replaceWith(PriceUSD)

			SizeETC = numberWithCommas(data.SizeETC.toFixed(0)) + " ETC"
			SizeUSD = "$" + numberWithCommas(data.SizeUSD.toFixed(0))

			$("#sizeETC").replaceWith(SizeETC)
			$("#sizeUSD").replaceWith(SizeUSD)
			$("#etcPriceUSD").replaceWith(data.ETCPriceUSD)

			// $('#createdStats').popup({
			// 	html: 'P3C tokens can <b>only</b> be created by sending Ethereum Classic (ETC) to the contract. There is no central authority that can inflate P3C. Hard cap assumes every ETC possible (210,000,000) is in contract.',
			// 	position: 'bottom center'
			// });
			// $('#priceStats').popup({
			// 	html: 'Current price of a new P3C token. All tokens are denominated in ETC and feed into the locked fund.',
			// 	position: 'bottom center'
			// });
			// $('#sizeStats').popup({
			// 	html: 'P3C uses a peer-reviewed <b>bonding curve</b> algorithm to intelligently distribute funds. These funds are only accessible by P3C participants.',
			// 	position: 'bottom center'
			// });
			if (typeof gtag !== 'undefined'){gtag('event', 'Home', {'event_label': 'Usage', 'event_category': 'LoadStats'});};
		}
	});
}

$('#whitepaper').click(function() {
	if (typeof gtag !== 'undefined'){gtag('event', 'Home', {'event_label': 'Usage', 'event_category': 'Whitepaper'});};
});

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


var masternode = getURL(window.location.search.substring(1)).ref;
localStorage.removeItem("ref");
if (masternode){
	 localStorage.setItem("ref", masternode)
}

if (localStorage.getItem('ref')) {
	$(".dashboard-link").attr("href", "/use.html?ref=" + localStorage.getItem('ref'))
}