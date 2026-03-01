// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {

    address public owner ; 
    modifier onlyOwner () {
        require(msg.sender== owner, 'Not Admin' );
        _ ;  
    }

    constructor (){
        owner = msg.sender;
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

    event CertificateIssued(bytes32 hash , address issuer);
    event CertificateRevoked(bytes32 hash, address issuer);


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

    function verifyCertificate(bytes32 hash) external view returns (bool) {
        Certificate memory cert = certificates[hash];

        if (cert.issuer == address(0)) return false;
        if (cert.isRevoked) return false;
        return true;
    }

      function revokeCertificate(bytes32 hash) external {
        Certificate storage cert = certificates[hash];

        require(cert.issuer != address(0), "Cert not found");
        require(msg.sender == cert.issuer, "Only issuer can revoke");
        require(!cert.isRevoked, "Already revoked");

        cert.isRevoked = true;
        cert.revokedAt = block.timestamp;

        emit CertificateRevoked(hash, msg.sender);
    }
}  
