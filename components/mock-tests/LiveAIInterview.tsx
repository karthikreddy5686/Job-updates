'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneOff, Subtitles, Disc } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LiveAIInterviewProps {
  test: any;
  onEnd: (answers: Record<string, string>) => void;
}

export default function LiveAIInterview({ test, onEnd }: LiveAIInterviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [aiState, setAiState] = useState<'speaking' | 'listening' | 'processing'>('speaking');
  const [transcript, setTranscript] = useState('');
  const [showCC, setShowCC] = useState(true);
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const currentQ = test.questions[currentIndex];

  useEffect(() => {
    // Start Camera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    };
    startCamera();

    // Setup Speech Synthesis
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }

    // Setup Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        setTranscript(prev => prev + finalTranscript + interimTranscript);
      };

      recognition.onend = () => {
        if (aiState === 'listening') {
           // Auto restart if it stops unexpectedly while listening
           try { recognition.start(); } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []); // Run once on mount

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleEndInterview();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle Question Flow
  useEffect(() => {
    if (!currentQ) return;

    // Reset state for new question
    setTranscript('');
    if (recognitionRef.current) recognitionRef.current.stop();

    // 1. AI Speaks the question
    setAiState('speaking');
    if (synthRef.current) {
      synthRef.current.cancel(); // clear queue
      const utterance = new SpeechSynthesisUtterance(currentQ.text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      // Try to find a good female voice
      const voices = synthRef.current.getVoices();
      const goodVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Female'));
      if (goodVoice) utterance.voice = goodVoice;

      utterance.onend = () => {
        // 2. AI Starts Listening
        setAiState('listening');
        if (recognitionRef.current) {
          try { recognitionRef.current.start(); } catch (e) {}
        }
      };

      // Slight delay before speaking
      setTimeout(() => {
        synthRef.current?.speak(utterance);
      }, 1000);
    }
  }, [currentIndex, currentQ]);

  const handleNextQuestion = () => {
    if (aiState === 'speaking') return; // Can't skip while AI is speaking

    // Save answer
    setAnswers(prev => ({ ...prev, [currentQ.id]: transcript }));

    if (currentIndex < test.questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      handleEndInterview();
    }
  };

  const handleEndInterview = () => {
    if (synthRef.current) synthRef.current.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    
    // Final save
    const finalAnswers = { ...answers, [currentQ.id]: transcript };
    onEnd(finalAnswers);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `00 : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#071018] text-white font-sans overflow-hidden">
      
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#0a1520]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <span className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-sm">U</span>
            nstop
          </div>
          <div className="text-slate-300 text-sm font-medium border-l border-slate-700 pl-6 py-1">
            {test.title}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-md text-sm font-semibold">
            <Disc className="w-4 h-4 animate-pulse" /> Recording
          </div>
          <div className="font-mono text-sm font-bold bg-slate-800 px-4 py-1.5 rounded-md text-slate-200">
            {formatTime(timeLeft)}
          </div>
          <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
            <div className="text-right">
              <div className="text-sm font-bold text-white">Candidate</div>
              <div className="text-xs text-slate-400">Mock Test Profile</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Candidate" alt="Avatar" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Split Screen */}
      <main className="flex-1 flex p-6 gap-6 max-w-[1600px] w-full mx-auto relative">
        
        {/* Left Pane: AI Interviewer */}
        <div className="flex-1 bg-black rounded-xl border border-slate-800 relative flex flex-col items-center justify-center overflow-hidden shadow-2xl">
          
          <motion.div 
            animate={aiState === 'speaking' ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{ repeat: aiState === 'speaking' ? Infinity : 0, duration: 2 }}
            className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-lg z-10 transition-colors duration-500
              ${aiState === 'speaking' ? 'bg-blue-600 shadow-blue-500/50' : 'bg-purple-600 shadow-purple-500/30'}
            `}
          >
            H
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-24 text-center z-10">
            {aiState === 'speaking' && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1">
                  {[1,2,3,4].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: ['8px', '24px', '8px'] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      className="w-1.5 bg-blue-500 rounded-full"
                    />
                  ))}
                </div>
                <span className="text-blue-400 font-medium text-sm">Asking Question...</span>
              </div>
            )}
            {aiState === 'listening' && (
              <div className="flex flex-col items-center">
                <span className="text-purple-400 font-bold mb-1">Listening...</span>
                <span className="text-slate-400 text-sm">Please answer</span>
              </div>
            )}
          </div>

          {/* AI Subtitles / Current Question */}
          <AnimatePresence>
            {showCC && aiState === 'speaking' && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                 className="absolute bottom-16 left-8 right-8 text-center"
               >
                 <div className="inline-block bg-black/80 backdrop-blur text-white px-6 py-3 rounded-xl border border-slate-700 text-lg shadow-xl max-w-2xl">
                   {currentQ.text}
                 </div>
               </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 left-4 text-slate-300 font-medium text-sm bg-black/50 px-3 py-1 rounded-md">
            Harsha (AI Interviewer)
          </div>
        </div>

        {/* Right Pane: Candidate Camera */}
        <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden shadow-2xl flex flex-col">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" 
          />
          
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="px-3 py-1 bg-black/50 backdrop-blur rounded text-xs font-bold text-slate-300 uppercase tracking-widest border border-slate-700">
              Q {currentIndex + 1} / {test.questions.length}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 text-white font-medium text-sm bg-black/50 backdrop-blur px-3 py-1 rounded-md">
            Candidate
          </div>

          {/* Live Transcript / CC */}
          <AnimatePresence>
            {showCC && transcript && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute bottom-16 left-8 right-8 text-center"
              >
                <div className="inline-block bg-black/70 backdrop-blur text-yellow-400 px-5 py-2.5 rounded-lg border border-slate-700 text-sm shadow-xl max-w-xl text-left">
                  {transcript}
                  <span className="w-1.5 h-4 inline-block bg-yellow-500 animate-pulse ml-1 align-middle"></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button Overlay (when listening) */}
          {aiState === 'listening' && (
            <div className="absolute bottom-4 right-4">
              <button 
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transition-colors"
              >
                {currentIndex === test.questions.length - 1 ? 'Finish Interview' : 'Submit Answer'}
              </button>
            </div>
          )}
        </div>

      </main>

      {/* Bottom Controls Bar */}
      <footer className="h-20 bg-[#0a1520] border-t border-slate-800 flex items-center justify-center gap-4 relative px-6">
        <button 
          onClick={handleEndInterview}
          className="px-6 py-2.5 bg-[#cc2929] hover:bg-red-600 text-white font-bold rounded flex items-center gap-2 transition-colors shadow-lg"
        >
          <PhoneOff className="w-4 h-4" /> End Interview
        </button>

        <button 
          onClick={() => setShowCC(!showCC)}
          className={`w-10 h-10 rounded flex items-center justify-center transition-colors shadow-lg
            ${showCC ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}
          `}
          title="Toggle Captions"
        >
          <Subtitles className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}
