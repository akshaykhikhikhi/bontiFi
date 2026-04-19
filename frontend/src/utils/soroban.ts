import { 
  rpc, 
  TransactionBuilder, 
  Networks, 
  // @ts-ignore
  Contract 
} from '@stellar/stellar-sdk';

const RPC_URL = 'https://soroban-testnet.stellar.org';
const server = new rpc.Server(RPC_URL);

export const NFT_CONTRACT_ID = 'CAR7...' ; // Placeholder
export const MARKETPLACE_CONTRACT_ID = 'CMKT...'; 
export const SPLITTER_CONTRACT_ID = 'CSPLIT...';

export const getEvents = async (contractId: string) => {
  try {
    const response = await server.getEvents({
      startLedger: 0,
      filters: [{
        type: 'contract',
        contractIds: [contractId],
      }],
      limit: 10,
    });
    return response.events;
  } catch (e) {
    console.error("Failed to fetch events", e);
    return [];
  }
};

// Simplified transaction submission
export const submitTx = async (txBuilder: any, sign: any) => {
  const tx = txBuilder.build();
  const signed = await sign(tx.toXDR());
  const result = await server.sendTransaction(signed);
  return result;
};
