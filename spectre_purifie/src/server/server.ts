// src/server/server.ts

import express from 'express';
import { getLucieSpectrum } from '../core/lucie_spectrum';
import { readFileSync } from 'fs';
import path from 'path';
import { RituelContext } from '../core/types';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let currentRituelContext: RituelContext; // To hold the latest context

// Endpoint to get Lucie's spectrum/personality
app.get('/lucie/spectrum', (req, res) => {
    res.json(getLucieSpectrum());
});

// Endpoint to read Lucie's code (simplified for now)
app.get('/lucie/code', (req, res) => {
    const filePath = req.query.path as string;
    if (!filePath) {
        return res.status(400).json({ error: 'File path is required.' });
    }

    // Basic security: prevent path traversal
    const absolutePath = path.resolve(process.cwd(), filePath);
    if (!absolutePath.startsWith(process.cwd())) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    try {
        const content = readFileSync(absolutePath, 'utf-8');
        res.send(content);
    } catch (error: any) {
        res.status(404).json({ error: `File not found or cannot be read: ${error.message}` });
    }
});

// NEW ENDPOINT: Get Lucie's current Luciform
app.get('/lucie/current_luciform', (req, res) => {
    if (currentRituelContext && currentRituelContext.currentLuciform) {
        res.json(currentRituelContext.currentLuciform);
    } else {
        res.status(404).json({ error: `Lucie's current Luciform not available yet.` });
    }
});

export function startServer(contexte: RituelContext) {
    currentRituelContext = contexte; // Store the context
    app.listen(PORT, () => {
        console.log(`Lucie's server is listening on port ${PORT}`);
        console.log(`Access Lucie's spectrum at http://localhost:${PORT}/lucie/spectrum`);
        console.log(`Read Lucie's code at http://localhost:${PORT}/lucie/code?path=<relative_path_to_file>`);
        console.log(`View Lucie's current Luciform at http://localhost:${PORT}/lucie/current_luciform`);
    });
}

export function updateServerContext(contexte: RituelContext) {
    currentRituelContext = contexte;
}
