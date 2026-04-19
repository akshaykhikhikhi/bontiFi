import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { WalletProvider, useWallet } from './context/WalletContext';
import Home from './pages/Home';
import Mint from './pages/Mint';
import Activity from './pages/Activity';
import { LayoutGrid, PlusCircle, Activity as ActivityIcon, Wallet } from 'lucide-react';

const Navbar = () => {
  const { address, connect, connecting } = useWallet();

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-black gradient-text tracking-tighter">
        STELLAR_NFT
      </Link>
      
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
          <LayoutGrid size={20} /> <span className="hidden md:inline">Gallery</span>
        </Link>
        <Link to="/mint" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
          <PlusCircle size={20} /> <span className="hidden md:inline">Mint</span>
        </Link>
        <Link to="/activity" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
          <ActivityIcon size={20} /> <span className="hidden md:inline">Activity</span>
        </Link>
        
        <button 
          onClick={connect}
          disabled={connecting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full font-bold transition-all card-hover shadow-lg shadow-blue-500/20"
        >
          <Wallet size={18} />
          {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : connecting ? 'Connecting...' : 'Connect'}
        </button>
      </div>
    </nav>
  );
};

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 max-w-7xl mx-auto w-full p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mint" element={<Mint />} />
              <Route path="/activity" element={<Activity />} />
            </Routes>
          </main>
          
          {/* Mobile Sticky Bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-6 py-3 flex justify-around items-center z-50">
             <Link to="/" className="text-slate-400 hover:text-blue-400"><LayoutGrid size={24} /></Link>
             <Link to="/mint" className="bg-blue-600 p-3 rounded-full -mt-10 shadow-xl border-4 border-[#0f172a]"><PlusCircle size={28} /></Link>
             <Link to="/activity" className="text-slate-400 hover:text-blue-400"><ActivityIcon size={24} /></Link>
          </div>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
