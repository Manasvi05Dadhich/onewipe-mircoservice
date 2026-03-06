// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/certificateReg.sol";

contract CertificateRegTest is Test {
    CertificateRegistry registry;
    address admin = address(1);
    address uni1 = address(2);
    address uni2 = address(3);
    address randomUser = address(4);

    bytes32 hash = keccak256("cert1");

    function setUp() public {
        vm.prank(admin);
        registry = new CertificateRegistry();

        vm.prank(admin);
        registry.addIssuer(uni1);

        vm.prank(admin);
        registry.addIssuer(uni2);
    }

    function testIssue() public {
        vm.prank(uni1);
        registry.issueCert(hash);

        bool success = registry.verifyCertificate(hash);
        assertTrue(success);
    }

    function testDuplicateIssue() public {
        vm.startPrank(uni1);
        registry.issueCert(hash);

        vm.expectRevert("duplicate");
        registry.issueCert(hash);

        vm.stopPrank();
    }

    function testNonIssuerRevert() public {
        vm.prank(randomUser);
        vm.expectRevert("Not issuer");
        registry.issueCert(hash);
    }

    function testEmptyHashRevert() public {
        vm.prank(uni1);
        vm.expectRevert("empty hash");
        registry.issueCert(bytes32(0));
    }

    function testRevoke() public {
        vm.prank(uni1);
        registry.issueCert(hash);

        vm.prank(uni1);
        registry.revokeCertificate(hash);

        bool success = registry.verifyCertificate(hash);
        assertFalse(success);
    }
}
