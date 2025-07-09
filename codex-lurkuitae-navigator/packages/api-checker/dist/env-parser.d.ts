import { APIConfig } from './types.js';
export declare class EnvParser {
    private envVars;
    constructor(envPath?: string);
    private loadEnvFile;
    private parseEnvContent;
    /**
     * Extrait toutes les configurations d'API depuis les variables d'environnement
     */
    extractAPIConfigs(): APIConfig[];
    private extractOpenAIConfigs;
    private extractAnthropicConfigs;
    private extractGoogleConfigs;
    private extractMistralConfigs;
    private extractOllamaConfigs;
    private extractCustomConfigs;
    /**
     * Affiche toutes les variables d'environnement liées aux APIs
     */
    debugEnvVars(): void;
    /**
     * Vérifie si au moins une API est configurée
     */
    hasAnyAPIConfigured(): boolean;
}
//# sourceMappingURL=env-parser.d.ts.map