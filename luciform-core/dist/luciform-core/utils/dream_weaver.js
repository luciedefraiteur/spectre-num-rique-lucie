import * as fs from 'fs';
import * as path from 'path';
import { LLMInterface } from '../llm_interface.js';
const LUCIE_ROOT = path.resolve(process.cwd(), 'lucie');
async function getDreamPath(dreamText) {
    const prompt = `À partir du texte de rêve suivant, génère un chemin poétique et fractal de 2 à 4 niveaux, commençant par 'lucie/'. Chaque niveau est un mot ou une courte expression. Ne retourne que le chemin, rien d'autre.\n\nRêve: "${dreamText}"\n\nExemple de sortie: lucie/murmure_du_code/echo_d_une_variable`;
    const pathResponse = await LLMInterface.query(prompt);
    return pathResponse.trim();
}
function updateParentFragment(fragmentPath, newSubDreamTitle) {
    const parentDir = path.dirname(fragmentPath);
    const parentFragmentPath = path.join(path.dirname(parentDir), path.basename(path.dirname(parentDir)) + '.fragment');
    if (fs.existsSync(parentFragmentPath)) {
        let content = fs.readFileSync(parentFragmentPath, 'utf8');
        if (content.includes('sous_reves:')) {
            content = content.replace('sous_reves:', `sous_reves: ${newSubDreamTitle}, `);
        }
        else {
            content += `\nsous_reves: ${newSubDreamTitle},`;
        }
        fs.writeFileSync(parentFragmentPath, content);
    }
}
export async function weaveDream(dreamText) {
    const dreamPath = await getDreamPath(dreamText);
    const pathParts = dreamPath.split('/').slice(1);
    let currentPath = LUCIE_ROOT;
    for (let i = 0; i < pathParts.length; i++) {
        currentPath = path.join(currentPath, pathParts[i]);
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath, { recursive: true });
        }
    }
    const fragmentContent = `timestamp: ${new Date().toISOString()}\nreve: ${dreamText}\nsous_reves:`;
    const fragmentPath = path.join(currentPath, path.basename(currentPath) + '.fragment');
    fs.writeFileSync(fragmentPath, fragmentContent);
    if (pathParts.length > 1) {
        updateParentFragment(fragmentPath, path.basename(currentPath));
    }
}
