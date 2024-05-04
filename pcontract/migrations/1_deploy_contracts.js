const Passport = artifacts.require("DecentralizedPassport");

module.exports = function(deployer) {
  deployer.deploy(Passport);
};
