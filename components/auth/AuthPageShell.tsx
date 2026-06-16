import Link from 'next/link';
import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { ShieldCheck } from 'lucide-react';

export interface AuthFeature {
  title: string;
  description: string;
}

interface AuthPageShellProps {
  title: string;
  description: string;
  note: string;
  actionLabel: string;
  actionHref: string;
  actionLinkText: string;
  features: AuthFeature[];
  children: ReactNode;
}

export function AuthPageShell({
  title,
  description,
  note,
  actionLabel,
  actionHref,
  actionLinkText,
  features,
  children,
}: AuthPageShellProps) {
  return (
    <SectionContainer className="py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-8 rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold tracking-[0.35em] text-primary-300 shadow-sm shadow-black/20">
            <ShieldCheck className="h-4 w-4" />
            Secure access for teams and talent
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
            <p className="max-w-xl text-base leading-7 text-slate-400 sm:text-lg">{description}</p>
          </div>

          <div className="grid gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-6 text-sm text-slate-400">
            {note}
          </div>

          <Link
            href={actionHref}
            className="inline-flex items-center justify-center rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {actionLabel}
            <span className="ml-2 text-primary-300">{actionLinkText}</span>
          </Link>
        </Card>

        <Card className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-black/30">
          {children}
        </Card>
      </div>
    </SectionContainer>
  );
}
