'use client';
import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockTestsData } from '@/data/mockTestsData';
import { CheckCircle2, XCircle, ArrowRight, BarChart3, Clock, Target, Home } from 'lucide-react';

export default function ResultsPage({ params }: { params: { id: string } }) {
  const test = mockTestsData.find(t => t.id === params.id);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  
  useEffect(() => {
    const saved = localStorage.getItem(`mock_result_${params.id}`);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {}
    }
  }, [params.id]);

  if (!test) return notFound();

  const totalQuestions = test.questions.length;
  if (totalQuestions === 0) return <div>No questions in this test.</div>;

  let correctCount = 0;
  let attemptedCount = 0;

  test.questions.forEach((q, idx) => {
    if (answers[idx] !== undefined) {
      attemptedCount++;
      if (answers[idx] === q.correctAnswer) {
        correctCount++;
      }
    }
  });

  const percentage = Math.round((correctCount / totalQuestions) * 100);
  
  let feedback = '';
  let colorClass = '';
  if (percentage >= 80) {
    feedback = 'Excellent Performance!';
    colorClass = 'text-green-600 bg-green-50 border-green-200';
  } else if (percentage >= 50) {
    feedback = 'Good Effort!';
    colorClass = 'text-amber-600 bg-amber-50 border-amber-200';
  } else {
    feedback = 'Needs Improvement';
    colorClass = 'text-red-600 bg-red-50 border-red-200';
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/job-updates" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 shadow-sm transition-colors">
            <Home className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            {test.logoUrl ? (
              <img src={test.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
            ) : null}
            <span className="font-bold text-slate-900">{test.title}</span>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-[2rem] p-8 sm:p-12 border border-slate-200 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border mb-8 font-bold ${colorClass}`}>
            <BarChart3 className="w-5 h-5" /> {feedback}
          </div>

          <div className="flex justify-center mb-12">
            <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-[12px] border-slate-50">
              <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="none" className="text-slate-100" />
                <circle 
                  cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="none" 
                  strokeDasharray={`${(percentage / 100) * 527.7} 527.7`}
                  className={percentage >= 80 ? 'text-green-500' : percentage >= 50 ? 'text-amber-500' : 'text-red-500'}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center">
                <span className="text-5xl font-extrabold text-slate-900">{percentage}%</span>
                <p className="text-sm font-semibold text-slate-500 mt-1">Score</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-6 rounded-3xl">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Attempted</p>
              <p className="text-3xl font-extrabold text-slate-900">{attemptedCount} <span className="text-lg text-slate-400 font-medium">/ {totalQuestions}</span></p>
            </div>
            <div className="bg-green-50 p-6 rounded-3xl">
              <p className="text-green-600 text-sm font-bold uppercase tracking-wider mb-2">Correct Answers</p>
              <p className="text-3xl font-extrabold text-green-700">{correctCount}</p>
            </div>
            <div className="bg-red-50 p-6 rounded-3xl">
              <p className="text-red-600 text-sm font-bold uppercase tracking-wider mb-2">Incorrect Answers</p>
              <p className="text-3xl font-extrabold text-red-700">{attemptedCount - correctCount}</p>
            </div>
          </div>
        </div>

        {/* Detailed Review Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 px-2 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-500" /> Detailed Review
          </h2>
          
          {test.questions.map((q, idx) => {
            const userAnswer = answers[idx];
            const isCorrect = userAnswer === q.correctAnswer;
            const isSkipped = userAnswer === undefined;

            return (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 leading-relaxed">
                    <span className="text-slate-400 mr-2">{idx + 1}.</span> {q.text}
                  </h3>
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : isSkipped ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                        <Clock className="w-4 h-4" /> Skipped
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {q.options?.map((opt, optIdx) => {
                    const isUserChoice = userAnswer === optIdx;
                    const isActualCorrect = q.correctAnswer === optIdx;
                    
                    let bgClass = 'bg-slate-50 border-slate-100';
                    let textClass = 'text-slate-600';
                    
                    if (isActualCorrect) {
                      bgClass = 'bg-green-50 border-green-200 ring-1 ring-green-500/20';
                      textClass = 'text-green-800 font-semibold';
                    } else if (isUserChoice && !isActualCorrect) {
                      bgClass = 'bg-red-50 border-red-200 ring-1 ring-red-500/20';
                      textClass = 'text-red-800 font-semibold';
                    }

                    return (
                      <div key={optIdx} className={`p-4 rounded-xl border flex items-center justify-between ${bgClass}`}>
                        <span className={textClass}>{opt}</span>
                        {isActualCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                        {isUserChoice && !isActualCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    Explanation
                  </h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {q.explanation || 'No detailed explanation provided for this question.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
