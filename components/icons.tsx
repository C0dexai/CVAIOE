

import React from 'react';

export function LoaderIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return (
        <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
}

export function RocketLaunchIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2zm3.43.913a8.973 8.973 0 0 0-6.86 0L9.43 1.93a1 1 0 0 1 .841-.583h3.458a1 1 0 0 1 .841.583l.86 1.017zM9.47 13.999l-2.03 2.03a1 1 0 0 1-1.414-1.414l2.03-2.03a.5.5 0 0 1 .707 0l.707.707a.5.5 0 0 1 0 .707zM11 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm3.53-1.999a.5.5 0 0 1 0-.707l.707-.707a.5.5 0 0 1 .707 0l2.03 2.03a1 1 0 0 1-1.414 1.414l-2.03-2.03zM7.5 17.5a1.5 1.5 0 0 0 1.5-1.5h6a1.5 1.5 0 0 0 1.5 1.5v.5h-9v-.5z"/>
        </svg>
    );
}

export function CloseIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.414-9.414a1 1 0 0 1 1.414-1.414L12 10.586l1.414-1.414a1 1 0 1 1 1.414 1.414L13.414 12l1.414 1.414a1 1 0 1 1-1.414 1.414L12 13.414l-1.414 1.414a1 1 0 1 1-1.414-1.414L10.586 12l-1.414-1.414z" clipRule="evenodd"/>
        </svg>
    );
}

export function AbacusIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <line x1="3" x2="21" y1="9" y2="9" />
            <line x1="3" x2="21" y1="15" y2="15" />
            <line x1="9" x2="9" y1="3" y2="21" />
            <line x1="15" x2="15" y1="3" y2="21" />
        </svg>
    );
}

export function CogIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5M12 9.75v1.5m0 0v1.5m0-1.5a1.5 1.5 0 0 1 1.5 1.5m-1.5-1.5a1.5 1.5 0 0 0-1.5 1.5m1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m1.5-1.5a1.5 1.5 0 0 0 1.5 1.5m-1.5-1.5H12m0 0H12m0 0a1.5 1.5 0 0 1-1.5-1.5m1.5 1.5a1.5 1.5 0 0 0-1.5-1.5m1.5-1.5a1.5 1.5 0 0 1 1.5-1.5m1.5 1.5a1.5 1.5 0 0 0 1.5-1.5m-15 6a7.5 7.5 0 0 1 15 0" />
        </svg>
    );
}

export function GeminiIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return (
        <svg className={className} viewBox="0 0 102 94.42" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M90.35 40.2L78.69 63.8l-11.66 22.9-11.66-22.9-11.66-22.9 11.66-22.9L67.03 0l11.66 22.9z"/>
            <path fill="#EA4335" d="M55.37 94.42l-11.66-22.9L32.05 48.6l11.66-22.9 11.66 22.9 11.66 22.9-11.66 22.9z"/>
            <path fill="#FBBC05" d="M22.06 71.52L10.4 48.6l11.66-22.9L33.72 2.81l11.66 22.9-11.66 22.9L22.06 71.52z"/>
            <path fill="#34A853" d="M11.66 22.9L0 45.8l11.66 22.9L23.32 91.6l11.66-22.9-11.66-22.9L11.66 22.9z"/>
        </svg>
    );
}

export function OpenAiIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return <img src="https://openai.com/favicon.ico" alt="OpenAI" className={`${className} rounded-full`} />;
}

export function GoogleAvatarIcon({ className = "w-8 h-8" }: { className?: string }): React.ReactNode {
    return (
        <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="white"/>
            <path d="M20 0C8.95431 0 0 8.95431 0 20H20V0Z" fill="#EA4335"/>
            <path d="M40 20C40 8.95431 31.0457 0 20 0V20H40Z" fill="#4285F4"/>
            <path d="M20 40C31.0457 40 40 31.0457 40 20H20V40Z" fill="#34A853"/>
            <path d="M0 20C0 31.0457 8.95431 40 20 40V20H0Z" fill="#FBBC05"/>
        </svg>
    );
}

export function CopyIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
    );
}

export function BookmarkFilledIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
        </svg>
    );
}

export function BookmarkOutlineIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
    );
}

export function ThumbUpIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
        </svg>
    );
}

export function ThumbDownIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
        </svg>
    );
}

export function CodeIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
        </svg>
    );
}

export function DownloadIcon({ className = "w-6 h-6" }: { className?: string }): React.ReactNode {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
    );
}