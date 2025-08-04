
export class BoughtCache {
    private readonly keys: Map<string, { tokenAddress: string; isCached: boolean }> = new Map<
      string,
      { tokenAddress: string; isCached: boolean }
    >();
  
    public save(tokenAddress: string, isCached: boolean) {
      if (!this.keys.has(tokenAddress)) {
        console.log(`Caching new bought token: ${tokenAddress}`);
        this.keys.set(tokenAddress, { tokenAddress, isCached });
      }
    }
  
    public async get(mint: string): Promise<{ tokenAddress: string; isCached: boolean } | undefined> {
      return this.keys.get(mint)!;
    }

    public async deleteKey(mint: string): Promise<boolean> {
      return this.keys.delete(mint);
    }



}
