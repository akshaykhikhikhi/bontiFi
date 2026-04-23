"use client";

import { Clock, Coins, ChevronRight } from "lucide-react";

interface BountyProps {
  title: string;
  reward: string;
  deadline: string;
  poster: string;
  status: string;
}

export default function BountyCard({ title, reward, deadline, poster, status }: BountyProps) {
  const isApproved = status === "Approved";

  return (
    <div 
      className={`brutal-card p-6 md:p-8 cursor-pointer relative group flex flex-col justify-between h-full ${
        isApproved 
          ? "border-olive-500 bg-olive-500/5 shadow-[6px_6px_0px_#808000]" 
          : "border-sap-500 bg-sap-500/5 shadow-[6px_6px_0px_#507D2A]"
      }`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight size={32} className={isApproved ? "text-olive-500" : "text-sap-500"} />
      </div>

      <div className="mb-6">
        <div className={`inline-block px-3 py-1 mb-4 border-2 font-bold uppercase tracking-widest text-xs ${
          isApproved ? "border-olive-500 text-olive-500 bg-olive-500/10" : "border-sap-500 text-sap-500 bg-sap-500/10"
        }`}>
          {status}
        </div>
        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 font-mono bg-black inline-block px-2 border border-white/10">
          POSTER: {poster.slice(0, 6)}...{poster.slice(-4)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t-2 border-white/10 pt-6 mt-auto">
        <div>
          <p className="text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center gap-1">
            <Coins size={12} className="text-yellow-500" /> Reward
          </p>
          <p className="font-black text-xl text-white">{reward} BNTY</p>
        </div>

        <div>
          <p className="text-[10px] uppercase text-gray-500 font-bold mb-1 flex items-center gap-1">
            <Clock size={12} className={isApproved ? "text-olive-500" : "text-sap-500"} /> Deadline
          </p>
          <p className="font-black text-lg text-white">{deadline}</p>
        </div>
      </div>
    </div>
  );
}
