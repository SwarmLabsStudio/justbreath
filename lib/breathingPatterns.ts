export type SoundProfile = 'FOCUS' | 'RELAX' | 'BALANCE' | 'ENERGIZE';

export interface BreathingSegment {
    duration: number; // Seconds
    label: string;    // Text to display
    scaleStart: number; // 0 to 1
    scaleEnd: number;   // 0 to 1
}

export interface BreathingMethod {
    id: string;
    title: string;
    description: string;
    soundProfile: SoundProfile;
    segments: BreathingSegment[]; // The loop cycle
}

export const BREATHING_METHODS: BreathingMethod[] = [
    {
        id: 'box',
        title: 'Box Breathing',
        description: 'Calm the nervous system & improve focus.',
        soundProfile: 'FOCUS',
        segments: [
            { duration: 4, label: 'Inhale', scaleStart: 0, scaleEnd: 1 },
            { duration: 4, label: 'Hold', scaleStart: 1, scaleEnd: 1 },
            { duration: 4, label: 'Exhale', scaleStart: 1, scaleEnd: 0 },
            { duration: 4, label: 'Hold', scaleStart: 0, scaleEnd: 0 },
        ]
    },
    {
        id: '4-7-8',
        title: '4-7-8 Relax',
        description: 'Deep relaxation & sleep induction.',
        soundProfile: 'RELAX',
        segments: [
            { duration: 4, label: 'Inhale', scaleStart: 0, scaleEnd: 1 },
            { duration: 7, label: 'Hold', scaleStart: 1, scaleEnd: 1 },
            { duration: 8, label: 'Exhale', scaleStart: 1, scaleEnd: 0 },
        ]
    },
    {
        id: 'coherent',
        title: 'Coherent',
        description: 'Heart coherence & stress reduction (5.5s).',
        soundProfile: 'BALANCE',
        segments: [
            { duration: 5.5, label: 'Inhale', scaleStart: 0, scaleEnd: 1 },
            { duration: 5.5, label: 'Exhale', scaleStart: 1, scaleEnd: 0 },
        ]
    },
    {
        id: 'nadi-shodhana',
        title: 'Alt. Nostril',
        description: 'Balance left/right brain & clarity.',
        soundProfile: 'BALANCE',
        segments: [
            { duration: 4, label: 'Inhale Left', scaleStart: 0, scaleEnd: 1 },
            { duration: 4, label: 'Exhale Right', scaleStart: 1, scaleEnd: 0 },
            { duration: 4, label: 'Inhale Right', scaleStart: 0, scaleEnd: 1 },
            { duration: 4, label: 'Exhale Left', scaleStart: 1, scaleEnd: 0 },
        ]
    },
    {
        id: 'extended-holds',
        title: 'Extended Holds',
        description: 'Deep focus & flow state priming.',
        soundProfile: 'FOCUS',
        segments: [
            { duration: 4, label: 'Inhale', scaleStart: 0, scaleEnd: 1 },
            { duration: 7, label: 'Hold', scaleStart: 1, scaleEnd: 1 },
            { duration: 8, label: 'Exhale', scaleStart: 1, scaleEnd: 0 },
            { duration: 4, label: 'Hold', scaleStart: 0, scaleEnd: 0 },
        ]
    },
    {
        id: 'mindful',
        title: 'Mindful Count',
        description: 'Simple awareness. Count your breaths.',
        soundProfile: 'RELAX',
        segments: [
            { duration: 5, label: 'Inhale', scaleStart: 0, scaleEnd: 1 },
            { duration: 5, label: 'Exhale', scaleStart: 1, scaleEnd: 0 },
        ]
    },
    {
        id: 'sama-vritti',
        title: 'Box (Easy)',
        description: 'Equal breath. Beginner friendly balance.',
        soundProfile: 'BALANCE',
        segments: [
            { duration: 4, label: 'Inhale', scaleStart: 0, scaleEnd: 1 },
            { duration: 4, label: 'Exhale', scaleStart: 1, scaleEnd: 0 },
        ]
    },
    {
        id: 'ujjayi',
        title: 'Ocean Breath',
        description: 'Slow, controlled constriction.',
        soundProfile: 'FOCUS',
        segments: [
            { duration: 7, label: 'Inhale (Slow)', scaleStart: 0, scaleEnd: 1 },
            { duration: 7, label: 'Exhale (Ocean)', scaleStart: 1, scaleEnd: 0 },
        ]
    },
    {
        id: 'wim-hof-like',
        title: 'Power Breath',
        description: 'Energizing. Hyper-oxygenation pace.',
        soundProfile: 'ENERGIZE',
        segments: [
            { duration: 1.5, label: 'Fully In', scaleStart: 0, scaleEnd: 1 },
            { duration: 1.0, label: 'Let Go', scaleStart: 1, scaleEnd: 0.2 },
        ]
    },
    {
        id: 'flow-focus',
        title: 'Flow Pace',
        description: 'Alertness & sustained attention.',
        soundProfile: 'FOCUS',
        segments: [
            { duration: 3.5, label: 'Inhale', scaleStart: 0, scaleEnd: 1 },
            { duration: 3.5, label: 'Exhale', scaleStart: 1, scaleEnd: 0 },
        ]
    },
];
