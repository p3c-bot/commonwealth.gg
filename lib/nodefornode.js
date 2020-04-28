if (typeof web3 == 'undefined') {displayError(`Please install Saturn Wallet.`)}
var gameID = getURL(window.location.search.substring(1)).game;
var lobby = web3.eth.contract(contracts.lobby.abi).at(contracts.lobby.address);


var activeGame;
var activeGameCost,activeGameSize,activeGameWaiting = 0;
$("#refundArea").hide();

// load game from address in URL, if it has one.
if (gameID){
    lobby.games.call(gameID, function (err, result) {
        $("#infoGameId").html(gameID);
        if (result != "0x0000000000000000000000000000000000000000"){
            alert(result)
            activeGame = web3.eth.contract(contracts.nodefornode.abi).at(String(result));
            getGameDetails(activeGame)
        }
    });
}

function getGameDetails(game) {
    game.cost.call(function (err, result) {
        activeGameCost = result.toNumber()
        $("#infoGameCost").html(web3.fromWei(parseFloat(activeGameCost).toFixed(18)));
        $("#buttonGameCost").html(" ("+ web3.fromWei(parseFloat(activeGameCost).toFixed(4)) + " ETC)");
        if (result == 0){
            alertify.alert("Expired Game","This game is either expired or the link is invalid.")
        }
    });

    game.size.call(function (err, result) {
        activeGameSize = result.toNumber()
        $("#infoGameSize").html(activeGameSize);
     });
 
     game.waitingPlayers.call(function (err, result) {
         activeGameWaiting = result.toNumber()
         $("#infoGameWaiting").html(activeGameWaiting);
         percentage = (activeGameWaiting / activeGameSize) * 100
         gameString = (activeGameWaiting + " Waiting / " + activeGameSize + " Total")
         $('#gameSize').progress({
             percent: percentage
           });
         $("#gameLabel").text(gameString);
     });

     game.time.call(function (err, result) {
        var activeGameTime = timeSince(result.toNumber() * 1000)
        $("#infoGameAge").html(activeGameTime);
     });

    game.amIWaiting.call(function (err, result) {
        if (result == true){
            $( "#refundArea" ).show();
            $( "#join").hide();
        }
    });
}

var amount;
function setMarketCap(){
    p3cContract.totalEthereumBalance.call(function (err, result) {
        if (!err) {
            amount = web3.fromWei(result).toFixed(0)
            $("#etcInContract").replaceWith(numberWithCommas(amount) + " ETC")
        }
    })
}

playerAddress = web3.toChecksumAddress(web3.eth.accounts[0])


$("#createGame").click(function () {
    amountOfPlayers = $("#amountOfPlayers").val()
    entryCost = $("#entryCost").val()
    if (entryCost != 0 && amountOfPlayers > 1){
        createGame(amountOfPlayers, entryCost)
    } else {
        alertify.error("Please create game with more than 1 player.")
    }
})

$("#getGame").click(function () {
    id = $("#gameId").val()
    getGame(id)
})

$("#refund").click(function () {
    refund(activeGame);
})

$("#join").click(function () {
    buyIn(activeGame, activeGameCost);
})


$('#copyGameLink').on('click', function (){
    var address = document.getElementById("myCropAddress")
    alertify.success('<h3>Referral Link Copied</h3>', 2)
})

var address;
// CREATE GAME
function createGame(amountOfPlayers, entryCost) {
    amount = web3.toWei(entryCost)
    lobby.createGame.sendTransaction(
        amountOfPlayers, 
        amount, 
        {
            from: web3.eth.accounts[0],
            value: amount,
            gasPrice: web3.toWei(1, 'gwei')
        },
        function (error, result) { //get callback from function which is your transaction key
            if (!error) {
                alertify.success("Creating Game - Waiting for Blockchain. You will be redirected.")
                $("#createGame").attr("data-clipboard-text", 'https://commonwealth.gg/nodefornode.html?ref=' + result);
            } else {
                console.log(error);
            }
            $('#gameAddress').innerHTML = 'Game Created. ID is ' + result.toString()
        }
    )
    window.location.replace('https://commonwealth.gg/nodefornode.html?game=' + (int(gameID) + 1) + '?');
}

function buyIn(game) {
    game.BuyIn.sendTransaction(
        web3.eth.accounts[0], 
        {
            from: web3.eth.accounts[0],
            value: activeGameCost,
            gasPrice: web3.toWei(1, 'gwei')
        },
        function (error, result) { //get callback from function which is your transaction key
            if (!error) {
                if(activeGameSize - activeGameWaiting == 1){
                    alertify.success("Buying In Success!")
                    alertify.alert(
                    "Succesful Game",                        
                    `
                    <p id="agreement" class="agreement">
                    Game has been successfully completed! Click OK to be redirected back to your wallet and see your reward.
                    </p>
                    <img id="loginLogo" src="img/etc-logo.png" class="ui image etc-logo center-larger" />
                    `,
                    function() {window.location.href = "https://commonwealth.gg/use.html"}
                    )
                }
            } else {
                console.log(error);
            }
        }
    )
}

function refund(game){
    game.Refund.sendTransaction(
        {
            from: web3.eth.accounts[0],
            gasPrice: web3.toWei(1, 'gwei')
        },
        function (error, result) {
            if (!error) {
                alertify.success(" Collecting Refund, please wait.")
            } else {
                console.log(error);
            }
            $('#gameAddress').innerHTML = 'Game Created. ID is ' + result.toString()
        }
    )
}