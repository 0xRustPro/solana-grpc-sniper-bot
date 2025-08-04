import { NATIVE_MINT, getOrCreateAssociatedTokenAccount, createCloseAccountInstruction } from "@solana/spl-token";
import { wallet, connection, jito_fee } from "./config";
import { Transaction, LAMPORTS_PER_SOL, sendAndConfirmTransaction, TransactionMessage, ComputeBudgetProgram, VersionedTransaction } from "@solana/web3.js";
import { program } from "commander";
import { logger } from "./logger";
import { jito_executeAndConfirm } from "../transactions/jito_tips_tx_executor";
program
  .option("-h, --help", "display help for command")
  .action((options) => {
    if (options.help) {
      logger.info(
        "ts-node unwrap_sol.js"
      );
      process.exit(0);
    }
  });
program.parse();
export async function unwrapSol(){
      // wSol ATA
    const wSolAta = await getOrCreateAssociatedTokenAccount(connection, wallet, NATIVE_MINT, wallet.publicKey);

    // close wSol account instruction
    const transaction = new Transaction;
    transaction.add(
        createCloseAccountInstruction(
          wSolAta.address,
          wallet.publicKey,
          wallet.publicKey
        )
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
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const new_sol_balance = await connection.getBalance(wallet.publicKey);
    console.log(`new sol balance: ${new_sol_balance/LAMPORTS_PER_SOL}`);
        
}


async function main(){
    await unwrapSol();
}

main();