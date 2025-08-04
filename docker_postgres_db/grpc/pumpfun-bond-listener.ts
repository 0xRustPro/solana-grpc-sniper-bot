import {
    CommitmentLevel,
    SubscribeRequest,
  } from "@triton-one/yellowstone-grpc";
  import pino from "pino";
  import Client from "@triton-one/yellowstone-grpc";
  import { PublicKey,VersionedTransactionResponse } from "@solana/web3.js";
  // import { buy, solanaConnection, sell } from "../transaction/transaction";
  import * as borsh from "@coral-xyz/borsh";
  import bs58 from "bs58";
  import base58 from "bs58";
  import { Buffer } from "buffer";
  import { struct, bool, u64, Layout } from "@coral-xyz/borsh";
  import { Idl } from "@project-serum/anchor";
  import {SolanaParser} from "@shyft-to/solana-transaction-parser";
  import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
  import {TransactionFormatter, SolanaEventParser, bnLayoutFormatter, transactionOutput, sell, buy} from "../../src/pumpfunsdk/pumpdotfun-sdk/src";
  import {createSubscribeNewPumpfunBondsTxRequest} from "./grpc-requests";
  import {token_db} from "../constants";
  import {handleSubscribe} from "./utils";
  let tokenSoldCount = {};
  let tokenRugCheckCount = {};
  let tokensHas40percentFreshWallet:any = {};
  const PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
  export const GLOBAL_ACCOUNT_SEED = "global";
  export const MINT_AUTHORITY_SEED = "mint-authority";
  export const BONDING_CURVE_SEED = "bonding-curve";
  const global_opeator = "jito";
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
  
  async function PingWhenTimeout(){
    //const currentSlot = await connection.getSlot("finalized");
    const pingNumber = await client.ping(1);
    //logger.info(`Ping number in price checker bot: ${pingNumber}`);
    if(pingNumber!==1) throw new Error("the grpc server has not response, restart the stream");

  }
  
  
  async function getBondingCurveAccount(
    mint: PublicKey
  ) {
    const tokenAccount = await connection.getAccountInfo(
      getBondingCurvePDA(mint),
      {
        commitment: "processed",
      }
    );
    if (!tokenAccount) {
      return null;
    }
    return BondingCurveAccount.fromBuffer(tokenAccount!.data);
  }
  function getBondingCurvePDA(mint: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(BONDING_CURVE_SEED), mint.toBuffer()],
        new PublicKey(PROGRAM_ID)
    )[0];
  }
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
  export const structure = struct([
    u64("discriminator"),
    u64("virtualTokenReserves"),
    u64("virtualSolReserves"),
    u64("realTokenReserves"),
    u64("realSolReserves"),
    u64("tokenTotalSupply"),
    bool("complete"),
  ]);
  
  
  export function decodeTransact(data){
    const output = base58.encode(Buffer.from(data,'base64'))
    return output;
  }

  export function  bondingCurveData(buffer: Buffer) {
  
    let value = structure.decode(buffer);
    const discriminator = BigInt(value.discriminator);
    const virtualTokenReserves = BigInt(value.virtualTokenReserves);
    const virtualSolReserves = BigInt(value.virtualSolReserves);
    const realTokenReserves = BigInt(value.realTokenReserves);
    const realSolReserves = BigInt(value.realSolReserves);
    const tokenTotalSupply = BigInt(value.tokenTotalSupply);
    const complete = value.complete;
    return {
        discriminator,
        virtualTokenReserves,
        virtualSolReserves,
        realTokenReserves,
        realSolReserves,
        tokenTotalSupply,
        complete
    };
  }

async function retriveCurveState(bonding_curve: string) {
    try {
      const filters = [
        {
          dataSize: 165, //size of account (bytes)
        },
        {
          memcmp: {
            offset: 32, //location of our query in the account (bytes)
            bytes: bonding_curve, //our search criteria, a base58 encoded string
          },
        },
      ];
      const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        { filters: filters }
      );
      let results: any = {};
      const solBalance = await connection.getBalance(
        new PublicKey(bonding_curve)
      );
      accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo: any = account.account.data;
        const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance =
          parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
  
        results[mintAddress] = tokenBalance;
        results["SOL"] = solBalance / 10 ** 9;
      });
      return results;
    } catch (e) {
      console.log(e);
    }
  }
  export async function tOutPut(data:any) {
    // Ensure data is defined and contains the necessary properties
    if (!data || !data.account || !data.account.account) {
        // throw new Error("Invalid data format");
        return;
    }


    const dataTx = data.account.account;

    // Safely decode each piece of transaction data
    const signature = dataTx.txnSignature ? decodeTransact(dataTx.txnSignature) : null;
    const pubKey:any = dataTx.pubkey ? decodeTransact(dataTx.pubkey) : null;
    const owner = dataTx.owner ? decodeTransact(dataTx.owner) : null;
    let poolstate:any = null;
    if(signature !== null){
    console.log("signature: ", signature);
    console.log("pubKey: ", pubKey);
    console.log("owner: ", owner)

    let targetToken = '';

    const curve_state = await retriveCurveState(pubKey);
    const accList = Object.keys(curve_state);
    console.log(accList);
    for(const token of accList){
        if(token !== "SOL") targetToken = token;
    }
    console.log(targetToken);
    try {
        poolstate = bondingCurveData(dataTx.data);
        console.log(poolstate);
        if(poolstate.complete === true){
          //token_db.insertNewGrad(targetToken, 0);
        }
    } catch (error) {
        console.error("Failed to decode pool state:", error);
    }
}
    
    return {
        signature,
        pubKey,
        owner,
        poolstate
    };
}
  
setInterval(PingWhenTimeout, 1000);

    
/**
 * Subscribes to a new pumpfun bonds and insert it to db
 */
export async function streamAnyNewBonds() {

    const stream = await client.subscribe();
    const r1: SubscribeRequest = await createSubscribeNewPumpfunBondsTxRequest();
    handleSubscribe(stream, r1);
    stream.on("data", (data:any) => {
    try{
        tOutPut(data);
    }catch(err){
        console.log(err)
    }

    });



}
  
streamAnyNewBonds();
  