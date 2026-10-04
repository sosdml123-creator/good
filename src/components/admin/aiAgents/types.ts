// src/components/admin/aiAgents/types.ts

export type AgentCategoryId = 
  | 'all'
  | 'engineering'
  | 'design'
  | 'ads'
  | 'sales'
  | 'marketing'
  | 'product'
  | 'project_management';

export interface AgentCategory {
  id: AgentCategoryId;
  name: string;
  badge: string;
  iconName: string;
}

export interface AgentPersona {
  id: string;
  name: string;
  koreanName: string;
  role: string;
  category: AgentCategoryId;
  categoryLabel: string;
  avatarIcon: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    gradient: string;
  };
  summary: string;
  description: string;
  keySkills: string[];
  systemPrompt: string;
  samplePrompts: {
    title: string;
    prompt: string;
  }[];
  externalToolGuides: {
    claude: string;
    chatgpt: string;
    cursor: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentId?: string;
  agentName?: string;
}

export interface MultiAgentTaskResult {
  agentId: string;
  agentName: string;
  role: string;
  avatarIcon: string;
  color: string;
  output: string;
  isLoading: boolean;
  error?: string;
}
