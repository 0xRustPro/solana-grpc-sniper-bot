import {
    CommitmentLevel,
    SubscribeRequest,
  } from "@triton-one/yellowstone-grpc";
const PING_INTERVAL_MS = 10_000; 
export async function handleSubscribe(client_stream: any, args: SubscribeRequest){
    // Create `error` / `end` handler
    const streamClosed = new Promise<void>((resolve, reject) => {
    client_stream.on("error", (error) => {
        console.log("ERROR", error);
        //reject(error);
        //client_stream.end()
        //handleSubscribe(client_stream, args)
        throw new Error("Stream error");
        return;
      });
      client_stream.on("end", () => {
        //resolve();
        return;
      });
      client_stream.on("close", () => {
         console.log("Stream closing...")
         return;
      });
    });
   
    // Send subscribe request
    await new Promise<void>((resolve, reject) => {
       client_stream.write(args, (err: any) => {
        if (err === null || err === undefined) {
          resolve();
        } else {
          reject(err);
        }
      });
    }).catch((reason) => {
      console.error(reason);
      throw reason;
    });
      // Send pings every 5s to keep the connection open
      const pingRequest: SubscribeRequest = {
       ping: { id: 1 },
       // Required, but unused arguments
       accounts: {},
       accountsDataSlice: [],
       transactions: {},
       blocks: {},
       blocksMeta: {},
       entry: {},
       slots: {},
     };
     setInterval(async () => {
       await new Promise<void>((resolve, reject) => {
           client_stream.write(pingRequest, (err) => {
           if (err === null || err === undefined) {
             resolve();
           } else {
             reject(err);
           }
         });
       }).catch((reason) => {
         console.error(reason);
         throw reason;
       });
     }, PING_INTERVAL_MS);
   
    await streamClosed;
   }