'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface LiveFeedItem {
  id: string;
  company: string;
  role: string;
  isNew?: boolean;
  postedTime: string;
  logo?: string;
}

interface LiveJobFeedProps {
  items?: LiveFeedItem[];
}

const defaultFeedItems: LiveFeedItem[] = [
  { id: '1', company: 'TCS', role: 'Software Engineer', isNew: true, postedTime: '2 MIN AGO' },
  { id: '2', company: 'Infosys', role: 'System Engineer', isNew: true, postedTime: '5 MIN AGO' },
  { id: '3', company: 'HDFC Bank', role: 'Relationship Manager', isNew: false, postedTime: '8 MIN AGO' },
  { id: '4', company: 'Accenture', role: 'Business Analyst', isNew: false, postedTime: '12 MIN AGO' },
  { id: '5', company: 'Deloitte', role: 'Consultant', isNew: true, postedTime: '15 MIN AGO' },
  { id: '6', company: 'Wipro', role: 'Project Engineer', isNew: false, postedTime: '18 MIN AGO' },
  { id: '7', company: 'SBI', role: 'PO', isNew: false, postedTime: '22 MIN AGO' },
  { id: '8', company: 'Capgemini', role: 'Analyst', isNew: false, postedTime: '25 MIN AGO' },
  { id: '9', company: 'Government Jobs', role: 'UPSC', isNew: false, postedTime: '30 MIN AGO' },
  { id: '10', company: 'Unstop', role: 'Internships', isNew: true, postedTime: '35 MIN AGO' },
];

function FeedLogo({ item }: { item: LiveFeedItem }) {
  const [logoIndex, setLogoIndex] = useState(0);

  const logoUrls = React.useMemo(() => {
    const urls: string[] = [];
    if (item.logo) urls.push(item.logo);
    const cleanName = item.company.toLowerCase().replace(/[^a-z0-9]/g, '');
    const firstWord = item.company.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '');
    
    if (cleanName && !item.logo?.includes(cleanName)) {
      urls.push(`https://logo.clearbit.com/${cleanName}.com`);
      urls.push(`https://logo.clearbit.com/${cleanName}.in`);
    }
    if (firstWord && firstWord !== cleanName && !item.logo?.includes(firstWord)) {
      urls.push(`https://logo.clearbit.com/${firstWord}.com`);
    }
    return urls;
  }, [item.company, item.logo]);

  if (logoIndex < logoUrls.length) {
    return <img src={logoUrls[logoIndex]} alt={item.company} className="h-8 w-8 object-contain rounded-md bg-white border border-slate-100 p-0.5 shrink-0" onError={() => setLogoIndex(i => i + 1)} />;
  }

  return (
    <div className="h-8 w-8 rounded-md bg-slate-200 shrink-0 flex items-center justify-center">
      <span className="text-xs font-bold text-slate-500">{item.company.charAt(0)}</span>
    </div>
  );
}

export default function LiveJobFeed({ items: propItems }: LiveJobFeedProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [displayItems, setDisplayItems] = useState<LiveFeedItem[]>([]);
  const [itemsLength, setItemsLength] = useState(0);

  useEffect(() => {
    async function loadItems() {
      if (propItems && propItems.length > 0) {
        setDisplayItems([...propItems, ...propItems]);
        setItemsLength(propItems.length);
        return;
      }
      try {
        const res = await fetch('/api/live-feed');
        if (res.ok) {
          const data = await res.json();
          const fetchedItems = data.items && data.items.length > 0 
            ? [...data.items, ...defaultFeedItems].filter((item, index, self) => 
                index === self.findIndex((t) => t.company === item.company)
              )
            : defaultFeedItems;
          setDisplayItems([...fetchedItems, ...fetchedItems]);
          setItemsLength(fetchedItems.length);
        } else {
          setDisplayItems([...defaultFeedItems, ...defaultFeedItems]);
          setItemsLength(defaultFeedItems.length);
        }
      } catch {
        setDisplayItems([...defaultFeedItems, ...defaultFeedItems]);
        setItemsLength(defaultFeedItems.length);
      }
    }
    loadItems();
  }, [propItems]);

  const feedWidth = itemsLength * 280; // Estimate width per item

  return (
    <motion.div className="flex flex-col w-full" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center p-3">
        <div className="flex items-center gap-3 pr-4 border-r border-slate-200 shrink-0 bg-white z-10">
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
            <Zap className="h-3.5 w-3.5" />
            Live
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Job Feed</p>
        </div>

        <div
          className="relative flex-1 overflow-hidden flex items-center ml-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex flex-row items-center gap-4"
            animate={{ x: isHovered ? 0 : [-0, -feedWidth] }}
            transition={{
              x: {
                duration: isHovered ? 0 : itemsLength * 4,
                ease: 'linear',
                repeat: isHovered ? 0 : Infinity,
              },
            }}
          >
            {displayItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex items-center gap-3 shrink-0 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-100 transition min-w-[260px]">
                <FeedLogo item={item} />
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-slate-900">{item.company}</p>
                    {item.isNew && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">NEW</span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-600 font-medium">{item.role}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{item.postedTime}</span>
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-sm" />
                </div>
              </div>
            ))}
          </motion.div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}
