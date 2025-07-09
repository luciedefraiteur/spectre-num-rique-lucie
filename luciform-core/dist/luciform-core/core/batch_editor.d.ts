import { Operation } from './types.js';
import { BatchActionFeedback, ResultAggregator } from './batch_editor_types.js';
/**
 * Executes a batch of actions (operations), dispatching via actionExecutorMap. Aggregates summary.
 * @param actions Array of parsed Action or Operation items
 * @param opts Optional config: {dryRun: boolean}
 */
export declare function executeBatch(actions: Operation[], opts?: {
    dryRun?: boolean;
}): Promise<{
    aggregator: ResultAggregator;
    feedback: BatchActionFeedback[];
}>;
export declare function executeShellCommand(command: string): Promise<void>;
export declare function applyOperation(op: Operation, dryRun?: boolean): Promise<void>;
