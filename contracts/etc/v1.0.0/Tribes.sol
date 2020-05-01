pragma solidity ^0.4.21;
/***
 *  _____     _ _               
 * |_   _| __(_) |__   ___  ___ 
 *   | || '__| | '_ \ / _ \/ __|
 *   | || |  | | |_) |  __/\__ \
 *   |_||_|  |_|_.__/ \___||___/
 *                             
 *  v 1.0.0
 *  "If you want to go fast, go alone, if you want to go far go with others."
 *  What?
 *  -> Create a Tribe of any amount of members and Amounts in the lobby.
 *  -> Put money into the Tribe, and when it hits the threshold, all members buy into Commonwealth on each other's masternode links. 
 *  -> Tribe contract self destructs after payout, but Lobby still lasts.
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
    function buy(address) public payable returns(uint256) {}
}
contract Farm {
    mapping (address => address) public crops;
    function myCrop() public pure returns(address) {}
    function myCropTokens() public pure returns(uint256) {}
    function myCropDividends() public pure returns(uint256) {}
}

contract Crop {
    function buy(address) external payable {}
}


contract Lobby {
    
    event NewTribe(address indexed _from, address _tribe, uint _id, uint _amountOfmembers, uint _entryCost);

    mapping (uint256 => address) public tribes;
    uint256 public tribeNumber = 0;
    
    /**
     * User specifies how many members they want, and what the entry cost in wei is for a new tribe.
     * Creates a new contract for them, and buys them automatic entry.
     */
    function createTribe(bytes32 name, uint256 amountOfmembers, uint256 entryCost) public payable returns (address) {
        require(amountOfmembers > 1 && entryCost > 0);
        
        address tribeAddress = new Tribe(tribeNumber, name, amountOfmembers, entryCost);
        tribes[tribeNumber] = tribeAddress;

        Tribe tribe = Tribe(tribeAddress);
        tribe.BuyIn.value(entryCost)(msg.sender);
        
        emit NewTribe(msg.sender, tribeAddress, tribeNumber, amountOfmembers, entryCost);
        tribeNumber += 1;
        return tribeAddress;
    }
}

/**
 * NodeForNode tribe contract. It is created by the lobby, and one time use.
 * If it fills up, it buys P3C with everyone's ref link, user can ask for refund, which sends back to them.
 * If a user has a crop setup, the functions will detect it and use it to buy tokens for.
 * Contract self destructs when it is used to clean the blockchain. 
 */
contract Tribe {
    
    event TribeJoined(address indexed _from);
    event TribeCompleted(uint256 indexed _id, address indexed _from, uint size);
    
    Hourglass p3c;
    Farm farm;

    address internal farmAddress = 0x93123bA3781bc066e076D249479eEF760970aa32;

    mapping(address => bool) public waiting;
    address[] public members;
    
    uint256 public id;
    bytes32 public name;
    uint256 public size;
    uint256 public cost;
    uint256 public time;

    function Tribe(uint256 _id, bytes32 _name, uint256 _amountOfmembers, uint256 _cost) public {
        farm = Farm(farmAddress);
        
        name = _name;
        id = _id;
        size = _amountOfmembers;
        cost = _cost;
        time = now;
    }
    
    function waitingMembers() public view returns (uint256){
        return members.length;
    }

    function BuyIn(address _user) payable public {
        require(msg.value == cost);

        // if a crop exists for a user, make that the user address
        address user = _user;
        if (farm.crops(_user) != 0x0){
            user = farm.crops(_user);
        }
        
        require(waiting[user] == false);
        
        members.push(user);
        waiting[user] = true;
        emit TribeJoined(user);

        // Iterate through members and distribute tokens
        if (members.length >= size){
            for (uint i=0; i<members.length;i++){
                // Each member buys in using their own node. Tribe theory is a beautiful thing.
                Crop(members[i]).buy.value(cost)(members[i]);
            }
            
            emit TribeCompleted(id, user, size);

            // Send any extra dividends back to the first member
            selfdestruct(msg.sender);
        }
    }
    
    function amIWaiting() public view returns (bool) {
        address user = msg.sender;
        // if there is a crop for the user, use it.
        if (farm.crops(msg.sender) != 0x0){
            user = farm.crops(msg.sender);
        }
        return waiting[user];
    }
    
    function Refund() public {
        address user = msg.sender;
        // if there is a crop for the user, use it.
        if (farm.crops(msg.sender) != 0x0){
            user = farm.crops(msg.sender);
        }
        
        require(waiting[user] == true);
        
        uint index = find(members, user);
        removeByIndex(members, index);     
        
        waiting[user] = false;
        (msg.sender).transfer(cost);
        if (members.length == 0){
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