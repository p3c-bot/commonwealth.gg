$('#whitepaper').click(function() {
	if (typeof gtag !== 'undefined'){gtag('event', 'Home', {'event_label': 'Usage', 'event_category': 'Whitepaper'});};
});

var masternode = getURL(window.location.search.substring(1)).ref;
if (masternode){
	 localStorage.setItem("ref", masternode)
}