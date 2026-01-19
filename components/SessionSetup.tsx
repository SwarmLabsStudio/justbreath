import { useState } from 'react';
import { BREATHING_METHODS, BreathingMethod } from '@/lib/breathingPatterns';

interface SessionSetupProps {
    onStart: (method: BreathingMethod, durationMinutes: number) => void;
}

export default function SessionSetup({ onStart }: SessionSetupProps) {
    const [selectedMethodId, setSelectedMethodId] = useState<string>(BREATHING_METHODS[0].id);
    const [duration, setDuration] = useState<number>(10);

    const selectedMethod = BREATHING_METHODS.find(m => m.id === selectedMethodId) || BREATHING_METHODS[0];

    return (
        <div className="layout-center fade-in">
            <h1 className="mb-2">JustBreath</h1>
            <p className="text-gray-400 mb-12 text-lg font-light">Focus. Flow. Relax.</p>

            {/* Session Type */}
            <div className="w-full max-w-4xl mb-8">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Breathing Method</h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '1rem',
                    maxHeight: '40vh',
                    overflowY: 'auto',
                    paddingRight: '0.5rem'
                }}>
                    {BREATHING_METHODS.map(method => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethodId(method.id)}
                            className={`card-button text-left ${selectedMethodId === method.id ? 'active-flow' : ''}`}
                            style={{ padding: '1.25rem' }}
                        >
                            <div className="text-lg font-medium mb-1 text-white">{method.title}</div>
                            <div className="text-xs text-gray-400 leading-relaxed">{method.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Duration */}
            <div className="w-full max-w-md mb-12">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Duration (Minutes)</h3>
                <div className="duration-selector">
                    {[5, 10, 20, 30].map(m => (
                        <button
                            key={m}
                            onClick={() => setDuration(m)}
                            className={`duration-btn ${duration === m ? 'active' : ''}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={() => onStart(selectedMethod, duration)}
                className="btn-start"
            >
                Start Session
            </button>
        </div>
    );
}
