import { RitualPlan } from '../types.js';
export interface Action {
    type: string;
    [key: string]: any;
}
export interface UnknownAction extends Action {
    type: 'UnknownAction';
    raw: string;
}
export declare const parse: (text: string) => RitualPlan | null | Action[];
