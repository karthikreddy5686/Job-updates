import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockTestsData } from '@/data/mockTestsData';
import { Clock, HelpCircle, AlertTriangle, PlayCircle, ArrowLeft } from 'lucide-react';

export default function MockTestLandingPage({ params }: { params: { id: string } }) {
  const test = mockTestsData.find(t => t.id === params.id);
  if (!test) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl">
        <Link href="/job-updates" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-slate-100">
            <div className="w-32 h-32 bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100 shadow-inner">
              {test.logoUrl ? (
                <img src={test.logoUrl} alt={test.company} className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-3xl font-bold text-slate-400">{test.company[0]}</span>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                {test.category} Mock Exam
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{test.title}</h1>
              <p className="text-lg text-slate-500">{test.company}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Duration</p>
                <p className="text-lg font-bold text-slate-900">{test.durationMinutes} Minutes</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-500">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Questions</p>
                <p className="text-lg font-bold text-slate-900">{test.questions.length} Questions</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 mb-1">Important Instructions</h4>
              <ul className="text-sm text-amber-800 space-y-1 list-disc pl-4">
                <li>Once you start, the timer cannot be paused.</li>
                <li>Do not refresh the page or you will lose your progress.</li>
                <li>Ensure you have a stable internet connection.</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href={`/mock-tests/${test.id}/take`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-black hover:-translate-y-0.5 transition-all shadow-lg"
            >
              <PlayCircle className="w-6 h-6" /> Standard MCQ Test
            </Link>
            <Link 
              href={`/mock-tests/${test.id}/ai-interview`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0066FF] text-white rounded-full font-bold text-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-500/30"
            >
              <PlayCircle className="w-6 h-6" /> AI Video Interview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
