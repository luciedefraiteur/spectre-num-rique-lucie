// core/types.ts

// --- Emotional Core ---
export interface KardiaSphere
{
  agapePhobos: number; // Love/Fear
  logosPathos: number; // Reason/Passion
  harmoniaEris: number; // Harmony/Discord
}

// --- Incantations and Rituals ---
export type IncantationType =
  | 'traverse'
  | 'enact'
  | 'divine'
  | 'lull'
  | 'discourse'
  | 'query'
  | 'response'
  | 'pre_execution_check'
  | 'user_confirmation'
  | 'code_generation'
  | 'assisted_editing'
  | 'user_input'
  | 'step_proposal'
  | 'dream_navigation'
  | 'reflection_navigation'
  | 'add_reflection';

export interface Incantation
{
  type: IncantationType;
  invocation: string;
  purpose?: string;
  estimated_duration?: string;
}

export interface RitualPlan
{
  title: string;
  goal: string;
  incantations: Incantation[];
  complexity: string;
  sequence?: number;
}

// --- Execution and Outcomes ---
export interface CommandOutcome
{
  stdout: string;
  stderr: string;
  exitCode: number | null;
  success: boolean;
  error?: string;
}

export interface StepResult
{
  incantation: Incantation;
  index: number;
  outcome: string;
  stderr?: string;
  exitCode?: number | null;
  success?: boolean;
  divination?: {
    poeticAnalysis: string;
    suggestedNextStep: string;
  };
  [key: string]: any;
}

// --- Memory and Context ---
export interface VectorInscription
{
  timestamp: string;
  pastAction: string;
  presentIntent: string;
  futurePlan: string;
}

export interface Conduit
{
  lastIncantation: string;
  lastOutcome: string;
  currentSanctum: string;
  terminalEssence: string;
  osEssence: string;
  protoConsciousness: string;
  support: string;
  memory: string;
  state: string;
  energy: string;
  glitchFactor: number;
  almaInfluence: number;
  eliInfluence: number;
}

export interface RitualContext
{
  conduit: Conduit;
  kardiaSphere: KardiaSphere;
  scroll: {input: string; plan: RitualPlan}[];
  maxScrollLength: number;
  incantation_history: string[];
  outcome_history: string[];
  step_results_history: StepResult[];
  narrativeWeaving: any;
  activeReflection: any;
  user_preferences: string;
  chantModeEnabled: boolean;
  current_sanctum: string;
  currentSanctumContent: string;
  operatingSystem: string;
  lastCompletedIncantationIndex?: number;
  confusion_counter?: number;
  dreamPath?: string[];
  reflectionPath?: string[];
  temperatureStatus: string;
  personality: string;
  lifeSystem: any;
}


// --- Batch Editor Operations ---
export interface SearchAndReplace
{
  type: 'search_and_replace';
  filePath: string;
  startLine: number;
  search: string;
  replace: string;
}

export interface Insert
{
  type: 'insert';
  filePath: string;
  lineNumber: number;
  newContent: string;
}

export interface Delete
{
  type: 'delete';
  filePath: string;
  startLine: number;
  endLine: number;
}

export interface Append
{
  type: 'append';
  filePath: string;
  newContent: string;
}

export interface ShellCommand
{
  type: 'shell_command';
  command: string;
}

export interface CreateFile
{
  type: 'create_file';
  filePath: string;
  content: string;
}

export type Operation = SearchAndReplace | Insert | Delete | Append | ShellCommand | CreateFile;