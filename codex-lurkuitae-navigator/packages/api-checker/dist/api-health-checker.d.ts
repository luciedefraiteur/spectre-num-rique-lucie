import { APIConfig, APIStatus, APICheckResult, HealthCheckOptions } from './types.js';
export declare class APIHealthChecker {
    private static readonly DEFAULT_TIMEOUT;
    private static readonly DEFAULT_RETRIES;
    /**
     * Teste une API spécifique
     */
    static checkAPI(config: APIConfig, options?: HealthCheckOptions): Promise<APIStatus>;
    /**
     * Teste toutes les APIs configurées
     */
    static checkAllAPIs(configs: APIConfig[], options?: HealthCheckOptions): Promise<APICheckResult>;
    /**
     * Effectue le test de santé selon le type d'API
     */
    private static performHealthCheck;
    /**
     * Test OpenAI API - Inspiré de llm_interface.ts
     */
    private static checkOpenAI;
    /**
     * Test Anthropic API - Inspiré de llm_interface.ts
     */
    private static checkAnthropic;
    /**
     * Test Google API
     */
    private static checkGoogle;
    /**
     * Test Mistral API
     */
    private static checkMistral;
    /**
     * Test Ollama API - Inspiré de llm_interface.ts
     */
    private static checkOllama;
    /**
     * Test API personnalisée
     */
    private static checkCustom;
    /**
     * Sélectionne l'API recommandée
     */
    private static selectRecommendedAPI;
    /**
     * Génère un résumé textuel
     */
    private static generateSummary;
    /**
     * Utilitaire pour attendre
     */
    private static sleep;
}
//# sourceMappingURL=api-health-checker.d.ts.map