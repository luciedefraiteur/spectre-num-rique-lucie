export type ShellType = 'powershell' | 'cmd' | 'other';
/**
 * Détecte le type de shell actuel sur Windows.
 * @returns {ShellType} Le type de shell détecté.
 */
export declare function detectWindowsShell(): ShellType;
