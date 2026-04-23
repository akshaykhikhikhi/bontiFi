"use client";

import BountyCard from "@/components/BountyCard";
import BountyModal from "@/components/BountyModal";
import SubmissionModal from "@/components/SubmissionModal";
import { Plus, TerminalSquare, Wallet, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedBounty, setSelectedBounty] = useState<any>(null);
  const [bounties, setBounties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { address, connect } = useWallet();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/bounties")
      .then((res) => res.json())
      .then((data) => {
        const liveBounties = (data || []).filter((b: any) => b.creationTxHash);
        setBounties(liveBounties);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0a]">
      <BountyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SubmissionModal 
        isOpen={isSubModalOpen} 
        onClose={() => setIsSubModalOpen(false)} 
        bountyId={selectedBounty?.contractBountyId}
        bountyTitle={selectedBounty?.title}
      />

      {/* Left Split: Fixed Hero / Nav */}
      <div className="w-full md:w-[40%] md:fixed md:h-screen p-8 border-b-4 md:border-b-0 md:border-r-4 border-sap-500 bg-[#0f0f0f] flex flex-col justify-between z-10">
        <div>
          <div className="flex justify-between items-start">
            <div className="w-16 h-16 bg-sap-500 border-2 border-white flex items-center justify-center font-black text-black text-4xl shadow-[6px_6px_0px_#8B0000]">
              B
            </div>
            
            {address ? (
              <button 
                onClick={() => router.push('/dashboard')}
                className="brutal-button bg-black text-white border-white px-4 py-2 text-sm flex items-center hover:bg-white hover:text-black transition-colors"
              >
                <LayoutDashboard size={18} className="mr-2" />
                Dashboard
              </button>
            ) : (
              <button 
                onClick={connect}
                className="brutal-button bg-sap-500 text-black px-4 py-2 text-sm flex items-center"
              >
                <Wallet size={18} className="mr-2" />
                Connect
              </button>
            )}
          </div>
          <div className="mt-24">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8 brutal-text">
              Ship <br /> Code. <br /> Get <br /> Paid.
            </h1>
            <p className="text-olive-400 font-mono text-lg mb-12 border-l-4 border-deepred-500 pl-6 py-2 bg-deepred-500/10">
              The brutal, decentralized destination for Stellar developers. No fluff, just bounties.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="brutal-button bg-sap-500 text-black px-8 py-5 w-full text-2xl flex items-center justify-between group"
            >
              <span>Post Bounty</span>
              <TerminalSquare className="group-hover:text-deepred-700 transition-colors" size={32} />
            </button>
          </div>
        </div>
        
        <div className="font-mono text-xs text-sap-700 uppercase tracking-widest mt-12 md:mt-0 flex justify-between items-center border-t-2 border-white/5 pt-4">
          <span>Stellar Soroban Network</span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-sap-500 animate-pulse" />
            System Online
          </span>
        </div>
      </div>

      {/* Right Split: Scrollable Feed */}
      <div className="w-full md:w-[60%] md:ml-[40%] p-6 md:p-12 bg-black min-h-screen relative">
        <div className="flex justify-between items-end border-b-4 border-white/10 pb-6 mb-12 sticky top-0 bg-black/90 backdrop-blur z-20 pt-6">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">Live Bounties</h2>
          <span className="font-mono font-bold bg-olive-500 text-black px-4 py-2 uppercase border-2 border-olive-500 brutal-card">{bounties.length} Active</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[300px] bg-white/5 border-2 border-white/10 animate-pulse brutal-card" />
            ))
          ) : bounties.length === 0 ? (
            <div className="col-span-full border-4 border-dashed border-white/10 p-12 text-center text-gray-500 font-mono uppercase">
              No bounties available at the moment.
            </div>
          ) : (
            bounties.map((bounty, i) => (
              <div 
                key={i} 
                onClick={() => {
                  if (bounty.status === "Approved") {
                    alert("This bounty has already been completed and is closed for submissions.");
                    return;
                  }
                  setSelectedBounty(bounty);
                  setIsSubModalOpen(true);
                }}
                className="w-full"
              >
                <BountyCard {...bounty} />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
