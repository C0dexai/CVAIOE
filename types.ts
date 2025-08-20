

export interface PackagingInterrelation {
  type: string;
  description: string;
  utility_tool: string;
}

export interface Agent {
  name: string;
  role: string;
  bio: string;
  focus_areas: string[];
  packaging_interrelation: PackagingInterrelation[];
}

export interface Tool {
  name: string;
  primary_agent: string;
}

export interface ChainStep {
  tool: string;
  input: string;
  params?: Record<string, string>;
}

export interface ChainedBookmark {
  name: string;
  associated_agent: string;
  description: string;
  chain: ChainStep[];
}

export interface CodexData {
  version: string;
  author: string;
  contact: string;
  ai_family: Agent[];
  tools: Tool[];
  chained_bookmarks: ChainedBookmark[];
}

export interface A2ARule {
  trigger: string;
  command: string;
}

export interface MCPManifests {
  [key: string]: string;
}

export interface CustomInstructions {
  system: string;
  ai: string;
  user: string;
}

export interface ConversationTurn {
    user: string;
    gemini: string;
    openai: string;
    abacus: string;
}

export interface OrchestrationStep {
  id: number;
  tool: string;
  agent: string;
  status: 'pending' | 'running' | 'complete';
  input: string;
  output: string;
}

export interface RunningOrchestration {
    bookmark: ChainedBookmark;
    initialBrief: string;
    steps: OrchestrationStep[];
}

// Types for Dual-LLM Control Center
export type LlmStrategy = 'GEMINI_PRIMARY' | 'OPENAI_PRIMARY' | 'ABACUS_PRIMARY' | 'TRIPLE_DYNAMIC';
export type OrchestrationStatus = 'idle' | 'starting' | 'streaming' | 'completed' | 'failed';
export type TaskStatus = 'pending' | 'running' | 'completed' | 'error';
export type LlmName = 'gemini' | 'openai' | 'abacus';

export interface DualLlmTask {
    id: string; // SSE messages have string taskIds
    description: string;
    agent: string;
    llm: LlmName;
    status: TaskStatus;
    log?: string;
}

// Type for the Orchestration Ledger, as per the OpenAPI spec
export type GeneratedSpa = {
  id: string; // uuid
  objective: string;
  command: string;
  agents: string[];
  strategy: LlmStrategy;
  summary: Record<string, any>; // Generic object as per spec {}
  createdAt: number; // integer
};

// Types for Gemini Pages Deployer
export interface DeployPageRequest {
  slug: string;
  title: string;
  html: string;
}

export interface DeployPageSuccessResponse {
    status: "success";
    message: string;
    endpoint: string;
    path: string;
    public_url: string;
    content_hash: string;
}
