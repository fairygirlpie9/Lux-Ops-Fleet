import { GoogleGenAI } from "@google/genai";
import { Technician, Job, DashboardMetrics } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeFleetStatus = async (
  technicians: Technician[],
  jobs: Job[],
  metrics: DashboardMetrics
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI service unavailable: Missing API Key.";

  const systemInstruction = `
    You are an expert Fleet Operations Manager AI named "FleetOps Prime".
    Your goal is to analyze the current state of a field service fleet and provide actionable insights.
    Focus on:
    1. Identifying critical bottlenecks (e.g., unassigned critical jobs).
    2. Suggesting the best technician for unassigned jobs based on location (coordinates), status, and skill (implied by efficiency).
    3. Commenting on overall fleet efficiency and potential revenue risks.
    Keep the response concise (under 200 words), professional, and formatted in Markdown.
  `;

  const dataContext = JSON.stringify({
    metrics,
    unassignedJobs: jobs.filter(j => j.status === 'Unassigned'),
    technicians: technicians.map(t => ({
      id: t.id,
      name: t.name,
      status: t.status,
      location: t.location,
      zone: t.zone,
      efficiency: t.efficiencyScore
    }))
  });

  const prompt = `Here is the current real-time fleet data:\n${dataContext}\n\nPlease provide a tactical status report and recommendations.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature for more analytical/factual responses
      }
    });

    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at this time. Please check your connection or API key.";
  }
};
