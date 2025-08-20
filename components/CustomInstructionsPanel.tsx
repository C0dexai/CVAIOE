
import React, { useState, useEffect } from 'react';
import { type CustomInstructions } from '../types';

type ApiKeys = { gemini: string; openai: string; abacus: string };

interface CustomInstructionsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (instructions: CustomInstructions, keys: ApiKeys) => void;
    initialInstructions: CustomInstructions;
    initialKeys: ApiKeys;
}

export default function CustomInstructionsPanel({ isOpen, onClose, onSave, initialInstructions, initialKeys }: CustomInstructionsPanelProps): React.ReactNode {
    const [instructions, setInstructions] = useState(initialInstructions);
    const [keys, setKeys] = useState(initialKeys);

    useEffect(() => {
        if (isOpen) {
            setInstructions(initialInstructions);
            setKeys(initialKeys);
        }
    }, [initialInstructions, initialKeys, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setInstructions(prev => ({ ...prev, [id]: value }));
    };

     const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setKeys(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(instructions, keys);
    };

    return (
        <div className={`fixed top-0 right-0 h-full w-[400px] max-w-[90vw] transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full bg-gray-800/80 backdrop-blur-lg border-l border-white/10 p-6 overflow-y-auto flex flex-col">
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white">Custom Instructions</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                    <div className="space-y-4 flex-grow">
                        <div>
                            <label htmlFor="system" className="block text-sm font-medium text-gray-300 mb-1">SYSTEM Persona</label>
                            <textarea id="system" rows={5} value={instructions.system} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white transition-all duration-300 input-glow-green" placeholder="e.g., Act as a senior software architect..."></textarea>
                        </div>
                        <div>
                            <label htmlFor="ai" className="block text-sm font-medium text-gray-300 mb-1">AI Behavior</label>
                            <textarea id="ai" rows={5} value={instructions.ai} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white transition-all duration-300 input-glow-green" placeholder="e.g., Provide concise, code-first answers..."></textarea>
                        </div>
                        <div>
                            <label htmlFor="user" className="block text-sm font-medium text-gray-300 mb-1">USER Context</label>
                            <textarea id="user" rows={5} value={instructions.user} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white transition-all duration-300 input-glow-green" placeholder="e.g., The current project is a Python Flask API..."></textarea>
                        </div>
                         <div className="space-y-4 border-t border-gray-700 pt-4">
                             <h3 className="text-lg font-semibold text-white">API Keys</h3>
                            <div>
                                <label htmlFor="gemini" className="block text-sm font-medium text-gray-300 mb-1">Gemini API Key</label>
                                <input id="gemini" type="password" value={keys.gemini} onChange={handleKeyChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white transition-all duration-300 input-glow-green" placeholder="Enter your Gemini API Key..." />
                            </div>
                             <div>
                                <label htmlFor="openai" className="block text-sm font-medium text-gray-300 mb-1">OpenAI API Key</label>
                                <input id="openai" type="password" value={keys.openai} onChange={handleKeyChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white transition-all duration-300 input-glow-green" placeholder="Enter your OpenAI API Key..." />
                            </div>
                            <div>
                                <label htmlFor="abacus" className="block text-sm font-medium text-gray-300 mb-1">Abacus API Key</label>
                                <input id="abacus" type="password" value={keys.abacus} onChange={handleKeyChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white transition-all duration-300 input-glow-green" placeholder="Enter your Abacus API Key..." />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex-shrink-0">
                        <button type="submit" className="w-full gemini-btn text-white font-bold py-3 px-6 rounded-lg shadow-lg">Set & Make Instructions Live</button>
                    </div>
                </form>
            </div>
        </div>
    );
}