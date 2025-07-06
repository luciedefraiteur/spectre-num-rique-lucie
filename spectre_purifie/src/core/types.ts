// src/core/types.ts

import {Luciform} from './luciform';

export interface RituelContext
{
    history: {type: string; content: string}[]; // This will eventually reference Luciform IDs
    currentWorkingDirectory: string;
    osHint: string;
    model: string;
    emotionalState: string;
    persona: {name: string; description: string};
    currentLuciform: Luciform; // Lucie's current state encapsulated in a Luciform
}

export enum ÉtapeType
{
    CD = 'CD',
    EXECUTE = 'EXECUTE',
    QUESTION = 'QUESTION',
    ANALYSE = 'ANALYSE',
    APPLY_EDITS = 'APPLY_EDITS',
    SAVE_MEMORY = 'SAVE_MEMORY',
    UPDATE_REFLECT = 'UPDATE_REFLECT',
    CONDUCT_RITUAL = 'CONDUCT_RITUAL',
    GENERATE_SCRY_ORB = 'GENERATE_SCRY_ORB',
    VIEW_SCRY_ORB = 'VIEW_SCRY_ORB',
}

export interface Étape
{
    type: ÉtapeType;
    description: string;
    parameters?: {[key: string]: any};
}

export interface PlanRituel
{
    goal: string;
    incantations: Étape[];
}

export enum ÉtapeStatus
{
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export interface ÉtapeResult
{
    incantation: Étape;
    status: ÉtapeStatus;
    output: string;
    error: string;
    timestamp: string;
}
