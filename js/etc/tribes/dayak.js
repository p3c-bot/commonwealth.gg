function getTribesInfo(){
    alertify.confirm(
        ' Commonwealth Tribes ',
        `
        <h2>Question</h2>
        <h4 style="">Q: How does this game work?</h4>
                                <h4 style="text-align: left">
                                    <h2>The purpose of the Tribe is to reduce the risk of investing in Commonwealth. Invest as a Tribe!</h2>
                                    <ul>
                                        <li>When a tribe is created, each user places an ETC in the contract. ETC can be returned at any time.</li>
                                        <li>After the rate is full, all ETCs are used to buy WLTH at Commonwealth. and WLTH will be distributed evenly among the players.</li>
                                        <li>Each user receives their WLTH as well as a 3% bonus!</li>
                                    </ul>
                                </h4>
        `,
      
        function () {},
    
        function () {}).set({
        labels: {
            ok: 'Ok',
            cancel: 'Close'
        }
    });
}

$( "#infoDayak" ).click(function() {
    getTribesInfo()
    if (typeof gtag !== 'undefined'){gtag('event', 'tribes', {'event_label': 'Usage', 'event_category': 'dayak'});};
});


$("#dayak").click(function() {
    $('.ui.modal')
    .modal('show')
    
});
