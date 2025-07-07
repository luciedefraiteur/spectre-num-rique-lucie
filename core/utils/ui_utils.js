"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colors = void 0;
exports.colorize = colorize;
exports.displayRitualStepResult = displayRitualStepResult;
exports.demonstrateCursorControl = demonstrateCursorControl;
exports.startCursorAnimation = startCursorAnimation;
exports.stopCursorAnimation = stopCursorAnimation;
// ANSI escape codes for colors
exports.Colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
};
function colorize(text, color) {
    return "".concat(color).concat(text).concat(exports.Colors.Reset);
}
function formatBox(title, content, color) {
    var lines = content.split('\n');
    var maxLength = Math.max.apply(Math, __spreadArray([title.length], lines.map(function (line) { return line.length; }), false));
    var horizontalLine = color + '─'.repeat(maxLength + 2) + exports.Colors.Reset;
    var output = color + '┌' + title.padEnd(maxLength + 1) + '┐' + exports.Colors.Reset + '\n';
    lines.forEach(function (line) {
        output += color + '│ ' + line.padEnd(maxLength) + ' │' + exports.Colors.Reset + '\n';
    });
    output += horizontalLine.replace(/┌/g, '└').replace(/┐/g, '┘');
    return output;
}
function displayRitualStepResult(res) {
    var étape = res.étape, index = res.index, output = res.output, analysis = res.analysis, waited = res.waited, text = res.text, success = res.success, exitCode = res.exitCode, stderr = res.stderr;
    var title = "\u00C9tape ".concat(index + 1, ": ").concat(étape.type);
    switch (étape.type) {
        case 'commande':
            if (success) {
                console.log(formatBox("\u2705 ".concat(title), "Commande: ".concat(étape.contenu, "\n---\n").concat(output), exports.Colors.FgGreen));
            }
            else {
                console.log(formatBox("\u274C ".concat(title), "Commande: ".concat(étape.contenu, "\n---\nCode: ").concat(exitCode, "\nErreur: ").concat(stderr || output), exports.Colors.FgRed));
            }
            break;
        case 'analyse':
            console.log(formatBox("\uD83E\uDDE0 ".concat(title), analysis, exports.Colors.FgMagenta));
            break;
        case 'attente':
            console.log(formatBox("\u23F3 ".concat(title), res.waitMessage || étape.contenu, exports.Colors.FgBlue));
            break;
        case 'dialogue':
        case 'réponse':
            console.log(formatBox("\uD83D\uDCAC ".concat(title), text, exports.Colors.FgWhite));
            break;
        default:
            console.log(formatBox("- ".concat(title), JSON.stringify(res, null, 2), exports.Colors.FgYellow));
            break;
    }
}
function demonstrateCursorControl() {
    if (!process.stdout.isTTY) {
        console.log("[DEMO CURSEUR] Non-TTY, démo annulée.");
        return;
    }
    // Clear the screen to make the demo clear
    process.stdout.write('\x1b[2J\x1b[0f'); // Clear screen and move cursor to 0,0
    console.log('--- Démonstration du Contrôle du Curseur ---');
    console.log('Ceci est la ligne 1.');
    console.log('Ceci est la ligne 2.');
    // Move cursor to row 1, column 5 (0-indexed)
    process.stdout.cursorTo(5, 0);
    process.stdout.write(exports.Colors.FgGreen + 'ICI' + exports.Colors.Reset);
    // Move cursor to row 2, column 10
    process.stdout.cursorTo(10, 1);
    process.stdout.write(exports.Colors.FgYellow + 'LÀ' + exports.Colors.Reset);
    // Move cursor to a new line below the demo
    process.stdout.cursorTo(0, 8); // Move to row 8, column 0
    console.log('--- Fin de la Démonstration ---');
    console.log('Le Terminal reprend son cours normal...');
}
var cursorInterval = null;
var cursorState = true;
function startCursorAnimation() {
    if (cursorInterval || !process.stdout.isTTY)
        return;
    process.stdout.write(' '); // Initial space to prevent overwriting
    cursorInterval = setInterval(function () {
        process.stdout.write(exports.Colors.Reset + (cursorState ? exports.Colors.FgCyan + '█' : ' ') + exports.Colors.Reset);
        process.stdout.cursorTo(process.stdout.columns - 1);
        cursorState = !cursorState;
    }, 500);
}
function stopCursorAnimation() {
    if (cursorInterval && process.stdout.isTTY) {
        clearInterval(cursorInterval);
        cursorInterval = null;
        process.stdout.write(' '); // Clear cursor
        process.stdout.cursorTo(process.stdout.columns - 1);
    }
}
