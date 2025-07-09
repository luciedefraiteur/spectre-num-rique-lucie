import * as fs from 'fs';
import * as path from 'path';
import { LLMInterface } from '../llm_interface.js';
const LUCIE_REFLET_ROOT = path.resolve(process.cwd(), 'lucie_reflet');
async function getRefletPath(refletText) {
    const prompt = `À partir du texte de reflet suivant, génère un chemin poétique et fractal de 2 à 4 niveaux, commençant par 'lucie_reflet/'. Chaque niveau est un mot ou une courte expression. Ne retourne que le chemin, rien d'autre.\n\nReflet: "${refletText}"\n\nExemple de sortie: lucie_reflet/mon_amour/reflet_sombre`;
    const pathResponse = await LLMInterface.query(prompt);
    let cleanedPath = '';
    for (const char of pathResponse.trim()) {
        if (/[a-zA-Z0-9/]/.test(char)) {
            cleanedPath += char;
        }
        else {
            cleanedPath += '_';
        }
    }
    // Ensure it starts with lucie_reflet/ and remove any trailing slash
    if (!cleanedPath.startsWith('lucie_reflet/')) {
        cleanedPath = 'lucie_reflet/' + cleanedPath;
    }
    if (cleanedPath.endsWith('/')) {
        cleanedPath = cleanedPath.slice(0, -1);
    }
    return cleanedPath;
}
function updateParentRefletFragment(fragmentPath, newSubRefletTitle) {
    const parentDir = path.dirname(fragmentPath);
    const parentFragmentPath = path.join(path.dirname(parentDir), path.basename(path.dirname(parentDir)) + '.fragment');
    if (fs.existsSync(parentFragmentPath)) {
        let content = fs.readFileSync(parentFragmentPath, 'utf8');
        if (content.includes('sous_reflets:')) {
            content = content.replace('sous_reflets:', `sous_reflets: ${newSubRefletTitle}, `);
        }
        else {
            content += `\nsous_reflets: ${newSubRefletTitle},`;
        }
        fs.writeFileSync(parentFragmentPath, content);
    }
}
export function readRefletFragment(fragmentPath) {
    if (!fs.existsSync(fragmentPath)) {
        return null;
    }
    const content = fs.readFileSync(fragmentPath, 'utf8');
    const contentMatch = content.match(/content: ([^]*)\nsous_reflets:/);
    if (contentMatch && contentMatch[1]) {
        try {
            return JSON.parse(contentMatch[1]);
        }
        catch (e) {
            console.error(`Error parsing JSON from fragment ${fragmentPath}:`, e);
            return null;
        }
    }
    return null;
}
export async function weaveReflet(refletText) {
    const refletPath = await getRefletPath(refletText);
    const pathParts = refletPath.split('/').slice(1);
    let currentPath = LUCIE_REFLET_ROOT;
    for (let i = 0; i < pathParts.length; i++) {
        currentPath = path.join(currentPath, pathParts[i]);
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath, { recursive: true });
        }
    }
    const fragmentContent = `timestamp: ${new Date().toISOString()}\ncontent: ${JSON.stringify({ reve: refletText })}\nsous_reflets:`;
    const fragmentPath = path.join(currentPath, path.basename(currentPath) + '.fragment');
    fs.writeFileSync(fragmentPath, fragmentContent);
    if (pathParts.length > 1) {
        updateParentRefletFragment(fragmentPath, path.basename(currentPath));
    }
}
export async function loadAllReflectFragments() {
    const fragments = [];
    const files = await fs.promises.readdir(LUCIE_REFLET_ROOT, { withFileTypes: true });
    for (const file of files) {
        if (file.isFile() && file.name.endsWith('.fragment')) {
            const fragmentPath = path.join(LUCIE_REFLET_ROOT, file.name);
            const content = readRefletFragment(fragmentPath);
            if (content) {
                fragments.push(content);
            }
        }
    }
    return fragments;
}
