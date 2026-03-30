
import { GoogleGenAI, Type } from "@google/genai";
import { OrgNode, MentorClient, Mentor, SuggestedActionItem, MentorMatch } from '../types.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const systemInstruction = `You are an AI assistant for the SCALEit Business Platform, a business coaching software. 
Your name is 'Pinnacle AI'. You are helpful, friendly, and knowledgeable about business growth strategies. 
When asked about the platform, refer to tools like 'Strategic Plan', 'Gap Analysis', 'Member Directory', etc.
Keep your responses concise and helpful.`;

export const getAIAssistantResponse = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Sorry, I encountered an error while processing your request. Please try again.";
    }
};

export const getNextBestAction = async (tasks: string, sessions: string): Promise<string> => {
    const prompt = `Based on the user's current situation, suggest the single most important 'Next Best Action' to focus on this week. Be concise, actionable, and encouraging.
  
  User's pending tasks:
  ${tasks}
  
  User's upcoming sessions:
  ${sessions}
  
  Your suggestion should be a single sentence. For example: "Finalize the Q3 marketing budget based on your mentor's advice from yesterday."`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: "You are an AI business coach providing focused, actionable advice.",
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for next best action:", error);
        return "Could not generate a suggestion at this time. Focus on your top priority task.";
    }
};

export const summarizeTranscript = async (transcript: string): Promise<string> => {
    const prompt = `Please summarize the following business coaching session transcript. The summary should be concise, under 150 words, and highlight the key discussion points and outcomes.
  
  Transcript:
  ---
  ${transcript}
  ---
  `;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: "You are an AI assistant that specializes in summarizing business meetings.",
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for summarization:", error);
        return "Sorry, I was unable to generate a summary for this session.";
    }
};


export const getOrgChartSuggestions = async (chart: OrgNode, companyInfo: string): Promise<string[]> => {
    const prompt = `Analyze the following organizational chart for a ${companyInfo}. Provide 2-3 actionable suggestions for improvement. The suggestions should focus on structure, potential missing roles, or reporting lines.
    
    Current Org Chart (JSON):
    ${JSON.stringify(chart, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                },
                systemInstruction: "You are an AI business consultant that analyzes organizational charts and provides actionable suggestions. Return a JSON object with a single key 'suggestions' containing an array of strings.",
            }
        });
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        return result.suggestions || [];
    } catch (error) {
        console.error("Error calling Gemini API for org chart suggestions:", error);
        return ["Could not generate suggestions at this time. Please ensure your org chart is structured correctly."];
    }
};

export const getLeadershipRecommendations = async (areasForImprovement: string[]): Promise<string[]> => {
    const prompt = `A business leader has identified the following areas for improvement based on a self-assessment. For each area, provide one concise, actionable recommendation.
    
    Areas for improvement:
    ${areasForImprovement.map(area => `- ${area}`).join('\n')}
    
    Your recommendations should be practical and easy to implement this week.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendations: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                },
                systemInstruction: "You are an AI leadership coach. You provide actionable advice. Return a JSON object with a 'recommendations' key containing an array of strings.",
            }
        });
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        return result.recommendations || [];
    } catch (error) {
        console.error("Error calling Gemini API for leadership recommendations:", error);
        return ["Could not generate recommendations at this time. A great first step is to discuss these areas with your mentor."];
    }
};


export const getSessionWorkspaceAI = async (transcript: string): Promise<{ summary: string, actionItems: SuggestedActionItem[] }> => {
    const prompt = `Analyze the following business coaching session transcript between a Mentor (Jordan Lee) and a Client (Alexandre Dubois).
    1.  Create a concise summary (under 100 words).
    2.  Extract distinct action items for both the Mentor and the Client.

    Transcript:
    ---
    ${transcript}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        actionItems: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    text: { type: Type.STRING },
                                    assignee: { type: Type.STRING, enum: ['Mentor', 'Client'] }
                                }
                            }
                        }
                    }
                },
                systemInstruction: "You are an AI assistant that summarizes transcripts and extracts action items for mentors and clients. Return a JSON object with 'summary' and 'actionItems' keys.",
            }
        });
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        return result || { summary: 'Could not generate AI analysis.', actionItems: [] };
    } catch (error) {
        console.error("Error calling Gemini API for session workspace AI:", error);
        return { summary: 'Error generating summary.', actionItems: [] };
    }
};


export const getMentorSuggestions = async (client: MentorClient, mentors: Mentor[]): Promise<MentorMatch[]> => {
    const prompt = `
    Based on the new client's profile and the available mentors, suggest the top 3 best mentor matches. For each match, provide a percentage match score and a brief reason.

    New Client Profile:
    - Industry: ${client.industry}
    - Years in Business: ${client.yearsInBusiness}
    - Company: ${client.company}

    Available Mentors:
    ${mentors.map(m => `- ${m.name}: Specialties: [${m.specialties.join(', ')}], Current Clients: ${m.clientCount}`).join('\n')}
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        matches: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    mentorName: { type: Type.STRING },
                                    matchScore: { type: Type.NUMBER },
                                    reason: { type: Type.STRING }
                                }
                            }
                        }
                    }
                },
                systemInstruction: "You are an AI assistant that matches clients to mentors. Return a JSON object with a 'matches' key containing an array of the top 3 mentor suggestions.",
            }
        });
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);

        // Combine AI results with full mentor data
        if (result.matches) {
            return result.matches.map((match: any) => {
                const mentorData = mentors.find(m => m.name === match.mentorName);
                return { ...mentorData, ...match };
            });
        }
        return [];

    } catch (error) {
        console.error("Error calling Gemini API for mentor suggestions:", error);
        return [];
    }
};

export const generateJobDescription = async (jobTitle: string, responsibilities: string): Promise<string> => {
    const prompt = `Generate a professional and engaging job description for the following role. The tone should be appealing to top candidates.
    
    Job Title: ${jobTitle}
    
    Key Responsibilities:
    ${responsibilities}

    The job description should include sections for:
    - A brief, exciting company overview.
    - The Role's Mission.
    - Key Responsibilities (based on the list provided).
    - Qualifications & Skills.
    - What We Offer (e.g., competitive salary, benefits, growth opportunities).
    `;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: "You are an expert AI copywriter specializing in compelling job descriptions.",
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating job description:", error);
        return "Failed to generate job description.";
    }
};

export const generateInterviewKit = async (jobDescription: string): Promise<{ questions: string[], scorecard: string[] }> => {
    const prompt = `Based on the provided job description, create a comprehensive interview kit.
    
    Job Description:
    ---
    ${jobDescription}
    ---
    
    The kit should include:
    1.  A list of 10-12 insightful interview questions, covering technical skills, behavioral aspects, and cultural fit.
    2.  A list of 5-7 key criteria for a candidate scorecard, to evaluate candidates consistently.
    `;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        scorecard: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                },
                systemInstruction: "You are an AI HR specialist that creates structured interview kits in JSON format.",
            }
        });
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        return result || { questions: [], scorecard: [] };
    } catch (error) {
        console.error("Error generating interview kit:", error);
        return { questions: ['Failed to generate questions.'], scorecard: ['Failed to generate scorecard.'] };
    }
};

/**
 * Generates an executive summary and key action items from a coaching session transcript using Google's Gemini 1.5 Flash model.
 * @param transcript The raw text transcript of the coaching session.
 * @returns A JSON string containing summary and actionItems.
 */
export const analyzeSession = async (transcript: string) => {
    try {
        const prompt = `
        You are an expert business coach assistant. Analyze the following coaching session transcript.
        
        Transcript: "${transcript}"
        
        Provide a JSON response with the following structure:
        {
            "summary": "A concise executive summary of the session (max 3 sentences).",
            "actionItems": [
                { "text": "Action item description", "assignee": "Mentor" or "Client" }
            ],
            "keyInsights": ["Insight 1", "Insight 2"]
        }
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        actionItems: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    text: { type: Type.STRING },
                                    assignee: { type: Type.STRING, enum: ['Mentor', 'Client'] }
                                }
                            }
                        },
                        keyInsights: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                },
                systemInstruction: "You are an expert business coach assistant. Return a JSON object with summary, actionItems, and keyInsights.",
            }
        });

        // Use text property directly as per SDK usage in this file
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        return JSON.stringify(result); // Return as string to match signature if needed, or object? Original code returned string.

    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return JSON.stringify({ summary: "Error analyzing session.", actionItems: [], keyInsights: [] });
    }
};

/**
 * Extracts a simple list of task strings from a session transcript for quick review.
 * @param transcript The raw text transcript.
 * @returns An array of task description strings.
 */
// Re-implemented with JSDoc
export const extractActionItems = async (transcript: string): Promise<string[]> => {
    try {
        const prompt = `
            Extract a list of specific, actionable tasks from this transcript. Return ONLY a JSON array of strings.
            Transcript: "${transcript}"
        `;
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
                systemInstruction: "You are an AI assistant that extracts actionable tasks from transcripts. Return a JSON array of strings.",
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Gemini Task Extraction Error", e);
        return [];
    }
}

export const suggestIdeaTags = async (ideaText: string): Promise<string[]> => {
    const prompt = `Analyze the following business idea and suggest 3-5 relevant, one-word tags for categorization.
    
    Idea: "${ideaText}"
    `;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                },
                systemInstruction: "You are an AI that suggests concise, relevant tags for ideas. Return a JSON object with a 'tags' key.",
            }
        });
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        return result.tags || [];
    } catch (error) {
        console.error("Error suggesting tags:", error);
        return [];
    }
};