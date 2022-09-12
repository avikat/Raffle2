// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.7.0 <0.9.0;

import "./IPrngSystemContract.sol";


contract PrngSystemContract {
    // Prng system contract address with ContractID 0.0.361
    address constant PRECOMPILE_ADDRESS = address(0x169);

    function getPseudorandomSeed() external returns (bytes32 seedBytes) {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IPrngSystemContract.getPseudorandomSeed.selector));
        require(success, "PRNG system call failed");
        seedBytes = abi.decode(result, (bytes32));
    }
     function getPseudorandomNumber(uint32 lo, uint32 hi) external returns (uint32) {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(IPrngSystemContract.getPseudorandomSeed.selector));
        require(success);
        uint32 choice;
        assembly {
            choice := mload(add(result, 0x20))
        }
        return lo + (choice % (hi - lo));
    }
}
