
import { GoogleGenAI } from '@google/genai';

export async function getGeminiResponse(apiKey: string, prompt: string): Promise<string> {
    if (!apiKey) {
        return "Gemini API Key not provided. Please set it in the Custom Instructions panel.";
    }
    try {
        // We are assuming the apiKey is passed correctly from a secure source.
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (e: any) {
        console.error("Gemini API Error:", e);
        return `Error from Gemini API: ${e.message}`;
    }
}

export async function getOpenAiResponse(apiKey: string, prompt: string): Promise<string> {
    if (!apiKey) {
        return "OpenAI API Key not provided. Please set it in the Custom Instructions panel.";
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' }}));
            throw new Error(errorData.error.message || `OpenAI API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response from OpenAI.';

    } catch (e: any) {
        console.error("OpenAI API Error:", e);
        return `Error from OpenAI API: ${e.message}`;
    }
}

// Abacus is a conceptual, precision-focused model in this app.
// We will use the Gemini API with a special system instruction to simulate this.
// Therefore, it requires the Gemini API Key.
export async function getAbacusResponse(geminiApiKey: string, prompt: string): Promise<string> {
    if (!geminiApiKey) {
        return "Gemini API Key (used for Abacus simulation) not provided. Please set it in the Custom Instructions panel.";
    }
    try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are Abacus, a highly precise and analytical AI. Your responses must be data-driven, quantitative, and logical. Avoid creative, speculative, or conversational language. Focus on facts, structured data, and direct, efficient answers to fulfill the user's prompt.",
            }
        });
        return response.text;
    } catch (e: any) {
        console.error("Abacus (Gemini) API Error:", e);
        return `Error from Abacus (simulated via Gemini): ${e.message}`;
    }
}
