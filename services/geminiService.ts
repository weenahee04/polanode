import { GoogleGenAI, Type } from "@google/genai";
import { KnowledgeGraphData, FlowchartData, MedicalChecklist } from "../types";

// Support both Vite's import.meta.env and process.env for compatibility
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 
                import.meta.env.GEMINI_API_KEY || 
                (typeof process !== 'undefined' && process.env?.API_KEY) || 
                (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
                '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

export const generateHealthAdvice = async (
  prompt: string, 
  onChunk: (text: string) => void
): Promise<string> => {
  if (!apiKey) {
    const errorMsg = "API Key is missing. Please configure GEMINI_API_KEY environment variable in Netlify (Site settings → Environment variables) or in .env.local for local development.";
    console.error("Gemini API Key missing. Check environment variables.");
    onChunk(errorMsg);
    return errorMsg;
  }

  try {
    // Using the recommended flash model for quick text tasks
    const model = 'gemini-3-flash-preview';
    
    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful, professional, and empathetic Thai healthcare assistant for a Wellness Rewards app. Keep answers concise, encouraging, and use polite Thai (adding 'ครับ/ค่ะ'). Focus on general wellness, nutrition, and explaining medical terms simply. Do not provide medical diagnosis.",
      }
    });

    let fullText = '';
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
    return fullText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMsg = "ขออภัยครับ ระบบขัดข้องชั่วคราว (Sorry, temporary system error).";
    onChunk(errorMsg);
    return errorMsg;
  }
};

export const generateRandomHealthQuestion = async (): Promise<string> => {
  if (!apiKey) return "วันนี้คุณได้ออกกำลังกายบ้างหรือยังครับ? (Have you exercised today?)";

  try {
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model: model,
      contents: "Generate a single, short, friendly, and random health-related question in Thai to ask the user. The goal is to gather data about their daily habits, diet, stress levels, or symptoms for a health knowledge graph. Example: 'ช่วงนี้คุณนอนหลับสนิทไหมครับ?' or 'วันนี้ทานผักผลไม้เพียงพอไหมครับ?'. Output ONLY the question text.",
    });
    return response.text?.trim() || "ช่วงนี้สุขภาพของคุณเป็นอย่างไรบ้างครับ?";
  } catch (error) {
    console.error("Error generating random question:", error);
    return "วันนี้คุณดื่มน้ำเพียงพอหรือยังครับ?";
  }
};

export const extractKnowledgeGraph = async (conversationText: string): Promise<KnowledgeGraphData> => {
  if (!apiKey) return { nodes: [], edges: [] };

  try {
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `Analyze the following health consultation text and extract a Knowledge Graph. 
      Identify entities such as Symptoms, Diseases/Conditions, Medicines/Treatments, Locations/Clinics, and others.
      Create relationships between them (e.g., CAUSES, TREATED_BY, LOCATED_AT).
      
      Text to analyze: "${conversationText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING, description: "Short display label, e.g. 'Headache'" },
                  type: { 
                    type: Type.STRING, 
                    enum: ['symptom', 'disease', 'medicine', 'location', 'other'] 
                  }
                },
                required: ['id', 'label', 'type']
              }
            },
            edges: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING, description: "id of the source node" },
                  target: { type: Type.STRING, description: "id of the target node" },
                  relation: { type: Type.STRING, description: "Relationship label, e.g. 'TREATS'" }
                },
                required: ['source', 'target', 'relation']
              }
            }
          },
          required: ['nodes', 'edges']
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as KnowledgeGraphData;
      return data;
    }
    return { nodes: [], edges: [] };

  } catch (error) {
    console.error("Knowledge Graph Extraction Error:", error);
    return { nodes: [], edges: [] };
  }
};

export const analyzeMedicalImage = async (base64Data: string, mimeType: string): Promise<{ 
    text: string, 
    graphData: KnowledgeGraphData, 
    flowchartData: FlowchartData,
    checklistData: MedicalChecklist
}> => {
  const emptyResult = { 
      text: "Could not analyze", 
      graphData: { nodes: [], edges: [] }, 
      flowchartData: { nodes: [], edges: [] },
      checklistData: { title: "", items: [] } 
  };

  if (!apiKey) return { ...emptyResult, text: "API Key missing" };

  try {
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
        model,
        contents: [
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            },
            {
                text: `Analyze this image. If it appears to be a Slit Lamp examination or eye-related medical image:
                1. Describe findings in friendly Thai.
                2. Extract medical entities for a Knowledge Graph.
                3. Create a logic Flowchart for the diagnostic process.
                4. Create a specific "Ophthalmologist Verification Checklist". 
                   - Group by anatomical structures (e.g., Lids/Lashes, Conjunctiva, Cornea, Anterior Chamber, Iris, Lens).
                   - Include common signs for the condition suspected (e.g. "Dendritic ulcer", "Cells/Flare", "KP").
                   - Mark 'isObserved' as true if you see it in the image, false if standard check but not seen.
                
                If it's not a medical image, just say so and return empty structures.`
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    analysis: { type: Type.STRING },
                    knowledgeGraph: {
                        type: Type.OBJECT,
                        properties: {
                            nodes: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        label: { type: Type.STRING },
                                        type: { type: Type.STRING, enum: ['symptom', 'disease', 'medicine', 'location', 'other'] }
                                    },
                                    required: ['id', 'label', 'type']
                                }
                            },
                            edges: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        source: { type: Type.STRING },
                                        target: { type: Type.STRING },
                                        relation: { type: Type.STRING }
                                    },
                                    required: ['source', 'target', 'relation']
                                }
                            }
                        },
                        required: ['nodes', 'edges']
                    },
                    flowchart: {
                        type: Type.OBJECT,
                        properties: {
                            nodes: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        label: { type: Type.STRING },
                                        type: { type: Type.STRING, enum: ['start', 'process', 'decision', 'end'] }
                                    },
                                    required: ['id', 'label', 'type']
                                }
                            },
                            edges: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        source: { type: Type.STRING },
                                        target: { type: Type.STRING },
                                        label: { type: Type.STRING }
                                    },
                                    required: ['source', 'target']
                                }
                            }
                        },
                        required: ['nodes', 'edges']
                    },
                    checklist: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            items: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        category: { type: Type.STRING },
                                        label: { type: Type.STRING },
                                        isObserved: { type: Type.BOOLEAN }
                                    },
                                    required: ['id', 'category', 'label', 'isObserved']
                                }
                            }
                        },
                        required: ['title', 'items']
                    }
                },
                required: ['analysis', 'knowledgeGraph', 'flowchart', 'checklist']
            }
        }
    });

    if (response.text) {
        const result = JSON.parse(response.text);
        return {
            text: result.analysis,
            graphData: result.knowledgeGraph || { nodes: [], edges: [] },
            flowchartData: result.flowchart || { nodes: [], edges: [] },
            checklistData: result.checklist || { title: "Standard Checklist", items: [] }
        };
    }
    return { ...emptyResult, text: "ไม่สามารถวิเคราะห์รูปภาพได้ (Could not analyze image)" };
  } catch (error) {
      console.error("Image analysis error:", error);
      return { ...emptyResult, text: "เกิดข้อผิดพลาดในการวิเคราะห์รูปภาพ (Error analyzing image)" };
  }
};