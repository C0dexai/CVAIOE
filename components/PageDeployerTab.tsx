
import React, { useState } from 'react';
import { type DeployPageRequest, type DeployPageSuccessResponse } from '../types';
import { deployPage } from './api';
import { LoaderIcon, RocketLaunchIcon } from './icons';

export default function PageDeployerTab({ showError }: { showError: (message: string) => void; }) {
    const [slug, setSlug] = useState('');
    const [title, setTitle] = useState('');
    const [html, setHtml] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);
    const [result, setResult] = useState<DeployPageSuccessResponse | null>(null);

    const handleDeploy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!slug || !html || isDeploying) return;
        
        // Basic slug validation
        if (!/^[a-z0-9-]+$/.test(slug)) {
            showError("Slug must be kebab-case (lowercase letters, numbers, and dashes only).");
            return;
        }

        setIsDeploying(true);
        setResult(null);

        try {
            const requestData: DeployPageRequest = { slug, title, html };
            const response = await deployPage(requestData);
            setResult(response);
        } catch (error: any) {
            showError(`Deployment Failed: ${error.message}`);
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="glass neon p-6">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">Gemini Pages Deployer</h2>
            <p className="text-center text-gray-300 mb-6">Publish or update static agent pages via the orchestrator endpoint.</p>
            
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleDeploy} className="space-y-6">
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">Page Slug (kebab-case)</label>
                        <input
                            id="slug"
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase())}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white transition-all duration-300 input-glow-green font-mono"
                            placeholder="e.g., agent-dashboard-v2"
                            required
                            disabled={isDeploying}
                        />
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Page Title (optional)</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white transition-all duration-300 input-glow-green"
                            placeholder="e.g., Agent Dashboard v2"
                            disabled={isDeploying}
                        />
                    </div>
                    <div>
                        <label htmlFor="html" className="block text-sm font-medium text-gray-300 mb-1">Full HTML Content</label>
                        <textarea
                            id="html"
                            rows={15}
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white transition-all duration-300 input-glow-green font-mono text-sm"
                            placeholder="<!doctype html>..."
                            required
                            disabled={isDeploying}
                        />
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <button
                            type="submit"
                            className="w-full gemini-btn text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isDeploying || !slug || !html}
                        >
                            {isDeploying ? <LoaderIcon className="w-5 h-5 mr-2" /> : <RocketLaunchIcon className="w-5 h-5 mr-2" />}
                            {isDeploying ? 'Deploying...' : 'Deploy Page'}
                        </button>
                    </div>
                </form>

                {result && (
                    <div className="mt-8 p-4 bg-green-900/30 rounded-lg border border-green-500/50 glow-green text-center">
                        <h4 className="text-lg font-bold text-green-300">Deployment Successful!</h4>
                        <p className="text-sm text-green-200 mt-2">Your page is now live.</p>
                        <a 
                            href={result.public_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-4 inline-block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg break-all"
                        >
                            View Page: {result.public_url}
                        </a>
                        <pre className="mt-4 text-left text-xs text-gray-400 bg-black/30 p-2 rounded-md font-mono">
                           Content Hash: {result.content_hash}
                        </pre>
                    </div>
                )}
                
                <div className="mt-6 text-xs text-center text-gray-500 p-2 bg-gray-900/50 rounded-lg">
                    <strong>Note:</strong> This tool requires a server-side proxy at <code>/orch/*</code> to inject the necessary authentication token for API calls to <code>api.andiegogiap.com</code>.
                </div>
            </div>
        </div>
    );
}