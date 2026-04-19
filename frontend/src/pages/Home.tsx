import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { Tag, ShoppingCart, Loader2 } from 'lucide-react';

// Mock NFT type for UI development
interface NFT {
  id: string;
  name: string;
  image: string;
  price?: string;
  seller?: string;
  listed: boolean;
}

const Home = () => {
  const { address } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulation for demo
  useEffect(() => {
    setTimeout(() => {
      setNfts([
        { 
          id: '1', 
          name: 'Stellar Explorer #01', 
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600', 
          price: '500 XLM',
          listed: true,
          seller: 'GABC...'
        },
        { 
          id: '2', 
          name: 'Soroban Knight', 
          image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=600', 
          price: '1200 XLM',
          listed: true,
          seller: 'GXYZ...'
        },
        { 
          id: '3', 
          name: 'Cosmic Core', 
          image: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&q=80&w=600', 
          listed: false
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black">Marketplace</h1>
          <p className="text-slate-400 mt-2">Discover and collect unique Stellar NFTs</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <div key={nft.id} className="glass rounded-3xl overflow-hidden card-hover group">
            <div className="aspect-square overflow-hidden relative">
              <img src={nft.image} alt={nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              {nft.listed && (
                <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Tag size={12} /> Listed
                </div>
              )}
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg truncate">{nft.name}</h3>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  {nft.price ? (
                    <>
                      <p className="text-xs text-slate-400 capitalize">Price</p>
                      <p className="font-black text-xl text-blue-400">{nft.price}</p>
                    </>
                  ) : (
                    <p className="text-slate-500 italic">Not for sale</p>
                  )}
                </div>
                
                {nft.listed && (
                  <button className="bg-slate-100 text-dark p-2.5 rounded-2xl hover:bg-white transition-colors">
                    <ShoppingCart size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
