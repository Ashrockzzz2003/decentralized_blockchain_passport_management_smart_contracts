// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedPassport {
    address private admin;
    uint256 auto_increment_country_id = 0;
    uint256 auto_increment_issuer_id = 0;
    uint256 auto_increment_passport_id = 0;

    constructor() {
        admin = msg.sender;
    }

    struct Country {
        uint256 countryId;
        string countryName;
        string latLong;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Issuer {
        uint256 issuerId;
        address issuerAddress;
        string issuerName;
        uint256 issuerCountryId;
        uint256 createdAt;
    }

    struct PassportData {
        uint256 passportId;
        address userAddress;
        string userName;
        string userDob;
        uint256 userCountryId;
        uint256 issuedBy;
        uint256 createdAt;
    }

    mapping(string => bool) public isCountry;
    mapping(uint256 => Country) private countryById;
    mapping(string => Country) public countryByName;

    mapping(address => bool) public isIssuer;
    mapping(string => Issuer) private issuerByName;
    mapping(address => Issuer) private issuerByAddress;
    mapping(uint256 => Issuer[]) private issuerData;

    mapping(address => bool) hasPassport;
    mapping(address => bool) hasPendingPassport;
    mapping(uint256 => PassportData[]) private pendingPassportData;
    mapping(uint256 => PassportData[]) private passportData;
    mapping(address => PassportData) private myPassport;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only Admin");
        _;
    }

    modifier onlyIssuer() {
        require(isIssuer[msg.sender], "Only Issuer");
        _;
    }

    function isAdmin() public view returns (bool) {
        return msg.sender == admin;
    }

    // Country API
    event CountryAdded(
        uint256 countryId,
        string countryName,
        string latLong,
        uint256 createdAt
    );
    function addCountry(
        string memory _countryName,
        string memory _latLong
    ) public onlyAdmin {
        require(!isCountry[_countryName], "Country already exists");
        auto_increment_country_id++;
        Country memory country = Country(
            auto_increment_country_id,
            _countryName,
            _latLong,
            block.timestamp,
            block.timestamp
        );
        countryById[auto_increment_country_id] = country;
        countryByName[_countryName] = country;
        isCountry[_countryName] = true;

        emit CountryAdded(
            auto_increment_country_id,
            _countryName,
            _latLong,
            block.timestamp
        );
    }

    event CountryUpdated(
        uint256 countryId,
        string countryName,
        string latLong,
        uint256 updatedAt
    );
    function updateCountry(
        uint256 _countryId,
        string memory _countryName,
        string memory _latLong
    ) public onlyAdmin {
        require(isCountry[_countryName], "Country does not exists");
        Country storage country = countryById[_countryId];
        country.countryName = _countryName;
        country.latLong = _latLong;
        country.updatedAt = block.timestamp;
        countryByName[_countryName] = country;

        emit CountryUpdated(
            _countryId,
            _countryName,
            _latLong,
            block.timestamp
        );
    }

    // Issuer API
    event IssuerAdded(
        uint256 issuerId,
        address issuerAddress,
        string issuerName,
        uint256 issuerCountryId,
        uint256 createdAt
    );
    function registerIssuer(
        address _issuerAddress,
        string memory _issuerName,
        string memory _issuerCountry
    ) public onlyAdmin {
        require(!isIssuer[_issuerAddress], "Issuer already exists");
        require(isCountry[_issuerCountry], "Country does not exists");
        auto_increment_issuer_id++;
        Issuer memory issuer = Issuer(
            auto_increment_issuer_id,
            _issuerAddress,
            _issuerName,
            countryByName[_issuerCountry].countryId,
            block.timestamp
        );
        issuerByName[_issuerName] = issuer;
        issuerByAddress[_issuerAddress] = issuer;
        isIssuer[_issuerAddress] = true;
        issuerData[countryByName[_issuerCountry].countryId].push(issuer);

        emit IssuerAdded(
            auto_increment_issuer_id,
            _issuerAddress,
            _issuerName,
            countryByName[_issuerCountry].countryId,
            block.timestamp
        );
    }

    function getIssuerByCountry(
        string memory _countryName
    ) public view returns (Issuer[] memory) {
        require(isCountry[_countryName], "Country does not exists");
        return issuerData[countryByName[_countryName].countryId];
    }

    // Passport API
    // requestPassport, no issuer
    function requestPassport(
        string memory _userName,
        string memory _userDob,
        string memory _userCountry
    ) public {
        require(!hasPassport[msg.sender], "Passport already exists");
        require(!hasPendingPassport[msg.sender], "Passport already requested");
        require(isCountry[_userCountry], "Country does not exists");
        auto_increment_passport_id++;
        PassportData memory passport = PassportData(
            auto_increment_passport_id,
            msg.sender,
            _userName,
            _userDob,
            countryByName[_userCountry].countryId,
            0,
            block.timestamp
        );
        pendingPassportData[countryByName[_userCountry].countryId].push(
            passport
        );
        hasPendingPassport[msg.sender] = true;
    }

    // getPendingPassport, issuer, no params. use msg.sender
    function getPendingPassport()
        public
        view
        onlyIssuer
        returns (PassportData[] memory)
    {
        require(isIssuer[msg.sender], "Only Issuer");
        return pendingPassportData[issuerByAddress[msg.sender].issuerCountryId];
    }

    // approvePassport, issuer, passportId
    function approvePassport(uint256 _passportId) public onlyIssuer {
        require(isIssuer[msg.sender], "Only Issuer");
        require(
            pendingPassportData[issuerByAddress[msg.sender].issuerCountryId]
                .length > 0,
            "No pending passport"
        );
        bool found = false;
        for (
            uint256 i = 0;
            i <
            pendingPassportData[issuerByAddress[msg.sender].issuerCountryId]
                .length;
            i++
        ) {
            if (
                pendingPassportData[
                    issuerByAddress[msg.sender].issuerCountryId
                ][i].passportId == _passportId
            ) {
                found = true;
                PassportData memory passport = pendingPassportData[
                    issuerByAddress[msg.sender].issuerCountryId
                ][i];
                passport.issuedBy = issuerByAddress[msg.sender].issuerId;
                passportData[passport.userCountryId].push(passport);
                hasPassport[passport.userAddress] = true;
                hasPendingPassport[passport.userAddress] = false;
                myPassport[passport.userAddress] = passport;

                // remove from pending
                for (
                    uint256 j = i;
                    j <
                    pendingPassportData[
                        issuerByAddress[msg.sender].issuerCountryId
                    ].length -
                        1;
                    j++
                ) {
                    pendingPassportData[
                        issuerByAddress[msg.sender].issuerCountryId
                    ][j] = pendingPassportData[
                        issuerByAddress[msg.sender].issuerCountryId
                    ][j + 1];
                }
                pendingPassportData[issuerByAddress[msg.sender].issuerCountryId]
                    .pop();

                break;
            }
        }
        require(found, "Passport not found");
    }

    // getPassport, user
    function getPassport() public view returns (PassportData memory) {
        require(hasPassport[msg.sender], "Passport does not exists");
        return myPassport[msg.sender];
    }

    // getPassportByAddress, user
    function getPassportByAddress(
        address _userAddress
    ) public view onlyIssuer returns (PassportData memory) {
        require(hasPassport[_userAddress], "Passport does not exists");
        return myPassport[_userAddress];
    }

    // public to verify user passport
    function verifyPassport(address _userAddress) public view returns (bool) {
        require(hasPassport[_userAddress], "Passport does not exists");

        PassportData memory passport = myPassport[_userAddress];

        if (passport.issuedBy == 0) {
            return false;
        }

        return true;
    }
}
