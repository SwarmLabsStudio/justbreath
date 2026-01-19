'use client';

import React, { useEffect, useState } from 'react';
import { useSoundScapes } from '@/hooks/useSoundScapes';
import { useBreathingRhythm } from '@/hooks/useBreathingRhythm';
import BreathVisualizer from '@/components/BreathVisualizer';
import { BreathingMethod } from '@/lib/breathingPatterns';
import { Clock, X } from 'lucide-react';

interface ActiveSessionProps {
    method: BreathingMethod;
    durationMinutes: number;
    onEnd: () => void;
}

export default function ActiveSession({ method, durationMinutes, onEnd }: ActiveSessionProps) {
    const { playSound, stopSound, updateBreath } = useSoundScapes();
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
    const [isEnding, setIsEnding] = useState(false);

    // Rhythm Guide
    const { label, scale: guideScale, progress } = useBreathingRhythm(!isEnding, method);

    // Sync sound with breath rhythm
    useEffect(() => {
        if (!isEnding) {
            updateBreath(label, progress);
        }
    }, [label, progress, isEnding, updateBreath]);

    // Start everything on mount
    useEffect(() => {
        playSound(method.soundProfile);

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            stopSound();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFinish = () => {
        setIsEnding(true);
        setTimeout(() => {
            onEnd();
        }, 3000);
    };

    const handleExit = () => {
        // Trigger visual fade out
        setIsEnding(true);
        // Trigger audio fade out immediately
        stopSound();

        // Wait for visual transition (1s) before unmounting
        setTimeout(() => {
            onEnd();
        }, 1000);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`overlay-fullscreen ${isEnding ? 'opacity-0' : 'opacity-100'}`}>

            {/* Background Visuals - Rendered independently */}
            <BreathVisualizer
                soundProfile={method.soundProfile}
                guideScale={guideScale}
            />

            {/* Top Bar - Fixed to Viewport, High Z-Index to prevent overlapping issues */}
            <div className="session-top-bar">
                <div className="session-header-content">
                    <h2 className="text-xl font-light opacity-90 text-white drop-shadow-md">{method.title}</h2>
                    <div className="text-sm text-gray-300 mt-1 drop-shadow-md opacity-70">
                        {method.soundProfile.toLowerCase()} focus
                    </div>
                </div>

                <button
                    onClick={handleExit}
                    className="btn-end-session group"
                >
                    <span className="text-sm font-medium text-white group-hover:text-gray-100">End Session</span>
                    <X size={18} className="text-white group-hover:text-gray-100" />
                </button>
            </div>

            {/* Center Instruction */}
            <div className="center-absolute">
                <p className="text-4xl font-light opacity-90 animate-pulse tracking-widest transition-all duration-300">
                    {label}
                </p>
            </div>

            {/* Bottom Bar / Timer */}
            <div className="w-full mb-8 flex justify-center fade-in">
                <div className="timer-pill">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-xl font-light font-variant-numeric">
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>
        </div>
    );
}
