1. Create account on hedera developer portal(testnet)

https://portal.hedera.com/register

Account Details -

{
"accountId": "0.0.47672314",
"publicKey": "302a300506.....afc47ace1426f",
"privateKey": "302a300506.....afc47ace1426f"
}

2. > npm init -y

3. Install Hashgraph SDK

   > npm i @hashgraph/sdk

4. Install solidity compiler

   > npm i dotenv solc

5. Creating Getter Setter Contract for a state variable

6. Now we need to compile it using solcjs and convert it to a bytecode to make it EVM compatible

> solcjs --bin LookupContract.sol

> Warning: Visibility for constructor is ignored. If you want the contract to be non-deployable, making it "abstract" is sufficient.
> --> LookupContract.sol:13:5:
> |
> 13 | constructor (string memory \_name, uint \_mobileNumber) public {
> | ^ (Relevant source part starts here and spans across multiple lines).

7. Bytecode is generated like

> LookupContract_sol_LookupContract.bin

8. Deploy Using JS File

9. O/P of index.js

```
- The bytecode file ID is: 0.0.47908481

- The smart contract ID is: 0.0.47908482

- The smart contract ID in Solidity format is: 0000000000000000000000000000000002db0682

- Here's the phone number that you asked for: 111111

- Contract function call status: SUCCESS

- Here's the phone number that you asked for: 222222

```
