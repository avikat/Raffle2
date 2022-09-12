import dotenv from "dotenv";
import {
  AccountId,
  PrivateKey,
  Client,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  ContractCallQuery,
  TransferTransaction,
  ContractInfoQuery,
  ContractCreateFlow,
  Hbar,
  AccountCreateTransaction,
} from "@hashgraph/sdk";
import { readFileSync } from "fs";
dotenv.config();

export async function getContract(contract)
{
    const [contractId, contractAddress] = await contractDeployFcn(
        contractBytecode,
        gasLimit
      );

      return (contractId,contractAddress)


}

export async function contractDeployFcn(bytecode, gasLim) {
    const contractCreateTx = new ContractCreateFlow()
      .setBytecode(bytecode)
      .setGas(gasLim);
    const contractCreateSubmit = await contractCreateTx.execute(client);
    const contractCreateRx = await contractCreateSubmit.getReceipt(client);
    const contractId = contractCreateRx.contractId;
    const contractAddress = contractId.toSolidityAddress();
    return [contractId, contractAddress];
  }

// module.exports = {getContract,contractDeployFcn}