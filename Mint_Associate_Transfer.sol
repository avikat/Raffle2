// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;
pragma experimental ABIEncoderV2;

import "./hip-206/HederaTokenService.sol";
import "./hip-206/HederaResponseCodes.sol";

// is - it is used for inheriting a class ie extends of TS
contract MintAssoTransHTS is HederaTokenService {

    address tokenAddress; // State Variable 

    constructor(address _tokenAddress) public {
        tokenAddress = _tokenAddress;
     }

    // Mint Fungible Token Function
    // Total Supply - Total Supply of our token
    // Serial Number - Used in Case of NFTs ???
    function mintFungibleToken(uint64 _amount) external {
        // We can inspect the hip-206 file for mintToken function
        (int response, uint64 newTotalSupply, int64[] memory serialNumbers) = HederaTokenService.mintToken(tokenAddress, _amount, new bytes[](0));

        if (response != HederaResponseCodes.SUCCESS) {
            revert ("Mint Failed");
        }
    }

    // Associating a token with the account
    function tokenAssociate(address _account) external {
        int response = HederaTokenService.associateToken(_account, tokenAddress);

        if (response != HederaResponseCodes.SUCCESS) {
            revert ("Associate Failed");
        }
    }

    // Transferring Token Using sender and reciever address
    function tokenTransfer(address _sender, address _receiver, int64 _amount) external {        
    int response = HederaTokenService.transferToken(tokenAddress, _sender, _receiver, _amount);
    
        if (response != HederaResponseCodes.SUCCESS) {
            revert ("Transfer Failed");
        }
    }
}

// Compiling the contract using  solcjs --bin Mint_Associate_Transfer.sol 
