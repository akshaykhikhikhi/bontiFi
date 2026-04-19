import React, { useState, useEffect } from 'react';
import { getEvents, MARKETPLACE_CONTRACT_ID } from '../utils/soroban';
import { Hash, ExternalLink, ArrowRightLeft, ShoppingBag, Sparkles, Loader2 } from 'lucide-react';

interface MarketEvent {
  id: string;
  type: 'mint' | 'list' | 'sold';
  user: string;
  details: string;
  timestamp: string;
  txHash: string;
}

const Activity = () => {
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated real-time updates
    const mockEvents: MarketEvent[] = [
      {
        id: '1',
        type: 'sold',
        user: 'GA7R...9Z2',
        details: 'Purchased Soroban Knight for 1200 XLM',
        timestamp: '2 mins ago',
        txHash: 'a1b2...c3d4'
      },
      {
        id: '2',
        type: 'list',
        user: 'GXYZ...K2L',
        details: 'Listed Cosmic Core for 800 XLM',
        timestamp: '15 mins ago',
        txHash: 'e5f6...g7h8'
      },
      {
        id: '3',
        type: 'mint',
        user: 'GABC...X1Y',
        details: 'Minted Stellar Explorer #01',
        timestamp: '1 hour ago',
        txHash: 'i9j0...k1l2'
      }
    ];

    setEvents(mockEvents);
    setLoading(false);

    // Initial real poll
    // getEvents(MARKETPLACE_CONTRACT_ID).then(evs => console.log("Real events:", evs));
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'mint': return <Sparkles className="text-purple-400" />;
      case 'list': return <ShoppingBag className="text-blue-400" />;
      case 'sold': return <ArrowRightLeft className="text-green-400" />;
      default: return <Hash />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-black">Market Activity</h1>
        <p className="text-slate-400 mt-2">Real-time pulse of the Stellar NFT ecosystem</p>
      </header>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="glass p-6 rounded-3xl flex flex-col sm:flex-row gap-6 items-start sm:items-center card-hover">
            <div className={`p-4 rounded-2xl bg-white/5`}>
              {getIcon(event.type)}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-400">{event.user}</span>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold opacity-70">
                  {event.type}
                </span>
              </div>
              <p className="text-lg font-medium">{event.details}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                <span>{event.timestamp}</span>
                <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition-colors">
                  <Hash size={12} /> {event.txHash} <ExternalLink size={12} />
                </span>
              </div>
            </div>

            <button className="hidden sm:block p-3 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
              <ExternalLink size={20} />
            </button>
          </div>
        ))}

        {!loading && events.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center space-y-4 text-slate-500">
            <Loader2 className="animate-spin" size={32} />
            <p>Waiting for events...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
