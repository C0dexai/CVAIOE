
import React from 'react';
import { type GeneratedSpa } from '../types';
import { CloseIcon } from './icons';

interface GeneratedSpaModalProps {
    isOpen: boolean;
    onClose: () => void;
    spa: GeneratedSpa | null;
}

export default function GeneratedSpaModal({ isOpen, onClose, spa }: GeneratedSpaModalProps): React.ReactNode {
    if (!isOpen || !spa) return null;

    const stages = Array.isArray(spa?.summary?.stages) ? spa.summary.stages : [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-gray-900 border-2 border-indigo-500/50 rounded-lg w-full max-w-4xl max-h-[90vh] shadow-2xl shadow-indigo-500/20 flex flex-col">
                <header className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{spa.id}: Launched SPA</h2>
                        <p className="text-sm text-indigo-300">{spa.objective}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <CloseIcon className="w-8 h-8" />
                    </button>
                </header>

                <main className="p-6 overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Synchronized Command</h3>
                        <pre className="bg-black/50 p-3 rounded-md text-sm text-green-300 font-mono whitespace-pre-wrap">
                            <code>{spa.command}</code>
                        </pre>
                    </div>

                    <div className="p-4 rounded-lg glow-green border border-green-500/30">
                        <h3 className="text-lg font-semibold text-gray-300 mb-3">Execution Summary</h3>
                        <div className="space-y-3">
                            {stages.map((stage, index) => (
                                <div key={index} className="p-3 bg-gray-800/70 rounded-lg border-l-4 border-green-500">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-white">{stage.name || 'Unnamed Stage'}</p>
                                        <span className="text-xs text-blue-300 font-mono">{stage.agent || 'N/A'}</span>
                                    </div>
                                </div>
                            ))}
                            {stages.length === 0 && (
                                <p className="text-gray-400">No summary stages available in the record.</p>
                            )}
                        </div>
                    </div>
                </main>

                 <footer className="text-center text-xs text-gray-500 p-3 border-t border-gray-700 flex-shrink-0">
                    Generated on {new Date(spa.createdAt).toLocaleString()}
                </footer>
            </div>
        </div>
    );
}
