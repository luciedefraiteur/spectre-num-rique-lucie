import { Operation } from '../../luciform-types/src/base.js';
export interface BatchActionFeedback {
    type: string;
    action: Operation;
    status: 'success' | 'error' | 'stubbed';
    message?: string;
    error?: unknown;
    extra?: any;
}
export declare class ResultAggregator {
    private results;
    add(feedback: BatchActionFeedback): void;
    all(): BatchActionFeedback[];
    successes(): BatchActionFeedback[];
    errors(): BatchActionFeedback[];
    stubbed(): BatchActionFeedback[];
    hasErrors(): boolean;
}
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
