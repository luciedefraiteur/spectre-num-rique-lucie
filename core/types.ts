export interface Incantation
{
  type: 'enact' | 'divine' | 'lull' | 'discourse' | 'query' | 'response' | 'traverse' | 'pre_execution_check' | 'user_confirmation' | 'code_generation' | 'user_input' | 'step_proposal' | 'assisted_editing' | 'dream_navigation' | 'reflection_navigation' | 'add_reflection';
  invocation: string;
  estimated_duration?: string;
  accomplished?: 'yes' | 'no';
  outcome?: any;
  divination?: {poeticAnalysis: string, suggestedNextStep: string};
}

export interface RitualPlan
{
  incantations: Incantation[];
  complexity: 'simple' | 'moderate' | 'complex';
  sequence: number;
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

export interface NarrativeWeaving
{
  currentTheme: string;
  keySymbols: string[];
  entityStates: {[entityName: string]: any};
  currentDream: string;
}

export interface KardiaSphere
{
  agapePhobos: number;
  logosPathos: number;
  harmoniaEris: number;
}

export interface RitualContext
{
  scroll: {input: string; plan: RitualPlan}[];
  incantation_history: string[];
  outcome_history: string[];
  step_results_history: any[];
  current_sanctum: string;
  temperatureStatus: 'normal' | 'elevated' | 'critical';
  conduit: Conduit;
  chantModeEnabled: boolean;
  narrativeWeaving: NarrativeWeaving;
  kardiaSphere: KardiaSphere;
  lastCompletedIncantationIndex?: number;
  currentSanctumContent?: string;
  operatingSystem?: string;
  personality: string;
  confusion_counter?: number;
  lifeSystem?: any;
  dreamPath?: string[];
  user_preferences?: string;
  reflectionPath?: string[];
  maxScrollLength: number;
  activeReflection?: any | null;
}

export interface CommandOutcome
{
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  error?: string;
}

export interface VectorInscription
{
  timestamp: string;
  pastAction: string;
  presentIntent: string;
  futurePlan: string;
}