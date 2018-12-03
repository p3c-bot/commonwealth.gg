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

// var opts = {
//     clockFace: 'DailyCounter',
//     countdown: true,
//     language: 'Custom'
// };
// var countdown = 1475924400 - ((new Date().getTime())/1000); // from: 10/08/2016 12:00 pm +0100
// countdown = Math.max(1, countdown);
// $('.flip-clock').FlipClock(countdown, opts);
// FlipClock.Lang.Custom = { days:'Dagar', hours:'Tim', minutes:'Min', seconds:'Sek' };
// var opts = {
//     clockFace: 'DailyCounter',
//     // countdown: true,
// };
var startDate = new Date('2018-07-01 19:02:42 -0400'); //What date to start counting from
var now = Math.floor(Date.now() / 1000); //Current timestamp in seconds
var clockStart = now - startDate.getTime() / 1000; //What to set the clock at when page loads

// var clock2 = $('.flip-clock').FlipClock(opts).setTime(clockStart); //Start clock

var clock = $('.flip-clock').FlipClock(clockStart, {
	clockFace: 'DailyCounter',
});