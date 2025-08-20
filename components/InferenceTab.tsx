

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { type GeneratedSpa } from '../types';
import { CogIcon, LoaderIcon } from './icons';
import { getLedgerSpas } from './api';


interface InferenceTabProps {
    onManage: (spa: GeneratedSpa) => void;
    showError: (message: string) => void;
}

const SpaLedgerCard = ({ spa, onManage }: { spa: GeneratedSpa; onManage: (spa: GeneratedSpa) => void }) => {
    return (
        <div className="bg-gray-800/60 p-4 rounded-lg border border-blue-500/30 glow-blue hover:glow-yellow transition-all duration-300 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white">{spa.id.slice(0,8)}...</h3>
                    <span className="text-xs bg-indigo-500/50 text-indigo-200 px-2 py-1 rounded-full font-mono">{spa.strategy}</span>
                </div>
                <p className="text-gray-300 mt-2 text-sm h-10 overflow-hidden">{spa.objective}</p>
                 <p className="text-xs text-gray-500 mt-1">Created: {new Date(spa.createdAt).toLocaleDateString()}</p>
            </div>
            <button
                onClick={() => onManage(spa)}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
                <CogIcon className="w-5 h-5" />
                Manage
            </button>
        </div>
    );
};

export default function InferenceTab({ onManage, showError }: InferenceTabProps): React.ReactNode {
    const [spas, setSpas] = useState<GeneratedSpa[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchSpas = useCallback(async (query: string) => {
        setIsLoading(true);
        try {
            const data = await getLedgerSpas(query);
            setSpas(data);
        } catch (e: any) {
            showError(`API Error: ${e.message}`);
            setSpas([]);
        } finally {
            setIsLoading(false);
        }
    }, [showError]);
    
    // Initial fetch
    useEffect(() => {
        fetchSpas('');
    }, [fetchSpas]);

    // Debounced search
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchSpas(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm, fetchSpas]);

    return (
        <div className="glass neon p-6">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">Inference & Ledger</h2>
            <p className="text-center text-gray-300 mb-6">A file explorer for all generated SPAs from completed Dual-LLM missions.</p>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by ID, Mission, or Command..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white transition-all duration-300 input-glow-green"
                />
            </div>

            {isLoading ? (
                 <div className="flex justify-center items-center py-16">
                    <LoaderIcon className="w-12 h-12 text-indigo-400" />
                 </div>
            ) : spas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {spas.map(spa => (
                        <SpaLedgerCard key={spa.id} spa={spa} onManage={onManage} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-2xl font-bold text-gray-400">No SPAs Found</h3>
                    <p className="text-gray-500 mt-2">The ledger is empty or your search returned no results. Complete a mission to generate an SPA.</p>
                </div>
            )}
        </div>
    );
}