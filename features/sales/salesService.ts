/**
 * Sales Service
 * Handles sales assessment ingestion, fit scoring, risk detection,
 * and handoff package generation for mentor onboarding.
 */

import { GoogleGenAI, Type } from "@google/genai";
import {
    ProspectProfile,
    HandoffPackage,
    FitScore,
    RiskIndicator,
    IdentifiedNeed,
    Recording,
    Transcript,
    ScaleItPillar
} from '../../types';
import * as zoomService from '../../services/zoomService';
import * as aiProcessingService from '../../services/aiProcessingService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

// =============================================================================
// Data Store (Mock)
// =============================================================================

const PROSPECTS: Map<string, ProspectProfile> = new Map();
const HANDOFF_PACKAGES: Map<string, HandoffPackage> = new Map();

// =============================================================================
// Prospect Management
// =============================================================================

export interface CreateProspectRequest {
    companyName: string;
    contactName: string;
    email: string;
    phone?: string;
    industry: string;
    companySize: string;
    revenue?: string;
    website?: string;
    source: string;
}

/**
 * Create a new prospect profile
 */
export async function createProspect(request: CreateProspectRequest): Promise<ProspectProfile> {
    const prospect: ProspectProfile = {
        id: `prospect_${Date.now()}`,
        ...request,
        createdAt: new Date().toISOString()
    };

    PROSPECTS.set(prospect.id, prospect);
    return prospect;
}

/**
 * Get prospect by ID
 */
export async function getProspect(prospectId: string): Promise<ProspectProfile | null> {
    return PROSPECTS.get(prospectId) ?? null;
}

/**
 * List all prospects
 */
export async function listProspects(): Promise<ProspectProfile[]> {
    return Array.from(PROSPECTS.values());
}

// =============================================================================
// Sales Call Processing
// =============================================================================

/**
 * Process a sales call and generate fit scoring
 */
export async function processSalesCall(
    prospectId: string,
    transcript: Transcript
): Promise<{ fitScore: FitScore; risks: RiskIndicator[]; needs: IdentifiedNeed[] }> {
    const prospect = PROSPECTS.get(prospectId);
    if (!prospect) {
        throw new Error(`Prospect ${prospectId} not found`);
    }

    // Generate fit score and extract insights in parallel
    const [fitScore, risks, needs] = await Promise.all([
        generateFitScore(prospect, transcript.content),
        extractRiskIndicators(transcript.content),
        extractIdentifiedNeeds(transcript.content)
    ]);

    return { fitScore, risks, needs };
}

/**
 * Generate fit score from sales call
 */
async function generateFitScore(prospect: ProspectProfile, transcript: string): Promise<FitScore> {
    const prompt = `Analyze this sales call transcript and assess the prospect's fit for the mentoring program.

Prospect Information:
- Company: ${prospect.companyName}
- Industry: ${prospect.industry}
- Company Size: ${prospect.companySize}
- Revenue: ${prospect.revenue || 'Unknown'}

Transcript:
${transcript}

Evaluate the prospect on:
1. Program Fit (1-100): How well their needs match our program
2. Readiness (1-100): How prepared they are to engage
3. Commitment (1-100): Their level of commitment and investment willingness
4. Coachability (1-100): Their openness to guidance and change

Respond in JSON:
{
  "programFit": number,
  "readiness": number,
  "commitment": number,
  "coachability": number,
  "reasoning": "Brief explanation of scores"
}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const result = JSON.parse(response.text ?? '{}');
        const overall = Math.round(
            (result.programFit + result.readiness + result.commitment + result.coachability) / 4
        );

        return {
            overall,
            level: overall >= 80 ? 'excellent' : overall >= 65 ? 'good' : overall >= 50 ? 'moderate' : 'poor',
            breakdown: {
                programFit: result.programFit || 50,
                readiness: result.readiness || 50,
                commitment: result.commitment || 50,
                coachability: result.coachability || 50
            },
            reasoning: result.reasoning || 'Analysis pending'
        };
    } catch (error) {
        console.error('[SalesService] Fit score generation failed:', error);
        return {
            overall: 50,
            level: 'moderate',
            breakdown: { programFit: 50, readiness: 50, commitment: 50, coachability: 50 },
            reasoning: 'Unable to generate fit score'
        };
    }
}

/**
 * Extract risk indicators from sales call
 */
async function extractRiskIndicators(transcript: string): Promise<RiskIndicator[]> {
    const prompt = `Analyze this sales call transcript and identify any risk indicators that a mentor should be aware of.

Look for:
- Financial constraints or cash flow issues
- Time commitment concerns
- Resistance to change or coaching
- Unrealistic expectations
- Communication challenges
- Team or leadership issues

Transcript:
${transcript}

Respond in JSON:
{
  "risks": [
    {
      "category": "string",
      "description": "string",
      "severity": "high|medium|low",
      "mitigationStrategy": "string"
    }
  ]
}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const result = JSON.parse(response.text ?? '{"risks":[]}');
        return (result.risks || []).map((r: any, i: number) => ({
            id: `risk_${Date.now()}_${i}`,
            category: r.category || 'general',
            description: r.description || '',
            severity: ['high', 'medium', 'low'].includes(r.severity) ? r.severity : 'medium',
            mitigationStrategy: r.mitigationStrategy
        }));
    } catch (error) {
        console.error('[SalesService] Risk extraction failed:', error);
        return [];
    }
}

/**
 * Extract identified needs from sales call
 */
async function extractIdentifiedNeeds(transcript: string): Promise<IdentifiedNeed[]> {
    const prompt = `Analyze this sales call transcript and identify the prospect's business needs.

Categorize needs by SCALE-IT pillars:
- Strategic: Vision, strategy, long-term planning
- CashFlow: Financial health, revenue, profitability
- Alliance: Team, hiring, organizational structure
- Leadership: Personal development, management skills
- Execution: Operations, processes, productivity

Transcript:
${transcript}

Respond in JSON:
{
  "needs": [
    {
      "category": "Strategic|CashFlow|Alliance|Leadership|Execution",
      "description": "string",
      "urgency": "critical|high|medium|low"
    }
  ]
}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const result = JSON.parse(response.text ?? '{"needs":[]}');
        return (result.needs || []).map((n: any, i: number) => ({
            id: `need_${Date.now()}_${i}`,
            category: validatePillar(n.category),
            description: n.description || '',
            urgency: ['critical', 'high', 'medium', 'low'].includes(n.urgency) ? n.urgency : 'medium'
        }));
    } catch (error) {
        console.error('[SalesService] Needs extraction failed:', error);
        return [];
    }
}

function validatePillar(pillar: string): ScaleItPillar {
    const valid: ScaleItPillar[] = ['Strategic', 'CashFlow', 'Alliance', 'Leadership', 'Execution'];
    return valid.includes(pillar as ScaleItPillar) ? (pillar as ScaleItPillar) : 'Execution';
}

// =============================================================================
// Handoff Package Generation
// =============================================================================

/**
 * Generate a complete handoff package for mentor assignment
 */
export async function generateHandoffPackage(
    prospectId: string,
    salesSessionId: string,
    transcript: Transcript,
    recordings: Recording[]
): Promise<HandoffPackage> {
    const prospect = await getProspect(prospectId);
    if (!prospect) {
        throw new Error(`Prospect ${prospectId} not found`);
    }

    // Process the sales call
    const { fitScore, risks, needs } = await processSalesCall(prospectId, transcript);

    // Generate summary
    const summaryResult = await aiProcessingService.extractSummary(salesSessionId, transcript.content);

    // Generate recommended approach
    const recommendedApproach = await generateRecommendedApproach(prospect, fitScore, needs, risks);

    const handoffPackage: HandoffPackage = {
        id: `handoff_${Date.now()}`,
        prospectId,
        prospect,
        salesSessionId,
        salesCallSummary: summaryResult.executiveSummary,
        fitScore,
        riskIndicators: risks,
        identifiedNeeds: needs,
        recommendedApproach,
        recordings,
        transcripts: [transcript],
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    HANDOFF_PACKAGES.set(handoffPackage.id, handoffPackage);

    return handoffPackage;
}

/**
 * Generate recommended approach for mentor
 */
async function generateRecommendedApproach(
    prospect: ProspectProfile,
    fitScore: FitScore,
    needs: IdentifiedNeed[],
    risks: RiskIndicator[]
): Promise<string> {
    const topNeeds = needs.slice(0, 3).map(n => `${n.category}: ${n.description}`).join('\n');
    const topRisks = risks.slice(0, 2).map(r => r.description).join('\n');

    const prompt = `Based on the prospect profile and assessment, provide a brief recommended approach for the mentor's first session.

Prospect: ${prospect.companyName} (${prospect.industry}, ${prospect.companySize})
Fit Score: ${fitScore.overall}/100 (${fitScore.level})
Reasoning: ${fitScore.reasoning}

Top Needs:
${topNeeds}

Key Risks:
${topRisks}

Provide a 2-3 sentence recommendation for how the mentor should approach this client.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });

        return response.text ?? 'Focus on building rapport and understanding their immediate priorities.';
    } catch (error) {
        return 'Focus on building rapport and understanding their immediate priorities.';
    }
}

/**
 * Get handoff package by ID
 */
export async function getHandoffPackage(packageId: string): Promise<HandoffPackage | null> {
    return HANDOFF_PACKAGES.get(packageId) ?? null;
}

/**
 * List handoff packages by status
 */
export async function listHandoffPackages(
    status?: HandoffPackage['status']
): Promise<HandoffPackage[]> {
    let packages = Array.from(HANDOFF_PACKAGES.values());
    if (status) {
        packages = packages.filter(p => p.status === status);
    }
    return packages.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

/**
 * Assign handoff package to mentor
 */
export async function assignToMentor(
    packageId: string,
    mentorId: string
): Promise<HandoffPackage> {
    const pkg = HANDOFF_PACKAGES.get(packageId);
    if (!pkg) {
        throw new Error(`Handoff package ${packageId} not found`);
    }

    const updated: HandoffPackage = {
        ...pkg,
        mentorId,
        status: 'assigned',
        assignedAt: new Date().toISOString()
    };

    HANDOFF_PACKAGES.set(packageId, updated);
    return updated;
}

/**
 * Accept handoff package (mentor acknowledges)
 */
export async function acceptHandoff(packageId: string): Promise<HandoffPackage> {
    const pkg = HANDOFF_PACKAGES.get(packageId);
    if (!pkg) {
        throw new Error(`Handoff package ${packageId} not found`);
    }

    const updated: HandoffPackage = {
        ...pkg,
        status: 'accepted'
    };

    HANDOFF_PACKAGES.set(packageId, updated);
    return updated;
}

export default {
    createProspect,
    getProspect,
    listProspects,
    processSalesCall,
    generateHandoffPackage,
    getHandoffPackage,
    listHandoffPackages,
    assignToMentor,
    acceptHandoff
};
