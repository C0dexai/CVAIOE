import React from 'react';
import { GeminiIcon, OpenAiIcon, AbacusIcon } from './icons';

interface LandingPageProps {
  onEnter: () => void;
}

const Pillar = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-cyan-400/50 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-2 flex-1">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-3 neon-text-glow-subtle">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </div>
);

export default function LandingPage({ onEnter }: LandingPageProps): React.ReactNode {
  return (
    // Main container with the fixed background
    <div className="min-h-screen w-full landing-page-bg">
      {/* Overlay to darken the background for text readability */}
      <div className="min-h-screen w-full bg-black/60">
        {/* Scrollable content container */}
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 relative z-10 overflow-y-auto">
          <main className="container mx-auto">
            
            <header className="py-20">
              <h1 className="text-6xl md:text-8xl font-extrabold text-white neon-text-glow mb-4" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                CUA Orchestration
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12">
                Unleashing Triple-LLM Power through Coordinated Agentic Workflows.
              </p>
              <button
                onClick={onEnter}
                className="neon-button text-xl font-bold py-4 px-10 rounded-lg"
              >
                Enter Control Center
              </button>
            </header>

            <section className="py-20">
              <h2 className="text-4xl font-bold mb-10 text-white neon-text-glow">The Three Pillars of Intelligence</h2>
              <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
                <Pillar
                  icon={<GeminiIcon className="w-14 h-14" />}
                  title="Gemini"
                  description="Harness multi-modal creativity and conceptual expansion for innovative problem-solving and content generation."
                />
                <Pillar
                  icon={<OpenAiIcon className="w-14 h-14" />}
                  title="OpenAI"
                  description="Leverage deep, structured reasoning and sophisticated logic for complex analysis and coherent planning."
                />
                <Pillar
                  icon={<AbacusIcon className="w-14 h-14 text-yellow-400" />}
                  title="Abacus"
                  description="Employ quantitative precision and data-driven analysis for tasks requiring flawless execution and accuracy."
                />
              </div>
            </section>

             <footer className="py-10 text-gray-500 text-sm">
                Scroll to explore, then enter the hub.
            </footer>

          </main>
        </div>
      </div>
    </div>
  );
}