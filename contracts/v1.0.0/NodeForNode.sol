pragma solidity ^0.4.21;
/***
 *  _   _           _     ______         _   _           _      
 * | \ | |         | |    |  ___|       | \ | |         | |     
 * |  \| | ___   __| | ___| |_ ___  _ __|  \| | ___   __| | ___ 
 * | . ` |/ _ \ / _` |/ _ \  _/ _ \| '__| . ` |/ _ \ / _` |/ _ \
 * | |\  | (_) | (_| |  __/ || (_) | |  | |\  | (_) | (_| |  __/
 * \_| \_/\___/ \__,_|\___\_| \___/|_|  \_| \_/\___/ \__,_|\___|
 *
 *  v 1.0.0
 *  "If you want to go fast, go alone, if you want to go far go with others."
 *  What?
 *  -> Create a NodeForNode Game of any amount of Players and Amounts in the lobby.
 *  -> Put money into the Game, and when it hits the threshold, all players buy into Commonwealth on each other's masternode links. 
 *  -> NodeForNode contract self destructs after payout, but Lobby still lasts.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

contract Hourglass {
    function myTokens() public view returns(uint256) {}
    function myDividends(bool) public view returns(uint256) {}
    function transfer(address, uint256) public {}
    function buy(address) public payable returns(uint256) {}
}
contract Farm {
    function myCrop() public view returns(address) {}
    function myCropTokens() public view returns(uint256) {}
    function myCropDividends() public view returns(uint256) {}
}

contract Lobby {
    
    event NewGame(address indexed _from, address _game, uint _id, uint _amountOfPlayers, uint _entryCost);

    mapping (uint256 => address) public games;
    uint256 public numberOfGames = 0;
    
    /**
     * User specifies how many players they want, and what the entry cost in wei is for a new game.
     * Creates a new contract for them, and buys them automatic entry.
     */
    function createGame(uint256 amountOfPlayers, uint256 entryCost) public payable returns (address) {
        address gameAddress = new NodeForNode(amountOfPlayers, entryCost);
        games[numberOfGames] = gameAddress;

        numberOfGames += 1;
        
        NodeForNode game = NodeForNode(gameAddress);
        game.BuyIn.value(entryCost)(msg.sender);
        
        emit NewGame(msg.sender, gameAddress, numberOfGames, amountOfPlayers, entryCost);
        
        return gameAddress;
    }
}


contract NodeForNode {
    
    event GameJoined(address indexed _from);
    event GameExecuted(address indexed _from, uint size, uint entry);
    
    Hourglass p3c;
    Farm farm;
    
    address internal p3cAddress = 0xDF9AaC76b722B08511A4C561607A9bf3AfA62E49;
    address internal farmAddress = 0x93123bA3781bc066e076D249479eEF760970aa32;

    mapping(address => bool) public waiting;
    address[] public players;
    
    uint256 public playerAmount;
    uint256 public entryCost;

    function NodeForNode(uint256 amountOfPlayers, uint256 cost) public {
        p3c = Hourglass(p3cAddress);
        farm = Farm(farmAddress);
        
        playerAmount = amountOfPlayers;
        entryCost = cost;
    }
    
    function waitingPlayers() public view returns (uint256){
        return players.length;
    }
    
    function BuyIn(address user) payable public {
        require(msg.value == entryCost);
        require(waiting[user] == false);

        // address user = msg.sender;
        
        // If the user has crop tokens, use that as the N4N destination
        // if (farm.myCropTokens() > p3c.myTokens()){
        //     user = farm.myCrop();
        // }
        
        emit GameJoined(user);
        players.push(user);
        waiting[user] = true;
        // require(players.length > size);
        
        if (players.length == playerAmount){
            // Iterate through players and distribute tokens
            for (uint i=0; i<players.length;i++){
                // uint tokensBought = p3c.buy.value(entryCost)(players[i]);
                // p3c.transfer(players[i],tokensBought);
                players[i].transfer(entryCost);
            }
            
            emit GameExecuted(user, playerAmount, entryCost);
            selfdestruct(msg.sender);
        }
    }
    
    function Refund(address user) public {
        require(user == msg.sender);
        // address user = msg.sender;
        // If the user has crop tokens, use that as the N4N destination
        // if (farm.myCropTokens() > p3c.myTokens()){
        //     user = farm.myCrop();
        // }
        
        require(waiting[user] == true);
        
        uint index = find(players, user);
        removeByIndex(players, index);     
        
        waiting[user] = false;
        user.transfer(entryCost);
        if (players.length == 0){
            selfdestruct(msg.sender);
        }
    }
    
    function removeByIndex(address[] storage items, uint index) internal {
        if (index >= items.length) {
            return;
        }

        for (uint i = index; i < items.length-1; i++) {
            items[i] = items[i + 1];
        }
        items.length--;
    }

    function find(address[] storage items, address value) internal view returns (uint) {
        uint i = 0;
        while (items[i] != value) {
            i++;
        }
        return i;
    }
}