import { useState, useEffect, useRef } from 'react';
import { BreathingMethod } from '@/lib/breathingPatterns';

interface BreathingState {
    label: string;
    progress: number; // 0 to 1 linear progress within current phase
    scale: number; // 0 to 1 (expansion amount)
}

export const useBreathingRhythm = (isActive: boolean, method: BreathingMethod) => {
    const [state, setState] = useState<BreathingState>({
        label: 'Ready',
        progress: 0,
        scale: 0,
    });

    const startTimeRef = useRef<number>(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (!isActive) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            return;
        }

        startTimeRef.current = performance.now();

        const loop = () => {
            const now = performance.now();
            const elapsed = (now - startTimeRef.current) / 1000; // seconds

            // Calculate total cycle duration
            const totalDuration = method.segments.reduce((acc, seg) => acc + seg.duration, 0);
            const t = elapsed % totalDuration;

            // Find current segment
            let currentSegStart = 0;
            let activeSegment = method.segments[0];

            for (const seg of method.segments) {
                if (t >= currentSegStart && t < currentSegStart + seg.duration) {
                    activeSegment = seg;
                    break;
                }
                currentSegStart += seg.duration;
            }

            // Calculate progress 0-1 within this segment
            const segmentProgress = (t - currentSegStart) / activeSegment.duration;

            // Interpolate Scale (Sine Ease is nice, but Linear might be clearer for some)
            // Let's stick to sine-ease for organic feel
            // smoothProgress goes 0 -> 1 with ease
            const smoothProgress = 0.5 * (1 - Math.cos(segmentProgress * Math.PI));

            // Lerp between start and end scale
            const currentScale = activeSegment.scaleStart + (activeSegment.scaleEnd - activeSegment.scaleStart) * smoothProgress;

            setState({
                label: activeSegment.label,
                progress: segmentProgress,
                scale: currentScale
            });

            rafRef.current = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            cancelAnimationFrame(rafRef.current);
        };
    }, [isActive, method]); // Re-run if method changes

    return state;
};
