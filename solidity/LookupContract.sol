// SPDX-License-Identifier: GPL-3.0
// Intialize ur license
pragma solidity >=0.7.0 <0.9.0; // solidity version

contract LookupContract { // Creating Contract with some name
    // Initializing a dict/hashmaps myDirectory storing key as stting and int as value
    // Making it public here can avoid us writing getter method where we only return the variable
    mapping (string => uint) public myDirectory;


    // Using _ for argument variables
    // Public Constructor
    constructor (string memory _name, uint _mobileNumber) public {
        // Using the above map
        myDirectory[_name] = _mobileNumber;
    }

    function setMobileNumber(string memory _name, uint _mobileNumber) public{
        myDirectory[_name] = _mobileNumber;
    }

    function getMobileNumber(string memory _name) public view returns(uint){
        return myDirectory[_name];
    }
}
// Now we need to compile it using solcjs and convert it to a bytecode to make it EVM compatible
// solcjs --bin LookupContract.sol 