// // SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Presale {
    // sample event
    // event SetMessage(address indexed from, string message);
    event ContractStart(address indexed from, string message);

    // the message we're storing
    // string message;

    function mint() public {
        emit ContractStart(msg.sender, "APAPAPAP");
    }
}
