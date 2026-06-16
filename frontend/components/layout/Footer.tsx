'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SectionContainer } from './SectionContainer';
import AdminModal from '../AdminModal';

export function Footer() {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <footer className="border-t border-slate-200/70 bg-slate-50 text-slate-700 dark:border-slate-800/70 dark:bg-slate-950 dark:text-slate-300">
      <SectionContainer className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          © 2026 Geonixa. All rights reserved &middot; Verification logs are retained to prevent fraudulent probing. &middot; <button onClick={() => setAdminOpen(true)} className="transition hover:text-primary-600 dark:hover:text-primary-400">Issuer Console</button>
        </p>
      </SectionContainer>
      <AdminModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </footer>
  );
}
