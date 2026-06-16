'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lightbulb, Mic, Play, X } from 'lucide-react';

interface PreAssessmentSetupProps {
  onComplete: () => void;
}

export default function PreAssessmentSetup({ onComplete }: PreAssessmentSetupProps) {
  const [cameraAccess, setCameraAccess] = useState(false);
  const [audioCheck, setAudioCheck] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioConfirmed, setAudioConfirmed] = useState(false);
  const [micDevice, setMicDevice] = useState('Default - Microphone');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Request Camera Access on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraAccess(true);
      } catch (err) {
        console.error("Camera/Mic access denied", err);
      }
    };
    startCamera();

    return () => {
      // Don't stop tracks here so we can pass them to the next component if needed, 
      // or stop them if we want to re-request. Better to keep them running.
    };
  }, []);

  const handleStartAudioCheck = () => {
    setIsRecordingAudio(true);
    // Simulate recording progress for 3 seconds then finish
    setTimeout(() => {
      setIsRecordingAudio(false);
    }, 3000);
  };

  const handleAudioModalNext = () => {
    setAudioCheck(true);
    setShowAudioModal(false);
  };

  return (
    <div className="flex flex-col bg-white w-full h-full min-h-screen font-sans">
      <div className="flex flex-1 flex-col md:flex-row max-w-[1200px] w-full mx-auto px-4 md:px-8 pt-8 pb-24">
        
        {/* Left Side: System Permissions Setup */}
        <div className="flex-1 pr-0 md:pr-12 md:border-r border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">System Permissions Setup</h1>
          <p className="text-sm text-slate-500 mb-8">Activates checks that maintain the integrity of your test</p>

          <div className="border border-slate-200 rounded-xl mb-12 shadow-sm overflow-hidden">
            {/* Camera Access Row */}
            <div className="flex items-start gap-4 p-5 border-b border-slate-200">
              <div className={`mt-1 shrink-0 ${cameraAccess ? 'text-emerald-500' : 'text-slate-300'}`}>
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Camera Access</h3>
                <p className="text-sm text-slate-500 mt-0.5">Required for face verification and detection during the assessment.</p>
              </div>
            </div>

            {/* Audio Check Row */}
            <div 
              className={`flex items-start gap-4 p-5 transition-colors cursor-pointer ${!cameraAccess ? 'opacity-50 pointer-events-none' : 'hover:bg-slate-50'}`}
              onClick={() => { if (cameraAccess && !audioCheck) setShowAudioModal(true); }}
            >
              <div className={`mt-1 shrink-0 ${audioCheck ? 'text-emerald-500' : 'text-slate-300'}`}>
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Audio Check</h3>
                <p className="text-sm text-slate-500 mt-0.5">Required to ensure your microphone is working correctly and audio can be captured during the assessment.</p>
                
                {!audioCheck && cameraAccess && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowAudioModal(true); }}
                    className="mt-3 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-full flex items-center gap-2 transition-colors"
                  >
                    <Mic className="w-4 h-4" /> Enable Audio Access
                  </button>
                )}
              </div>
            </div>
          </div>

          <h4 className="font-bold text-slate-900 mb-3">Please note,</h4>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
              <li>Unstop can access my camera feed for identity verification and monitoring purposes during the assessment.</li>
              <li>I am the registered candidate and will take the assessment without any external help or impersonation.</li>
              <li>My face should remain clearly visible throughout the assessment duration.</li>
            </ul>
            <button className="text-blue-600 text-sm mt-3 hover:underline">Read More...</button>
          </div>
        </div>

        {/* Right Side: Important Instructions & Camera Preview */}
        <div className="w-full md:w-[400px] pl-0 md:pl-12 pt-8 md:pt-0 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-6 h-6 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-900">Important Instructions</h2>
          </div>
          
          <div className="text-sm text-slate-600 space-y-4 flex-1">
            <p>Reach out to support if needed:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>If you face any issues, please email us at support@unstop.com using your registered email ID. For quicker resolution, include a screen recording and/or the opportunity link.</li>
            </ul>
          </div>

          {/* Camera Preview */}
          <div className="mt-auto pt-8">
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-100 aspect-video relative shadow-sm">
              {cameraAccess ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform -scale-x-100" // Mirror effect
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                  Waiting for camera access...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 w-full border-t border-slate-200 bg-white py-4 px-8 flex justify-end z-40">
        <button 
          disabled={!cameraAccess || !audioCheck}
          onClick={onComplete}
          className="px-8 py-3 bg-[#0066FF] text-white font-semibold rounded-full hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          I understand, proceed
        </button>
      </div>

      {/* Audio Modal Overlay */}
      <AnimatePresence>
        {showAudioModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowAudioModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Audio Check & Voice Verification</h3>
                <button onClick={() => setShowAudioModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 pb-6 flex-1 flex flex-col items-center text-center">
                <p className="text-sm font-semibold text-slate-700 mb-1">Click on Start and read the sentence below to test your microphone and complete voice verification.</p>
                <p className="text-xs text-slate-500 mb-6">This step ensures that your audio is working correctly and that your responses can be recorded clearly during the assessment.</p>
                
                <p className="text-lg font-bold text-slate-900 leading-relaxed mb-8 max-w-xl mx-auto">
                  "Hi, I am here to complete this assessment. I understand that my voice is being recorded for verification purposes. I confirm that I am taking this test honestly and without any assistance."
                </p>

                <div className="w-full max-w-lg border border-slate-200 rounded-xl p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 text-sm">
                    <Mic className="w-4 h-4 shrink-0" />
                    <span className="truncate">{micDevice}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleStartAudioCheck}
                      disabled={isRecordingAudio}
                      className="px-6 py-2 bg-slate-800 text-white rounded-full text-sm font-semibold hover:bg-slate-900 disabled:bg-slate-400 flex items-center gap-2 transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" /> {isRecordingAudio ? 'Recording...' : 'Start'}
                    </button>
                    <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-blue-500 origin-left"
                         initial={{ scaleX: 0 }}
                         animate={{ scaleX: isRecordingAudio ? 1 : 0 }}
                         transition={{ duration: 3, ease: "linear" }}
                       />
                    </div>
                    <span className="text-xs text-slate-500 font-mono">0:00</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 bg-white">
                <label className="flex items-start gap-3 cursor-pointer mb-6 px-2">
                  <input 
                    type="checkbox" 
                    checked={audioConfirmed}
                    onChange={(e) => setAudioConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    I confirm that my voice is clearly audible and my microphone is working properly. I understand that audio will be required during this assessment.
                  </span>
                </label>

                <button 
                  disabled={!audioConfirmed}
                  onClick={handleAudioModalNext}
                  className="w-24 py-2.5 bg-slate-200 text-slate-500 font-semibold rounded-full hover:bg-slate-300 disabled:opacity-50 transition-colors disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
