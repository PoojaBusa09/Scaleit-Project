/**
 * AI Processing Service
 * Handles transcript analysis, extraction of summaries, decisions, commitments,
 * risks, opportunities, and SCALE-IT tagging using Gemini AI.
 */

import { GoogleGenAI, Type } from "@google/genai";
import {
    Transcript,
    ProcessedSession,
    SessionSummary,
    Decision,
    Commitment,
    RiskSignal,
    Opportunity,
    ScaleItPillar,
    AIMetadata,
    UrgencyLevel,
    ImpactLevel,
    SCALE_IT_PILLARS
} from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

// =============================================================================
// Core Processing Pipeline
// =============================================================================

/**
 * Process a complete transcript and extract all insights
 */
export async function processTranscript(transcript: Transcript): Promise<ProcessedSession> {
    console.log(`[AIProcessing] Processing transcript: ${transcript.id}`);

    const content = transcript.content;

    // Run extractions in parallel for efficiency
    const [summary, decisions, commitments, risks, opportunities] = await Promise.all([
        extractSummary(transcript.sessionId, content),
        extractDecisions(transcript.sessionId, content),
        extractCommitments(transcript.sessionId, content),
        extractRisks(transcript.sessionId, content),
        extractOpportunities(transcript.sessionId, content)
    ]);

    // Aggregate SCALE-IT tags from all extracted items
    const scaleItTags = aggregateScaleItTags([
        ...decisions.map(d => d.scaleItPillar),
        ...commitments.map(c => c.scaleItPillar),
        ...opportunities.map(o => o.scaleItPillar)
    ]);

    return {
        sessionId: transcript.sessionId,
        summary,
        decisions,
        commitments,
        risks,
        opportunities,
        scaleItTags,
        processedAt: new Date().toISOString()
    };
}

// =============================================================================
// Summary Extraction
// =============================================================================

/**
 * Extract executive summary from transcript
 */
export async function extractSummary(sessionId: string, content: string): Promise<SessionSummary> {
    const prompt = `Analyze this mentoring session transcript and provide:
1. A concise executive summary (2-3 sentences)
2. 3-5 key points discussed

Transcript:
${content}

Respond in JSON format:
{
  "executiveSummary": "string",
  "keyPoints": ["string", "string", ...]
}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        executiveSummary: { type: Type.STRING },
                        keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['executiveSummary', 'keyPoints']
                }
            }
        });

        const result = JSON.parse(response.text ?? '{}');

        return {
            id: `sum_${sessionId}_${Date.now()}`,
            sessionId,
            executiveSummary: result.executiveSummary || 'Session summary pending.',
            keyPoints: result.keyPoints || [],
            duration: estimateDuration(content),
            aiMetadata: createAIMetadata(0.9)
        };
    } catch (error) {
        console.error('[AIProcessing] Summary extraction failed:', error);
        return {
            id: `sum_${sessionId}_${Date.now()}`,
            sessionId,
            executiveSummary: 'Unable to generate summary.',
            keyPoints: [],
            duration: estimateDuration(content),
            aiMetadata: createAIMetadata(0, 'pending')
        };
    }
}

// =============================================================================
// Decision Extraction
// =============================================================================

/**
 * Extract decisions made during the session
 */
export async function extractDecisions(sessionId: string, content: string): Promise<Decision[]> {
    const prompt = `Identify all decisions made during this mentoring session.
For each decision, determine:
1. What was decided
2. The context/reason
3. Which SCALE-IT pillar it relates to (Strategic, CashFlow, Alliance, Leadership, Execution)
4. The exact quote from the transcript

Transcript:
${content}

Respond in JSON format:
{
  "decisions": [
    {
      "text": "string",
      "context": "string",
      "scaleItPillar": "Strategic|CashFlow|Alliance|Leadership|Execution",
      "sourceQuote": "string"
    }
  ]
}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        decisions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    text: { type: Type.STRING },
                                    context: { type: Type.STRING },
                                    scaleItPillar: { type: Type.STRING },
                                    sourceQuote: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        const result = JSON.parse(response.text ?? '{"decisions":[]}');

        return (result.decisions || []).map((d: any, i: number) => ({
            id: `dec_${sessionId}_${i}`,
            sessionId,
            text: d.text,
            context: d.context,
            scaleItPillar: validatePillar(d.scaleItPillar),
            sourceQuote: d.sourceQuote,
            aiMetadata: createAIMetadata(0.85)
        }));
    } catch (error) {
        console.error('[AIProcessing] Decision extraction failed:', error);
        return [];
    }
}

// =============================================================================
// Commitment Extraction
// =============================================================================

/**
 * Extract commitments/action items from the session
 */
export async function extractCommitments(sessionId: string, content: string): Promise<Commitment[]> {
    const prompt = `Extract all commitments and action items from this mentoring session.
For each commitment, identify:
1. What was committed to
2. Who owns it (member or mentor)
3. Suggested deadline if mentioned
4. Urgency level (critical, high, medium, low)
5. SCALE-IT pillar (Strategic, CashFlow, Alliance, Leadership, Execution)
6. Business context
7. Exact quote from transcript

Transcript:
${content}

Respond in JSON format:
{
  "commitments": [
    {
      "text": "string",
      "owner": "member|mentor",
      "deadline": "string or null",
      "urgency": "critical|high|medium|low",
      "scaleItPillar": "Strategic|CashFlow|Alliance|Leadership|Execution",
      "businessContext": "string",
      "sourceQuote": "string"
    }
  ]
}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        commitments: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    text: { type: Type.STRING },
                                    owner: { type: Type.STRING },
                                    deadline: { type: Type.STRING, nullable: true },
                                    urgency: { type: Type.STRING },
                                    scaleItPillar: { type: Type.STRING },
                                    businessContext: { type: Type.STRING },
                                    sourceQuote: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        const result = JSON.parse(response.text ?? '{"commitments":[]}');

        return (result.commitments || []).map((c: any, i: number) => ({
            id: `com_${sessionId}_${i}`,
            sessionId,
            text: c.text,
            owner: c.owner === 'mentor' ? 'mentor' : 'member',
            suggestedDeadline: c.deadline ? parseDeadline(c.deadline) : undefined,
            urgency: validateUrgency(c.urgency),
            scaleItPillar: validatePillar(c.scaleItPillar),
            businessContext: c.businessContext,
            sourceQuote: c.sourceQuote,
            aiMetadata: createAIMetadata(0.88)
        }));
    } catch (error) {
        console.error('[AIProcessing] Commitment extraction failed:', error);
        return [];
    }
}

// =============================================================================
// Risk Detection
// =============================================================================

/**
 * Detect risk signals from the session
 */
export async function extractRisks(sessionId: string, content: string): Promise<RiskSignal[]> {
    const prompt = `Analyze this mentoring session for potential risks or red flags.
For each risk, identify:
1. Category (financial, operational, team, strategic, personal)
2. Severity (critical, warning, watch)
3. Description
4. Indicators that signal this risk
5. Suggested action
6. Quote from transcript

Transcript:
${content}

Respond in JSON format:
{
  "risks": [
    {
      "category": "financial|operational|team|strategic|personal",
      "severity": "critical|warning|watch",
      "description": "string",
      "indicators": ["string"],
      "suggestedAction": "string",
      "sourceQuote": "string"
    }
  ]
}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        risks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    category: { type: Type.STRING },
                                    severity: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    indicators: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    suggestedAction: { type: Type.STRING },
                                    sourceQuote: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        const result = JSON.parse(response.text ?? '{"risks":[]}');

        return (result.risks || []).map((r: any, i: number) => ({
            id: `risk_${sessionId}_${i}`,
            sessionId,
            category: validateRiskCategory(r.category),
            severity: validateSeverity(r.severity),
            description: r.description,
            indicators: r.indicators || [],
            suggestedAction: r.suggestedAction,
            sourceQuote: r.sourceQuote,
            aiMetadata: createAIMetadata(0.82)
        }));
    } catch (error) {
        console.error('[AIProcessing] Risk extraction failed:', error);
        return [];
    }
}

// =============================================================================
// Opportunity Detection
// =============================================================================

/**
 * Detect opportunities from the session
 */
export async function extractOpportunities(sessionId: string, content: string): Promise<Opportunity[]> {
    const prompt = `Identify growth opportunities discussed or implied in this mentoring session.
For each opportunity:
1. Type (growth, efficiency, partnership, market)
2. Title
3. Description
4. Potential impact (high, medium, low)
5. Suggested next steps
6. SCALE-IT pillar

Transcript:
${content}

Respond in JSON format:
{
  "opportunities": [
    {
      "type": "growth|efficiency|partnership|market",
      "title": "string",
      "description": "string",
      "potentialImpact": "high|medium|low",
      "suggestedNextSteps": ["string"],
      "scaleItPillar": "Strategic|CashFlow|Alliance|Leadership|Execution"
    }
  ]
}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        opportunities: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    type: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    potentialImpact: { type: Type.STRING },
                                    suggestedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    scaleItPillar: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        const result = JSON.parse(response.text ?? '{"opportunities":[]}');

        return (result.opportunities || []).map((o: any, i: number) => ({
            id: `opp_${sessionId}_${i}`,
            sessionId,
            type: validateOpportunityType(o.type),
            title: o.title,
            description: o.description,
            potentialImpact: validateImpact(o.potentialImpact),
            suggestedNextSteps: o.suggestedNextSteps || [],
            scaleItPillar: validatePillar(o.scaleItPillar),
            aiMetadata: createAIMetadata(0.80)
        }));
    } catch (error) {
        console.error('[AIProcessing] Opportunity extraction failed:', error);
        return [];
    }
}

// =============================================================================
// SCALE-IT Tagging
// =============================================================================

/**
 * Tag content with SCALE-IT pillars
 */
export async function tagToScaleIt(content: string): Promise<ScaleItPillar[]> {
    const prompt = `Analyze this text and determine which SCALE-IT pillars it relates to.
SCALE-IT pillars:
- Strategic: Long-term goals, vision, strategic planning
- CashFlow: Finances, revenue, cash flow, budgeting
- Alliance: Team, hiring, organizational structure
- Leadership: Personal development, leadership skills
- Execution: Tasks, action items, implementation

Text:
${content}

Respond with a JSON array of applicable pillars (can be multiple):
["Strategic", "CashFlow", ...]`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const pillars = JSON.parse(response.text ?? '[]');
        return pillars.filter((p: string) => isValidPillar(p)) as ScaleItPillar[];
    } catch (error) {
        console.error('[AIProcessing] SCALE-IT tagging failed:', error);
        return ['Execution']; // Default fallback
    }
}

// =============================================================================
// Utility Functions
// =============================================================================

function createAIMetadata(confidence: number, status: AIMetadata['status'] = 'pending'): AIMetadata {
    return {
        status,
        confidence,
        generatedAt: new Date().toISOString()
    };
}

function validatePillar(pillar: string): ScaleItPillar {
    const valid: ScaleItPillar[] = ['Strategic', 'CashFlow', 'Alliance', 'Leadership', 'Execution'];
    const normalized = pillar?.charAt(0).toUpperCase() + pillar?.slice(1).toLowerCase();
    return valid.includes(normalized as ScaleItPillar) ? (normalized as ScaleItPillar) : 'Execution';
}

function isValidPillar(pillar: string): boolean {
    return ['Strategic', 'CashFlow', 'Alliance', 'Leadership', 'Execution'].includes(pillar);
}

function validateUrgency(urgency: string): UrgencyLevel {
    const valid: UrgencyLevel[] = ['critical', 'high', 'medium', 'low'];
    return valid.includes(urgency as UrgencyLevel) ? (urgency as UrgencyLevel) : 'medium';
}

function validateImpact(impact: string): ImpactLevel {
    const valid: ImpactLevel[] = ['high', 'medium', 'low'];
    return valid.includes(impact as ImpactLevel) ? (impact as ImpactLevel) : 'medium';
}

function validateSeverity(severity: string): 'critical' | 'warning' | 'watch' {
    const valid = ['critical', 'warning', 'watch'];
    return valid.includes(severity) ? (severity as any) : 'watch';
}

function validateRiskCategory(cat: string): RiskSignal['category'] {
    const valid = ['financial', 'operational', 'team', 'strategic', 'personal'];
    return valid.includes(cat) ? (cat as any) : 'operational';
}

function validateOpportunityType(type: string): Opportunity['type'] {
    const valid = ['growth', 'efficiency', 'partnership', 'market'];
    return valid.includes(type) ? (type as any) : 'growth';
}

function parseDeadline(deadline: string): string {
    // Try to parse various deadline formats
    const date = new Date(deadline);
    if (!isNaN(date.getTime())) {
        return date.toISOString();
    }

    // Handle relative dates like "next week", "60 days"
    const match = deadline.match(/(\d+)\s*(day|week|month)/i);
    if (match) {
        const num = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        const now = new Date();

        if (unit === 'day') now.setDate(now.getDate() + num);
        else if (unit === 'week') now.setDate(now.getDate() + num * 7);
        else if (unit === 'month') now.setMonth(now.getMonth() + num);

        return now.toISOString();
    }

    // Default to 2 weeks from now
    const twoWeeks = new Date();
    twoWeeks.setDate(twoWeeks.getDate() + 14);
    return twoWeeks.toISOString();
}

function estimateDuration(content: string): string {
    const words = content.split(/\s+/).length;
    const minutes = Math.round(words / 150); // ~150 words per minute speaking
    return `${minutes} min`;
}

function aggregateScaleItTags(pillars: ScaleItPillar[]): ScaleItPillar[] {
    return [...new Set(pillars)];
}

export default {
    processTranscript,
    extractSummary,
    extractDecisions,
    extractCommitments,
    extractRisks,
    extractOpportunities,
    tagToScaleIt
};
