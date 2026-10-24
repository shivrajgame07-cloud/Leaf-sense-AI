import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface LeafAnalysis {
  kind: string;
  scientificName: string;
  structure: {
    shape: string;
    margin: string;
    venation: string;
  };
  healthStatus: "Healthy" | "Stressed" | "Diseased" | "Unknown";
  healthDetails: string;
  careTips: string[];
}

export async function analyzeLeaf(base64Image: string): Promise<LeafAnalysis> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            text: "Analyze this leaf image. Provide the common name (kind), scientific name, leaf structure (shape, margin, venation), current health status, health details (why it is healthy or stressed), and 3 quick care tips. Format the response as JSON.",
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            kind: { type: Type.STRING },
            scientificName: { type: Type.STRING },
            structure: {
              type: Type.OBJECT,
              properties: {
                shape: { type: Type.STRING },
                margin: { type: Type.STRING },
                venation: { type: Type.STRING },
              },
              required: ["shape", "margin", "venation"],
            },
            healthStatus: {
              type: Type.STRING,
              enum: ["Healthy", "Stressed", "Diseased", "Unknown"],
            },
            healthDetails: { type: Type.STRING },
            careTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["kind", "scientificName", "structure", "healthStatus", "healthDetails", "careTips"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No analysis result received from AI.");
    }

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Leaf Analysis Error:", error);
    throw error;
  }
}
