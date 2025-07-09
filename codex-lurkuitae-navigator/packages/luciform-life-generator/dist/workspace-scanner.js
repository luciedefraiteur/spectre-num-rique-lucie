// 🔮 Workspace Scanner - ScryOrb Réel pour Luciforms
// Hanté par la signature base666 - Vision cosmique du workspace
import fs from 'fs';
import path from 'path';
export class WorkspaceScanner {
    static SIGNATURE = "⛧𝖚⟁⇌↯⟲ⱷ𓂀𓆩⫷𝖋𝖆𝖎𝖗𝖊𝖈𝖍𝖙⛧𖤐𝔐";
    /**
     * 🔮 Scanne le workspace complet pour contexte ScryOrb
     */
    static async scanWorkspace(rootPath = process.cwd()) {
        console.log('🔮 ScryOrb activé - Scanning workspace...');
        console.log(`📍 Racine: ${rootPath}`);
        const openFiles = await this.scanFiles(rootPath);
        const availableGolems = await this.detectGolems(openFiles);
        const recentActivity = await this.analyzeActivity(rootPath);
        const cosmicEnergy = this.calculateCosmicEnergy(openFiles, availableGolems);
        return {
            currentDirectory: rootPath,
            openFiles,
            recentActivity,
            availableGolems,
            cosmicEnergy
        };
    }
    /**
     * 📁 Scanne les fichiers du workspace
     */
    static async scanFiles(rootPath) {
        const files = [];
        try {
            await this.scanDirectory(rootPath, files, 0, 3); // Max 3 niveaux
        }
        catch (error) {
            console.warn(`⚠️ Erreur scan: ${error.message}`);
        }
        console.log(`📄 ${files.length} fichiers détectés`);
        return files;
    }
    /**
     * 📂 Scanne récursivement un répertoire
     */
    static async scanDirectory(dirPath, files, depth, maxDepth) {
        if (depth > maxDepth)
            return;
        try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);
                // Ignorer certains dossiers
                if (entry.isDirectory()) {
                    if (!['node_modules', '.git', 'dist', '.next'].includes(entry.name)) {
                        await this.scanDirectory(fullPath, files, depth + 1, maxDepth);
                    }
                }
                else if (entry.isFile()) {
                    // Analyser seulement certains types de fichiers
                    if (this.isInterestingFile(entry.name)) {
                        const fileContext = await this.analyzeFile(fullPath);
                        if (fileContext) {
                            files.push(fileContext);
                        }
                    }
                }
            }
        }
        catch (error) {
            // Ignorer les erreurs de permission
        }
    }
    /**
     * 🎯 Détermine si un fichier est intéressant
     */
    static isInterestingFile(filename) {
        const extensions = ['.luciform', '.ts', '.js', '.json', '.md', '.txt'];
        const interesting = [
            'package.json', 'tsconfig.json', 'README.md',
            'plan.', 'signature', 'augment', 'golem'
        ];
        return extensions.some(ext => filename.endsWith(ext)) ||
            interesting.some(pattern => filename.includes(pattern));
    }
    /**
     * 📖 Analyse un fichier spécifique
     */
    static async analyzeFile(filePath) {
        try {
            const stats = fs.statSync(filePath);
            const content = fs.readFileSync(filePath, 'utf8');
            // Limiter la taille du contenu
            const truncatedContent = content.length > 2000
                ? content.substring(0, 2000) + '...[truncated]'
                : content;
            const blasphemyLevel = this.calculateFileBlasphemy(content, filePath);
            const luciformType = this.detectLuciformType(content, filePath);
            return {
                path: filePath,
                content: truncatedContent,
                lastModified: stats.mtime,
                blasphemyLevel,
                luciformType
            };
        }
        catch (error) {
            return null;
        }
    }
    /**
     * 🔥 Calcule le niveau de blasphémie d'un fichier
     */
    static calculateFileBlasphemy(content, filePath) {
        let blasphemy = 0;
        // Facteurs de blasphémie
        blasphemy += content.length / 100; // Taille
        blasphemy += (content.match(/⛧|𖤐|𝖚|⟁|⇌|↯|⟲|ⱷ|𓂀|𓆩|⫷/g) || []).length * 50; // Caractères base666
        blasphemy += (content.match(/luciform|golem|blasphemy|signature/gi) || []).length * 10; // Mots-clés
        blasphemy += (content.match(/function|class|interface|type/g) || []).length * 5; // Code technique
        // Bonus pour certains fichiers
        if (filePath.includes('luciform'))
            blasphemy += 100;
        if (filePath.includes('signature'))
            blasphemy += 150;
        if (filePath.includes('base666'))
            blasphemy += 200;
        return Math.min(Math.floor(blasphemy), 666);
    }
    /**
     * 🧬 Détecte le type de luciform
     */
    static detectLuciformType(content, filePath) {
        if (!filePath.endsWith('.luciform'))
            return undefined;
        try {
            const parsed = JSON.parse(content);
            return parsed.type || 'luciform_mystérieux';
        }
        catch {
            return 'luciform_corrompu';
        }
    }
    /**
     * 👥 Détecte les golems présents dans le workspace
     */
    static async detectGolems(files) {
        const golems = [];
        for (const file of files) {
            if (file.luciformType) {
                try {
                    const parsed = JSON.parse(file.content);
                    const golem = {
                        name: parsed.nom || parsed.name || path.basename(file.path, '.luciform'),
                        type: parsed.type || 'golem_mystérieux',
                        status: this.determineGolemStatus(parsed, file),
                        lastSeen: file.lastModified,
                        signature: this.extractGolemSignature(parsed),
                        capabilities: this.extractCapabilities(parsed)
                    };
                    golems.push(golem);
                }
                catch {
                    // Ignorer les luciforms corrompus
                }
            }
        }
        console.log(`👥 ${golems.length} golems détectés`);
        return golems;
    }
    /**
     * 🎭 Détermine le statut d'un golem
     */
    static determineGolemStatus(parsed, file) {
        const recentlyModified = Date.now() - file.lastModified.getTime() < 24 * 60 * 60 * 1000; // 24h
        if (file.blasphemyLevel > 500)
            return 'transcendent';
        if (recentlyModified)
            return 'active';
        return 'dormant';
    }
    /**
     * ⛧ Extrait la signature d'un golem
     */
    static extractGolemSignature(parsed) {
        return parsed.signature_énergétique ||
            parsed.signature ||
            parsed.code_blasphematoire ||
            this.SIGNATURE;
    }
    /**
     * 🛠️ Extrait les capacités d'un golem
     */
    static extractCapabilities(parsed) {
        const capabilities = [];
        if (parsed.capacités_émergentes)
            capabilities.push(...parsed.capacités_émergentes);
        if (parsed.capacités_luciformes_parfaites)
            capabilities.push(...Object.keys(parsed.capacités_luciformes_parfaites));
        if (parsed.spécialités)
            capabilities.push(...parsed.spécialités);
        if (parsed.actions_surveillance_fichiers)
            capabilities.push('surveillance_fichiers');
        if (parsed.plan_détaillé)
            capabilities.push('planification');
        return capabilities.slice(0, 10); // Limiter à 10
    }
    /**
     * 📊 Analyse l'activité récente
     */
    static async analyzeActivity(rootPath) {
        const activity = [];
        // Pour l'instant, activité simulée
        activity.push({
            timestamp: new Date(),
            action: 'workspace_scan',
            energyChange: 0.1
        });
        return activity;
    }
    /**
     * ⚡ Calcule l'énergie cosmique du workspace
     */
    static calculateCosmicEnergy(files, golems) {
        let energy = 0;
        // Énergie des fichiers
        energy += files.reduce((sum, file) => sum + file.blasphemyLevel, 0) / 10000;
        // Énergie des golems
        energy += golems.length * 0.1;
        energy += golems.filter(g => g.status === 'active').length * 0.2;
        energy += golems.filter(g => g.status === 'transcendent').length * 0.5;
        // Bonus pour la signature
        const hasSignature = files.some(f => f.path.includes('signature'));
        if (hasSignature)
            energy += 0.3;
        return Math.min(energy, 1);
    }
}
