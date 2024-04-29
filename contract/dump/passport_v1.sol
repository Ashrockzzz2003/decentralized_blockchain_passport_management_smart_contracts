// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Passport {

  address private admin;
  uint256 auto_increment_country_id = 0;
  uint256 auto_increment_issuer_id = 0;
  uint256 auto_increment_passport_id = 0;

  constructor() {
    admin = msg.sender;
  }

  struct Nationality {
    uint256 countryId;
    string countryName;
    string latLong;
    string createdAt;
  }

  struct Issuer {
    uint256 issuerId;
    address issuerAddress;
    string issuerName;
    uint256 issuerNationalityId;
    string createdAt;
  }

  struct PassportData {
    uint256 passportId;
    address userAddress;
    string userName;
    string userDob;
    uint256 userNationalityId;
    uint256 issuedBy;
    string createdAt;
  }

  mapping(address => bool) public isIssuer;
  
  mapping(string => bool) public isExistingIssuer;
  mapping(string => bool) public isExistingNationality;

  mapping(string => uint256) private issuerId;
  mapping(string => uint256) private nationalityId;
 
  mapping(address => bool) public inPendingStatusToVerify;
  mapping(address => bool) public hasPassport;

  mapping(address => PassportData) private pendingPassport;
  mapping(address => PassportData) private passportData;

  mapping(address => Issuer) private issuerData;
  mapping(uint256 => Nationality) private countryDataById;
  mapping(string => Nationality) private countryData;

  Nationality[] countryList;
  Issuer[] issuerList;

  mapping(uint256 => PassportData[]) pendingPassportList;

  modifier onlyAdmin() {
    require(msg.sender == admin, "Access Restricted");
    _;
  }

  modifier onlyIssuer() {
    require(isIssuer[msg.sender] == true, "Access Restricted");
    _;
  }

  function createNationality(string memory _countryName, string memory _latLong, string memory _createdAt) onlyAdmin public returns (bool) {
    require(isExistingNationality[_countryName] == false, "Country Already Exists");

    auto_increment_country_id++;

    countryData[_countryName] = Nationality(auto_increment_country_id, _countryName, _latLong, _createdAt);
    countryDataById[auto_increment_country_id] = Nationality(auto_increment_country_id, _countryName, _latLong, _createdAt);
    countryList.push(Nationality(auto_increment_country_id, _countryName, _latLong, _createdAt));

    isExistingNationality[_countryName] = true;
    nationalityId[_countryName] = auto_increment_country_id;

    return true;
  }

  function registerIssuer(string memory _issuerName, string memory _createdAt, string memory _countryName, address _issuerAddress) onlyAdmin public returns (bool) {
    require(isExistingIssuer[_issuerName] == false && isIssuer[_issuerAddress] == false, "Issuer Already Registered");
    require(isExistingNationality[_countryName] == true, "Country not found");

    uint256 _countryId = nationalityId[_countryName];

    if (_countryId == 0) {
      return false;
    }

    auto_increment_issuer_id++;

    issuerData[_issuerAddress] = Issuer(auto_increment_issuer_id, _issuerAddress, _issuerName, _countryId, _createdAt);
    isExistingIssuer[_issuerName] = true;
    isIssuer[_issuerAddress] = true;
    issuerId[_issuerName] = auto_increment_issuer_id;

    issuerList.push(Issuer(auto_increment_issuer_id, _issuerAddress, _issuerName, _countryId, _createdAt));

    return true;
  }

  // struct PassportData {
  //   uint256 passportId;
  //   address userAddress;
  //   string userName;
  //   string userDob;
  //   uint256 userNationalityId;
  //   uint256 issuedBy;
  //   string createdAt;
  // }

  function createPassport(address _userAddress, string memory _userName, string memory _userDob, string memory _countryName, string memory _createdAt) public returns (bool)  {
    require(hasPassport[_userAddress] == false, "User already has a passport");
    require(inPendingStatusToVerify[_userAddress] == false, "User passport pending verification.");
    require(isExistingNationality[_countryName] == true, "Country not found");

    uint256 _countryId = nationalityId[_countryName];

    auto_increment_passport_id++;
    pendingPassport[_userAddress] = PassportData(auto_increment_passport_id, _userAddress, _userName, _userDob, _countryId, 0, _createdAt);
    inPendingStatusToVerify[_userAddress] = true;

    pendingPassportList[_countryId].push(PassportData(auto_increment_passport_id, _userAddress, _userName, _userDob, _countryId, 0, _createdAt));

    return true;
  }

  function getMyPendingVerifications() public view onlyIssuer returns (PassportData[] memory) {
    Issuer memory issuer = issuerData[msg.sender];

    uint256 issuerCountryId = issuer.issuerNationalityId;
    return pendingPassportList[issuerCountryId];
  }

  function verifyPassport(uint _passportId) public onlyIssuer returns (bool) {

    Issuer memory issuer = issuerData[msg.sender];
    bool check = false;

    uint256 issuerCountryId = issuer.issuerNationalityId;

    uint256 passportIndex = 0;

    for (uint256 i = 0; i < pendingPassportList[issuerCountryId].length; i++) {
      if (pendingPassportList[issuerCountryId][i].passportId == _passportId) {
        check = true;
        passportIndex = i;
        break;
      }
    }

    if (!check) {
      return false;
    }

    passportData[pendingPassportList[issuerCountryId][passportIndex].userAddress] = pendingPassportList[issuerCountryId][passportIndex];
    hasPassport[pendingPassportList[issuerCountryId][passportIndex].userAddress] = true;
    passportData[pendingPassportList[issuerCountryId][passportIndex].userAddress].issuedBy = issuer.issuerId;

    for (uint256 i = passportIndex; i < pendingPassportList[issuerCountryId].length - 1; i++) {
      pendingPassportList[issuerCountryId][i] = pendingPassportList[issuerCountryId][i + 1];
    }
    pendingPassportList[issuerCountryId].pop();

    delete pendingPassport[pendingPassportList[issuerCountryId][passportIndex].userAddress];
    inPendingStatusToVerify[pendingPassportList[issuerCountryId][passportIndex].userAddress] = false;

    return true;
  }

  function getMyPassport() public view returns (PassportData memory) {
    return passportData[msg.sender];
  }

  function isPassportVerified(address _userAddress) public view returns (bool) {
    return hasPassport[_userAddress];
  }
  
}