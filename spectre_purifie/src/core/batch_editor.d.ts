export interface FileEdit {
    filePath: string;
    oldContent?: string;
    newContent?: string;
    type: 'replace' | 'insert' | 'append' | 'delete' | 'create';
}
export declare function applyBatchEdits(edits: FileEdit[], currentWorkingDirectory: string): Promise<{
    success: boolean;
    message: string;
}[]>;
