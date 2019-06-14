var Voters = artifacts.require("./Voters_data.sol");

module.exports = function(deployer) {
    deployer.deploy(Voters);
};