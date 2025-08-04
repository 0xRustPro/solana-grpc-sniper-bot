
import { PublicKey, TransactionInstruction, Keypair, Connection, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {connection, jito_fee} from "../../helpers/config";
import bs58 from "bs58";
import axios from "axios";
export const nozomi_connection = new Connection("https://ams1.secure.nozomi.temporal.xyz/?c=YOUR_API_KEY"); //
// Define constants
const NOZOMI_TIP = new PublicKey("TEMPaMeCRFAS9EKF53Jd6KpHxgL47uWLcpFArU1Fanq");
const MIN_TIP_AMOUNT = 1_000_000;

const listOfValidators = [
    "TEMPaMeCRFAS9EKF53Jd6KpHxgL47uWLcpFArU1Fanq",
"noz3jAjPiHuBPqiSPkkugaJDkJscPuRhYnSpbi8UvC4",
"noz3str9KXfpKknefHji8L1mPgimezaiUyCHYMDv1GE",
"noz6uoYCDijhu1V7cutCpwxNiSovEwLdRHPwmgCGDNo",
"noz9EPNcT7WH6Sou3sr3GGjHQYVkN3DNirpbvDkv9YJ",
"nozc5yT15LazbLTFVZzoNZCwjh3yUtW86LoUyqsBu4L",
"nozFrhfnNGoyqwVuwPAW4aaGqempx4PU6g6D9CJMv7Z",
"nozievPk7HyK1Rqy1MPJwVQ7qQg2QoJGyP71oeDwbsu",
"noznbgwYnBLDHu8wcQVCEw6kDrXkPdKkydGJGNXGvL7",
"nozNVWs5N8mgzuD3qigrCG2UoKxZttxzZ85pvAQVrbP",
"nozpEGbwx4BcGp6pvEdAh1JoC2CQGZdU6HbNP1v2p6P",
"nozrhjhkCr3zXT3BiT4WCodYCUFeQvcdUkM7MqhKqge",
"nozrwQtWhEdrA6W8dkbt9gnUaMs52PdAv5byipnadq3",
"nozUacTVWub3cL4mJmGCYjKZTnE9RbdY5AP46iQgbPJ",
"nozWCyTPppJjRuw2fpzDhhWbW355fzosWSzrrMYB1Qk",
"nozWNju6dY353eMkMqURqwQEoM3SFgEKC6psLCSfUne",
"nozxNBgWohjR75vdspfxR5H9ceC7XXH99xpxhVGt3Bb"

]
const nozomi_url = "http://ams1.nozomi.temporal.xyz/?c="; // i'm using ams Direct HTTP here, please change if needed
// Direct HTTP
// PITT: http://pit1.nozomi.temporal.xyz/?c=

// EWR: http://ewr1.nozomi.temporal.xyz/?c=

// AMS: http://ams1.nozomi.temporal.xyz/?c=

// FRA: http://fra2.nozomi.temporal.xyz/?c=

// Secure HTTPS:
// AMS: https://ams1.secure.nozomi.temporal.xyz/?c=

// EWR: https://ewr1.secure.nozomi.temporal.xyz/?c=

// PITT: https://pit1.secure.nozomi.temporal.xyz/?c=

// FRA: https://fra2.secure.nozomi.temporal.xyz/?c=

// put your nozomi low latency api keys here.
const low_latency_api_key = [
  "YOUR_NOZOMI_LOW_LATENCY_API_KEY"

]
export async function getRamdomValidator() {
    const randomIndex = Math.floor(Math.random() * listOfValidators.length);
    return new PublicKey(listOfValidators[randomIndex]);
}
export async function getRandomNozomiAPIKey() {
  const randomIndex = Math.floor(Math.random() * low_latency_api_key.length);
  return low_latency_api_key[randomIndex];
}
export async function sendNozomiTx(
  ixs: any[],
  signer: Keypair,
  blockhash:any,
  dex:string,
  buyOrSell:string,
): Promise<any> {
  const validator = await getRamdomValidator();
  console.log("signer", signer.publicKey.toBase58());
  console.log("Sending tip to", validator.toBase58());
  // Create transfer instruction
  let tips = parseFloat(jito_fee);
  const tipIx = SystemProgram.transfer({
    fromPubkey: signer.publicKey,
    toPubkey: validator,
    lamports: tips*LAMPORTS_PER_SOL,
  });
  ixs.push(tipIx);

  // Get the latest blockhash

  // Create transaction and sign it
  const tx = new Transaction().add(...ixs);
  if(typeof blockhash === "string") {
    tx.recentBlockhash = blockhash;
  }else{
    tx.recentBlockhash = blockhash.blockhash;
    tx.lastValidBlockHeight = blockhash.lastValidBlockHeight
  }
  tx.feePayer = signer.publicKey;
  tx.sign(signer);
  console.log(tx);
  const b64Tx = Buffer.from(tx.serialize()).toString('base64');
  const url_request = `${nozomi_url}${await getRandomNozomiAPIKey()}`;
  let request;
  try{
    request = await axios.post(url_request, {
      jsonrpc: "2.0",
      id: 1,
      method: "sendTransaction",
      params: [ 
        b64Tx, 
        { "encoding": "base64" }
    ]
    });

  }  catch (error) {
        console.log(`error sending tx to Nozomi: ${error}`);
        
      } 
  
  console.log("Transaction sent with signature:", request);
  
}

