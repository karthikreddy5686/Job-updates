'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function MockInterviewWidget() {
  const [activeTab, setActiveTab] = useState<'Tech' | 'Management' | 'General'>('Tech');
  const [mockTestsData, setMockTestsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/mock-tests')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMockTestsData(data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredItems = mockTestsData.filter(item => item.category === activeTab);

  if (isLoading) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm mt-6 flex justify-center items-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-5 overflow-hidden relative mt-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-2.5">
          <div className="w-1.5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full shrink-0"></div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-1.5">
              Company Mock Tests
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            </h2>
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">AI exams from top MNCs.</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-2 px-2">
        {['Tech', 'Management', 'General'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'border-[#2563eb] text-[#2563eb] bg-blue-50' 
                : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Vertical Scrolling List */}
      <div className="relative -mx-2">
        <div 
          className="flex flex-col gap-3 px-2 pb-4 pt-1 max-h-[500px] overflow-y-auto scrollbar-hide"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: (index % 10) * 0.05, type: "spring", stiffness: 200 }}
                key={item.id} 
                className="w-full bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300 flex items-center p-3 gap-4 group/card"
              >
                {/* Logo Area */}
                <div className="w-12 h-12 shrink-0 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 overflow-hidden relative">
                   <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                   <motion.div 
                     whileHover={{ scale: 1.15 }}
                     transition={{ type: "spring", stiffness: 300 }}
                     className="w-8 h-8 flex items-center justify-center relative z-10"
                   >
                      {item.logoUrl ? (
                        <img 
                          src={item.logoUrl} 
                          alt={item.company} 
                          className="max-w-full max-h-full object-contain drop-shadow-sm rounded-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <span className={`${item.logoUrl ? 'hidden' : ''} font-bold text-slate-400 text-lg`}>
                        {item.company[0]}
                      </span>
                   </motion.div>
                </div>
              
              {/* Content Area */}
              <div className="flex flex-col flex-grow min-w-0">
                <h3 className="font-bold text-slate-900 text-[13px] leading-tight truncate group-hover/card:text-blue-600 transition-colors" title={item.title}>
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.company}</p>
              </div>

              {/* Action */}
              <div className="shrink-0">
                <Link href={`/mock-tests/${item.id}`} className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-400 group-hover/card:bg-blue-600 group-hover/card:text-white transition-all duration-300 shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
          
          {filteredItems.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="w-full py-8 text-center text-slate-500 text-sm border border-dashed rounded-xl"
            >
              No tests for {activeTab}.
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
