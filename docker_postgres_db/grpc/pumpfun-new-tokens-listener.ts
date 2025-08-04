import {
    CommitmentLevel,
    SubscribeRequest,
  } from "@triton-one/yellowstone-grpc";
import pino from "pino";
import base58 from "bs58";
import Client from "@triton-one/yellowstone-grpc";
import { PublicKey } from "@solana/web3.js";
import * as borsh from "@coral-xyz/borsh";
import bs58 from "bs58";
import { Buffer } from "buffer";
import { Idl } from "@project-serum/anchor";
import {SolanaParser} from "@shyft-to/solana-transaction-parser";
import {TransactionFormatter, SolanaEventParser, bnLayoutFormatter, transactionOutput, buy, sell,launchTransactionOutput1, snipe} from "../../src/pumpfunsdk/pumpdotfun-sdk/src";
import pumpFunIdl from "../../src/pumpfunsdk/pumpdotfun-sdk/src/IDL/pump-fun.json";
import {createSubscribeNewPumpfunTokenRequest } from "./grpc-requests"
import {handleSubscribe} from "./utils";
import {data_db} from "./constants";
//import {master_db } from "../master-wallet-checker/constants";
// import {checkIfFreshWallet} from "../master-wallet-checker/rugCheck";
const PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";

const client:any = new Client(
GRPC_URL,
GRPC_XTOKEN,
{
    "grpc.max_receive_message_length": 64 * 1024 * 1024, // 64MiB
}
); //grpc endpoint
const TXN_FORMATTER = new TransactionFormatter();
const PUMP_FUN_PROGRAM_ID = new PublicKey(
  PROGRAM_ID
);
const PUMP_FUN_IX_PARSER = new SolanaParser([]);
PUMP_FUN_IX_PARSER.addParserFromIdl(
  PUMP_FUN_PROGRAM_ID.toBase58(),
  pumpFunIdl as Idl,
);
const PUMP_FUN_EVENT_PARSER = new SolanaEventParser([], console);
PUMP_FUN_EVENT_PARSER.addParserFromIdl(
  PUMP_FUN_PROGRAM_ID.toBase58(),
  pumpFunIdl as Idl,
);
function decodePumpFunTxn(tx: any) {

    if(tx.meta === undefined) return;
    if (tx.meta?.err) return;
  
    const paredIxs = PUMP_FUN_IX_PARSER.parseTransactionData(
      tx.transaction.message,
      tx.meta.loadedAddresses,
    );
  
    const pumpFunIxs = paredIxs.filter((ix) =>
      ix.programId.equals(PUMP_FUN_PROGRAM_ID),
    );
  
    if (pumpFunIxs.length === 0) return;
    const events = PUMP_FUN_EVENT_PARSER.parseEvent(tx);
    const result = { instructions: pumpFunIxs, events };
    bnLayoutFormatter(result);
    return result;
  }
async function getLatestPriceInSOL(virtualSolReserves:number, virtualTokenReserves:number){
const fixedTokenSupply = 1000000000;
return (
    ((fixedTokenSupply * virtualSolReserves) / virtualTokenReserves)/10**12
);
}
  
export async function checkLatestPrice(txout:any){
  if(txout === undefined) return { type: "", tokenAddress: "", user: "", tokenAmount: 0, solAmount: 0, latestPrice: 0, noOfBundledBuys: 0, isRug: false, devAddress: "" };
  const type = txout.type;
  const tokenAddress = txout.mint;
  const noOfBundledBuys = txout.noOfBundledBuys;
  const user = txout.user;
  const tokenAmount = txout.tokenAmount;
  const solAmount = txout.solAmount;
  const isRug = txout.isRug;
  const devAddress = txout.devAddress;
  const latestPrice = (await getLatestPriceInSOL(txout.virtualSolReserves, txout.virtualTokenReserves)).toFixed(11);

  return { type, tokenAddress, user, tokenAmount, solAmount, latestPrice, noOfBundledBuys, isRug, devAddress };
}

export async function checkBondingCurvePercentageAndPrice(data:any, txout:any, signature:string){
    const {type, tokenAddress, user, tokenAmount, solAmount, latestPrice, noOfBundledBuys, isRug, devAddress} = await checkLatestPrice(txout);

    

    data_db.insertTokenRug(tokenAddress, 0);
    const tokenAmt = tokenAmount/10**6;
    const currentTimestamp = Date.now();
    let tokenName = "";

    data_db.updateTokenName(tokenAddress, tokenName);
    data_db.insertLatestToken(tokenAddress, user, solAmount, 0, currentTimestamp, 0, Number(latestPrice), tokenAmt);
    data_db.insertPfLaunchTxn(tokenAddress, signature);


}   

/**
 * Subscribes to a new pumpfun token and insert it to db
 */
export async function streamAnyNewTokens() {
const stream = await client.subscribe();
const r1: SubscribeRequest = await createSubscribeNewPumpfunTokenRequest(undefined);
handleSubscribe(stream, r1);
stream.on("data", (data:any) => {
    if (data.transaction !== undefined) {
        const txn = TXN_FORMATTER.formTransactionFromJson(
            data.transaction,
            Date.now(),
          );
        let parsedTxn = decodePumpFunTxn(txn);
        if (!parsedTxn) return;
        const signature = base58.encode(data.transaction.transaction.signature);
        console.log("Signature: ", signature);
        const tOutput = launchTransactionOutput1(parsedTxn, {})
    //logger.info(`New token created: ${data.transaction.transaction.meta.postTokenBalances[0].mint}`);
        checkBondingCurvePercentageAndPrice(data, tOutput, signature);
    }
});

}

streamAnyNewTokens();