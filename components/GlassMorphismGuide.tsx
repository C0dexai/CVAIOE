
import React from 'react';

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="mb-8">
        <h3 className="text-2xl font-bold text-cyan-300 mb-3 border-b-2 border-cyan-500/30 pb-2">{title}</h3>
        <div className="text-gray-300 space-y-3">{children}</div>
    </section>
);

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-gray-900/70 p-4 rounded-lg text-sm text-yellow-300 font-mono whitespace-pre-wrap">
        <code>{children}</code>
    </pre>
);

export default function GlassMorphismGuide(): React.ReactNode {
    return (
        <div className="glass neon p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">A Guide to Glass Morphism</h2>

            <Section title="Introduction">
                <p>Glass morphism, also known as glassmorphism, has emerged as one of the most captivating design trends in modern web development. This technique creates interfaces that appear to be made of frosted glass, combining transparency, blur effects, and subtle shadows to achieve a sense of depth and elegance.</p>
            </Section>
            
            <Section title="Core Principle: The Backdrop Filter">
                 <p>The core principle behind glass morphism lies in the `backdrop-filter` CSS property, specifically the `blur()` function. This creates the frosted glass effect by blurring the content behind the element:</p>
                <CodeBlock>
{`.glass-card { 
    background: rgba(255, 255, 255, 0.1); 
    backdrop-filter: blur(20px); 
    -webkit-backdrop-filter: blur(20px); 
    border: 1px solid rgba(255, 255, 255, 0.2); 
    border-radius: 16px; 
}`}
                </CodeBlock>
            </Section>
            
            <Section title="Key Considerations">
                <p><strong>Balance and Readability:</strong> The key to effective glass morphism is finding the right balance between transparency and readability. Too much transparency makes content hard to read, while too little defeats the glass effect. Typically, background opacity should range from 0.05 to 0.25, depending on the background complexity.</p>
                <p><strong>Layering and Depth:</strong> Layering is crucial for creating depth. Multiple glass elements can be stacked to create complex interfaces, with each layer having slightly different opacity and blur values. This creates a sense of hierarchy and visual interest.</p>
                <p><strong>Borders and Refinement:</strong> Subtle borders using semi-transparent white or light colors help define the edges of glass components, especially when they overlap or sit against complex backgrounds. The border should be subtle enough to maintain the glass effect but visible enough to provide structure.</p>
                <p><strong>Color and Contrast:</strong> The technique works best with high-contrast backgrounds – either very dark or very bright. The glass elements themselves should use neutral colors with low opacity, allowing the background to show through naturally.</p>
                <p><strong>Shadows:</strong> Soft, subtle shadows complement glass morphism by adding depth and separation. Use shadows that suggest the glass element is floating above the background rather than casting a heavy shadow.</p>
            </Section>

            <Section title="Performance & Accessibility">
                 <p><strong>Performance Optimization:</strong> Performance is essential when using `backdrop-filter` extensively. The blur effect can be computationally expensive, especially on lower-end devices. Consider providing fallbacks for browsers that don't support `backdrop-filter` and test performance across different devices.</p>
                <p><strong>Accessibility:</strong> Accessibility should not be overlooked. Ensure that text contrast meets WCAG guidelines, even with the blur effects in place. Test with screen readers and consider how the layered transparency might affect users with visual impairments.</p>
            </Section>

            <Section title="Conclusion">
                <p>When done correctly, glass morphism creates interfaces that feel modern, elegant, and engaging. The technique works particularly well for dashboards, modal dialogs, cards, and navigation elements where you want to maintain visual connection with the background while creating distinct interactive areas.</p>
            </Section>

        </div>
    );
}