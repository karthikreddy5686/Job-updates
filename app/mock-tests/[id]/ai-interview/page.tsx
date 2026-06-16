'use client';
import React, { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { mockTestsData } from '@/data/mockTestsData';
import PreAssessmentSetup from '@/components/mock-tests/PreAssessmentSetup';
import LiveAIInterview from '@/components/mock-tests/LiveAIInterview';

export default function AIInterviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const test = mockTestsData.find(t => t.id === params.id);
  
  const [phase, setPhase] = useState<'setup' | 'interview'>('setup');
  
  if (!test) return notFound();

  const handleInterviewEnd = (answers: Record<string, string>) => {
    // In a real app, send the transcribed answers to an LLM or DB.
    console.log("Interview ended. Answers:", answers);
    localStorage.setItem(`ai_mock_result_${test.id}`, JSON.stringify(answers));
    router.push(`/mock-tests/${test.id}/results`);
  };

  return (
    <>
      {phase === 'setup' && (
        <PreAssessmentSetup onComplete={() => setPhase('interview')} />
      )}
      
      {phase === 'interview' && (
        <LiveAIInterview test={test} onEnd={handleInterviewEnd} />
      )}
    </>
  );
}
