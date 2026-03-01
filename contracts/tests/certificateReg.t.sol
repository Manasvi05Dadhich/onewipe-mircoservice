// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/certificateReg.sol";

contract  certificateRegTest is Test {
    certificateRegistry registry ;
    address admin = address(1);
    address uni1 = address(2);
    address uni2 = address(3);
    address randomUser = address(4);

    bytes hash = keccak256('cert1');

    function setup() public {
        vm.prank (admin);
        registry = new certificateRegistry();

        vm.prank(admin);
        registry.addIssuer(uni1);

        vm.prank(admin);
        registry.addIssuer(uni2);
    }

    function testIssue() public{
        vm.prank(uni1);
        registry.issueCert(hash);

        bool success = registry.issueCert();
        assertTrue(success);
    }

    function testDuplicateRevoke() public {
        vm.startPrank(uni1);
        registry.issueCert(hash);

        vm.expectRevert();
        registry.issueCert(hash);

        vm.stopPrank();
    }

     function testNonIssuerRevert() public {
        vm.prank(randomUser);
        vm.expectRevert();
        registry.issueCert(hash);
    }

     function testEmptyHashRevert() public {
        vm.prank(uni1);
        vm.expectRevert();
        registry.issueCert(bytes32(0));
    }

}