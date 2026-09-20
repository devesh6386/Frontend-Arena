'use client';

import { useEffect, useMemo, useState } from 'react';
import { Receipt } from '@/types';
import { buildThreads } from '@/lib/connection-engine';
import { patterns } from '@/lib/pattern-engine';
import MemoryMuseum from '@/components/MemoryMuseum';
import { ArrowDown, ArrowRight, CircleDot, Disc3, Sparkles, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InsightCard from '@/components/InsightCard';
import Filters from '@/components/Filters';

type ViewMode = 'hero' | 'explorer' | 'thread-focus';

export default function Home() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [mode, setMode] = useState<ViewMode>('hero');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  
  // Explorer states
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('new');
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    fetch('/data/receipts.json')
      .then(r => r.json())
      .then(setReceipts)
      .catch(e => console.error("Could not load receipts", e));
  }, []);

  const threads = useMemo(() => buildThreads(receipts), [receipts]);
  const insights = useMemo(() => patterns(receipts), [receipts]);

  // Derived data
  const music = receipts.filter(r => r.type === 'music');
  const purchases = receipts.filter(r => r.type === 'purchase');
  
  const selectedReceiptData = receipts.find(r => r.id === selectedReceipt);
  const activeThreadData = threads.find(t => t.id === activeThread);

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#11100e] text-[#f5f1e8] relative">
      
      {/* 3D Canvas Background */}
      <MemoryMuseum 
        receipts={receipts}
        threads={threads}
        selectedReceiptId={selectedReceipt}
        activeThreadId={activeThread}
        onSelectReceipt={(id) => {
          setSelectedReceipt(id);
          setActiveThread(null);
          if (mode === 'hero') setMode('explorer');
        }}
        mode={mode}
      />

      {/* 2D HTML Overlays */}
      <AnimatePresence>
        {mode === 'hero' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="text-center mt-[10vh] pointer-events-auto">
              <div className="flex justify-center gap-2 items-center text-xs uppercase tracking-[.2em] text-[#e86c45] mb-7">
                <Sparkles size={15}/> One dataset. Hundreds of moments.
              </div>
              <h1 className="serif text-6xl md:text-[8rem] leading-[.9] tracking-[-.06em]">
                YOUR LIFE,<br/>
                <i className="text-[#e86c45]">IN RECEIPTS</i>
              </h1>
              <p className="mt-8 max-w-md mx-auto text-lg leading-relaxed text-[#aaa59a]">
                A living archive. Explore the songs, purchases, and small convergences that make a digital life feel human.
              </p>
              
              <button 
                onClick={() => setMode('explorer')} 
                className="mt-12 mx-auto rounded-full bg-[#e86c45] text-white px-8 py-4 text-sm flex items-center gap-3 hover:bg-white hover:text-[#e86c45] transition-all shadow-[0_0_40px_rgba(232,108,69,0.3)]"
              >
                ENTER YOUR STORY <ArrowRight size={15}/>
              </button>
            </div>
            
            <div className="absolute bottom-10 flex gap-10 text-xs text-[#aaa59a]">
              <div><b className="text-white text-lg">{music.length}</b> music moments</div>
              <div><b className="text-white text-lg">{purchases.length}</b> purchases</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mode !== 'hero' && (
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-0 left-0 w-full p-5 md:p-8 flex justify-between items-center z-20 pointer-events-none"
          >
            <div className="flex gap-2 items-center font-semibold tracking-tight glass px-4 py-2 rounded-full pointer-events-auto cursor-pointer" onClick={() => setMode('hero')}>
              <span className="h-6 w-6 rounded-full bg-[#e86c45] grid place-items-center text-white">
                <Disc3 size={12}/>
              </span> 
              after the song
            </div>
            <div className="flex gap-4 pointer-events-auto">
              <button 
                onClick={() => setShowUI(!showUI)} 
                className="glass px-5 py-2 rounded-full text-sm hover:bg-[#ffffff10] transition"
              >
                {showUI ? 'Hide UI' : 'Menu'}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Explorer UI (Insights & Threads) */}
      <AnimatePresence>
        {mode === 'explorer' && showUI && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-5 top-28 bottom-5 w-80 z-10 flex flex-col gap-5 pointer-events-none"
          >
            <div className="glass rounded-2xl p-5 pointer-events-auto flex flex-col gap-4 max-h-[50%] overflow-y-auto scrollbar">
              <h3 className="text-xs uppercase tracking-widest text-[#e86c45] mb-2">Life Threads</h3>
              {threads.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => {
                    setActiveThread(t.id);
                    setSelectedReceipt(null);
                    setMode('thread-focus');
                  }} 
                  className="text-left hover:bg-[#ffffff10] p-2 rounded-lg transition"
                >
                  <div className="font-medium text-sm">{t.title}</div>
                  <div className="text-xs text-[#aaa59a] mt-1 line-clamp-2">{t.summary}</div>
                </button>
              ))}
            </div>

            <div className="glass rounded-2xl p-5 pointer-events-auto flex flex-col gap-4 flex-1 overflow-y-auto scrollbar">
              <h3 className="text-xs uppercase tracking-widest text-[#e5a083] mb-2">Discoveries</h3>
              {insights.map((x, i) => (
                <div key={i} className="mb-4">
                  <InsightCard {...x} onClick={() => {}} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Thread Overlay */}
      <AnimatePresence>
        {mode === 'thread-focus' && activeThreadData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 glass rounded-3xl p-8 max-w-2xl w-full text-center"
          >
            <p className="uppercase tracking-[.2em] text-xs text-[#e86c45] mb-3">Active Thread</p>
            <h2 className="serif text-4xl mb-4">{activeThreadData.title}</h2>
            <p className="text-[#aaa59a] text-sm mb-6">{activeThreadData.summary}</p>
            <button 
              onClick={() => {
                setActiveThread(null);
                setMode('explorer');
              }}
              className="px-6 py-2 rounded-full border border-[#ffffff2a] text-sm hover:bg-white hover:text-black transition"
            >
              Exit Thread View
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Detail Overlay */}
      <AnimatePresence>
        {selectedReceiptData && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-5 top-28 w-80 z-30 glass rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="uppercase text-xs tracking-[.18em] text-[#e86c45]">Receipt Detail</span>
              <button onClick={() => setSelectedReceipt(null)} className="hover:text-white text-[#aaa59a]"><X size={16}/></button>
            </div>
            
            <h3 className="serif text-2xl mb-2">{selectedReceiptData.title}</h3>
            <p className="text-[#aaa59a] text-sm mb-6">{selectedReceiptData.subtitle}</p>
            
            <div className="grid gap-4 border-t border-[#ffffff2a] pt-5 text-sm">
              <div>
                <span className="text-[#81796b] block text-xs uppercase tracking-widest mb-1">When</span>
                {new Date(selectedReceiptData.timestamp).toLocaleString()}
              </div>
              <div>
                <span className="text-[#81796b] block text-xs uppercase tracking-widest mb-1">Source</span>
                <span className="bg-[#ffffff10] px-2 py-1 rounded text-xs">{selectedReceiptData.source}</span>
              </div>
              {selectedReceiptData.amount !== undefined && (
                <div>
                  <span className="text-[#81796b] block text-xs uppercase tracking-widest mb-1">Amount</span>
                  ₹{selectedReceiptData.amount.toLocaleString('en-IN')}
                </div>
              )}
              {selectedReceiptData.duration !== undefined && (
                <div>
                  <span className="text-[#81796b] block text-xs uppercase tracking-widest mb-1">Played</span>
                  {selectedReceiptData.duration} minutes
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                const t = threads.find(x => x.receipts.some(r => r.id === selectedReceiptData.id));
                if (t) {
                  setActiveThread(t.id);
                  setMode('thread-focus');
                }
              }} 
              className="mt-6 w-full flex items-center justify-center gap-2 text-sm bg-[#ffffff10] py-2 rounded-lg hover:bg-[#ffffff20] transition"
            >
              Find Connections <CircleDot size={14} className="text-[#e86c45]"/>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
