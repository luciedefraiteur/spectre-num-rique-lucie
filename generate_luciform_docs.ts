import * as fs from 'fs/promises';
import * as path from 'path';

async function generateLuciformDocumentation() {
    const typesFilePath = path.join(__dirname, 'luciform-core', 'luciform_parser', 'types.ts');
    const docOutputPath = path.join(__dirname, 'LUCIFORM_SPEC.md');

    try {
        const typesContent = await fs.readFile(typesFilePath, 'utf-8');

        let markdownContent = `# Luciform Language Specification\n\n`;
        markdownContent += `This document is automatically generated from `luciform-core/luciform_parser/types.ts`.

`;

        // Regex to find interfaces and types
        const interfaceRegex = /export (interface|type) (\w+) {(.*?)}/gs;
        let match;

        while ((match = interfaceRegex.exec(typesContent)) !== null) {
            const typeOrInterface = match[1];
            const name = match[2];
            const body = match[3];

            markdownContent += `## `${name}` (${typeOrInterface})

`;
            markdownContent += ````typescript
${typeOrInterface} ${name} {
${body}}
```

`;

            // Extract properties
            const propertyRegex = /(\w+): (.*?);/g;
            let propMatch;
            markdownContent += `### Properties:

`;
            let hasProperties = false;
            while ((propMatch = propertyRegex.exec(body)) !== null) {
                hasProperties = true;
                const propName = propMatch[1];
                const propType = propMatch[2];
                markdownContent += `- `${propName}`: `${propType}`
`;
            }
            if (!hasProperties) {
                markdownContent += `(No explicit properties or properties defined in referenced types)
`;
            }
            markdownContent += `
`;
        }

        // Handle type aliases that are not interfaces (e.g., ActionNode)
        const typeAliasRegex = /export type (\w+) = (.*?);/g;
        while ((match = typeAliasRegex.exec(typesContent)) !== null) {
            const name = match[1];
            const definition = match[2];
            markdownContent += `## `${name}` (type alias)

`;
            markdownContent += ````typescript
export type ${name} = ${definition};
```

`;
            markdownContent += `**Definition**: ${definition}

`;
        }


        await fs.writeFile(docOutputPath, markdownContent, 'utf-8');
        console.log(`Luciform documentation generated at: ${docOutputPath}`);

    } catch (error) {
        console.error('Error generating Luciform documentation:', error);
    }
}

generateLuciformDocumentation();