/**
 * Creates a simple web application with an HTML file and a JavaScript file.
 * @param parameters The parameters for the ritual.
 * @returns A list of operations to be executed by the batch editor.
 */
export async function perform(parameters) {
    const { projectName, title, entryMessage } = parameters;
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="script.js" defer></script>
</head>
<body>
    <h1>${title}</h1>
    <p>${entryMessage}</p>
</body>
</html>`;
    const jsContent = `console.log("${entryMessage}");`;
    const operations = [
        {
            type: 'create_file',
            filePath: `${projectName}/index.html`,
            content: htmlContent,
        },
        {
            type: 'create_file',
            filePath: `${projectName}/script.js`,
            content: jsContent,
        },
    ];
    return operations;
}
//# sourceMappingURL=create_web_app.js.map