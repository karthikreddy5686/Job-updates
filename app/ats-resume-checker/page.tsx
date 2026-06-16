'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Zap, RefreshCcw, Briefcase, Target } from 'lucide-react';
import { Button } from '@/app/components';
import Link from 'next/link';

export default function AtsResumeChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setShowResults(false);
      } else {
        alert('Please upload a PDF file.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setShowResults(false);
      } else {
        alert('Please upload a PDF file.');
      }
    }
  };

  const handleScan = async () => {
    if (!file) {
      alert('Please upload your resume first.');
      return;
    }
    setIsScanning(true);
    setShowResults(false);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const parseRes = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      const parseData = await parseRes.json();
      
      if (!parseRes.ok || !parseData.success) {
        setError('Could not extract text from PDF.');
        setIsScanning(false);
        return;
      }

      const text = parseData.text;

      const res = await fetch('/api/resume-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text, jobDescription }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Analysis failed.');
        setIsScanning(false);
        return;
      }

      setResult(data.result);
      setShowResults(true);
    } catch (err) {
      setError('An error occurred during analysis.');
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setFile(null);
    setJobDescription('');
    setShowResults(false);
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/job-updates" className="text-sm font-semibold text-slate-500 hover:text-black transition-colors">
              &larr; Back to Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white shadow-sm">
              Premium ATS Tool
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-black shadow-sm mb-6"
          >
            <Zap className="h-4 w-4 text-black" />
            AI-Powered Analysis
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-black sm:text-6xl"
          >
            ATS Resume Checker
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-slate-600"
          >
            Upload your resume and paste the job description to instantly see how well you match. Discover missing keywords and optimize your chances of getting hired.
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Dropzone */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all ${file ? 'border-black bg-slate-100' : 'border-slate-300 bg-white hover:border-black hover:bg-slate-50'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
              />
              
              {file ? (
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-white mb-4">
                    <FileText className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-bold text-black">{file.name}</p>
                  <p className="text-sm text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • Click to change</p>
                </div>
              ) : (
                <div className="text-center px-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-black mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-bold text-black">Upload your PDF Resume</p>
                  <p className="text-sm text-slate-500 mt-2">Drag and drop your file here, or click to browse</p>
                </div>
              )}
            </div>

            {/* Job Description Area */}
            <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="mb-3 flex items-center gap-2 text-sm font-bold text-black">
                <Briefcase className="h-4 w-4" />
                Target Job Description (Optional)
              </label>
              <textarea 
                placeholder="Paste the job description here to see your exact match rate..."
                className="min-h-[160px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-black outline-none transition-colors focus:border-black focus:bg-white"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleScan}
              disabled={!file || isScanning}
              className="w-full rounded-2xl bg-black py-4 text-lg font-bold text-white shadow-xl shadow-black/20 hover:bg-slate-900 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isScanning ? (
                <div className="flex items-center justify-center gap-3">
                  <RefreshCcw className="h-5 w-5 animate-spin" />
                  Analyzing with AI...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5" />
                  Scan Resume Now
                </div>
              )}
            </Button>
            {error && <p className="text-red-500 text-sm font-bold text-center mt-2">{error}</p>}
          </motion.div>

          {/* Results Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative flex flex-col rounded-3xl border border-slate-200 bg-black p-1 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-black to-slate-900 rounded-3xl" />
            
            <div className="relative flex h-full flex-col rounded-[22px] bg-black px-6 py-8 text-white sm:px-8">
              {!showResults && !isScanning ? (
                <div className="flex h-full flex-col items-center justify-center text-center opacity-60">
                  <div className="mb-6 rounded-full bg-white/10 p-6">
                    <Target className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Awaiting Resume</h3>
                  <p className="mt-2 max-w-[280px] text-sm text-slate-400">
                    Upload your resume and click scan to generate your detailed ATS compatibility report.
                  </p>
                </div>
              ) : isScanning ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 animate-ping rounded-full bg-white/20" />
                    <div className="relative rounded-full bg-white/10 p-6">
                      <Zap className="h-10 w-10 animate-pulse text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold animate-pulse">Running AI Analysis...</h3>
                  <div className="mt-6 w-full max-w-[240px] overflow-hidden rounded-full bg-white/10">
                    <motion.div 
                      className="h-2 bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-full flex-col"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Match Score</p>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-5xl font-extrabold">{result?.atsScore || 0}</span>
                          <span className="text-xl font-bold text-slate-500">/ 100</span>
                        </div>
                      </div>
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white border-t-white/20 bg-white/5">
                        <span className="text-2xl font-bold text-white">{result?.atsScore || 0}%</span>
                      </div>
                    </div>

                    <div className="mt-8 flex-1 space-y-8">
                      <div>
                        <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          Matched Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result?.matchedKeywords?.length > 0 ? result.matchedKeywords.map((kw: string) => (
                            <span key={kw} className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white">
                              {kw}
                            </span>
                          )) : <p className="text-sm text-slate-400">No matched keywords found.</p>}
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                          <XCircle className="h-4 w-4 text-red-400" />
                          Missing Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result?.missingKeywords?.length > 0 ? result.missingKeywords.map((kw: string) => (
                            <span key={kw} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm text-red-200">
                              {kw}
                            </span>
                          )) : <p className="text-sm text-slate-400">No missing keywords found.</p>}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white/5 p-5">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                          <AlertTriangle className="h-4 w-4 text-yellow-400" />
                          Improvement Tips
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-300">
                          {result?.improvements?.length > 0 ? result.improvements.map((imp: any, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                              {imp.detail || imp.title}
                            </li>
                          )) : <p className="text-sm text-slate-400">Your resume looks great! No improvements suggested.</p>}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                      <button onClick={reset} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                        Scan another resume
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
