import React, { createContext, useContext, useState, useEffect } from 'react';
import { isConnected, getPublicKey, signTransaction } from '@stellar/freighter-api';

interface WalletContextType {
  address: string | null;
  connecting: boolean;
  connect: () => Promise<void>;
  sign: (xdr: string, network?: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const connect = async () => {
    setConnecting(true);
    try {
      if (await isConnected()) {
        const pubkey = await getPublicKey();
        setAddress(pubkey);
      } else {
        alert("Please install Freighter wallet");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setConnecting(false);
    }
  };

  const sign = async (xdr: string, network: string = 'TESTNET') => {
    return await signTransaction(xdr, { network });
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (await isConnected()) {
        const pubkey = await getPublicKey();
        if (pubkey) setAddress(pubkey);
      }
    };
    checkConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ address, connecting, connect, sign }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
};
