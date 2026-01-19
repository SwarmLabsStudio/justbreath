'use client';

import { useState } from 'react';
import SessionSetup from '@/components/SessionSetup';
import ActiveSession from '@/components/ActiveSession';
import { BreathingMethod } from '@/lib/breathingPatterns';

export default function Home() {
  const [sessionState, setSessionState] = useState<{
    isActive: boolean;
    method: BreathingMethod | null;
    duration: number;
  }>({
    isActive: false,
    method: null,
    duration: 10,
  });

  const startSession = (method: BreathingMethod, duration: number) => {
    setSessionState({
      isActive: true,
      method,
      duration,
    });
  };

  const endSession = () => {
    setSessionState(prev => ({ ...prev, isActive: false }));
  };

  return (
    <main style={{ minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Background Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, var(--background), #111)',
          pointerEvents: 'none',
          zIndex: -20
        }}
      />

      {/* Content */}
      {sessionState.isActive && sessionState.method ? (
        <ActiveSession
          method={sessionState.method}
          durationMinutes={sessionState.duration}
          onEnd={endSession}
        />
      ) : (
        <SessionSetup onStart={startSession} />
      )}
    </main>
  );
}
