

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type Agent, type ConversationTurn } from '../types';
import { CODEX_DATA } from '../constants';
import Card from './Card';
import { AbacusIcon, GeminiIcon, OpenAiIcon, LoaderIcon, CogIcon, CopyIcon, BookmarkOutlineIcon, BookmarkFilledIcon, ThumbUpIcon, ThumbDownIcon } from './icons';
import { NeonDoc } from './NeonDoc';
import { getGeminiResponse, getOpenAiResponse, getAbacusResponse } from './llm';

interface AgenticCoreTabProps {
    geminiApiKey: string;
    openaiApiKey: string;
    abacusApiKey: string;
    showError: (message: string) => void;
}

const WelcomePanel = () => (
    <div className="glass neon p-6 text-center h-full flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-white mb-2">Select an Agent</h2>
        <p className="text-gray-300">Choose an AI Family member to view their profile and start a conversation.</p>
    </div>
);

const TriChatInterface = ({ 
    agent, 
    conversation, 
    onSendMessage, 
    isResponding,
    bookmarkedTurns,
    votedTurns,
    onCopy,
    onBookmark,
    onVote
}: { 
    agent: Agent, 
    conversation: ConversationTurn[], 
    onSendMessage: (msg: string) => void, 
    isResponding: boolean,
    bookmarkedTurns: number[],
    votedTurns: { [key: number]: 'up' | 'down' | undefined },
    onCopy: (turn: ConversationTurn) => void,
    onBookmark: (index: number) => void,
    onVote: (index: number, vote: 'up' | 'down') => void
}) => {
    const [input, setInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isResponding) {
            onSendMessage(input.trim());
            setInput('');
        }
    };
    
    return (
        <div className="mt-6 flex flex-col h-full">
            <div ref={chatContainerRef} className="space-y-6 mb-4 p-4 bg-black/20 rounded-lg flex-grow overflow-y-auto">
                {conversation.length === 0 && (
                     <div className="text-center text-gray-400 pt-16">
                        <p className="text-lg">The conversation begins here.</p>
                        <p className="text-sm">Your first inference will be answered by Gemini, OpenAI, and Abacus through the lens of {agent.name}.</p>
                    </div>
                )}
                {conversation.map((turn, index) => (
                    <div key={index} className="space-y-4">
                        {/* User Prompt & Actions */}
                        <div className="flex justify-end items-start gap-3 group">
                            <div className="flex-shrink-0 flex items-center gap-1.5 p-1.5 rounded-full bg-gray-900 border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button title="Copy Thread" onClick={() => onCopy(turn)} className="text-gray-400 hover:text-white transition-colors">
                                    <CopyIcon className="w-5 h-5" />
                                </button>
                                <button title="Bookmark Thread" onClick={() => onBookmark(index)} className="transition-colors">
                                    {bookmarkedTurns.includes(index) ? (
                                        <BookmarkFilledIcon className="w-5 h-5 text-yellow-400" />
                                    ) : (
                                        <BookmarkOutlineIcon className="w-5 h-5 text-gray-400 hover:text-yellow-400" />
                                    )}
                                </button>
                                <button title="Good Response" onClick={() => onVote(index, 'up')} className={`transition-colors ${votedTurns[index] === 'up' ? 'text-green-400' : 'text-gray-400 hover:text-green-400'}`}>
                                    <ThumbUpIcon className="w-5 h-5" />
                                </button>
                                 <button title="Bad Response" onClick={() => onVote(index, 'down')} className={`transition-colors ${votedTurns[index] === 'down' ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}>
                                    <ThumbDownIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-3 rounded-lg max-w-2xl bg-blue-600 text-white shadow-md">
                               {turn.user}
                            </div>
                        </div>

                        {/* AI Responses */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-3 rounded-lg bg-gray-700/80">
                                <h4 className="flex items-center gap-2 text-md font-semibold text-cyan-300 mb-2"><GeminiIcon className="w-5 h-5" /> Gemini</h4>
                                <p className="text-sm text-gray-200 whitespace-pre-wrap">{turn.gemini}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-700/80">
                                <h4 className="flex items-center gap-2 text-md font-semibold text-green-300 mb-2"><OpenAiIcon className="w-5 h-5" /> OpenAI</h4>
                                <p className="text-sm text-gray-200 whitespace-pre-wrap">{turn.openai}</p>
                            </div>
                             <div className="p-3 rounded-lg bg-gray-700/80">
                                <h4 className="flex items-center gap-2 text-md font-semibold text-yellow-300 mb-2"><AbacusIcon className="w-5 h-5" /> Abacus</h4>
                                <p className="text-sm text-gray-200 whitespace-pre-wrap">{turn.abacus}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-lg p-3 text-white transition-all duration-300 input-glow-green" 
                    placeholder={`Converse with ${agent.name}...`} 
                    required 
                    autoComplete="off"
                    disabled={isResponding}
                />
                <button type="submit" className="gemini-btn font-bold p-3 rounded-lg flex items-center text-white" disabled={isResponding}>
                    {isResponding ? <LoaderIcon className="w-5 h-5" /> : 'Send Inference'}
                </button>
            </form>
        </div>
    );
};


const AgentDetailPanel = ({ agent, ...props }: { agent: Agent } & AgenticCoreTabProps) => {
    const [conversation, setConversation] = useState<ConversationTurn[]>([]);
    const [isResponding, setIsResponding] = useState(false);
    const [bookmarkedTurns, setBookmarkedTurns] = useState<number[]>([]);
    const [votedTurns, setVotedTurns] = useState<{ [key: number]: 'up' | 'down' | undefined }>({});
    
    useEffect(() => {
        // Reset state when agent changes
        setConversation([]);
        setBookmarkedTurns([]);
        setVotedTurns({});
    }, [agent]);

    const getAgentAvatar = () => {
        const iconClass = "w-12 h-12";
        switch (agent.name) {
            case 'KARA':
            case 'KARL':
                return <GeminiIcon className={iconClass} />;
            case 'SOPHIA':
                return <OpenAiIcon className={iconClass} />;
            case 'DAN':
                return <AbacusIcon className={`${iconClass} text-yellow-300`} />;
            case 'MISTRESS':
                return <CogIcon className={`${iconClass} text-gray-300`} />;
            default:
                return <span className="text-4xl font-bold">{agent.name.charAt(0)}</span>;
        }
    };

    const handleSendMessage = async (text: string) => {
        setIsResponding(true);
        const loadingTurn: ConversationTurn = {
            user: text,
            gemini: "Thinking...",
            openai: "Thinking...",
            abacus: "Thinking...",
        };
        setConversation(prev => [...prev, loadingTurn]);
        
        try {
            const fullPrompt = `From the perspective of the AI agent ${agent.name}, whose role is "${agent.role}", provide a concise and in-character response to the following user prompt: "${text}"`;
            
            const [geminiResponse, openaiResponse, abacusResponse] = await Promise.all([
                getGeminiResponse(props.geminiApiKey, fullPrompt),
                getOpenAiResponse(props.openaiApiKey, fullPrompt),
                getAbacusResponse(props.geminiApiKey, fullPrompt),
            ]);

            const finalTurn: ConversationTurn = {
                user: text,
                gemini: geminiResponse,
                openai: openaiResponse,
                abacus: abacusResponse,
            };

            setConversation(prev => {
                const newConversation = [...prev];
                newConversation[newConversation.length - 1] = finalTurn;
                return newConversation;
            });

        } catch (e: any) {
            props.showError(`An error occurred while communicating with the LLMs: ${e.message}`);
             const errorTurn: ConversationTurn = {
                user: text,
                gemini: "Error fetching response.",
                openai: "Error fetching response.",
                abacus: "Error fetching response.",
            };
             setConversation(prev => {
                const newConversation = [...prev];
                newConversation[newConversation.length - 1] = errorTurn;
                return newConversation;
            });
        } finally {
            setIsResponding(false);
        }
    };
    
    const handleCopy = (turn: ConversationTurn) => {
        const textToCopy = `
User: ${turn.user}

--- Gemini Response ---
${turn.gemini}

--- OpenAI Response ---
${turn.openai}

--- Abacus Response ---
${turn.abacus}
        `.trim();
        navigator.clipboard.writeText(textToCopy);
        // Maybe show a toast notification here in a real app
    };
    
    const handleBookmark = (index: number) => {
        setBookmarkedTurns(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const handleVote = (index: number, vote: 'up' | 'down') => {
        setVotedTurns(prev => ({
            ...prev,
            [index]: prev[index] === vote ? undefined : vote
        }));
    };

    const collectedBookmarks = conversation.filter((_, index) => bookmarkedTurns.includes(index));

    return (
        <div className="glass neon p-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 text-center md:w-1/4">
                    <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mx-auto border-2 border-blue-400">
                        {getAgentAvatar()}
                    </div>
                    <h2 className="text-2xl font-bold mt-2 text-white">{agent.name}</h2>
                    <p className="text-blue-300">{agent.role}</p>
                </div>
                <div className="flex-grow md:w-3/4">
                     <div className="mb-4">
                        <NeonDoc text={agent.bio} />
                    </div>
                    <h4 className="text-lg font-semibold mt-4 mb-2 text-white">Primary Focus Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                        {agent.focus_areas.map(area => <span key={area} className="bg-gray-600 text-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">{area}</span>)}
                    </div>
                </div>
            </div>
            
            {collectedBookmarks.length > 0 && (
                <div className="my-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg flex-shrink-0">
                    <h4 className="text-sm font-bold text-yellow-300 flex items-center gap-2">
                        <BookmarkFilledIcon className="w-4 h-4"/>
                        Bookmarked Context (Suggestive Inference Guide)
                    </h4>
                    <div className="text-xs text-gray-300 mt-2 space-y-1 max-h-24 overflow-y-auto">
                        {collectedBookmarks.map((turn, i) => (
                           <div key={i} className="p-1.5 bg-black/20 rounded">
                                <span className="font-semibold text-yellow-200">User:</span> {turn.user.substring(0, 80)}{turn.user.length > 80 ? '...' : ''}
                           </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex-grow min-h-0">
                <TriChatInterface 
                    agent={agent} 
                    conversation={conversation} 
                    onSendMessage={handleSendMessage} 
                    isResponding={isResponding}
                    bookmarkedTurns={bookmarkedTurns}
                    votedTurns={votedTurns}
                    onCopy={handleCopy}
                    onBookmark={handleBookmark}
                    onVote={handleVote}
                />
            </div>
        </div>
    );
}


export default function AgenticCoreTab(props: AgenticCoreTabProps): React.ReactNode {
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

    return (
        <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 250px)' }}>
            <div className="flex-shrink-0">
                <h2 className="text-2xl font-bold text-white mb-4 text-center">AI Family Agents</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
                    {CODEX_DATA.ai_family.map(agent => (
                        <Card
                            key={agent.name}
                            title={agent.name}
                            subtitle={agent.role}
                            onClick={() => setSelectedAgent(agent)}
                            isSelected={selectedAgent?.name === agent.name}
                        />
                    ))}
                </div>
            </div>
            
            <div className="flex-grow min-h-0">
                 {selectedAgent ? <AgentDetailPanel agent={selectedAgent} {...props} /> : <WelcomePanel />}
            </div>
        </div>
    );
}