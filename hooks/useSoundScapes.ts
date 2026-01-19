import { useRef, useEffect } from 'react';
import { SoundEngine } from '@/lib/SoundEngine';
import { SoundProfile } from '@/lib/breathingPatterns';

export const useSoundScapes = () => {
    const engineRef = useRef<SoundEngine | null>(null);

    useEffect(() => {
        engineRef.current = new SoundEngine();
        return () => {
            engineRef.current?.stop();
        };
    }, []);

    const playSound = (profile: SoundProfile) => {
        engineRef.current?.start(profile);
    };

    const updateBreath = (label: string, progress: number) => {
        engineRef.current?.updateBreath(label, progress);
    };

    const stopSound = () => {
        engineRef.current?.stop();
    };

    return { playSound, stopSound, updateBreath };
};
