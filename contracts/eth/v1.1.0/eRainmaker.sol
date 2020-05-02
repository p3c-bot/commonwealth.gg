pragma solidity ^0.4.21;
/***
 *     _______             __            __       __            __                           
 *    |       \           |  \          |  \     /  \          |  \                          
 *    | $$$$$$$\  ______   \$$ _______  | $$\   /  $$  ______  | $$   __   ______    ______  
 *    | $$__| $$ |      \ |  \|       \ | $$$\ /  $$$ |      \ | $$  /  \ /      \  /      \ 
 *    | $$    $$  \$$$$$$\| $$| $$$$$$$\| $$$$\  $$$$  \$$$$$$\| $$_/  $$|  $$$$$$\|  $$$$$$\
 *    | $$$$$$$\ /      $$| $$| $$  | $$| $$\$$ $$ $$ /      $$| $$   $$ | $$    $$| $$   \$$
 *    | $$  | $$|  $$$$$$$| $$| $$  | $$| $$ \$$$| $$|  $$$$$$$| $$$$$$\ | $$$$$$$$| $$      
 *    | $$  | $$ \$$    $$| $$| $$  | $$| $$  \$ | $$ \$$    $$| $$  \$$\ \$$     \| $$      
 *     \$$   \$$  \$$$$$$$ \$$ \$$   \$$ \$$      \$$  \$$$$$$$ \$$   \$$  \$$$$$$$ \$$      
 *              
 *  
 * v 1.1.0
 *  "I believe in large dividends!"                                                                                         
 *
 *  Ethereum Commonwealth.gg Rainmaker(based on contract @ ETC:0xa4ee9e650951b987d23367e29ce49f5350706a49)

 *  What?
 *  -> Holds onto eCOM tokens, and can ONLY reinvest in the eCOM contract and accumulate more tokens.
 *  -> This contract CANNOT sell, give, or transfer any tokens it owns.
 */

contract Hourglass {
    function reinvest() public {}
    function myTokens() public view returns(uint256) {}
    function myDividends(bool) public view returns(uint256) {}
}

contract RainMaker {
    Hourglass eCOM;
    address public eCOMAddress = 0xDF9AaC76b722B08511A4C561607A9bf3AfA62E49;

    function RainMaker() public {
        eCOM = Hourglass(eCOMAddress);
    }

    function makeItRain() public {
        eCOM.reinvest();
    }

    function myTokens() public view returns(uint256) {
        return eCOM.myTokens();
    }
    
    function myDividends() public view returns(uint256) {
        return eCOM.myDividends(true);
    }
}