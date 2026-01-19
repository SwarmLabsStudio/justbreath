'use client';

import { useEffect, useRef } from 'react';
import { SoundProfile } from '@/lib/breathingPatterns';

interface BreathVisualizerProps {
    soundProfile: SoundProfile;
    guideScale: number; // 0 to 1
}

export default function BreathVisualizer({ soundProfile, guideScale }: BreathVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        // Configuration
        const minRadius = Math.min(window.innerWidth, window.innerHeight) * 0.15;
        const maxAdditionalRadius = Math.min(window.innerWidth, window.innerHeight) * 0.20;

        // Simulate "breathing life" without mic
        // We'll use the guideScale itself as the driver for intensity

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            time += 0.01;

            // Derived intensity from expansion
            // When fully expanded (guideScale=1), things are brighter/calmer? 
            // Actually usually more intense.
            const intensity = guideScale;

            // Color Palette based on SoundProfile
            let hueBase = 240;
            let hueShift = 40;

            switch (soundProfile) {
                case 'FOCUS':
                    hueBase = 210;
                    hueShift = 60;
                    break;
                case 'RELAX':
                    hueBase = 150;
                    hueShift = 30;
                    break;
                case 'BALANCE':
                    hueBase = 260;
                    hueShift = 40;
                    break;
                case 'ENERGIZE':
                    hueBase = 20;
                    hueShift = 40;
                    break;
            }

            // Radius
            const currentRadius = minRadius + (guideScale * maxAdditionalRadius);

            // Pulse
            // Add a subtle idle pulse always, appearing "alive"
            const idlePulse = Math.sin(time * 2) * 2;

            const hue = hueBase + (intensity * hueShift);
            const lightness = 50 + (intensity * 10);
            const color = `hsl(${hue}, 70%, ${lightness}%)`;
            const glowColor = `hsl(${hue}, 80%, 60%)`;

            // Clear with trails
            ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Center
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // Draw "Breath Blob"
            ctx.beginPath();

            const points = 100;
            for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2;

                // Organic noise
                let noiseAmt = 12;
                if (soundProfile === 'ENERGIZE') noiseAmt = 25;

                const noise = Math.sin(angle * 5 + time) * Math.cos(angle * 3 + time * 0.5) * noiseAmt
                    + Math.sin(angle * 12 + time * 2) * 5;

                // Simulated turbulence based on expansion state
                // More turbulent when expanding? Or steady?
                // Let's keep it steady but breathing.

                const r = currentRadius + noise + idlePulse;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.closePath();

            // Fill
            const gradient = ctx.createRadialGradient(cx, cy, currentRadius * 0.2, cx, cy, currentRadius * 1.5);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.fill();

            // Glow
            ctx.strokeStyle = glowColor;
            ctx.lineWidth = 3 + (intensity * 2);
            ctx.stroke();

            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [soundProfile, guideScale]);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
