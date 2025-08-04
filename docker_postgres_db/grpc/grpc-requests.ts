import {
    CommitmentLevel,
    SubscribeRequest,
  } from "@triton-one/yellowstone-grpc";
import { struct, bool, u64, Layout } from "@coral-xyz/borsh";

export async function createSubscribeNewPumpfunTokenRequest(
    targetToken: string | undefined
  ): Promise<SubscribeRequest> {
    let request: any = null;
    if (targetToken !== undefined) {
      // if has target mint to snipe
      request = {
        slots: {},
        accounts: {},
        transactions: {
          pumpdotfun: {
            vote: false,
            failed: false,
            signature: undefined,
            accountInclude: [
              "TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM",
              targetToken,
            ],
            accountExclude: [],
            accountRequired: [targetToken],
          },
        },
        transactionsStatus: {},
        blocks: {},
        blocksMeta: {},
        accountsDataSlice: [],
        commitment: CommitmentLevel.PROCESSED, // Subscribe to processed blocks for the fastest updates
        entry: {},
      };
    } else {
      // if doesn't have target mint to snipe
      request = {
        slots: {},
        accounts: {},
        transactions: {
          pumpdotfun: {
            vote: false,
            failed: false,
            signature: undefined,
            accountInclude: ["TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM"],
            accountExclude: [],
            accountRequired: [],
          },
        },
        transactionsStatus: {},
        blocks: {},
        blocksMeta: {},
        accountsDataSlice: [],
        commitment: CommitmentLevel.PROCESSED, // Subscribe to processed blocks for the fastest updates
        entry: {},
      };
    }
  
    return request;
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
  
export async function createSubscribeNewPumpfunBondsTxRequest(){

    const req = {
      "slots": {},
      "accounts": {
        "pumpfun": {
          "account": [],
          "filters": [
            {
              "memcmp": {
                "offset": structure.offsetOf('complete').toString(),
                "bytes" : Uint8Array.from([1])
              }
            }
          ],
          "owner": ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"]
        }
      },
      "transactions": {},
      "blocks": {},
      "blocksMeta": {
        "block": []
      },
      "accountsDataSlice": [],
      "commitment": CommitmentLevel.PROCESSED, // Subscribe to processed blocks for the fastest updates
      entry: {}
      }
      return req;
}


export async function createSubscribeNewPumpfunTransactionsRequest(
    walletToExclude:string[]
  ): Promise<SubscribeRequest> {
    let request: any = null;
      // if doesn't have target mint to snipe
      request = {
        slots: {},
        accounts: {},
        transactions: {
          pumpdotfun: {
            vote: false,
            failed: false,
            signature: undefined,
            accountInclude: ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"],
            accountExclude: [...walletToExclude, "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"],
            accountRequired: [],
          },
        },
        transactionsStatus: {},
        blocks: {},
        blocksMeta: {},
        accountsDataSlice: [],
        commitment: CommitmentLevel.PROCESSED, // Subscribe to processed blocks for the fastest updates
        entry: {},
      };
    
  
    return request;
}

export async function createSubscribeNewPumpSwapMigrationsRequest(): Promise<SubscribeRequest> {
    const request: SubscribeRequest = {
        slots: {},
        accounts: {},
        transactions: {
          solana: {
            vote: false,
            failed: false,
            signature: undefined,
            accountInclude: [ "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P", "39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg", "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"],
            accountExclude: [],
            accountRequired: ["39azUYFWPz3VHgKCf3VChUwbpURdCHRxjWVowf5jUJjg", "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"],
          },
        },
        blocks: {},
        blocksMeta: {},
        accountsDataSlice: [],
        commitment: CommitmentLevel.PROCESSED, // Subscribe to processed blocks for the fastest updates
        entry: {},
      };
    return request;
}

export async function createSubscribePumpfunMultipleWalletTxnRequest(
    accounts:string[]
    ): Promise<SubscribeRequest> {
    let request: any = null;
        // if doesn't have target mint to snipe
    request = {
    slots: {},
    accounts: {},
    transactions: {
        pumpdotfun: {
        vote: false,
        failed: false,
        signature: undefined,
        accountInclude: accounts,
        accountExclude: [],
        accountRequired: ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"],
        },
    },
    transactionsStatus: {},
    blocks: {},
    blocksMeta: {},
    accountsDataSlice: [],
    commitment: CommitmentLevel.PROCESSED, // Subscribe to processed blocks for the fastest updates
    entry: {},
    };


    return request;
}

export async function createSubscribeWalletsPumpSwapTrades(listOfWallets: string[]){
    let request: any = null;
    request = {
      slots: {},
      accounts: {},
      transactions: {
        RaydiumTrade: {
          vote: false,
          failed: false,
          signature: undefined,
          accountInclude: [...listOfWallets],
          accountExclude: [],
          accountRequired: ['pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA', ...listOfWallets],
        },
      },
      transactionsStatus: {},
      blocks: {},
      blocksMeta: {},
      accountsDataSlice: [],
      commitment: CommitmentLevel.PROCESSED, // Subscribe to processed blocks for the fastest updates
      entry: {},
    };
    return request;
}