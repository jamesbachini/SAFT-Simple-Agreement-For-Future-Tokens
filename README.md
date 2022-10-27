# SAFT | Simple Agreement For Future Tokens

## Smart Contract

Contract is deployed using a token contract address in the constructor.

A token holder can then approve spend of their tokens and call lock(address _beneficiary, uint _amount, uint _unlockTimestamp)

This will allocate the amount of tokens to the beneficiary but they wont be able to get them until the block.timestamp reaches a set date.

Timestamp = number of seconds since January 1st 1970. See unit tests for examples of how to calculate this.

## Legal Agreement

An accompanying legal agreement is available on my blog at https://jamesbachini.com/saft/

## Install

```shell
npm install --save-dev hardhat
npm install --save-dev dotenv
npm install --save-dev chai
npm install --save-dev @nomiclabs/hardhat-etherscan
npm install --save-dev @nomicfoundation/hardhat-network-helpers
npm install --save-dev @nomicfoundation/hardhat-chai-matchers
npm install --save-dev @nomiclabs/hardhat-waffle
npm install --save-dev @nomiclabs/hardhat-ethers
npm install --save-dev @openzeppelin/contracts
npm install --save-dev ethereum-waffle
npx hardhat test
```
