/**
 * Hybrid AI Service
 * 
 * ใช้ Groq สำหรับ text generation (เร็วและฟรี)
 * ใช้ Gemini สำหรับ image analysis (เมื่อจำเป็น)
 */

import { 
  generateHealthAdvice as groqGenerateHealthAdvice,
  generateRandomHealthQuestion as groqGenerateRandomQuestion,
  extractKnowledgeGraph as groqExtractKnowledgeGraph
} from './groqService';

import { 
  analyzeMedicalImage as geminiAnalyzeMedicalImage
} from './geminiService';

import { KnowledgeGraphData } from '../types';

// Text generation - ใช้ Groq (เร็วกว่าและฟรี)
export const generateHealthAdvice = groqGenerateHealthAdvice;
export const generateRandomHealthQuestion = groqGenerateRandomQuestion;
export const extractKnowledgeGraph = groqExtractKnowledgeGraph;

// Image analysis - ใช้ Gemini (รองรับ vision)
export const analyzeMedicalImage = geminiAnalyzeMedicalImage;

// Fallback function: ถ้า Groq ล้มเหลว ให้ fallback ไปใช้ Gemini
export const generateHealthAdviceWithFallback = async (
  prompt: string,
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    return await groqGenerateHealthAdvice(prompt, onChunk);
  } catch (error) {
    console.warn("Groq failed, falling back to Gemini:", error);
    // Fallback to Gemini
    const { generateHealthAdvice: geminiGenerate } = await import('./geminiService');
    return await geminiGenerate(prompt, onChunk);
  }
};

export const extractKnowledgeGraphWithFallback = async (
  conversationText: string
): Promise<KnowledgeGraphData> => {
  try {
    return await groqExtractKnowledgeGraph(conversationText);
  } catch (error) {
    console.warn("Groq failed, falling back to Gemini:", error);
    // Fallback to Gemini
    const { extractKnowledgeGraph: geminiExtract } = await import('./geminiService');
    return await geminiExtract(conversationText);
  }
};

