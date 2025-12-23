import Groq from "groq-sdk";
import { KnowledgeGraphData, FlowchartData, MedicalChecklist } from "../types";

// Support both Vite's import.meta.env and process.env
const apiKey = import.meta.env.VITE_GROQ_API_KEY || 
                import.meta.env.GROQ_API_KEY || 
                (typeof process !== 'undefined' && process.env?.GROQ_API_KEY) || 
                '';

const groq = new Groq({
  apiKey: apiKey,
});

export const generateHealthAdvice = async (
  prompt: string, 
  onChunk: (text: string) => void
): Promise<string> => {
  if (!apiKey) {
    const errorMsg = "API Key is missing. Please configure GROQ_API_KEY environment variable.";
    console.error("Groq API Key missing. Check environment variables.");
    onChunk(errorMsg);
    return errorMsg;
  }

  try {
    const stream = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile", // หรือ "llama-3.1-8b-instant" (เร็วกว่า)
      messages: [
        {
          role: "system",
          content: "You are a helpful, professional, and empathetic Thai healthcare assistant for a Wellness Rewards app. Keep answers concise, encouraging, and use polite Thai (adding 'ครับ/ค่ะ'). Focus on general wellness, nutrition, and explaining medical terms simply. Do not provide medical diagnosis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      stream: true,
      temperature: 0.7,
    });

    let fullText = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullText += content;
        onChunk(fullText);
      }
    }
    return fullText;

  } catch (error) {
    console.error("Groq API Error:", error);
    const errorMsg = "ขออภัยครับ ระบบขัดข้องชั่วคราว (Sorry, temporary system error).";
    onChunk(errorMsg);
    return errorMsg;
  }
};

export const generateRandomHealthQuestion = async (): Promise<string> => {
  if (!apiKey) return "วันนี้คุณได้ออกกำลังกายบ้างหรือยังครับ? (Have you exercised today?)";

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Generate a single, short, friendly, and random health-related question in Thai to ask the user. The goal is to gather data about their daily habits, diet, stress levels, or symptoms for a health knowledge graph. Example: 'ช่วงนี้คุณนอนหลับสนิทไหมครับ?' or 'วันนี้ทานผักผลไม้เพียงพอไหมครับ?'. Output ONLY the question text."
        }
      ],
      temperature: 0.8,
    });

    return response.choices[0]?.message?.content?.trim() || "ช่วงนี้สุขภาพของคุณเป็นอย่างไรบ้างครับ?";
  } catch (error) {
    console.error("Error generating random question:", error);
    return "วันนี้คุณดื่มน้ำเพียงพอหรือยังครับ?";
  }
};

export const extractKnowledgeGraph = async (conversationText: string): Promise<KnowledgeGraphData> => {
  if (!apiKey) return { nodes: [], edges: [] };

  try {
    const prompt = `Analyze the following health consultation text and extract a Knowledge Graph. 
    Identify entities such as Symptoms, Diseases/Conditions, Medicines/Treatments, Locations/Clinics, and others.
    Create relationships between them (e.g., CAUSES, TREATED_BY, LOCATED_AT).
    
    Text to analyze: "${conversationText}"
    
    Return ONLY valid JSON in this exact format:
    {
      "nodes": [
        {"id": "string", "label": "string", "type": "symptom|disease|medicine|location|other"}
      ],
      "edges": [
        {"source": "string", "target": "string", "relation": "string"}
      ]
    }`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a JSON extraction expert. Always return valid JSON only, no other text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content || '';
    if (text) {
      try {
        const data = JSON.parse(text) as KnowledgeGraphData;
        return data;
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        // Try to extract JSON from text if wrapped
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]) as KnowledgeGraphData;
        }
      }
    }
    return { nodes: [], edges: [] };

  } catch (error) {
    console.error("Knowledge Graph Extraction Error:", error);
    return { nodes: [], edges: [] };
  }
};

// Note: Groq doesn't support image analysis, so this is a placeholder
export const analyzeMedicalImage = async (base64Data: string, mimeType: string): Promise<{ 
    text: string, 
    graphData: KnowledgeGraphData, 
    flowchartData: FlowchartData,
    checklistData: MedicalChecklist
}> => {
  const emptyResult = { 
      text: "Groq API does not support image analysis. Please use Gemini API for this feature.", 
      graphData: { nodes: [], edges: [] }, 
      flowchartData: { nodes: [], edges: [] },
      checklistData: { title: "", items: [] } 
  };
  return emptyResult;
};

