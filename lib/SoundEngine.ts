import { SoundProfile } from '@/lib/breathingPatterns';
// export type SessionType = 'FLOW' | 'RELAXATION';

export class SoundEngine {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    // Noise Nodes
    private noiseNode: AudioBufferSourceNode | null = null;
    private noiseFilter: BiquadFilterNode | null = null;
    private noiseGain: GainNode | null = null;

    // Binaural Nodes
    private oscL: OscillatorNode | null = null;
    private oscR: OscillatorNode | null = null;
    private binauralGain: GainNode | null = null;

    private isPlaying: boolean = false;

    constructor() { }

    private init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
        }
    }

    // Create Brown Noise (deeper, rumble-like, similar to ocean/breath)
    private createBrownNoise() {
        if (!this.ctx) return null;
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 1.0; // Reduced from 3.5 to prevent clipping 
        }
        return buffer;
    }

    async start(profile: SoundProfile) {
        this.init();
        if (!this.ctx || !this.masterGain) return;

        if (this.ctx.state === 'suspended') {
            try { await this.ctx.resume(); } catch (e) { console.error(e); }
        }

        this.stop();
        this.isPlaying = true;

        const now = this.ctx.currentTime;

        // Master Fade In
        this.masterGain.gain.setValueAtTime(0, now);
        this.masterGain.gain.linearRampToValueAtTime(1.0, now + 1);

        // 1. Noise Layer setup
        const noiseBuffer = this.createBrownNoise();
        if (noiseBuffer) {
            this.noiseNode = this.ctx.createBufferSource();
            this.noiseNode.buffer = noiseBuffer;
            this.noiseNode.loop = true;

            this.noiseFilter = this.ctx.createBiquadFilter();
            this.noiseFilter.type = 'lowpass';
            this.noiseFilter.frequency.value = 800; // Increased to 800Hz for more air/ocean sound

            this.noiseGain = this.ctx.createGain();
            this.noiseGain.gain.setValueAtTime(0, now); // Starts silent

            this.noiseNode.connect(this.noiseFilter).connect(this.noiseGain).connect(this.masterGain);
            this.noiseNode.start();
        }

        // 2. Binaural Layer setup (Constant background drone)
        let baseFreq = 200;
        let beatFreq = 10;

        // Frequencies based on research + user constraints
        switch (profile) {
            case 'FOCUS': // Gamma (40Hz)
                baseFreq = 200;
                beatFreq = 40;
                break;
            case 'RELAX': // Delta (4Hz) - Deep sleep/calm
                baseFreq = 100;
                beatFreq = 4;
                break;
            case 'BALANCE': // Alpha (10Hz) - Coherence
                baseFreq = 150;
                beatFreq = 10;
                break;
            case 'ENERGIZE': // Beta/Gamma (30Hz)
                baseFreq = 250;
                beatFreq = 30;
                break;
        }

        this.oscL = this.ctx.createOscillator();
        this.oscL.type = 'sine';
        this.oscL.frequency.value = baseFreq;

        this.oscR = this.ctx.createOscillator();
        this.oscR.type = 'sine';
        this.oscR.frequency.value = baseFreq + beatFreq;

        const panL = this.ctx.createStereoPanner(); panL.pan.value = -1;
        const panR = this.ctx.createStereoPanner(); panR.pan.value = 1;

        this.binauralGain = this.ctx.createGain();
        this.binauralGain.gain.value = 0.1; // Subtle background layer

        this.oscL.connect(panL).connect(this.binauralGain).connect(this.masterGain);
        this.oscR.connect(panR).connect(this.binauralGain).connect(this.masterGain);

        this.oscL.start();
        this.oscR.start();
    }

    // Called every frame to modulate volume based on breath phase
    updateBreath(label: string, progress: number) {
        if (!this.ctx || !this.noiseGain || !this.isPlaying) return;

        const now = this.ctx.currentTime;
        // Smooth out transitions heavily
        const rampTime = 0.1;

        let targetGain = 0;

        // Inhale: Fade In (0 -> 1)
        if (label.includes('Inhale') || label.includes('In')) {
            // Progress 0->1, so Gain 0.2 -> 0.8 (never full silence or max blast)
            targetGain = 0.2 + (progress * 0.6);
        }
        // Hold: Steady (Keep high or low depending on if we just inhaled or exhaled)
        else if (label.includes('Hold')) {
            // Heuristic: If we are holding, we usually just inhaled or exhaled.
            // For simplicity in this stateless update, let's keep it steady mid-volume OR
            // relying on the previous value would be better, but tricky in RAF.
            // Let's make "Hold" a steady hum.
            targetGain = 0.5;
        }
        // Exhale: Fade Out (1 -> 0)
        else if (label.includes('Exhale') || label.includes('Out') || label.includes('Ocean')) {
            // Progress 0->1 (start to end of exhale)
            // Gain 0.8 -> 0.2
            targetGain = 0.8 - (progress * 0.6);
        }
        // Fallback (Ready, etc)
        else {
            targetGain = 0;
        }

        // Apply smooth volume change
        this.noiseGain.gain.setTargetAtTime(targetGain, now, rampTime);
    }

    stop() {
        if (!this.ctx || !this.masterGain || !this.isPlaying) return;

        const now = this.ctx.currentTime;
        // Fade out master
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1);

        const nodesToStop = [this.noiseNode, this.oscL, this.oscR];
        this.isPlaying = false;
        this.noiseNode = null;
        this.oscL = null;
        this.oscR = null;

        setTimeout(() => {
            nodesToStop.forEach(n => { try { n?.stop(); } catch (e) { } });
        }, 1200);
    }
}
