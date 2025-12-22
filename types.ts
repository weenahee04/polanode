import { LucideIcon } from 'lucide-react';

export interface RewardItem {
  id: string;
  title: string;
  category: string;
  points: number;
  imageUrl: string;
  description: string;
}

export interface QuickNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  imageUrl?: string;
}

export enum Tab {
  HOME = 'HOME',
  REWARDS = 'REWARDS',
  AI_CHAT = 'AI_CHAT',
  PROFILE = 'PROFILE'
}

// Knowledge Graph Types
export type NodeType = 'symptom' | 'disease' | 'medicine' | 'location' | 'other';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  x?: number; // For visualization
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string;
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Flowchart Types
export type FlowchartNodeType = 'start' | 'process' | 'decision' | 'end';

export interface FlowchartNode {
  id: string;
  label: string;
  type: FlowchartNodeType;
}

export interface FlowchartEdge {
  source: string;
  target: string;
  label?: string; // e.g., "Yes", "No"
}

export interface FlowchartData {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
}

// Medical Checklist Types
export interface ChecklistItem {
  id: string;
  category: string; // e.g. "Cornea", "Lids"
  label: string; // e.g. "Keratic Precipitates"
  isObserved: boolean; // AI prediction
  isVerified?: boolean; // User confirmation
}

export interface MedicalChecklist {
  title: string;
  items: ChecklistItem[];
}

// AI Training Types
export interface LearnedConcept extends GraphNode {
  learnedAt: Date;
  confidence: number;
  sourceInteraction: string; // The chat message ID or preview
}