// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Saft {
    address token;
    struct LockDetails {
        uint unlockTimestamp;
        uint amount;
    }
    mapping (address => LockDetails[]) public vestedTokens;
    mapping (address => uint) public claimed;

    constructor (address _tokenContractAddress) {
        token = _tokenContractAddress;
    }

    function lock(address _beneficiary, uint _amount, uint _unlockTimestamp) public {
        require(vestedTokens[_beneficiary].length < 100, "Limit of 100 locks per address to avoid unbounded loop");
        IERC20(token).transferFrom(msg.sender,address(this), _amount);
        vestedTokens[_beneficiary].push(LockDetails(_unlockTimestamp,_amount));
    }

    function unlock(address _beneficiary) public {
        uint amountAvailable;
        for (uint i=0; i<vestedTokens[_beneficiary].length; i++) {
            if (vestedTokens[_beneficiary][i].unlockTimestamp < block.timestamp) {
                amountAvailable += vestedTokens[_beneficiary][i].amount;
            }
        }
        uint claimable = amountAvailable - claimed[_beneficiary];
        require(claimable > 0, "Nothing to claim"); 
        claimed[_beneficiary] += claimable;
        IERC20(token).transfer(_beneficiary, claimable);
    }
}