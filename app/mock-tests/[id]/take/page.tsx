'use client';
import React, { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { mockTestsData } from '@/data/mockTestsData';
import { Clock, CheckCircle2, ChevronLeft, ChevronRight, XCircle, Play, FileCode2 } from 'lucide-react';

export default function ActiveTestPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const test = mockTestsData.find(t => t.id === params.id);
  const initialTime = test?.durationMinutes ? test.durationMinutes * 60 : 0;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [testResults, setTestResults] = useState<Record<number, any[]>>({});
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!test) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, test]);

  if (!test) return notFound();

  const currentQ = test.questions[currentIndex];

  const handleSelect = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleCodeChange = (code: string) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: code }));
  };

  const runCode = () => {
    if (currentQ.type !== 'coding' || !currentQ.testCases) return;
    
    const code = answers[currentIndex] || currentQ.initialCode || '';
    const results = currentQ.testCases.map((tc: any) => {
      try {
        // Safe evaluation of the function definition
        const fn = new Function(`
          ${code}
          // Assuming the function name is the first word after 'function '
          const fnName = "${code}".match(/function\\s+([a-zA-Z0-9_]+)/)[1];
          return eval(fnName + "(" + ${tc.input} + ")");
        `);
        
        const output = fn();
        const expected = JSON.parse(tc.expectedOutput); // Parse if it's a string representation of an array, else compare directly
        
        // Simple equality check (arrays need stringify)
        const passed = JSON.stringify(output) === JSON.stringify(expected);
        return { passed, output, expected: tc.expectedOutput };
      } catch (err: any) {
        return { passed: false, error: err.message, expected: tc.expectedOutput };
      }
    });

    setTestResults(prev => ({ ...prev, [currentIndex]: results }));
  };

  const handleClear = () => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[currentIndex];
      return next;
    });
    setTestResults(prev => {
      const next = { ...prev };
      delete next[currentIndex];
      return next;
    });
  };

  const handleSubmit = () => {
    // In a real app, save to db. Here, pass via localStorage or state management.
    localStorage.setItem(`mock_result_${test.id}`, JSON.stringify(answers));
    router.push(`/mock-tests/${test.id}/results`);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (test.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col">
        <h2 className="text-2xl font-bold mb-4">No questions available for this test.</h2>
        <button onClick={() => router.push('/job-updates')} className="text-blue-600 underline">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {test.logoUrl ? (
            <img src={test.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
          ) : (
            <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-400">
              {test.company[0]}
            </div>
          )}
          <h1 className="font-bold text-slate-900 hidden sm:block">{test.title}</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
            <Clock className={`w-5 h-5 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-600'}`} />
            <span className={`font-mono font-bold text-lg ${timeLeft < 60 ? 'text-red-600' : 'text-slate-800'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors shadow-md shadow-blue-500/20"
          >
            Submit Assessment
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto p-4 sm:p-8 gap-8">
        {/* Sidebar / Question Navigator */}
        <aside className="w-full lg:w-72 flex-shrink-0 order-2 lg:order-1">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-28">
            <h3 className="font-bold text-slate-900 mb-4">Questions Outline</h3>
            
            <div className="flex flex-col gap-6 mb-6">
              {(() => {
                const sections: { [key: string]: {q: any, idx: number}[] } = {};
                test.questions.forEach((q, idx) => {
                  const secName = q.section || 'General';
                  if (!sections[secName]) sections[secName] = [];
                  sections[secName].push({ q, idx });
                });

                return Object.keys(sections).map(sec => (
                  <div key={sec}>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{sec}</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {sections[sec].map(({ q, idx }) => {
                        const isAnswered = answers[idx] !== undefined;
                        const isCurrent = currentIndex === idx;
                        
                        return (
                          <button
                            key={q.id}
                            onClick={() => setCurrentIndex(idx)}
                            className={`
                              w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all
                              ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''}
                              ${isAnswered ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                            `}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-100 border border-green-200"></div> Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200"></div> Unanswered
              </div>
            </div>
          </div>
        </aside>

        {/* Main Question Area */}
        <section className="flex-1 order-1 lg:order-2 flex flex-col">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold">
                Question {currentIndex + 1} of {test.questions.length}
              </span>
              <button 
                onClick={handleClear}
                disabled={answers[currentIndex] === undefined}
                className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-30 disabled:hover:text-red-500 flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" /> Clear Selection
              </button>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">
              {currentQ.text}
            </h2>

            {currentQ.type === 'coding' ? (
              <div className="flex flex-col gap-4 mb-12">
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-slate-800">
                    <div className="flex items-center gap-2 text-slate-300 text-sm font-mono">
                      <FileCode2 className="w-4 h-4 text-blue-400" /> main.js
                    </div>
                    <button
                      onClick={runCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-md transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" /> Run Code
                    </button>
                  </div>
                  <label htmlFor="code-editor" className="sr-only">
                    Coding editor for the current question
                  </label>
                  <textarea
                    id="code-editor"
                    value={answers[currentIndex] !== undefined ? answers[currentIndex] : (currentQ.initialCode || '')}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className="w-full h-80 bg-transparent text-green-400 p-4 font-mono text-sm focus:outline-none resize-y"
                    spellCheck="false"
                  />
                </div>

                {/* Test Results Panel */}
                {testResults[currentIndex] && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4">
                    <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Test Results</h4>
                    <div className="space-y-3">
                      {testResults[currentIndex].map((res: any, idx: number) => (
                        <div key={idx} className={`p-3 rounded-lg border ${res.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-bold text-sm ${res.passed ? 'text-green-700' : 'text-red-700'}`}>
                              Test Case {idx + 1}: {res.passed ? 'Passed ✅' : 'Failed ❌'}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-slate-600 space-y-1">
                            <div><span className="text-slate-400">Input:</span> {currentQ.testCases?.[idx].input}</div>
                            <div><span className="text-slate-400">Expected:</span> {res.expected}</div>
                            <div>
                              <span className="text-slate-400">Output:</span>{' '}
                              <span className={res.passed ? 'text-green-600' : 'text-red-600'}>
                                {res.error ? `Error: ${res.error}` : JSON.stringify(res.output)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 mb-12">
                {currentQ.options?.map((opt: string, optIdx: number) => {
                  const isSelected = answers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(optIdx)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group
                        ${isSelected ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'}
                      `}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                        ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-blue-400'}
                      `}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <span className={`text-base font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-auto flex items-center justify-between pt-8 border-t border-slate-100">
              <button
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              
              <button
                onClick={() => {
                  if (currentIndex < test.questions.length - 1) {
                    setCurrentIndex(i => i + 1);
                  } else {
                    handleSubmit();
                  }
                }}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all shadow-sm
                  ${currentIndex === test.questions.length - 1 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20' 
                    : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20'}
                `}
              >
                {currentIndex === test.questions.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
