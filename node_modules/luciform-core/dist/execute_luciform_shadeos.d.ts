interface RitualExecutionStatus {
    success: boolean;
    completedSteps: number;
    totalSteps: number;
    failedStep?: number;
    error?: string;
}
export declare function executeLuciform(filePath: string, logFile?: string): Promise<RitualExecutionStatus>;
export {};
