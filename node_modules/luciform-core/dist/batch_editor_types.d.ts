export interface BatchActionFeedback {
    type: string;
    action: any;
    status: 'success' | 'error' | 'stubbed';
    error?: any;
    message?: string;
    extra?: any;
}
export declare class ResultAggregator {
    private results;
    add(feedback: BatchActionFeedback): void;
    all(): BatchActionFeedback[];
    successes(): BatchActionFeedback[];
    errors(): BatchActionFeedback[];
    stubbed(): BatchActionFeedback[];
}
