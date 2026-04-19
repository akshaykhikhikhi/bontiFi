import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Upload, ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';

const Mint = () => {
  const { address, connecting } = useWallet();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setLoading(true);
    
    // Simulate IPFS upload and Soroban mint
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-6 glass p-10 rounded-[3rem] animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black">NFT Minted!</h1>
        <p className="text-slate-400">Your masterpiece is now on the Stellar network.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="w-full bg-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all"
        >
          Mint Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-black">Mint New NFT</h1>
        <p className="text-slate-400 mt-2">Create a new digital asset on Soroban</p>
      </header>

      <form onSubmit={handleMint} className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold ml-2">Upload Asset</span>
            <div className={`mt-2 border-2 border-dashed rounded-[2rem] aspect-square flex flex-col items-center justify-center cursor-pointer transition-all ${preview ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'}`}>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-[1.8rem]" />
              ) : (
                <div className="text-center space-y-3">
                  <div className="p-4 bg-slate-800 rounded-full w-fit mx-auto">
                    <Upload className="text-slate-400" size={32} />
                  </div>
                  <p className="text-sm text-slate-400">PNG, JPG, GIF max 10MB</p>
                </div>
              )}
            </div>
          </label>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-2">Asset Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Galactic Sunset"
              className="w-full bg-slate-800 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-2">Description</label>
            <textarea 
              placeholder="Tell us about your NFT..."
              className="w-full bg-slate-800 border-none rounded-2xl px-5 py-4 h-32 focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Minting Fee</span>
              <span className="font-bold">1.0 XLM</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-blue-400">
              <span>Total</span>
              <span>1.0 XLM</span>
            </div>
          </div>

          <button 
            type="submit"
            disabled={!address || loading || !file}
            className="w-full bg-blue-600 disabled:bg-slate-700 py-5 rounded-[1.5rem] font-black text-lg transition-all card-hover shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <PlusCircle size={22} />}
            {loading ? 'Minting...' : 'Create NFT'}
          </button>
          
          {!address && (
            <p className="text-center text-sm text-rose-400 font-bold">Please connect your wallet to mint</p>
          )}
        </div>
      </form>
    </div>
  );
};

const PlusCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export default Mint;
