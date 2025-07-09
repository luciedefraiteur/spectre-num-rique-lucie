// 🏥 Health checker pour APIs - Inspiré de llm_interface.ts
// Teste la disponibilité et performance des APIs configurées
import { APIType } from './types.js';
export class APIHealthChecker {
    static DEFAULT_TIMEOUT = 10000; // 10 secondes
    static DEFAULT_RETRIES = 2;
    /**
     * Teste une API spécifique
     */
    static async checkAPI(config, options = {}) {
        const startTime = Date.now();
        const timeout = options.timeout || this.DEFAULT_TIMEOUT;
        const retries = options.retries || this.DEFAULT_RETRIES;
        let lastError;
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const result = await this.performHealthCheck(config, timeout);
                const responseTime = Date.now() - startTime;
                return {
                    name: config.name,
                    type: config.type,
                    available: true,
                    responseTime,
                    model: config.model,
                    lastChecked: new Date()
                };
            }
            catch (error) {
                lastError = error.message;
                if (attempt < retries) {
                    console.log(`🔄 Tentative ${attempt + 1}/${retries + 1} échouée pour ${config.name}, retry...`);
                    await this.sleep(1000 * (attempt + 1)); // Backoff progressif
                }
            }
        }
        return {
            name: config.name,
            type: config.type,
            available: false,
            responseTime: Date.now() - startTime,
            error: lastError,
            model: config.model,
            lastChecked: new Date()
        };
    }
    /**
     * Teste toutes les APIs configurées
     */
    static async checkAllAPIs(configs, options = {}) {
        console.log(`🔍 Test de ${configs.length} APIs configurées...`);
        const results = [];
        // Tester toutes les APIs en parallèle pour plus de rapidité
        const promises = configs.map(config => this.checkAPI(config, options));
        const statuses = await Promise.all(promises);
        results.push(...statuses);
        const availableAPIs = results.filter(r => r.available);
        const unavailableAPIs = results.filter(r => !r.available);
        // Trouver l'API la plus rapide
        const fastestAPI = availableAPIs.length > 0
            ? availableAPIs.reduce((fastest, current) => current.responseTime < fastest.responseTime ? current : fastest)
            : undefined;
        // Recommander une API (priorité: disponible, rapide, fiable)
        const recommendedAPI = this.selectRecommendedAPI(availableAPIs);
        const summary = this.generateSummary(availableAPIs.length, unavailableAPIs.length, fastestAPI, recommendedAPI);
        return {
            totalAPIs: configs.length,
            availableAPIs: availableAPIs.length,
            unavailableAPIs: unavailableAPIs.length,
            fastestAPI,
            recommendedAPI,
            results,
            summary
        };
    }
    /**
     * Effectue le test de santé selon le type d'API
     */
    static async performHealthCheck(config, timeout) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        try {
            switch (config.type) {
                case APIType.OPENAI:
                    await this.checkOpenAI(config, controller.signal);
                    break;
                case APIType.ANTHROPIC:
                    await this.checkAnthropic(config, controller.signal);
                    break;
                case APIType.GOOGLE:
                    await this.checkGoogle(config, controller.signal);
                    break;
                case APIType.MISTRAL:
                    await this.checkMistral(config, controller.signal);
                    break;
                case APIType.OLLAMA:
                    await this.checkOllama(config, controller.signal);
                    break;
                case APIType.CUSTOM:
                    await this.checkCustom(config, controller.signal);
                    break;
                default:
                    throw new Error(`Type d'API non supporté: ${config.type}`);
            }
        }
        finally {
            clearTimeout(timeoutId);
        }
    }
    /**
     * Test OpenAI API - Inspiré de llm_interface.ts
     */
    static async checkOpenAI(config, signal) {
        if (!config.apiKey) {
            throw new Error('Clé API OpenAI manquante');
        }
        const response = await fetch(`${config.baseUrl}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            },
            signal
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API Error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('Réponse OpenAI invalide');
        }
    }
    /**
     * Test Anthropic API - Inspiré de llm_interface.ts
     */
    static async checkAnthropic(config, signal) {
        if (!config.apiKey) {
            throw new Error('Clé API Anthropic manquante');
        }
        // Test simple avec un message minimal
        const response = await fetch(`${config.baseUrl}/v1/messages`, {
            method: 'POST',
            headers: {
                'x-api-key': config.apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
                ...config.headers
            },
            body: JSON.stringify({
                model: config.model || 'claude-3-haiku-20240307',
                max_tokens: 10,
                messages: [{ role: 'user', content: 'ping' }]
            }),
            signal
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Anthropic API Error ${response.status}: ${errorBody}`);
        }
        const data = await response.json();
        if (!data.content || !Array.isArray(data.content)) {
            throw new Error('Réponse Anthropic invalide');
        }
    }
    /**
     * Test Google API
     */
    static async checkGoogle(config, signal) {
        if (!config.apiKey) {
            throw new Error('Clé API Google manquante');
        }
        const response = await fetch(`${config.baseUrl}/models?key=${config.apiKey}`, {
            method: 'GET',
            signal
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google API Error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        if (!data.models || !Array.isArray(data.models)) {
            throw new Error('Réponse Google invalide');
        }
    }
    /**
     * Test Mistral API
     */
    static async checkMistral(config, signal) {
        if (!config.apiKey) {
            throw new Error('Clé API Mistral manquante');
        }
        const response = await fetch(`${config.baseUrl}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            },
            signal
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Mistral API Error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('Réponse Mistral invalide');
        }
    }
    /**
     * Test Ollama API - Inspiré de llm_interface.ts
     */
    static async checkOllama(config, signal) {
        const response = await fetch(`${config.baseUrl}/api/tags`, {
            method: 'GET',
            signal
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ollama API Error ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        if (!data.models || !Array.isArray(data.models)) {
            throw new Error('Réponse Ollama invalide');
        }
    }
    /**
     * Test API personnalisée
     */
    static async checkCustom(config, signal) {
        const endpoint = config.testEndpoint || '/health';
        const url = `${config.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...config.headers
        };
        if (config.apiKey) {
            headers['Authorization'] = `Bearer ${config.apiKey}`;
        }
        const response = await fetch(url, {
            method: 'GET',
            headers,
            signal
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Custom API Error ${response.status}: ${errorText}`);
        }
    }
    /**
     * Sélectionne l'API recommandée
     */
    static selectRecommendedAPI(availableAPIs) {
        if (availableAPIs.length === 0)
            return undefined;
        // Priorité: OpenAI > Anthropic > Google > Mistral > Ollama > Custom
        const priority = [APIType.OPENAI, APIType.ANTHROPIC, APIType.GOOGLE, APIType.MISTRAL, APIType.OLLAMA, APIType.CUSTOM];
        for (const type of priority) {
            const api = availableAPIs.find(api => api.type === type);
            if (api)
                return api;
        }
        // Fallback: la plus rapide
        return availableAPIs.reduce((fastest, current) => current.responseTime < fastest.responseTime ? current : fastest);
    }
    /**
     * Génère un résumé textuel
     */
    static generateSummary(available, unavailable, fastest, recommended) {
        let summary = `📊 Résultat: ${available} API(s) disponible(s), ${unavailable} indisponible(s)`;
        if (fastest) {
            summary += `\n⚡ Plus rapide: ${fastest.name} (${fastest.responseTime}ms)`;
        }
        if (recommended) {
            summary += `\n🎯 Recommandée: ${recommended.name}`;
        }
        if (available === 0) {
            summary += '\n❌ Aucune API disponible - Vérifiez vos clés et configurations';
        }
        return summary;
    }
    /**
     * Utilitaire pour attendre
     */
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
