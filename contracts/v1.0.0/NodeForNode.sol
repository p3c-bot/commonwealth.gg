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
    function myTokens() public pure returns(uint256) {}
    function myDividends(bool) public pure returns(uint256) {}
    function transfer(address, uint256) public returns(bool) {}
    function buy(address) public payable returns(uint256) {}
}
contract Farm {
    mapping (address => address) public crops;
    function myCrop() public pure returns(address) {}
    function myCropTokens() public pure returns(uint256) {}
    function myCropDividends() public pure returns(uint256) {}
}

contract Lobby {
    
    event NewGame(address indexed _from, address _game, uint _id, uint _amountOfPlayers, uint _entryCost);

    mapping (uint256 => address) public games;
    uint256 public gameNumber = 0;
    
    /**
     * User specifies how many players they want, and what the entry cost in wei is for a new game.
     * Creates a new contract for them, and buys them automatic entry.
     */
    function createGame(uint256 amountOfPlayers, uint256 entryCost) public payable returns (address) {
        address gameAddress = new NodeForNode(gameNumber, amountOfPlayers, entryCost);
        games[gameNumber] = gameAddress;

        
        NodeForNode game = NodeForNode(gameAddress);
        game.BuyIn.value(entryCost)(msg.sender);
        
        emit NewGame(msg.sender, gameAddress, gameNumber, amountOfPlayers, entryCost);
        gameNumber += 1;
        return gameAddress;
    }
}

/**
 * NodeForNode game contract. It is created by the lobby, and one time use.
 * If it fills up, it buys P3C with everyone's referal link, user can ask for refund, which sends back to them.
 * If a user has a crop setup, the functions will detect it and use it to buy tokens for.
 * Contract self desturcts when it is used to clean the blockchain. 
 */
contract NodeForNode {
    
    event GameJoined(address indexed _from);
    event GameExecuted(uint256 indexed _id, address indexed _from, uint size);
    
    Hourglass p3c;
    Farm farm;
    
    // address internal p3cAddress = 0x8c01128ff13E8296c34b22b20Ffc2829D85A2A22;
    address internal p3cAddress = 0xDe6FB6a5adbe6415CDaF143F8d90Eb01883e42ac;
    address internal farmAddress = 0x93123bA3781bc066e076D249479eEF760970aa32;

    mapping(address => bool) public waiting;
    address[] public players;
    
    uint256 public id;
    uint256 public size;
    uint256 public cost;

    function NodeForNode(uint256 _id, uint256 _amountOfPlayers, uint256 _cost) public {
        p3c = Hourglass(p3cAddress);
        farm = Farm(farmAddress);
        
        id = _id;
        size = _amountOfPlayers;
        cost = _cost;
    }
    
    function waitingPlayers() public view returns (uint256){
        return players.length;
    }

    function BuyIn(address _user) payable public {
        require(msg.value == cost);

        // if a crop exists for a user, make that the user address
        address user = _user;
        if (farm.crops(_user) != 0x0){
            user = farm.crops(_user);
        }
        
        require(waiting[user] == false);
        
        players.push(user);
        waiting[user] = true;
        emit GameJoined(user);

        // Iterate through players and distribute tokens
        if (players.length >= size){
            for (uint i=0; i<players.length;i++){
                // Each player buys in using their own node. Game theory is a beautiful thing.
                p3c.buy.value(cost)(players[i]);
                uint myTokens = (p3c.myTokens());
                p3c.transfer(players[i], myTokens);
            }
            
            emit GameExecuted(id, user, size);
            // Send any extra dividends back to the first player
            selfdestruct(msg.sender);
        }
    }
    
    function Refund() public {
        address user = msg.sender;
        // if there is a crop for the user, use it.
        if (farm.crops(msg.sender) != 0x0){
            user = farm.crops(msg.sender);
        }
        
        require(waiting[user] == true);
        
        uint index = find(players, user);
        removeByIndex(players, index);     
        
        waiting[user] = false;
        (msg.sender).transfer(cost);
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