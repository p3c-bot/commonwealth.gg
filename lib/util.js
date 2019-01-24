const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function playSound(filename) {
    var mp3Source = '<source src="' + 'doc-assets/' + filename + '.mp3" type="audio/mpeg">';
    var embedSource = '<embed hidden="true" autostart="true" loop="false" src="doc-assets/' + filename + '.mp3">';
    document.getElementById("sound").innerHTML = '<audio autoplay="autoplay">' + mp3Source + embedSource + '</audio>';
}

function getNetworkId(web3) {
    return new Promise((resolve, reject) => {
        // trust wallet doesnt allow accessing this variable.
        if (web3.currentProvider.publicConfigStore == undefined){
            resolve('61')
        }
        version = web3.currentProvider.publicConfigStore._state.networkVersion.toString();
        resolve(version)
    });
}

function displayError(errorString){
    alertify.defaults.notifier.delay = 10000
    alertify.error(errorString)
    $('#warning').transition({
        animation: 'shake',
        duration: '2s',
    });
    setInterval(function () {
        $('#warning').transition({
            animation: 'shake',
            duration: '2s',
        });
    }, 4000)
}