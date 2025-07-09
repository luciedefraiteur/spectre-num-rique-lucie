import { WorkspaceContext } from './types.js';
export declare class WorkspaceScanner {
    private static readonly SIGNATURE;
    /**
     * 🔮 Scanne le workspace complet pour contexte ScryOrb
     */
    static scanWorkspace(rootPath?: string): Promise<WorkspaceContext>;
    /**
     * 📁 Scanne les fichiers du workspace
     */
    private static scanFiles;
    /**
     * 📂 Scanne récursivement un répertoire
     */
    private static scanDirectory;
    /**
     * 🎯 Détermine si un fichier est intéressant
     */
    private static isInterestingFile;
    /**
     * 📖 Analyse un fichier spécifique
     */
    private static analyzeFile;
    /**
     * 🔥 Calcule le niveau de blasphémie d'un fichier
     */
    private static calculateFileBlasphemy;
    /**
     * 🧬 Détecte le type de luciform
     */
    private static detectLuciformType;
    /**
     * 👥 Détecte les golems présents dans le workspace
     */
    private static detectGolems;
    /**
     * 🎭 Détermine le statut d'un golem
     */
    private static determineGolemStatus;
    /**
     * ⛧ Extrait la signature d'un golem
     */
    private static extractGolemSignature;
    /**
     * 🛠️ Extrait les capacités d'un golem
     */
    private static extractCapabilities;
    /**
     * 📊 Analyse l'activité récente
     */
    private static analyzeActivity;
    /**
     * ⚡ Calcule l'énergie cosmique du workspace
     */
    private static calculateCosmicEnergy;
}
//# sourceMappingURL=workspace-scanner.d.ts.map