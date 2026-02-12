
export type ExperimentStatus = 'idea' | 'hypothesis' | 'running' | 'complete' | 'learnings';
export type ExperimentResult = 'won' | 'lost' | 'inconclusive' | null;

export interface Board {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  // New Fields
  bio?: string;
  linkedin_url?: string;
  contact_email?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  hasAttachment?: boolean;
}

export interface Experiment {
  id: string;
  board_id: string; // Link to Board
  title: string;
  description: string;
  status: ExperimentStatus;
  ice_impact: number;
  ice_confidence: number;
  ice_ease: number;
  market: string;
  type: string;
  tags: string[];
  created_at: string;
  archived: boolean;
  locked: boolean;
  result: ExperimentResult;
  owner: string; 
  comments: Comment[];
  // UI Helper
  boardName?: string;
}

// Tron Style Config
export const STATUS_CONFIG: Record<ExperimentStatus, { label: string; color: string; bg: string; border: string; darkColor: string; darkBg: string; darkBorder: string }> = {
  idea: { 
    label: 'Backlog', 
    color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/30',
    darkColor: 'text-slate-300', darkBg: 'bg-slate-500/10', darkBorder: 'border-slate-500/30'
  },
  hypothesis: { 
    label: 'Hypothesis', 
    color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30',
    darkColor: 'text-neon-blue', darkBg: 'bg-neon-blue/10', darkBorder: 'border-neon-blue/30'
  },
  running: { 
    label: 'Running', 
    color: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/30',
    darkColor: 'text-neon-purple', darkBg: 'bg-neon-purple/10', darkBorder: 'border-neon-purple/30'
  },
  complete: { 
    label: 'Complete', 
    color: 'text-neon-cyan', bg: 'bg-neon-cyan/10', border: 'border-neon-cyan/30',
    darkColor: 'text-neon-cyan', darkBg: 'bg-neon-cyan/10', darkBorder: 'border-neon-cyan/30'
  },
  learnings: { 
    label: 'Learnings', 
    color: 'text-neon-orange', bg: 'bg-neon-orange/10', border: 'border-neon-orange/30',
    darkColor: 'text-neon-orange', darkBg: 'bg-neon-orange/10', darkBorder: 'border-neon-orange/30'
  },
};

export const RESULT_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  won: { label: 'Won', color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30' },
  lost: { label: 'Lost', color: 'text-neon-red', bg: 'bg-neon-red/10', border: 'border-neon-red/30' },
  inconclusive: { label: 'Inconclusive', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
};

export const MARKETS = ['US', 'UK', 'CA', 'AU', 'NZ', 'SG'];
export const TYPES = ['Acquisition', 'Retention', 'Monetization', 'Product'];
