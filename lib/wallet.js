if(web3.isConnected())
{
    var network = web3.version.network;

    if (network == 1)
    {
        $('body #loadingSpinner').hide();
        $('body #dimmerNetwork').dimmer({ closable: false }).dimmer('show');
    }
}
