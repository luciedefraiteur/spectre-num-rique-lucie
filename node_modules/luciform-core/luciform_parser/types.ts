export interface Operation {
  type: string;
  [key: string]: any; // Allow for other properties like 'description', 'command', etc.
}

export interface LuciformDocument {
  type: 'LuciformDocument';
  pas: PasNode[];
  sygil?: string;
  meta?: any;
}

export interface PasNode {
  type: 'Pas';
  content: string; // The raw content of the pas before any action block
  action: ActionNode | null;
}

export type ActionNode = PromenadeActionNode | JsonActionNode | MessageActionNode | AskPersonaActionNode | EntangleWithActionNode | ScryOrbActionNode | HelpRequestActionNode;

export interface EntangleWithActionNode {
  type: 'entangle_with';
  luciform_path: string;
}

export interface ScryOrbActionNode {
  type: 'scry_orb';
  target: string;
  goal: string;
}

export interface AskPersonaActionNode {
  type: 'ask_persona';
  persona: string;
  question: string;
}

export interface PromenadeActionNode {
  type: 'promenade';
  description: string;
}

export interface JsonActionNode {
  type: 'json_action';
  operation: Operation; // The parsed JSON operation
}

export interface MessageActionNode {
  type: 'message';
  message: string;
}

export interface HelpRequestActionNode {
  type: 'help_request';
  rawContent: string;
  reason: string;
}
