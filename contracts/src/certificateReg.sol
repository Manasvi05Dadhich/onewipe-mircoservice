// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract certificateRegistry {

    address public owner ; 
    modifier onlyOwner () {
        require(msg.sender== owner, 'Not Admin' );
        _ ;  
    }

    constructor (){
        owner == msg.sender;
    }

    mapping(address => bool) public issuers ;

    function addIssuer (address uni ) external onlyOwner(){
        require(uni !=  address(0), "Invalid address");
        issuers[uni] = true ;
        }

    function removeIssuer(address uni ) external onlyOwner(){
        issuers[uni] = false  ;
    }

    modifier onlyIssuer() {
          require(issuers[msg.sender], "Not issuer");
        _;
    }

    struct Certificate {
        address issuer;
        uint256 issuedAt;
        bool isRevoked;
        
        uint256 revokedAt;
    }

    mapping(bytes32 => Certificate) public certificates ;

    event certIssued(bytes32 hash , address issuer);
    event  certRevoked(bytes32 hash, address issuer);


    function issueCert(bytes32 hash) external onlyIssuer{
        require(hash != bytes32(0), "empty hash");
        require(certificates[hash].issuer== address(0), "duplicate");

        certificates[hash] = Certificate({
            issuer : msg.sender,
            issuedAt : block.timestamp,
            isRevoked : false,
             revokedAt : 0
        });

        
        emit CertificateIssued(hash, msg.sender);
    }
    
}