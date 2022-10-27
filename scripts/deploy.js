const hre = require('hardhat');

const main = async () => {
  let owner, token, saft;
  [owner] = await ethers.getSigners();
  const MockERC20 = await ethers.getContractFactory('MockERC20');
  token = await MockERC20.deploy();
  console.log(`MockERC20 Token contract deployed to: ${token.address}`);
  const Saft = await ethers.getContractFactory('Saft');
  saft = await Saft.deploy(token.address); // Enter token contact address here
  console.log(`Saft contract deployed to: ${saft.address}`);
  /*
  // Example of setting a token lock
  const unlockTime = (await time.latest()) + 86400;
  const amount = ethers.utils.parseEther('1000');
  await token.approve(saft.address,amount);
  await saft.lock(investor1.address, amount, unlockTime);
  */
};

main();