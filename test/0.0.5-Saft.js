const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Saft", function () {
  let saft, token, owner, investor1, investor2;

  before(async () => {
    [owner, investor1, investor2] = await ethers.getSigners();
    const MockERC20 = await ethers.getContractFactory('MockERC20');
    token = await MockERC20.deploy();
    const Saft = await ethers.getContractFactory('Saft');
    saft = await Saft.deploy(token.address);
  });

  describe("MockERC20", function () {
    it("Owner has balance of Mock Token", async function () {
      const balance = await token.balanceOf(owner.address);
      expect(balance).to.gt(0);
    });

    it("Owner can lock tokens for investor1", async function () {
      const unlockTime = (await time.latest()) + 86400;
      const amount = ethers.utils.parseEther('1000');
      await token.approve(saft.address,amount);
      await saft.lock(investor1.address, amount, unlockTime);
      const lockDetails = await saft.vestedTokens(investor1.address,0);
      expect(lockDetails.amount).to.equal(amount);
    });

    it("investor1 can't withdraw tokens early", async function () {
      await expect(saft.connect(investor1).unlock(investor1.address))
        .to.be.revertedWith('Nothing to claim');
      const balance = await token.balanceOf(investor1.address);
      expect(balance).to.equal(0);
    });

    it("investor1 can withdraw tokens after lockup period", async function () {
      const amount = ethers.utils.parseEther('1000');
      const unlockTime = (await time.latest()) + 86400 + 1000;
      await time.increaseTo(unlockTime);
      await saft.connect(investor1).unlock(investor1.address);
      const balance = await token.balanceOf(investor1.address);
      expect(balance).to.equal(amount);
    });

    it("investor1 can't withdraw twice", async function () {
      await expect(saft.connect(investor1).unlock(investor1.address))
        .to.be.revertedWith('Nothing to claim');
    });

    it("Owner can lock multiple times for investor2", async function () {
      const unlockTime1 = (await time.latest()) + 86400;
      const unlockTime2 = (await time.latest()) + 86400 + 86400;
      const unlockTime3 = (await time.latest()) + 86400 + 86400 + 86400;
      const amount = ethers.utils.parseEther('1000');
      const totalAmount = ethers.utils.parseEther('3000');
      await token.approve(saft.address,totalAmount);
      await saft.lock(investor2.address, amount, unlockTime1);
      await saft.lock(investor2.address, amount, unlockTime2);
      await saft.lock(investor2.address, amount, unlockTime3);
      const lockDetails = await saft.vestedTokens(investor2.address,0);
      expect(lockDetails.amount).to.equal(amount);
    });

    it("investor2 can't withdraw tokens early", async function () {
      await expect(saft.connect(investor2).unlock(investor2.address))
        .to.be.revertedWith('Nothing to claim');
      const balance = await token.balanceOf(investor2.address);
      expect(balance).to.equal(0);
    });

    it("investor2 can withdraw two locks but not three", async function () {
      const amount = ethers.utils.parseEther('2000');
      const unlockTime = (await time.latest()) + 86400 + 86400 + 1000;
      await time.increaseTo(unlockTime);
      await saft.connect(investor2).unlock(investor2.address);
      const balance = await token.balanceOf(investor2.address);
      expect(balance).to.equal(amount);
    });

    it("investor2 can't withdraw last tokens", async function () {
      await expect(saft.connect(investor2).unlock(investor2.address))
        .to.be.revertedWith('Nothing to claim');
    });

    it("investor2 can withdraw thrid lock", async function () {
      const amount = ethers.utils.parseEther('3000');
      const unlockTime = (await time.latest()) + 86400 + 1000;
      await time.increaseTo(unlockTime);
      await saft.connect(investor2).unlock(investor2.address);
      const balance = await token.balanceOf(investor2.address);
      expect(balance).to.equal(amount);
    });
  });
});