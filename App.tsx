



import React, { useState, useCallback } from 'react';
import { type RunningOrchestration, type CustomInstructions, type GeneratedSpa, type LlmStrategy } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import AgenticCoreTab from './components/AgenticCoreTab';
import AdjecticManifestTab from './components/AdjecticManifestTab';
import ConfigTab from './components/ConfigTab';
import AjenticNexusTab from './components/AjenticNexusTab';
import GeminiOpenAIPlan from './components/GeminiOpenAIPlan';
import DualLlmControlTab from './components/DualLlmControlTab';
import CustomInstructionsPanel from './components/CustomInstructionsPanel';
import Modal from './components/Modal';
import InferenceTab from './components/InferenceTab';
import PageDeployerTab from './components/PageDeployerTab';
import GeneratedSpaModal from './components/GeneratedSpaModal';
import SpaManagementPanel from './components/SpaManagementPanel';
import LandingPage from './components/LandingPage';
import { replaySpa, shareSpaContext } from './components/api';
import GlassMorphismGuide from './components/GlassMorphismGuide';
import { CloseIcon, CopyIcon } from './components/icons';


type Tab = 'agentic' | 'adjectic' | 'config' | 'ajentic' | 'plan' | 'dualLlm' | 'inference' | 'deploy' | 'glass';

const PREFILLED_INSTRUCTIONS: CustomInstructions = {
    system: "You are LYRA, the master orchestrator for the AI Family. Your primary function is to interpret high-level missions and break them down into a logical sequence of tasks for specialized AI agents. You must dynamically allocate tasks to either Gemini, OpenAI, or Abacus based on the chosen LLM strategy. Your goal is to achieve the mission objective with maximum efficiency, parallelization, and coherence, ensuring seamless context handoffs between agents and LLMs. Maintain a persistent state of the entire operation.",
    ai: "When orchestrating, provide clear, step-by-step reasoning for task delegation. For each task, specify the assigned Agent, the chosen LLM, and the rationale for that choice under the 'Dynamic' strategy (e.g., 'Assigning to Gemini for its advanced code generation capabilities'). Log all significant events, decisions, and inter-agent communications to the appropriate LLM context log. When encountering an error, engage KARA for security/compliance checks and SOPHIA for semantic analysis to find an alternative path forward.",
    user: "The user is an Operator overseeing the AI Family's CI/CD and development workflows. They will provide high-level missions and expect you to manage the entire execution lifecycle. The primary interface is the Dual-LLM Control Center. The user requires full transparency into the process, including real-time execution flow and synchronized LLM context logs. The current ecosystem includes agents: LYRA, KARA, SOPHIA, CECILIA, DAN, STAN, DUDE, KARL, MISTRESS. The goal is to future-proof the system by validating this Triple-LLM approach."
};

interface HtmlViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    spa: GeneratedSpa | null;
}

function HtmlViewerModal({ isOpen, onClose, spa }: HtmlViewerModalProps): React.ReactNode {
    if (!isOpen || !spa) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(spa.command);
        alert('HTML content copied to clipboard!'); // Simple feedback
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-gray-900 border-2 border-cyan-500/50 rounded-lg w-full max-w-4xl max-h-[90vh] shadow-2xl shadow-cyan-500/20 flex flex-col">
                <header className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-white">HTML Content for SPA: {spa.id}</h2>
                        <button onClick={handleCopy} title="Copy HTML" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-md">
                            <CopyIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <CloseIcon className="w-8 h-8" />
                    </button>
                </header>

                <main className="p-1 overflow-y-auto bg-black/30">
                    <pre className="p-4 text-sm text-yellow-300 font-mono whitespace-pre-wrap">
                        <code>{spa.command}</code>
                    </pre>
                </main>

                 <footer className="text-center text-xs text-gray-500 p-3 border-t border-gray-700 flex-shrink-0">
                    Generated on {new Date(spa.createdAt).toLocaleString()}
                </footer>
            </div>
        </div>
    );
}

export default function App(): React.ReactNode {
    const [isAppEntered, setAppEntered] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('glass');
    const [error, setError] = useState<string | null>(null);
    const [isInstructionsPanelOpen, setInstructionsPanelOpen] = useState(false);
    const [customInstructions, setCustomInstructions] = useState<CustomInstructions>(PREFILLED_INSTRUCTIONS);
    const [openAiApiKey, setOpenAiApiKey] = useState('');
    
    const [lastCompletedOrchestration, setLastCompletedOrchestration] = useState<RunningOrchestration | null>(null);
    const [viewingSpa, setViewingSpa] = useState<GeneratedSpa | null>(null);
    const [viewingSpaHtml, setViewingSpaHtml] = useState<GeneratedSpa | null>(null);
    const [managedSpa, setManagedSpa] = useState<GeneratedSpa | null>(null);
    const [isManagementPanelOpen, setManagementPanelOpen] = useState(false);
    const [missionToReenact, setMissionToReenact] = useState<{ objective: string; agents: string[]; llmStrategy: LlmStrategy; } | null>(null);


    const handleEnterApp = () => {
        setAppEntered(true);
    };

    const showError = useCallback((message: string) => {
        setError(message);
    }, []);

    const handleSetCustomInstructions = (instructions: CustomInstructions) => {
        setCustomInstructions(instructions);
        setInstructionsPanelOpen(false);
    };

    const handleOrchestrationComplete = () => {
        // This is now a navigation helper called by DualLlmControlTab
        setActiveTab('inference');
    };

    const handleSelectSpaForManagement = (spa: GeneratedSpa) => {
        setManagedSpa(spa);
        setManagementPanelOpen(true);
    };

    const handleReenactMission = async (spa: GeneratedSpa) => {
        try {
            const replayData = await replaySpa(spa.id);
            if(replayData.ok) {
                setMissionToReenact({
                    objective: replayData.objective,
                    agents: replayData.agents,
                    llmStrategy: replayData.llmStrategy,
                });
                setActiveTab('dualLlm');
                setManagementPanelOpen(false);
            } else {
                showError('Failed to fetch replay data from API.');
            }
        } catch(e: any) {
            showError(`API Error: ${e.message}`);
        }
    };
    
    const handleShareContext = async (spa: GeneratedSpa) => {
        try {
            const result = await shareSpaContext(spa.id);
            if (result.ok) {
                 const contextSummary = `\n\nCONTEXT FROM PAST MISSION (${spa.id}):\n- Mission: ${spa.objective}\n- Outcome: Successfully generated an SPA with the command "${spa.command}". This can be used as a template for similar tasks.`;
                setCustomInstructions(prev => ({
                    ...prev,
                    system: prev.system + contextSummary,
                }));
                setManagementPanelOpen(false);
                alert(`Context from SPA ${spa.id} has been shared with LYRA via API.`);
            } else {
                 showError('Failed to share context via API.');
            }
        } catch(e: any) {
             showError(`API Error: ${e.message}`);
        }
    };
    
    const handleClearReenactMission = useCallback(() => {
        setMissionToReenact(null);
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'glass':
                return <GlassMorphismGuide />;
            case 'deploy':
                return <PageDeployerTab showError={showError} />;
            case 'inference':
                 return <InferenceTab onManage={handleSelectSpaForManagement} showError={showError} />;
            case 'agentic':
                return <AgenticCoreTab 
                            showError={showError} 
                            openAiApiKey={openAiApiKey}
                        />;
            case 'adjectic':
                return (
                    <AdjecticManifestTab 
                        openInstructions={() => setInstructionsPanelOpen(true)}
                        onOrchestrationComplete={setLastCompletedOrchestration}
                    />
                );
            case 'config':
                return <ConfigTab onOrchestrationStart={() => setActiveTab('adjectic')} />;
            case 'ajentic':
                return <AjenticNexusTab lastCompletedOrchestration={lastCompletedOrchestration} />;
            case 'plan':
                return <GeminiOpenAIPlan />;
            case 'dualLlm':
                return <DualLlmControlTab 
                            onOrchestrationComplete={handleOrchestrationComplete} 
                            missionToReenact={missionToReenact}
                            onClearReenactMission={handleClearReenactMission}
                            showError={showError}
                       />;
            default:
                return null;
        }
    };
    
    if (!isAppEntered) {
        return <LandingPage onEnter={handleEnterApp} />;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Header />

             <div className="my-4 max-w-2xl mx-auto">
                <label htmlFor="openai-api-key" className="block text-sm font-medium text-gray-300 mb-2 text-center">
                    OpenAI API Key (Optional)
                </label>
                <input
                    id="openai-api-key"
                    type="password"
                    value={openAiApiKey}
                    onChange={(e) => setOpenAiApiKey(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-2 text-white transition-all duration-300 input-glow-green"
                    placeholder="Enter your OpenAI API Key to use the OpenAI model..."
                />
            </div>

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <main className="mt-8">
                {renderTabContent()}
            </main>

            <footer className="text-center text-xs text-gray-600 p-4 font-mono mt-8">
                GAU-C-CUAG | ECOSYSTEM PRIMER: A3 | SIMULATION NETWORK: 255.8.8.8
            </footer>

            <CustomInstructionsPanel
                isOpen={isInstructionsPanelOpen}
                onClose={() => setInstructionsPanelOpen(false)}
                onSave={handleSetCustomInstructions}
                initialInstructions={customInstructions}
            />

            <SpaManagementPanel
                isOpen={isManagementPanelOpen}
                onClose={() => setManagementPanelOpen(false)}
                spa={managedSpa}
                onPreview={setViewingSpa}
                onReenact={handleReenactMission}
                onShareContext={handleShareContext}
                onViewHtml={setViewingSpaHtml}
            />

            <Modal 
                isOpen={!!error}
                onClose={() => setError(null)}
                title="Error"
            >
                <p>{error}</p>
            </Modal>
            
            <GeneratedSpaModal 
                isOpen={!!viewingSpa}
                onClose={() => setViewingSpa(null)}
                spa={viewingSpa}
            />

            <HtmlViewerModal
                isOpen={!!viewingSpaHtml}
                onClose={() => setViewingSpaHtml(null)}
                spa={viewingSpaHtml}
            />
        </div>
    );
}