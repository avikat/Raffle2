// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import "./IPrngSystemContract.sol";

error Raffle__NotOpen();
error Raffle__InsufficientPlayers();
error Raffle__InsufficientHbarSent();
error Raffle__TxFeeFailed();
error Raffle__WinnerTxFailed();
error Raffle__AlreadyOpen();

// error Raffle_NotEnoughEthEntered();
// error Raffle_TransferFailed();
// error Raffle_NotOpen();
// error Raffle_UpkeepNotNeeded(
//     uint256 currentBalance,
//     uint256 numPlayers,
//     uint256 RaffleState
// );

// import "./../util-precompile/PrngSystemContract.sol" ;

contract Raffle {
    address constant PRECOMPILE_ADDRESS = address(0x169);
    address payable[] players;
    address payable[] lastplayers;
    bool raffleOpen = false;
    address owner = address(0x2df9d9c);
    address payable ownerPayable = payable(owner);
    address lastWinner;

    event Log(address sende, string message);
    event Log2(uint256 val, address sende);
    event Log3(uint256 val, address sende);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function getPseudorandomSeed() external returns (bytes32 seedBytes) {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(
                IPrngSystemContract.getPseudorandomSeed.selector
            )
        );
        require(success, "PRNG system call failed");
        seedBytes = abi.decode(result, (bytes32));
    }

    function getPseudorandomNumber(uint32 lo, uint32 hi)
        internal
        returns (uint32)
    {
        (bool success, bytes memory result) = PRECOMPILE_ADDRESS.call(
            abi.encodeWithSelector(
                IPrngSystemContract.getPseudorandomSeed.selector
            )
        );
        require(success);
        uint32 choice;
        assembly {
            choice := mload(add(result, 0x20))
        }
        return lo + (choice % (hi - lo));
    }

    function WinnerIndex() internal returns (uint32) {
        uint32 lo = 0;
        uint32 hi = 10000000;
        uint32 random = getPseudorandomNumber(lo, hi);
        return random;
    }

    function sendAndAddParticipant() external payable {
        if (!raffleOpen) {
            revert Raffle__NotOpen();
        }

        if (msg.value != 100000000) {
            revert Raffle__InsufficientHbarSent();
        }

        players.push(payable(msg.sender));
        emit Log(msg.sender, "entered");
    }

    function checkRaffleState() private returns (bool upKeepNeeded) {
        bool enoughPlayers = players.length > 2;
        bool hasBalance = address(this).balance > 0;
        upKeepNeeded = (raffleOpen && enoughPlayers && hasBalance);
        if (!raffleOpen) {
            revert Raffle__NotOpen();
        } else if (!enoughPlayers) {
            revert Raffle__InsufficientPlayers();
        } else if (!hasBalance) {
            revert Raffle__InsufficientHbarSent();
        } else {
            raffleOpen = false;
            return upKeepNeeded;
        }
    }

    function processWinner() internal {
        bool upKeepNeeded = checkRaffleState();
        if (upKeepNeeded) {
            uint32 random = WinnerIndex() % uint32(players.length);

            address payable recentWinner = players[random];
            lastWinner = recentWinner;
            lastplayers = players;
            players = new address payable[](0);
            uint256 value = address(this).balance;
            (bool success, ) = recentWinner.call{
                value: (address(this).balance) * 0.8
            }("");
            if (!success) {
                revert Raffle__WinnerTxFailed();
            }
            emit Log2(value * 0.8, recentWinner);
            (bool sucess, ) = ownerPayable.call{value: address(this).balance}(
                ""
            );
            if (!success) {
                revert Raffle__TxFeeFailed();
            }
            emit Log3(value * 0.2, owner);
        }
    }

    function Open() external onlyOwner {
        if (raffleOpen == true) {
            revert Raffle__AlreadyOpen();
        } else {
            raffleOpen = true;
        }
    }

    function Close() external onlyOwner {
        if (raffleOpen == false) {
            revert Raffle__NotOpen();
        } else {
            processWinner();
        }
    }

    function getPlayers() public view returns (address payable[] memory) {
        // address payable memory
        address payable[] memory lasts = players;
        return lasts;
    }

    function getNumPlayers() public view returns (uint) {
        return players.length;
    }

    function getLastWinner() public view returns (address) {
        return lastWinner;
    }

    function getLastPlayers() public view returns (address payable[] memory) {
        address payable[] memory lasts = lastplayers;
        return lasts;
    }
}

////hedera token minter

// pragma solidity ^0.8.0;

// import "./../hip-206/HederaTokenService.sol";
// import "./../hip-206/HederaResponseCodes.sol";
// import "./../hip-206/ExpiryHelper.sol";

// contract Presale is HederaTokenService {
//     string public baseURI;
//     uint256 public cost = 2000000000;
//     uint256 public maxSupply = 5;
//     uint256 public maxMintAmount = 2;
//     address public token = 0x0000000000000000000000000000000002df80E0;

//     bytes[] data2;

//     event InputData(address indexed addr, uint64 serialNo, bytes[] metadata);

//     function mint() external payable {
//         uint64 x = 0;
//         bytes memory data= bytes("bafyreihrdz2ny6auwkaec7hqbb6av5oyw525ni6yedjkxt2mito27ekskq/metadata.json");
//         data2.push(data);
//         // bytes[] memory data3 = data2;
//         emit InputData(msg.sender, x, data2);
//         MintAndSend(msg.sender, x, data2);
//         data2.pop();
//     }

//     function MintAndSend(address to, uint64 serialNo, bytes[] memory metadata) internal returns(int){
//         int res = HederaTokenService.associateToken(to, token);
//         if(res != HederaResponseCodes.SUCCESS){
//             revert("Failed to mint non-fungible token");
//         }
//         (int response, uint64 newTotalSupply, int64[] memory serial ) = HederaTokenService.mintToken(token, serialNo, metadata);
//         emit InputData(msg.sender, newTotalSupply, metadata);
//         if(response != HederaResponseCodes.SUCCESS){
//             revert("Failed to mint non-fungible token");
//         }
//         int res1 = HederaTokenService.transferNFT(token, address(this), to, int64(serial[0]));
//         emit InputData(msg.sender, serialNo, metadata);
//         if(res1 != HederaResponseCodes.SUCCESS){
//             revert("Failed to transfer non-fungible token");
//         }
//         return res1;
//         // return (serial[0], res);
//     }
// }
