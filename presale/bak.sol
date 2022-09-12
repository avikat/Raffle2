

// // Created by HashLips
// // The Nerdy Coder Clones
// // Warning: Function state mutability can be restricted to pure
// // Created NFT with Token ID: 0.0.48201952 

// pragma solidity ^0.8.0;

import "./../hip-206/HederaTokenService.sol";
import "./../hip-206/HederaResponseCodes.sol";
import "./../hip-206/ExpiryHelper.sol";
import "./../hip-206/IHederaTokenService.sol";

// contract Presale  {
//   // using Strings for uint256;

//   string public baseURI;
//   string public baseExtension = ".json";
//   uint256 public cost = 2000000000;
//   uint256 public maxSupply = 5;
//   uint256 public maxMintAmount = 2;
//   address public token = 0x0000000000000000000000000000000002df80E0;



//   // bool public paused = false;
//   // mapping(address => bool) public whitelisted;

//   // constructor(
//   //   string memory _name,
//   //   string memory _symbol,
//   //   string memory _initBaseURI
//   // ) 
// // ERC721(_name, _symbol) {
// //     setBaseURI(_initBaseURI);
// //     mint(msg.sender, 20);
// //   }

//   // internal
// //   function _baseURI() internal view virtual override returns (string memory) {
// //     return baseURI;
// //   }

//   // public
//   // event Log(address to, uint64 serialNo, bytes[] metadata);
//   event Start(string x);

//   // event P
  function mint() public {
    // bytes[1] memory data;
    emit Start("Hi From Start");
    uint64 x = 0;
    // bytes[] memory data;

    // bytes memory cid = "697066733a2f2f626166797265696273726872646d6970796e356734647768717364626272347967656d6d36787a72366272706575346d74787874757762697579342f6d657461646174612e6a736f6e";
    // data[1] = ("ipfs://bafyreibsrhrdmipyn5g4dwhqsdbb213gemm6xzr6brpeu4mtxxtuwbiuy4/metadata.json");
    // data[1] = sha256(bytes ("ipfs://bafyreibsrhrdmipyn5g4dwhqsdbb213gemm6xzr6brpeu4mtxxtuwbiuy4/metadata.json"));
    // bytes memory  str1 = hex"A76A95918C39eE40d4a43CFAF19C35050E32E271";

    // bytes memory cid = "ipfs://bafyreibsrhrdmipyn5g4dwhqsdbb213gemm6xzr6brpeu4mtxxtuwbiuy4/metadata.json";

    // bytes memory data = ("ipfs://bafyreibsrhrdmipyn5g4dwhqsdbb213gemm6xzr6brpeu4mtxxtuwbiuy4/metadata.json");
    // bytes[] memory data = new bytes[]();
    bytes[] memory data = new bytes[](1);
    data[1] = bytes("ipfs://bafyreihrdz2ny6auwkaec7hqbb6av5oyw525ni6yedjkxt2mito27ekskq/metadata.json");
    // data.push()
    emit Log(_to, x, data);

    MintAndSend(_to, x, data);

  }

  function MintAndSend(address to, uint64 serialNo, bytes[] memory metadata) internal returns(int64, int){

      int res2 = HederaTokenService.associateToken(to, token);
      if (res2 != HederaResponseCodes.SUCCESS) {
          revert ("Associate Failed");
      }
      (int response, , int64[] memory serial) = HederaTokenService.mintToken(token, serialNo, metadata);
      if(response != HederaResponseCodes.SUCCESS){
          revert("Failed to mint non-fungible token");
      }
      int res = HederaTokenService.transferNFT(token, address(this), to, int64(serialNo));
      if(response != HederaResponseCodes.SUCCESS){
          revert("Failed to transfer non-fungible token");
      }
      return (serial[0], res);
      
    }
  // function walletOfOwner(address _owner)
  //   public
  //   view
  //   returns (uint256[] memory)
  // {
  //   uint256 ownerTokenCount = balanceOf(_owner);
  //   uint256[] memory tokenIds = new uint256[](ownerTokenCount);
  //   for (uint256 i; i < ownerTokenCount; i++) {
  //     tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
  //   }
  //   return tokenIds;
  // }

//   // function tokenURI(uint256 tokenId)
//   //   public
//   //   view
//   //   virtual
//   //   override
//   //   returns (string memory)
//   // {
//   //   require(
//   //     _exists(tokenId),
//   //     "ERC721Metadata: URI query for nonexistent token"
//   //   );

//   //   string memory currentBaseURI = _baseURI();
//   //   return bytes(currentBaseURI).length > 0
//   //       ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
//   //       : "";
//   // }

//   //only owner
// //   function setCost(uint256 _newCost) public onlyOwner {
// //     cost = _newCost;
// //   }

// //   function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
// //     maxMintAmount = _newmaxMintAmount;
// //   }

// //   function setBaseURI(string memory _newBaseURI) public onlyOwner {
// //     baseURI = _newBaseURI;
// //   }

// //   function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
// //     baseExtension = _newBaseExtension;
// //   }

// //   function pause(bool _state) public onlyOwner {
// //     paused = _state;
// //   }
 
// //  function whitelistUser(address _user) public onlyOwner {
// //     whitelisted[_user] = true;
// //   }
 
// //   function removeWhitelistUser(address _user) public onlyOwner {
// //     whitelisted[_user] = false;
// //   }

// //   function withdraw() public payable onlyOwner {
// //     require(payable(msg.sender).send(address(this).balance));
// //   }
// }


// // - Deploying contract...
// // - The smart contract ID is: 0.0.48203245
// // - The smart contract ID in Solidity format is: 0000000000000000000000000000000002df85ed
