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
}