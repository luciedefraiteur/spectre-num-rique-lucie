import { Operation } from './types.js';
export declare function executeShellCommand(command: string): Promise<void>;
export declare function applyOperation(op: Operation, dryRun?: boolean): Promise<void>;

import { BatchActionFeedback, ResultAggregator } from './batch_editor_types.js';
import type { Action } from './permissive_parser/index.js';
type AnyBatchAction = Operation | Action;
export declare function executeBatch(
  actions: AnyBatchAction[],
  opts?: { dryRun?: boolean }
): Promise<{ aggregator: ResultAggregator, feedback: BatchActionFeedback[] }>;
