"use client";

import { useWallet } from "@/context/WalletContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  Users, 
  DollarSign, 
  ExternalLink, 
  ChevronDown, 
  CheckCircle,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { approveWorkOnChain } from "@/lib/stellar";

export default function Dashboard() {
  const { address, loading: authLoading, disconnect } = useWallet();
  const [postedBounties, setPostedBounties] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !address) {
      router.push("/");
    }
  }, [address, authLoading, router]);

  useEffect(() => {
    if (address) {
      const fetchData = async () => {
        try {
          const [bReq, sReq] = await Promise.all([
            fetch(`/api/bounties?poster=${address}`),
            fetch(`/api/submissions?hunter=${address}`)
          ]);
          const [bData, sData] = await Promise.all([
            bReq.json(),
            sReq.json()
          ]);
          setPostedBounties((bData || []).filter((b: any) => b.creationTxHash));
          setSubmissions(sData || []);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [address]);

  const handleDeleteBounty = async (dbId: string) => {
    if (!confirm("Are you sure you want to remove this bounty? This will hide it from the platform.")) return;
    try {
      const res = await fetch(`/api/bounties/${dbId}`, { method: "DELETE" });
      if (res.ok) {
        setPostedBounties(prev => prev.filter(b => b._id !== dbId));
      } else {
        alert("Failed to delete bounty");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting bounty");
    }
  };

  const handleApprove = async (subId: string, hunter: string, contractBountyId: string | number, onChainIndex: number, amount: string) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid payout amount.");
      return;
    }

    if (contractBountyId === undefined || contractBountyId === null) {
      alert("Error: This bounty is missing its on-chain ID. It may have been created during a simulation phase. Please create a new bounty to test payouts.");
      return;
    }

    if (onChainIndex === undefined || onChainIndex === null || isNaN(Number(onChainIndex))) {
      alert("Error: This submission is missing its on-chain index.");
      return;
    }

    if (!confirm(`Are you sure you want to approve this submission? This will release the funds to ${hunter}.`)) return;

    try {
      const txResult = await approveWorkOnChain(Number(contractBountyId), Number(onChainIndex), amount);
      const res = await fetch(`/api/submissions/${subId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posterAddress: address })
      });

      if (res.ok) {
        alert("Payment released successfully!");
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
      alert("Error approving submission: " + (e as any).message);
    }
  };

  if (authLoading || !address) return null;

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0a]">
      
      {/* Left Split: Dashboard Sidebar */}
      <div className="w-full md:w-[35%] md:fixed md:h-screen p-8 border-b-4 md:border-b-0 md:border-r-4 border-sap-500 bg-[#0f0f0f] flex flex-col z-10">
        
        <div className="flex items-center gap-4 mb-16 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-12 h-12 bg-sap-500 border-2 border-white flex items-center justify-center font-black text-black text-2xl shadow-[4px_4px_0px_#8B0000]">
            B
          </div>
          <span className="text-3xl font-black brutal-text tracking-tighter uppercase text-white">Back to Feed</span>
        </div>

        <div className="mt-8">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6 brutal-text text-white">
            Your <br /> Command <br /> Center.
          </h1>
          <div className="p-4 bg-deepred-500/10 border-l-4 border-deepred-500 mb-8">
            <p className="text-sap-400 font-mono text-sm break-all font-bold">
              {address}
            </p>
          </div>

          <button 
            onClick={disconnect}
            className="brutal-button bg-black border-deepred-500 text-deepred-500 hover:bg-deepred-500 hover:text-white px-6 py-4 w-full text-lg flex items-center justify-center gap-2"
          >
            Disconnect Wallet
          </button>
        </div>

        <div className="mt-auto pt-8 border-t-2 border-white/5">
          <div className="grid grid-cols-2 gap-4">
            <StatCard title="Total Posted" value={postedBounties.length} icon={<Package className="text-sap-500" />} />
            <StatCard title="Submissions" value={submissions.length} icon={<Users className="text-deepred-500" />} />
          </div>
        </div>

      </div>

      {/* Right Split: Dashboard Content */}
      <div className="w-full md:w-[65%] md:ml-[35%] p-6 md:p-12 bg-black min-h-screen relative">
        <div className="flex justify-between items-end border-b-4 border-white/10 pb-6 mb-12 sticky top-0 bg-black/90 backdrop-blur z-20 pt-6">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">Activity</h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          <section>
            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2 text-white bg-sap-500/10 border-l-4 border-sap-500 pl-4 py-2">
              <Package size={24} className="text-sap-500" />
              Bounties I Posted
            </h2>
            <div className="space-y-4">
              {postedBounties.length === 0 ? (
                <EmptyState message="No bounties posted yet." />
              ) : (
                postedBounties.map((b: any, i) => (
                  <DashboardItem 
                    key={i} 
                    title={b.title} 
                    subtitle={b.reward + " BNTY"} 
                    status={b.status} 
                    bountyId={b.contractBountyId}
                    dbId={b._id}
                    creationTxHash={b.creationTxHash}
                    isPoster={true}
                    onApprove={handleApprove}
                    onDelete={handleDeleteBounty}
                  />
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2 text-white bg-deepred-500/10 border-l-4 border-deepred-500 pl-4 py-2">
              <Users size={24} className="text-deepred-500" />
              My Submissions
            </h2>
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <EmptyState message="No submissions made yet." />
              ) : (
                submissions.map((s, i) => (
                  <DashboardItem 
                    key={i} 
                    title={s.ipfsLink.slice(0, 30) + "..."} 
                    subtitle={"Bounty ID: " + s.bountyId} 
                    status={s.approved ? "Approved" : "Pending"} 
                    link={s.ipfsLink}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="glass p-6 rounded-3xl">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
      </div>
      <div>
        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black mt-1">{value}</p>
      </div>
    </div>
  );
}

function DashboardItem({ title, subtitle, status, link, bountyId, dbId, isPoster, onApprove, onDelete, creationTxHash }: any) {
  const [showSubs, setShowSubs] = useState(false);
  const [subs, setSubs] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [payoutAmounts, setPayoutAmounts] = useState<Record<string, string>>({});


  const fetchSubs = async () => {
    if (!showSubs && isPoster && bountyId !== undefined && bountyId !== null) {
      setLoadingSubs(true);
      try {
        const res = await fetch(`/api/submissions?bountyId=${bountyId}`);
        setSubs(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSubs(false);
      }
    }
    setShowSubs(!showSubs);
  };

  return (
    <div className="space-y-2">
      <div 
        onClick={fetchSubs}
        className="glass p-4 rounded-2xl flex justify-between items-center group hover:bg-white/[0.05] transition-colors cursor-pointer"
      >
        <div>
          <h4 className="font-bold group-hover:text-sap-400 transition-colors flex items-center gap-2">
            {title}
            {(link || isPoster) && <ExternalLink size={14} className="text-gray-500" />}
          </h4>
          <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-tighter">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
            status === "Approved" || status === "Active" ? "bg-sap-500/10 text-sap-400" : "bg-yellow-500/10 text-yellow-400"
          }`}>
            {status}
          </div>
          {isPoster && onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(dbId); }}
              className="p-1 hover:bg-red-500/20 text-red-400 rounded-md transition-colors"
              title="Remove Bounty"
            >
              <Trash2 size={16} />
            </button>
          )}
          {isPoster && (
            <ChevronDown size={18} className={`text-gray-500 transition-transform ${showSubs ? "rotate-180" : ""}`} />
          )}
        </div>
      </div>

      {showSubs && isPoster && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pl-6 space-y-3 overflow-hidden"
        >
          {loadingSubs ? (
            <div className="text-xs text-gray-500 animate-pulse">Loading submissions...</div>
          ) : subs.length === 0 ? (
            <div className="text-xs text-gray-500 italic">No submissions yet.</div>
          ) : (
            subs.map((s, i) => (
               <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-gray-300">{s.hunter.slice(0, 8)}...{s.hunter.slice(-8)}</p>
                  <a href={s.ipfsLink} target="_blank" className="text-[10px] text-sap-400 hover:underline flex items-center gap-1 mt-1">
                    <ExternalLink size={10} />
                    View Work (IPFS)
                  </a>
                </div>
                {!s.approved && status !== "Approved" && (
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      placeholder="Amt"
                      value={payoutAmounts[s._id] || ""}
                      onChange={(e) => setPayoutAmounts(prev => ({ ...prev, [s._id]: e.target.value }))}
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] w-16 focus:outline-none focus:border-sap-500"
                    />
                    <button 
                      onClick={() => onApprove(s._id, s.hunter, bountyId, s.onChainIndex, payoutAmounts[s._id])}
                      className="bg-olive-600 hover:bg-olive-700 text-[10px] font-black px-4 py-2 rounded-lg uppercase transition-all"
                    >
                      Approve & Pay
                    </button>
                  </div>
                )}
                {s.approved && (
                  <div className="text-[10px] font-black text-olive-500 uppercase flex items-center gap-1">
                    <CheckCircle size={12} />
                    Winner
                  </div>
                )}
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center">
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  );
}
