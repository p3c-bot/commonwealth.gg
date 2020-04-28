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
            activeGame = web3.eth.contract(contracts.nodefornode.abi).at(String(result));
            getGameDetails(activeGame)
        } else {
            expiredGameAlert()
        }
    });

    lobby.gameNumber.call(function (err, result) {
        $("#gameNumber").text(result);
    });
}

function getGameDetails(game) {
    game.size.call(function (err, result) {
        if (result == 0){
            expiredGameAlert()
        }
        activeGameSize = result.toNumber()
        $("#infoGameSize").html(activeGameSize);
     });

    game.cost.call(function (err, result) {
        activeGameCost = result.toNumber()
        var prettyNumber = web3.fromWei(parseFloat(activeGameCost).toFixed(4))
        $("#infoGameCost").html( prettyNumber + " ETC");
        $("#buttonGameCost").html(" ("+ prettyNumber + " ETC)");
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
    
    new ClipboardJS('.button');
    $("#copyGameButton").attr("data-clipboard-text", 'https://commonwealth.gg/nodefornode.html?game=' + gameID + "#");

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
                var receipt = web3.eth.getTransactionReceipt(transactionHash);
                $('#gameAddress').innerHTML = 'Game Created. ID is ' + result.toString()
                $("#createGame").attr("data-clipboard-text", 'https://commonwealth.gg/nodefornode.html?ref=' + result);
            } else {
                console.log(error);
            }
        }
    )
    // window.location.replace('https://commonwealth.gg/nodefornode.html?game=' + (int(gameID) + 1) + '?');
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
                    succesfulGameAlert()
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
            // $('#gameAddress').innerHTML = 'Game Created. ID is ' + result.toString()
        }
    )
}

$('#copyGameButton').on('click', function (){
    var game = document.getElementById("createGame")
    alertify.success('<h3>Referral Link Copied</h3>', 2)
})

function expiredGameAlert(){
    alertify.error("Expired Game. Please go to a valid game.")
    alertify.alert("Expired Game",
    `
    <h2 style="text-align:center;">
    This game is either expired or does not exist yet!
    </h2>
    <img id="loginLogo" src="img/nodefornode/warning-tiny.png" class="ui image etc-logo center-larger" />
    `
    )
}

function succesfulGameAlert(){
    alertify.success("Buying In Success!")
    alertify.alert(
    "Successful Game",                        
    `
    <h2 style="text-align:center;">
    Success! Click OK to go back to your wallet and see your reward.
    </h2>
    <img id="loginLogo" src="img/nodefornode/success-tiny.png" class="ui image etc-logo center-larger" />
    `,
    function() {window.location.href = "https://commonwealth.gg/use.html"}
    )
}

function gameCreatedAlert(newGameID){
    alertify.success("Creating Game - Waiting for Blockchain. You will be redirected.")    
    alertify.alert("Game Created",
    `
    <h2 style="text-align:center;">
    New Game has been created! Click ok to copy link to clipboard.
    </h2>
    <img id="loginLogo" src="img/nodefornode/beachball.gif" class="ui image etc-logo" />
    `,
    function() {
        $("#copyMNButton").attr("data-clipboard-text", 'https://commonwealth.gg/index.html?ref=' + myCropAddress);
    }
    )
}