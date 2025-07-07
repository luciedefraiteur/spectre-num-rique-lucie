import { KardiaSphere } from '../types.js';

export interface Operation {
  type: string;
  [key: string]: any; // Allow for other properties like 'description', 'command', etc.
}

export interface LuciformDocument {
  type: 'LuciformDocument';
  pas: PasNode[];
  kardia?: KardiaSphere;
}

export interface PasNode {
  type: 'Pas';
  content: string; // The raw content of the pas before any action block
  action: ActionNode | null;
}

export type ActionNode = PromenadeActionNode | JsonActionNode | MessageActionNode;

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