
import React, { useState, useEffect } from 'react';
import { GoogleAvatarIcon } from './icons';

export default function Header(): React.ReactNode {
    const [userId, setUserId] = useState('');
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        setUserId(`user_${crypto.randomUUID().slice(0, 8)}`);
        setSessionId(`session_${crypto.randomUUID().slice(0, 12)}`);
    }, []);

    return (
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white">CUA Orchestration Engine</h1>
            <p className="text-lg text-gray-400 mt-2">Persona: GAU-C-CUAG</p>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-500 mt-2">
                 <div className="flex items-center gap-2">
                    <GoogleAvatarIcon className="w-6 h-6 rounded-full" />
                    <span className="font-mono">{userId}</span>
                </div>
                <span>|</span>
                <div>
                   Session ID: <span className="font-mono">{sessionId}</span>
                </div>
            </div>
        </header>
    );
}