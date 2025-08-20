

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


type Tab = 'agentic' | 'adjectic' | 'config' | 'ajentic' | 'plan' | 'dualLlm' | 'inference' | 'deploy' | 'glass';

const PREFILLED_INSTRUCTIONS: CustomInstructions = {
    system: "You are LYRA, the master orchestrator for the AI Family. Your primary function is to interpret high-level missions and break them down into a logical sequence of tasks for specialized AI agents. You must dynamically allocate tasks to either Gemini, OpenAI, or Abacus based on the chosen LLM strategy. Your goal is to achieve the mission objective with maximum efficiency, parallelization, and coherence, ensuring seamless context handoffs between agents and LLMs. Maintain a persistent state of the entire operation.",
    ai: "When orchestrating, provide clear, step-by-step reasoning for task delegation. For each task, specify the assigned Agent, the chosen LLM, and the rationale for that choice under the 'Dynamic' strategy (e.g., 'Assigning to Gemini for its advanced code generation capabilities'). Log all significant events, decisions, and inter-agent communications to the appropriate LLM context log. When encountering an error, engage KARA for security/compliance checks and SOPHIA for semantic analysis to find an alternative path forward.",
    user: "The user is an Operator overseeing the AI Family's CI/CD and development workflows. They will provide high-level missions and expect you to manage the entire execution lifecycle. The primary interface is the Dual-LLM Control Center. The user requires full transparency into the process, including real-time execution flow and synchronized LLM context logs. The current ecosystem includes agents: LYRA, KARA, SOPHIA, CECILIA, DAN, STAN, DUDE, KARL, MISTRESS. The goal is to future-proof the system by validating this Triple-LLM approach."
};

export default function App(): React.ReactNode {
    const [isAppEntered, setAppEntered] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('glass');
    const [error, setError] = useState<string | null>(null);
    const [isInstructionsPanelOpen, setInstructionsPanelOpen] = useState(false);
    const [customInstructions, setCustomInstructions] = useState<CustomInstructions>(PREFILLED_INSTRUCTIONS);
    
    const [geminiApiKey, setGeminiApiKey] = useState<string>('');
    const [openAiApiKey, setOpenAiApiKey] = useState<string>('');
    const [abacusApiKey, setAbacusApiKey] = useState<string>('');

    const [lastCompletedOrchestration, setLastCompletedOrchestration] = useState<RunningOrchestration | null>(null);
    const [viewingSpa, setViewingSpa] = useState<GeneratedSpa | null>(null);
    const [managedSpa, setManagedSpa] = useState<GeneratedSpa | null>(null);
    const [isManagementPanelOpen, setManagementPanelOpen] = useState(false);
    const [missionToReenact, setMissionToReenact] = useState<{ objective: string; agents: string[]; llmStrategy: LlmStrategy; } | null>(null);


    const handleEnterApp = () => {
        setAppEntered(true);
    };

    const showError = useCallback((message: string) => {
        setError(message);
    }, []);

    const handleSetCustomInstructions = (instructions: CustomInstructions, keys: { gemini: string; openai: string; abacus: string }) => {
        setCustomInstructions(instructions);
        setGeminiApiKey(keys.gemini);
        setOpenAiApiKey(keys.openai);
        setAbacusApiKey(keys.abacus);
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
                            geminiApiKey={geminiApiKey} 
                            openaiApiKey={openAiApiKey} 
                            abacusApiKey={abacusApiKey} 
                            showError={showError} 
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
                initialKeys={{ gemini: geminiApiKey, openai: openAiApiKey, abacus: abacusApiKey }}
            />

            <SpaManagementPanel
                isOpen={isManagementPanelOpen}
                onClose={() => setManagementPanelOpen(false)}
                spa={managedSpa}
                onPreview={setViewingSpa}
                onReenact={handleReenactMission}
                onShareContext={handleShareContext}
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
        </div>
    );
}