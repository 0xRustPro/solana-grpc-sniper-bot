import { NATIVE_MINT, getOrCreateAssociatedTokenAccount, createSyncNativeInstruction,  } from "@solana/spl-token";
import { wallet, connection, jito_fee } from "./config";
import { Transaction, SystemProgram, LAMPORTS_PER_SOL,  sendAndConfirmTransaction, TransactionMessage, ComputeBudgetProgram, VersionedTransaction } from "@solana/web3.js";
import {getSPLTokenBalance} from "./check_balance";
import { program } from "commander";
import { logger } from "./logger";
import { jito_executeAndConfirm } from "../transactions/jito_tips_tx_executor";
let wrap_size = 0;
program
  .option("-s, --size <size>", "size of sol to wrap")
  .option("-h, --help", "display help for command")
  .action((options:any) => {
    if (options.help) {
      logger.info(
        "ts-node wrap_sol.js --size <size>"
      );
      process.exit(0);
    }
    if (!options.size) {
        console.error("❌ Missing required options");
        process.exit(1);
      }
    if (options.size) {
        wrap_size = options.size;
    }
  });
program.parse();
export async function wrap_sol(
    amount:number
){
    // wSol ATA 
    const wSolAta = await getOrCreateAssociatedTokenAccount(connection, wallet, NATIVE_MINT, wallet.publicKey);
    console.log(`wsol ATA: ${wSolAta.address.toBase58()}`);
    // wrap Sol
    let transaction = new Transaction().add(
        // trasnfer SOL
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: wSolAta.address,
          lamports: amount*LAMPORTS_PER_SOL,
        }),
        // sync wrapped SOL balance
        createSyncNativeInstruction(wSolAta.address)
    );
    let latestBlockhash = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
      payerKey: wallet.publicKey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions: [
        ...[
          ComputeBudgetProgram.setComputeUnitLimit({
            units: 70000,
          }),
        ],
        ...transaction.instructions,
      ],
    }).compileToV0Message();
  
    const tx = new VersionedTransaction(messageV0);
    tx.sign([wallet]);

    let attempts = 0;
    const maxAttempts = 3;
  
    while (attempts < maxAttempts) {
      attempts++;
      try {
        const res = await jito_executeAndConfirm(
          tx,
          wallet,
          latestBlockhash,
          jito_fee
        );
        const signature = res.signature;
        const confirmed = res.confirmed;
  
        if (signature) {
          console.log(`Transaction successful: ${signature}`);
          break;
        } else {
          console.log("jito fee transaction failed");
          console.log(`Retry attempt ${attempts}`);
        }
      } catch (e: any) {
        console.log(e);
      }
      latestBlockhash = await connection.getLatestBlockhash();
    }

    // submit transaction
    // await for 3 second
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await check_wsol_balance(wSolAta);

}

export async function check_wsol_balance(wSolAta:any){
    const wsolBalance = await getSPLTokenBalance(connection, NATIVE_MINT, wallet.publicKey);
    console.log(`new wsol balance: ${wsolBalance}`);
}

export async function main(){
    await wrap_sol(wrap_size);
    
}
main();