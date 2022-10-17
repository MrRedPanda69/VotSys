const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Voting Unit Tests", () => {
    let voting;
    let deployer;
    let voter;

    beforeEach(async () => {
      deployer = (await getNamedAccounts()).deployer;
      voter = (await getNamedAccounts()).voter;
      await deployments.fixture(["all"]);
      voting = await ethers.getContract("Voting", deployer);
    });
    
    describe("add candidate", () => {
      it("add candidate - admin", async () => {
        await voting.addCandidate("Jorge", "Loredo", "Team Venti");
        const newCandidate = String(await voting.candidates(0));
        assert.equal(newCandidate, "0,Jorge,Loredo,Team Venti,0");
      });
      it("add candidate - user", async () => {
        voting = await ethers.getContract("Voting", voter);
        await expect(voting.addCandidate("Jorge", "Loredo", "Team Venti")).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });

    describe("vote", () => {
      it("vote successfully", async () => {
        await voting.addCandidate("Jorge", "Loredo", "Team Venti");
        await voting.vote(0);
        const votesNumber = String(await voting.candidates(0)).split(",")[4];
        assert.equal(votesNumber, "1");
      });
      it("can't vote again", async () => {
        await voting.addCandidate("Jorge", "Loredo", "Team Venti");
        await voting.vote(0);
        await expect(voting.vote(0)).to.be.revertedWith("You can't vote more than once");
      });
    });
  });