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
 *  "I believe in large dividends!"                                                                                         
 *  What?
 *  -> Holds onto P3C tokens, and can ONLY reinvest in the P3C contract and accumulate more tokens.
 *  -> This contract CANNOT sell, give, or transfer any tokens it owns.
 */
 
contract Hourglass {
    function reinvest() public {}
    function myTokens() public view returns(uint256) {}
    function myDividends(bool) public view returns(uint256) {}
}

contract RainMaker {
    Hourglass p3c;
    address public p3cAddress = 0xDF9AaC76b722B08511A4C561607A9bf3AfA62E49;

    function RainMaker() public {
        p3c = Hourglass(p3cAddress);
    }

    function makeItRain() public {
        p3c.reinvest();
    }

    function myTokens() public view returns(uint256) {
        return p3c.myTokens();
    }
    
    function myDividends() public view returns(uint256) {
        return p3c.myDividends(true);
    }
}