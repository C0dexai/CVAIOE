

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { type LlmStrategy, type OrchestrationStatus, type DualLlmTask, type TaskStatus, type LlmName } from '../types';
import { CODEX_DATA } from '../constants';
import { LoaderIcon, AbacusIcon, GeminiIcon, OpenAiIcon } from './icons';
import { startWorkflow } from './api';

interface DualLlmControlTabProps {
    onOrchestrationComplete: () => void;
    missionToReenact: { objective: string; agents: string[]; llmStrategy: LlmStrategy; } | null;
    onClearReenactMission: () => void;
    showError: (message: string) => void;
}

const LlmIcon = ({ llm }: { llm: LlmName }) => {
    switch (llm) {
        case 'gemini':
            return <GeminiIcon className="w-5 h-5" />;
        case 'openai':
            return <OpenAiIcon className="w-5 h-5" />;
        case 'abacus':
            return <AbacusIcon className="w-5 h-5 text-yellow-400" />;
        default:
            return null;
    }
}

const TaskCard = ({ task }: { task: DualLlmTask }) => {
    const getStatusColor = () => {
        switch(task.status) {
            case 'completed': return 'border-green-500';
            case 'running': return 'border-blue-500 animate-pulse';
            case 'error': return 'border-red-500';
            default: return 'border-gray-600';
        }
    }
    return (
        <div className={`p-3 bg-gray-900/80 rounded-lg border-l-4 ${getStatusColor()}`}>
            <div className="flex justify-between items-center">
                <p className="font-bold text-white">{task.agent}</p>
                <LlmIcon llm={task.llm} />
            </div>
            <p className="text-sm text-gray-300 mt-1">{task.description}</p>
            {task.status === 'running' && <div className="mt-2"><LoaderIcon className="w-4 h-4 text-blue-400" /></div>}
        </div>
    );
};

export default function DualLlmControlTab({ onOrchestrationComplete, missionToReenact, onClearReenactMission, showError }: DualLlmControlTabProps): React.ReactNode {
    const [objective, setObjective] = useState('Develop, secure, and document a new user authentication API.');
    const [selectedAgents, setSelectedAgents] = useState<string[]>(['LYRA', 'KARA', 'SOPHIA', 'CECILIA', 'MISTRESS']);
    const [strategy, setStrategy] = useState<LlmStrategy>('TRIPLE_DYNAMIC');
    const [status, setStatus] = useState<OrchestrationStatus>('idle');
    const [tasks, setTasks] = useState<DualLlmTask[]>([]);
    const [logs, setLogs] = useState<{ gemini: string[], openai: string[], abacus: string[] }>({ gemini: [], openai: [], abacus: [] });
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        if (missionToReenact) {
            setObjective(missionToReenact.objective);
            setStrategy(missionToReenact.llmStrategy);
            setSelectedAgents(missionToReenact.agents);
            
            setStatus('idle');
            setTasks([]);
            setLogs({ gemini: [], openai: [], abacus: [] });

            onClearReenactMission();
        }
    }, [missionToReenact, onClearReenactMission]);

    const handleAgentToggle = (agentName: string) => {
        setSelectedAgents(prev => prev.includes(agentName) ? prev.filter(name => name !== agentName) : [...prev, agentName]);
    };

    const runOrchestrationStream = useCallback((instanceId: string) => {
        setStatus('streaming');
        
        const es = new EventSource(`https://api.andiegogiap.com/v1/control/mission/${instanceId}/stream`);
        eventSourceRef.current = es;

        es.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if(data.type === 'task_update' && data.task) {
                    setTasks(prevTasks => {
                        const existing = prevTasks.find(t => t.id === data.task.id);
                        if(existing) {
                            return prevTasks.map(t => t.id === data.task.id ? {...t, ...data.task} : t);
                        }
                        return [...prevTasks, data.task].sort((a,b) => a.id.localeCompare(b.id));
                    });
                } else if (data.type === 'log' && data.llm) {
                     setLogs(prev => ({ ...prev, [data.llm]: [...prev[data.llm], data.message]}));
                } else if (data.type === 'orchestration_complete') {
                    setStatus('completed');
                    es.close();
                }
            } catch (e) {
                console.error("Failed to parse SSE message", e);
            }
        };

        es.onerror = () => {
            showError("Connection to event stream failed. The orchestration may have completed, or there was a network error.");
            setStatus('failed');
            es.close();
        };

    }, [showError]);

    const handleInitiate = async () => {
        if (!objective || selectedAgents.length === 0) return;
        setStatus('starting');
        setTasks([]);
        setLogs({ gemini: [], openai: [], abacus: [] });

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        try {
            const { instanceId } = await startWorkflow(objective, selectedAgents, strategy);
            runOrchestrationStream(instanceId);
        } catch (e: any) {
            showError(`API Error: ${e.message}`);
            setStatus('failed');
        }
    };
    
    const isBusy = status === 'starting' || status === 'streaming';

    return (
        <div className="glass neon p-6">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Dual-LLM Control Center</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Config */}
                <div className="lg:col-span-1 space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">1. Mission Objective</h3>
                        <textarea
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                            rows={4}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white transition-all duration-300 input-glow-green"
                            placeholder="Define the high-level mission..."
                            disabled={isBusy}
                        />
                         <div className="mt-2 grid grid-cols-3 gap-2">
                            <button onClick={() => setObjective("Generate a multi-modal presentation for a new product launch, including text, images, and a script outline.")} className="flex items-center justify-center gap-2 text-xs p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"><GeminiIcon className="w-4 h-4" /> Suggest</button>
                            <button onClick={() => setObjective("Draft a comprehensive technical specification for a secure, scalable REST API with user authentication and role-based access control.")} className="flex items-center justify-center gap-2 text-xs p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"><OpenAiIcon className="w-4 h-4" /> Suggest</button>
                            <button onClick={() => setObjective("Analyze the provided quarterly sales data, identify key trends, and create a precise forecast model for the next two quarters.")} className="flex items-center justify-center gap-2 text-xs p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"><AbacusIcon className="w-4 h-4" /> Suggest</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">2. Assign Agents</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {CODEX_DATA.ai_family.map(agent => (
                                <label key={agent.name} className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${selectedAgents.includes(agent.name) ? 'bg-indigo-600/80' : 'bg-gray-700/60'}`}>
                                    <input type="checkbox" checked={selectedAgents.includes(agent.name)} onChange={() => handleAgentToggle(agent.name)} className="form-checkbox text-indigo-500 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500 h-4 w-4" disabled={isBusy} />
                                    <span>{agent.name}</span>
                                 </label>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold text-white mb-2">3. LLM Strategy</h3>
                         <select value={strategy} onChange={e => setStrategy(e.target.value as LlmStrategy)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white transition-all duration-300 input-glow-green" disabled={isBusy}>
                            <option value="TRIPLE_DYNAMIC">Triple Dynamic (Auto-Select)</option>
                            <option value="GEMINI_PRIMARY">Gemini Primary</option>
                            <option value="OPENAI_PRIMARY">OpenAI Primary</option>
                            <option value="ABACUS_PRIMARY">Abacus Primary</option>
                        </select>
                    </div>
                    <button onClick={handleInitiate} className="w-full gemini-btn text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center" disabled={isBusy}>
                        {isBusy && <LoaderIcon className="w-5 h-5 mr-2"/>}
                        {status === 'idle' && 'Initiate Orchestration'}
                        {status === 'starting' && 'Starting...'}
                        {status === 'streaming' && 'Orchestration in Progress...'}
                        {(status === 'completed' || status === 'failed') && 'Run Again'}
                    </button>
                    {status === 'completed' && (
                         <div className="mt-4 p-4 bg-green-900/30 rounded-lg border border-green-500/50 glow-green text-center">
                            <h4 className="text-lg font-bold text-green-300">Mission Complete</h4>
                             <p className="text-sm text-green-200 mt-2">The SPA has been registered in the ledger.</p>
                            <button onClick={onOrchestrationComplete} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                                View in Ledger
                            </button>
                        </div>
                    )}
                </div>
                {/* Column 2: Execution Flow */}
                <div className="lg:col-span-1">
                     <h3 className="text-xl font-bold text-white mb-2">Real-time Execution Flow</h3>
                     <div className="p-4 bg-black/30 rounded-lg h-[500px] overflow-y-auto space-y-3 glow-green border border-green-500/30">
                        {tasks.length === 0 && <p className="text-gray-400 text-center mt-8">Awaiting orchestration...</p>}
                        {tasks.map(task => <TaskCard key={task.id} task={task} />)}
                        {status === 'completed' && <div className="text-center p-4 bg-green-900/50 rounded-lg text-green-300 font-bold">Mission Completed Successfully</div>}
                         {status === 'failed' && <div className="text-center p-4 bg-red-900/50 rounded-lg text-red-300 font-bold">Orchestration Failed</div>}
                     </div>
                </div>
                {/* Column 3: Logs */}
                <div className="lg:col-span-1">
                     <h3 className="text-xl font-bold text-white mb-2">Synchronized LLM Context</h3>
                     <div className="flex flex-col h-[500px] space-y-2">
                        <div className="flex-1 bg-black/30 p-3 rounded-lg overflow-y-auto glow-green border border-green-500/30">
                            <h4 className="flex items-center gap-2 text-md font-semibold text-cyan-300 mb-2">
                                <LlmIcon llm="gemini" />
                                Gemini Log
                            </h4>
                            <pre className="text-xs font-mono whitespace-pre-wrap text-gray-300 space-y-1">{logs.gemini.map((l,i) => <div key={i}>{l}</div>)}</pre>
                        </div>
                         <div className="flex-1 bg-black/40 p-3 rounded-lg overflow-y-auto glow-green border border-green-500/30">
                             <h4 className="flex items-center gap-2 text-md font-semibold text-green-300 mb-2">
                                 <LlmIcon llm="openai" />
                                 OpenAI Log
                             </h4>
                             <pre className="text-xs font-mono whitespace-pre-wrap text-gray-300 space-y-1">{logs.openai.map((l,i) => <div key={i}>{l}</div>)}</pre>
                         </div>
                         <div className="flex-1 bg-black/50 p-3 rounded-lg overflow-y-auto glow-green border border-green-500/30">
                             <h4 className="flex items-center gap-2 text-md font-semibold text-yellow-300 mb-2">
                                 <LlmIcon llm="abacus" />
                                 Abacus Log
                             </h4>
                             <pre className="text-xs font-mono whitespace-pre-wrap text-gray-300 space-y-1">{logs.abacus.map((l,i) => <div key={i}>{l}</div>)}</pre>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
}